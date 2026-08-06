#!/usr/bin/env python3
"""
enrich-content-from-experience.py — Read experience notes and suggest content updates.

Usage:
  python3 enrich-content-from-experience.py [--dry-run] [--json]
  
This script:
1. Reads experience notes from Payload
2. Extracts prices, vendors, sensory details, recommendations
3. Compares against existing blog posts and stories
4. Generates suggestions for content enrichment
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path
from datetime import datetime

# ── Configuration ─────────────────────────────────────────────────────────────

PAYLOAD_URL = os.environ.get('PAYLOAD_URL', 'https://cms.system.simplyenak.com')
PAYLOAD_TOKEN = os.environ.get('PAYLOAD_TOKEN', '')
CONTENT_DIR = Path(__file__).resolve().parent.parent / 'site' / 'src' / 'data' / 'content'
POST_DIR = Path(__file__).resolve().parent.parent / 'site' / 'src' / 'data' / 'post'

# ── Experience Extraction ─────────────────────────────────────────────────────

def extract_experiences(notes):
    """Extract structured experiences from note data."""
    experiences = []
    
    for note in notes:
        exp = {
            'source': note.get('slug', 'unknown'),
            'location': note.get('location', ''),
            'type': note.get('noteType', ''),
            'dishes': [],
            'vendors': [],
            'sensory': [],
            'surprises': [],
            'recommendations': [],
            'prices': [],
        }
        
        # Extract dishes with prices
        for dish in note.get('dishes', []) or []:
            name = dish.get('name', '')
            price = dish.get('price', '')
            vendor = dish.get('vendor', '')
            if name:
                exp['dishes'].append(name.lower())
            if price:
                # Extract RM amounts
                rm_match = re.search(r'RM?\s*(\d+\.?\d*)', price, re.I)
                if rm_match:
                    exp['prices'].append(float(rm_match.group(1)))
        
        # Extract vendor details
        for vendor in note.get('vendors', []) or []:
            if vendor.get('name'):
                exp['vendors'].append({
                    'name': vendor.get('name', ''),
                    'address': vendor.get('address', ''),
                    'years': vendor.get('yearsRunning', ''),
                    'story': vendor.get('story', ''),
                })
        
        # Extract sensory details
        for sensory in note.get('sensoryDetails', []) or []:
            if sensory.get('detail'):
                exp['sensory'].append(sensory.get('detail', '').lower())
        
        # Extract recommendations
        for rec in note.get('recommendations', []) or []:
            if rec.get('tip'):
                exp['recommendations'].append(rec.get('tip', ''))
        
        # Extract surprises
        if note.get('surprises'):
            exp['surprises'] = note['surprises'].split('\n')
        
        experiences.append(exp)
    
    return experiences


def analyze_content_gaps(posts, experiences):
    """Find gaps in existing content vs available experiences."""
    suggestions = []
    
    for post in posts:
        content = post.get('content', '') or ''
        body_text = extract_body_text(content)
        
        issues = []
        suggestions_list = []
        
        # Check for price mentions
        if not re.search(r'rm\s*\d+', body_text, re.I):
            issues.append('no_prices')
            suggestions_list.append('Add specific prices (RM X) for mentioned dishes')
        
        # Check for vendor names
        if not re.search(r'(stall|shop|restaurant|market|kopitiam)', body_text, re.I):
            issues.append('no_vendor_names')
            suggestions_list.append('Name specific vendors/stalls mentioned')
        
        # Check for sensory details
        sensory_words = ['crispy', 'smoky', 'fragrant', 'tangy', 'umami', 'silky', 'custardy', 'charcoal']
        found_sensory = [s for s in sensory_words if s in body_text.lower()]
        if len(found_sensory) < 2:
            issues.append('low_sensory')
            suggestions_list.append('Add sensory descriptors (texture, taste, smell)')
        
        # Check for first-person experience
        if not re.search(r'(i (learned|noticed|found|tried)|we (tested|found)|my (favourite|go-to))', body_text, re.I):
            issues.append('no_experience_markers')
            suggestions_list.append('Add first-person observations')
        
        if issues:
            suggestions.append({
                'post': post.get('slug', post.get('title', 'unknown')),
                'type': post.get('type', 'unknown'),
                'issues': issues,
                'suggestions': suggestions_list,
            })
    
    return suggestions


def extract_body_text(content_json):
    """Extract text content from Payload rich text format."""
    if isinstance(content_json, str):
        return content_json
    
    if isinstance(content_json, dict):
        texts = []
        if content_json.get('type') == 'root':
            for child in content_json.get('children', []) or []:
                texts.append(extract_node_text(child))
        return ' '.join(texts)
    
    return ''


def extract_node_text(node):
    """Recursively extract text from Lexical rich text nodes."""
    if not isinstance(node, dict):
        return ''
    
    if node.get('type') == 'text' and 'text' in node:
        return node['text']
    
    texts = []
    for key in ['children', 'nodes']:
        if key in node and isinstance(node[key], list):
            for child in node[key]:
                texts.append(extract_node_text(child))
    
    return ' '.join(texts)


def load_experience_notes():
    """Load experience notes from Payload API."""
    if not PAYLOAD_TOKEN:
        print("ERROR: PAYLOAD_TOKEN not set", file=sys.stderr)
        return []
    
    import urllib.request
    
    url = f"{PAYLOAD_URL}/api/experience_notes?limit=100"
    req = urllib.request.Request(url, headers={
        'Authorization': f'Bearer {PAYLOAD_TOKEN}',
        'Content-Type': 'application/json',
    })
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            return data.get('docs', [])
    except Exception as e:
        print(f"Error loading experience notes: {e}", file=sys.stderr)
        return []


def load_existing_content():
    """Load existing blog posts and stories."""
    posts = []
    
    # Load blog posts
    for post_file in list(POST_DIR.glob('*.md')) + list(POST_DIR.glob('*.mdx')):
        try:
            content = post_file.read_text(encoding='utf-8')
            posts.append({
                'file': post_file.name,
                'slug': post_file.stem,
                'type': 'blog',
                'content': content,
            })
        except Exception:
            pass
    
    # Load stories from JSON
    stories_file = CONTENT_DIR / 'stories.json'
    if stories_file.exists():
        try:
            with open(stories_file) as f:
                stories = json.load(f)
            for story in stories:
                posts.append({
                    'file': f"stories/{story.get('slug', 'unknown')}.json",
                    'slug': story.get('slug', 'unknown'),
                    'type': 'story',
                    'content': json.dumps(story),
                })
        except Exception:
            pass
    
    return posts


def main():
    parser = argparse.ArgumentParser(description='Enrich content from experience notes')
    parser.add_argument('--dry-run', action='store_true', help='Show suggestions without writing')
    parser.add_argument('--json', action='store_true', help='Output JSON')
    parser.add_argument('--post', help='Analyze specific post by slug')
    args = parser.parse_args()
    
    # Load data
    print("Loading experience notes...", file=sys.stderr)
    notes = load_experience_notes()
    print(f"  Found {len(notes)} experience notes", file=sys.stderr)
    
    print("Loading existing content...", file=sys.stderr)
    posts = load_existing_content()
    print(f"  Found {len(posts)} posts/stories", file=sys.stderr)
    
    # Extract experiences
    experiences = extract_experiences(notes)
    
    # Analyze gaps
    suggestions = analyze_content_gaps(posts, experiences)
    
    # Filter if specific post requested
    if args.post:
        suggestions = [s for s in suggestions if args.post in s['post']]
    
    # Output
    result = {
        'timestamp': datetime.now().isoformat(),
        'experiences_analyzed': len(experiences),
        'posts_analyzed': len(posts),
        'suggestions': suggestions,
    }
    
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print(f"\nExperience Enrichment Report")
        print(f"={'='*50}")
        print(f"\nExperiences analyzed: {len(experiences)}")
        print(f"Posts analyzed: {len(posts)}")
        print(f"Suggestions generated: {len(suggestions)}")
        
        if suggestions:
            print(f"\nPosts needing enrichment:")
            for s in suggestions[:10]:
                print(f"\n  📝 {s['post']} ({s['type']})")
                for issue in s['issues']:
                    print(f"     - {issue}")
                for sug in s['suggestions']:
                    print(f"       → {sug}")
        
        if not suggestions:
            print("\n✓ All posts have sufficient experience signals")
    
    return 0 if not suggestions or all(not s['issues'] for s in suggestions) else 1


if __name__ == '__main__':
    sys.exit(main())
