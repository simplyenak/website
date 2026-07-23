#!/usr/bin/env python3
"""Debug version of brand-voice-fix main()."""
import sys, json, traceback, re
from pathlib import Path

CONTENT_DIR = Path(__file__).parent.parent / "site" / "src" / "data" / "content"
print(f"CONTENT_DIR: {CONTENT_DIR}", file=sys.stderr)
print(f"Exists: {CONTENT_DIR.exists()}", file=sys.stderr)

# Import ALL functions from the fix module
sys.path.insert(0, str(Path(__file__).parent))
import importlib.util
spec = importlib.util.spec_from_file_location("fix_mod", str(Path(__file__).parent / "brand-voice-fix.py"))
fix_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fix_mod)

dry_run = "--dry-run" in sys.argv
fix_mode = "--fix" in sys.argv
print(f"dry_run={dry_run}, fix_mode={fix_mode}", file=sys.stderr)

SKIP_FILES = {"testimonials.json", "reviews.json", "stories.json", "media-coverage.json"}
files = sorted(f for f in CONTENT_DIR.glob("*.json") if f.name != "media.json" and f.name not in SKIP_FILES)
print(f"Files: {len(files)}", file=sys.stderr)
for fp in files:
    print(f"  {fp.name}", file=sys.stderr)

total_changes = 0
files_changed = 0

for fpath in files:
    data = json.loads(fpath.read_text())
    new_data, changes = fix_mod.fix_value(data, fpath.name)
    if changes:
        files_changed += 1
        total_changes += len(changes)
        if fix_mode:
            with open(fpath, 'w') as f:
                json.dump(new_data, f, indent=2, ensure_ascii=False)
                f.write('\n')
            print(f"Fixed {fpath.name}: {len(changes)} change(s)")

print(f"\n{'='*60}")
print(f"Brand Voice Fixer — {files_changed} files, {total_changes} changes")
print(f"{'='*60}")
