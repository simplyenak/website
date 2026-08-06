#!/usr/bin/env python3
"""Backfill segment copy from LandingPageSections.astro hardcoded strings
into Payload landing_pages (hero_hook, problem_heading, problem_content,
body_markdown).

The copy lives in the component source; this script extracts it once and
PATCHes each landing page so Payload becomes the source of truth.

body_markdown format (per Maarten's design):
    ## People
    <people text>
    ## Places
    <places text>
    ## Stories
    <stories text>
Plus optional extra prose paragraphs.

Run: python3 scripts/backfill-segment-copy.py
"""
import json
import os
import re
import sys
import time
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV = os.path.join(ROOT, 'site', '.env')


def segment_name_from_slug(slug: str) -> str:
    """Derive a display name from a landing page slug (e.g.
    'food-tours-for-couples-kuala-lumpur' -> 'Couples Kuala Lumpur')."""
    parts = [p for p in slug.split('-') if p not in ('food', 'tours', 'for')]
    return ' '.join(p.capitalize() for p in parts) if parts else slug.replace('-', ' ').title()

creds = {}
with open(ENV) as f:
    for line in f:
        line = line.strip()
        if line.startswith('PAYLOAD_EMAIL='):
            creds['email'] = line.split('=', 1)[1].strip()
        elif line.startswith('PAYLOAD_PASSWORD='):
            creds['password'] = line.split('=', 1)[1].strip()

COMPONENT = os.path.join(ROOT, 'site', 'src', 'components', 'LandingPageSections.astro')
src = open(COMPONENT, encoding='utf-8').read()


def api(path, method='GET', body=None, token=None):
    url = 'https://cms.system.simplyenak.com' + path
    req = urllib.request.Request(url, method=method)
    if token:
        req.add_header('Authorization', f'Bearer {token}')
    req.add_header('Content-Type', 'application/json')
    data = json.dumps(body).encode() if body is not None else None
    try:
        with urllib.request.urlopen(req, data=data, timeout=30) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {'http_error': e.code, 'body': e.read().decode()[:300]}


def extract_hooks():
    """Extract the hardcoded hooks from getHook()."""
    # Specific hooks: if (first === 'halal') return `...`;
    hooks = {}
    for m in re.finditer(r"if \(first === '(\w+)'\) return `([^`]+)`;", src):
        hooks[m.group(1)] = m.group(2)
    # Type hooks from the hooks map
    type_hooks = {}
    m = re.search(r"const hooks: Record<string, string> = \{(.*?)\};", src, re.S)
    if m:
        for tm in re.finditer(r"(\w+): `([^`]+)`", m.group(1)):
            type_hooks[tm.group(1)] = tm.group(2)
    return hooks, type_hooks


def extract_problems():
    """Extract the hardcoded problem blocks from getProblem().

    Blocks use MIXED quotes (single and double) — e.g.
    halal: { title: "The 'Is this halal?' problem", desc: "..." },
    vegetarian: { title: 'The sad side-dish problem', desc: '...' },
    So parse with a tolerant regex over the whole block then split by key."""
    problems = {}
    m = re.search(r"const probs: Record<string, \{ title: string; desc: string \}> = \{(.*?)\n  \};", src, re.S)
    if m:
        block = m.group(1)
        for pm in re.finditer(r"(\w+): \{ title: ([\"'])(.*?)\2, desc: ([\"'])(.*?)\4 \}", block, re.S):
            key = pm.group(1)
            title = pm.group(3).replace("\\'", "'").replace('\\"', '"').replace('\\n', '\n')
            desc = pm.group(5).replace("\\'", "'").replace('\\"', '"').replace('\\n', '\n')
            problems[key] = {'title': title, 'desc': desc}
    return problems


def extract_pps():
    """Extract the People/Places/Stories pitches from getPeoplePlacesStories().

    Each entry: key: {\n people: "...",\n places: "...",\n stories: "...",\n },
    with double-quoted strings that may contain escaped quotes."""
    specific = {}
    m = re.search(r"const specific: Record<string, \{ people: string; places: string; stories: string \}> = \{(.*?)\n  \};", src, re.S)
    if m:
        block = m.group(1)
        for block_m in re.finditer(
            r"(\w+): \{\s*people: \"((?:[^\"\\]|\\.)*)\",\s*places: \"((?:[^\"\\]|\\.)*)\",\s*stories: \"((?:[^\"\\]|\\.)*)\"\s*,?\s*\}",
            block, re.S):
            key = block_m.group(1)
            specific[key] = {
                'people': block_m.group(2).replace('\\"', '"').replace('\\n', '\n'),
                'places': block_m.group(3).replace('\\"', '"').replace('\\n', '\n'),
                'stories': block_m.group(4).replace('\\"', '"').replace('\\n', '\n'),
            }
    return specific


