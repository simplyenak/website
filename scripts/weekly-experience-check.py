#!/usr/bin/env python3
"""
Weekly experience enrichment check.

Reads new experience notes from the past week and:
1. Extracts prices, vendors, sensory details
2. Compares against existing content
3. Generates a report of suggested updates
4. Sends notification if significant gaps found

Usage:
  python3 weekly-experience-check.py [--dry-run]
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path

PAYLOAD_URL = os.environ.get('PAYLOAD_URL', 'https://cms.system.simplyenak.com')
PAYLOAD_TOKEN = os.environ.get('PAYLOAD_TOKEN', '')
CONTENT_DIR = Path(__file__).resolve().parent.parent / 'site' / 'src' / 'data' / 'content'
POST_DIR = Path(__file__).resolve().parent.parent / 'site' / 'src' / 'data' / 'post'


def get_recent_experience_notes(days=7):
    """Get experience notes from the past N days."""
    if not PAYLOAD_TOKEN:
        return []
    
    import urllib.request
    from urllib.parse import quote
    
    since = (datetime.now() - timedelta(days=days)).isoformat()
    url = f"{PAYLOAD_URL}/api/experience_notes?limit=50&sort=-createdAt&where[createdAt][greaterThan]={quote(since)}"
    
    req = urllib.request.Request(url, headers={
        'Authorization': f'Bearer {PAYLOAD_TOKEN}',
        'Content-Type': 'application/json',
    })
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            return data.get('docs', [])
    except Exception as e:
        print(f"Error fetching notes: {e}", file=sys.stderr)
        return []


def extract_primitives(notes):
    """Extract all unique values from notes."""
    prices = set()
    vendors = set()
    locations = set()
    sensory = set()
    dishes = set()
    
    for note in notes:
        # Location
        if note.get('location'):
            locations.add(note['location'].lower())
        
        # Prices
        for dish in note.get('dishes', []) or []:
            price = dish.get('price', '')
            if price:
                match = re.search(r'(\d+\.?\d*)', price)
                if match:
                    prices.add(match.group(1))
            name = dish.get('name', '')
            if name:
                dishes.add(name.lower())
        
        # Vendors
        for vendor in note.get('vendors', []) or []:
            if vendor.get('name'):
                vendors.add(vendor['name'].lower())
        
        # Sensory
        for s in note.get('sensoryDetails', []) or []:
            if s.get('detail'):
                sensory.add(s['detail'].lower())
    
    return {
        'prices': prices,
        'vendors': vendors,
        'locations': locations,
        'sensory': sensory,
        'dishes': dishes,
    }


def analyze_posts(primitives):
    """Check which posts are missing primitives from recent notes."""
    posts = []
    
    # Load blog posts
    for post_file in list(POST_DIR.glob('*.md')) + list(POST_DIR.glob('*.mdx')):
        content = post_file.read_text(encoding='utf-8')
        posts.append({
            'file': post_file.name,
            'content': content,
        })
    
    # Load stories
    stories_file = CONTENT_DIR / 'stories.json'
    if stories_file.exists():
        with open(stories_file) as f:
            for story in json.load(f):
                text = json.dumps(story)
                posts.append({
                    'file': f"stories/{story.get('slug', 'unknown')}.json",
                    'content': text,
                })
    
    gaps = []
    for post in posts:
        text = post['content'].lower()
        issues = []
        
        # Check for prices
        if not re.search(r'\b\d+\.\d+\b', text) or not re.search(r'rm\s*\d+', text, re.I):
            issues.append('no_prices')
        
        # Check for vendor names
        missing_vendors = [v for v in primitives['vendors'] if v not in text]
        if missing_vendors:
            issues.append(f'missing_vendors: {", ".join(missing_vendors[:5])}')
        
        # Check for sensory details
        missing_sensory = [s for s in primitives['sensory'] if s not in text]
        if len(missing_sensory) > 3:
            issues.append(f'low_sensory_coverage: {len(missing_sensory)} missing')
        
        if issues:
            gaps.append({
                'file': post['file'],
                'issues': issues,
            })
    
    return gaps


def main():
    parser = argparse.ArgumentParser(description='Weekly experience enrichment check')
    parser.add_argument('--days', type=int, default=7, help='Days to look back')
    parser.add_argument('--dry-run', action='store_true', help='Show without sending')
    parser.add_argument('--json', action='store_true', help='JSON output')
    args = parser.parse_args()
    
    print(f"Checking experience notes from last {args.days} days...", file=sys.stderr)
    
    # Get recent notes
    notes = get_recent_experience_notes(args.days)
    print(f"  Found {len(notes)} recent notes", file=sys.stderr)
    
    if not notes:
        print("No new experience notes this period.")
        return 0
    
    # Extract primitives
    primitives = extract_primitives(notes)
    print(f"  Extracted: {len(primitives['prices'])} prices, {len(primitives['vendors'])} vendors", file=sys.stderr)
    
    # Analyze gaps
    gaps = analyze_posts(primitives)
    print(f"  Found {len(gaps)} posts with gaps", file=sys.stderr)
    
    # Output
    result = {
        'date': datetime.now().isoformat(),
        'notes_analyzed': len(notes),
        'primitives': primitives,
        'posts_with_gaps': len(gaps),
        'gaps': gaps[:20],
    }
    
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print(f"\n{'='*50}")
        print(f"Experience Enrichment Report")
        print(f"{'='*50}")
        print(f"\nNew notes: {len(notes)}")
        print(f"Posts needing updates: {len(gaps)}")
        
        if gaps:
            print(f"\nTop gaps:")
            for g in gaps[:5]:
                print(f"  - {g['file']}: {', '.join(g['issues'][:3])}")
        
        print(f"\nNew primitives to consider:")
        print(f"  Prices: {', '.join(list(primitives['prices'])[:10])}")
        print(f"  Vendors: {', '.join(list(primitives['vendors'])[:10])}")
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
