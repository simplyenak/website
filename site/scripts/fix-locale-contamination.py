#!/usr/bin/env python3
"""
fix-locale-contamination.py

Regenerates the 8 non-Malay locale page types (de, es, fr, nl, ru, ja, zh, pt)
from the current EN page versions, adding correct locale plumbing.

WHY: the locale pages were created by copying the ms/ version and only swapping
the lang + href prefixes, leaving MALAY hardcoded fallbacks and metadata on
German/French/Japanese/etc pages (verified live: /de/about/ renders in Malay).
The EN pages are the correct English source and have newer structure.

The transform per page:
  1. Add: import useTranslations, const lang='xx', const t = useTranslations(lang)
  2. Pass lang to every content fetcher (getX(lang))
  3. Prefix internal hrefs with /xx/ (except hash links and existing /xx/ links)

ms/ is intentionally NOT touched (Malay is correct there).
"""
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent / "src" / "pages"
LANGS = ["de", "es", "fr", "nl", "ru", "ja", "zh", "pt"]

# Page type -> (en file, [list of transform hints])
PAGES = [
    "about.astro",
    "contact.astro",
    "faq.astro",
    "index.astro",
    "tours/index.astro",
]

# Fetchers that take an optional locale as FIRST arg (add lang)
LOCALE_FETCHERS = [
    "getAboutPage", "getContactPage", "getFAQsByPage", "getStories",
    "getAllTours", "getHomePage", "getToursPage", "getTourBySlug",
    "getFeaturedTours", "getSiteSettings", "getFAQs", "getAllStories",
]

def add_locale_plumbing(content: str, lang: str) -> str:
    """Insert the locale const + t() after the frontmatter imports."""
    # 1. Ensure useTranslations import
    if "useTranslations" not in content:
        content = content.replace(
            "import Layout from '~/layouts/PageLayout.astro';",
            "import Layout from '~/layouts/PageLayout.astro';\nimport { useTranslations } from '~/i18n/utils';",
            1,
        )
    # 2. Insert lang const + t after the last import line in frontmatter.
    #    If `const t = useTranslations(...)` already exists (e.g. EN faq.astro
    #    hardcodes useTranslations('en')), do NOT add a second declaration —
    #    just retarget the existing one to `lang`.
    m = re.match(r"---\n(.*?)\n---", content, re.S)
    if not m:
        print(f"  !! no frontmatter found")
        return content
    front = m.group(1)
    # Find the last import line
    import_lines = [l for l in front.split("\n") if l.strip().startswith("import ")]
    if not import_lines:
        print(f"  !! no imports found")
        return content
    last_import = import_lines[-1]
    # If lang const already exists (shouldn't for EN source), replace it
    if re.search(r"const lang\s*=", front):
        front = re.sub(r"const lang\s*=\s*'[^']*';", f"const lang = '{lang}';", front)
    else:
        front = front.replace(
            last_import,
            f"{last_import}\n\nconst lang = '{lang}';",
            1,
        )
    # 3. Retarget existing useTranslations to `lang`; only add `const t` if none exists
    if re.search(r"const t\s*=\s*useTranslations", front):
        front = re.sub(r"const t\s*=\s*useTranslations\([^)]*\)", "const t = useTranslations(lang)", front)
    else:
        front = re.sub(r"useTranslations\('en'\)", "useTranslations(lang)", front)
        if "const t = useTranslations" not in front:
            front = front.replace(f"const lang = '{lang}';", f"const lang = '{lang}';\nconst t = useTranslations(lang);", 1)
    content = content[: m.start(1)] + front + content[m.end(1):]
    return content

def pass_locale_to_fetchers(content: str, lang: str) -> str:
    """Pass lang to content fetchers: getX() -> getX(lang), getY('faq') -> getY('faq', lang)."""
    for fetcher in LOCALE_FETCHERS:
        # Pattern: fetcher( with args up to first matching close paren
        # Handle both getFAQsByPage('faq') and getAboutPage()
        pattern = re.compile(rf"{fetcher}\(([^)]*)\)")
        def repl(m):
            args = m.group(1).strip()
            if not args:
                return f"{fetcher}('{lang}')"
            if args.startswith("'") or args.startswith('"'):
                # already has a string first arg -> append lang
                return f"{fetcher}({args}, '{lang}')"
            if args == lang or args == f"'{lang}'":
                return m.group(0)
            return m.group(0)
        content = pattern.sub(repl, content)
    return content

def prefix_internal_hrefs(content: str, lang: str) -> str:
    """Prefix hardcoded internal hrefs with /lang/."""
    # Match href="/..." but NOT href="//..." (external) and not already /lang/
    def repl(m):
        href = m.group(1)
        if href.startswith("//"):
            return m.group(0)
        if href.startswith(f"/{lang}"):
            return m.group(0)
        if href == "/":
            return f'href="/{lang}/"'
        return f'href="/{lang}{href}"'
    return re.sub(r'href="(/[^"]*)"', repl, content)

def transform(content: str, lang: str) -> str:
    content = add_locale_plumbing(content, lang)
    content = pass_locale_to_fetchers(content, lang)
    content = prefix_internal_hrefs(content, lang)
    return content

def main():
    dry = "--dry-run" in sys.argv
    changed = 0
    for page in PAGES:
        en_file = BASE / page
        if not en_file.exists():
            print(f"SKIP {page}: no EN source")
            continue
        en_content = en_file.read_text(encoding="utf-8")
        for lang in LANGS:
            out_file = BASE / lang / page
            new_content = transform(en_content, lang)
            if out_file.exists() and out_file.read_text(encoding="utf-8") == new_content:
                continue
            if dry:
                print(f"  [dry] would write {out_file.relative_to(BASE)}")
            else:
                out_file.parent.mkdir(parents=True, exist_ok=True)
                out_file.write_text(new_content, encoding="utf-8")
                print(f"  wrote {out_file.relative_to(BASE)}")
            changed += 1
    print(f"\n{changed} files {'would be' if dry else ''} regenerated from EN with locale plumbing")

if __name__ == "__main__":
    main()