def main():
    login = api('/api/users/login', 'POST', {'email': creds['email'], 'password': creds['password']})
    sess = login.get('token')
    if not sess:
        print('LOGIN FAILED:', login)
        sys.exit(1)
    print('login OK')

    hooks, type_hooks = extract_hooks()
    problems = extract_problems()
    specific = extract_pps()
    print(f"Extracted: {len(hooks)} specific hooks, {len(type_hooks)} type hooks, "
          f"{len(problems)} problems, {len(specific)} PPS blocks")

    # All landing pages
    d = api('/api/landing_pages?limit=200&depth=0', token=sess)
    pages = d.get('docs', [])

    # For each page, determine copy by first slug word / segment type
    updated = 0
    for p in pages:
        slug = p.get('slug', '')
        ptype = p.get('type', '')
        first = slug.split('-')[0]
        if first == 'food':
            first = slug.split('-')[1] if len(slug.split('-')) > 1 else first  # food-tours-* -> tours
            first = slug.split('-')[2] if len(slug.split('-')) > 2 else first  # kuala/penang/etc
        # Normalize: kuala-lumpur -> kuala, george town pages -> penang-ish
        first_norm = first
        if first == 'kuala':
            first_norm = 'kuala'
        elif first in ('george', 'gurney', 'chowrasta', 'little'):
            first_norm = 'penang'
        elif first == 'kampung':
            first_norm = 'kuala'
        elif first == 'chow':
            first_norm = 'kuala'
        elif first in ('queensbay', 'batu', 'tanjung', 'pudu'):
            first_norm = 'kuala' if 'kuala' in slug else 'penang'

        hook = hooks.get(first_norm) or type_hooks.get(ptype)
        problem = problems.get(first_norm)
        pps = specific.get(first_norm)

        # Resolve template literals from the type hooks: `${name}` and
        # `${name.toLowerCase()}` reference the segment. Resolve per page so
        # the stored copy is static and editable in the CMS.
        def resolve_tpl(text: str) -> str:
            if not text:
                return text
            seg_name = p.get('title') or segment_name_from_slug(slug)
            text = text.replace('${name.toLowerCase()}', seg_name.lower())
            text = text.replace('${name}', seg_name)
            return text

        hook = resolve_tpl(hook)
        problem_title = resolve_tpl(problem['title']) if problem else ''
        problem_desc = resolve_tpl(problem['desc']) if problem else ''

        # Build body_markdown from PPS + any pageContent
        body_parts = []
        if pps:
            if pps['people']:
                body_parts.append(f"## People\n\n{pps['people']}")
            if pps['places']:
                body_parts.append(f"## Places\n\n{pps['places']}")
            if pps['stories']:
                body_parts.append(f"## Stories\n\n{pps['stories']}")
        body_md = '\n\n'.join(body_parts)

        if not hook and not problem and not body_md:
            continue  # no copy to write for this page

        patch = {
            'title': p.get('title'),
            'slug': p.get('slug'),
            'type': p.get('type'),
            'status': p.get('status'),
            'hero_title': p.get('hero_title'),
            'hero_subtitle': p.get('hero_subtitle'),
            'hero_description': p.get('hero_description'),
            'hero_hook': hook or '',
            'problem_heading': problem_title,
            'problem_content': problem_desc,
            'body_markdown': body_md,
        }
        res = api(f'/api/landing_pages/{p["id"]}?draft=false', 'PATCH', patch, sess)
        if 'http_error' in res:
            print(f"  FAIL {slug}: {res['body'][:120]}")
        else:
            updated += 1
            print(f"  OK {slug}: hook={'Y' if hook else 'n'} problem={'Y' if problem else 'n'} body={'Y' if body_md else 'n'}")
        time.sleep(0.15)

    print(f"\nUpdated {updated}/{len(pages)} pages")


if __name__ == '__main__':
    main()
