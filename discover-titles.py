#!/usr/bin/env python3
"""Discover Title Generator — creates promise+suspense titles that deliver.

Based on Gem's Discover research (Jul 2026):
- Promise value in the title
- Create suspense / curiosity gap
- NEVER flat answers
- Always deliver what you promise (not clickbate)

Usage:
  python3 scripts/discover-titles.py "durian season malaysia"
  python3 scripts/discover-titles.py "penang food tours" --article-file site/src/data/post/eating-durians.md
"""
import json, os, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# Title patterns that work for Discover
PATTERNS = [
    # Promise + suspense
    "What Happens When {topic}",
    "The Truth About {topic} (Nobody Tells You)",
    "{topic}: What I Wish I Knew Before",
    "Why {topic} Changes Everything",
    # Negative insight (curiosity gap)
    "The Biggest Mistake People Make With {topic}",
    "What Most People Get Wrong About {topic}",
    "Never Do This With {topic}",
    # Personal transformation
    "How {topic} Changed My View of Malaysia",
    "I Tried {topic} — Here's What Happened",
    # Secret/insider
    "The Secret to {topic} (From a Local)",
    "Insider Guide to {topic}",
    # Direct promise
    "Your Complete Guide to {topic} in 2026",
    "Everything You Need to Know About {topic}",
    # Question that promises answer
    "Is {topic} Worth It? Here's the Honest Answer",
    "Can {topic} Really Be That Good?",
]

def generate(topic, article_file=None):
    """Generate title variants for a topic."""
    # Clean topic for title use
    clean = topic.strip().title()
    if clean.endswith("?"):
        clean = clean[:-1]
    
    titles = []
    for pattern in PATTERNS:
        title = pattern.format(topic=clean)
        # Keep under 60 chars for SERP display
        if len(title) <= 65:
            titles.append(title)
    
    # If article file provided, check which titles match the content promises
    if article_file and Path(article_file).exists():
        content = Path(article_file).read_text(encoding="utf-8").lower()
        # Score each title by checking if key promises appear in content
        scored = []
        for title in titles:
            title_words = set(re.findall(r'\w+', title.lower()))
            # Remove common words
            stop = {"what","the","a","an","is","are","was","were","do","does","did","will","would","could","should","may","might","can","to","of","in","on","at","for","with","from","by","and","or","but","not","this","that","these","those","your","my","his","her","their","our","its","you","he","she","it","they","we","i","me"}
            promising_words = title_words - stop
            # Count how many promising words appear in content
            matches = sum(1 for w in promising_words if w in content)
            score = matches / max(len(promising_words), 1)
            scored.append((title, score))
        
        scored.sort(key=lambda x: x[1], reverse=True)
        return scored
    
    return [(t, None) for t in titles]

if __name__ == "__main__":
    topic = sys.argv[1] if len(sys.argv) > 1 else "durian season malaysia"
    article_file = None
    for i, a in enumerate(sys.argv[2:]):
        if a == "--article-file" and i + 2 < len(sys.argv):
            article_file = sys.argv[i + 3]
    
    print(f"\n=== Discover Title Options: {topic} ===\n")
    results = generate(topic, article_file)
    for i, (title, score) in enumerate(results):
        marker = f" [match: {score:.0%}]" if score is not None else ""
        print(f"  {i+1}. {title}{marker}")
    
    print("\n  Best for Discover: #1-5 (promise + suspense)")
    print("  Best for SEO: #6-10 (negative insight / curiosity)")
    print("  Best for both: #11-14 (direct promise)")
