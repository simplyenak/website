#!/usr/bin/env python3
"""Compare durian-guide-2026 vs eating-durians: content, meta, structure."""
import json, re, sys

data = json.load(open("site/src/data/content/stories.json"))
items = data if isinstance(data, list) else data.get("docs", data.get("stories", []))

targets = ["durian-guide-2026", "eating-durians"]

def extract_text(content):
    words = []
    if isinstance(content, dict) and "root" in content:
        def walk(n):
            if isinstance(n, dict):
                if n.get("text"):
                    words.append(n["text"])
                for ch in n.get("children", []) or []:
                    walk(ch)
            elif isinstance(n, list):
                for ch in n:
                    walk(ch)
        walk(content["root"]["children"])
    return " ".join(words)

def headings(content):
    hs = []
    if isinstance(content, dict) and "root" in content:
        def walk(n):
            if isinstance(n, dict):
                if str(n.get("type", "")).startswith("heading"):
                    txt = "".join(ch.get("text", "") for ch in n.get("children", []) if ch.get("text"))
                    if txt:
                        hs.append(txt)
                for ch in n.get("children", []) or []:
                    walk(ch)
            elif isinstance(n, list):
                for ch in n:
                    walk(ch)
        walk(content["root"]["children"])
    return hs

for it in items:
    if it.get("slug") not in targets:
        continue
    print(f"===== {it.get('slug')} =====")
    print("title:", it.get("title"))
    print("meta_title:", repr(it.get("meta_title")))
    print("excerpt:", repr((it.get("excerpt") or "")[:120]))
    c = it.get("content")
    md = it.get("content_markdown") or ""
    body = md if md else extract_text(c)
    print("body words:", len(re.findall(r"\b\w+\b", body)))
    print("headings:", headings(c) if not md else re.findall(r"^#{1,3} .*$", md, re.M))
    print("updatedAt:", it.get("updatedAt"), "| publishedDate:", it.get("publishedDate"))
    print()
