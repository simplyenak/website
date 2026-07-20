#!/usr/bin/env python3
"""Fix YAML frontmatter in story markdown files — strip || prefixes."""

import re, sys
from pathlib import Path

POSTS_DIR = Path(__file__).parent / ".." / "src" / "data" / "post"

for filepath in sorted(POSTS_DIR.resolve().glob("*.md")):
    text = filepath.read_text(encoding="utf-8")
    
    # Strip || prefix from YAML frontmatter fields
    lines = text.split("\n")
    in_frontmatter = False
    changed = False
    new_lines = []
    
    for line in lines:
        if line.strip() == "---":
            in_frontmatter = not in_frontmatter
            new_lines.append(line)
            continue
        if in_frontmatter and line.startswith("|") and len(line) > 1 and line[1] not in (" ", "-", ">"):
            # Strip leading pipe when followed by a letter (broken YAML from colony import)
            line = line.lstrip("|")
            changed = True
        new_lines.append(line)
    
    if changed:
        filepath.write_text("\n".join(new_lines), encoding="utf-8")
        print(f"Fixed {filepath.name}")
