#!/usr/bin/env python3
"""
Fix Portuguese meta fields in Payload CMS stories.

62+ out of 91 stories have Portuguese text in excerpt, meta_description,
meta.description, and/or meta.title fields due to a previous locale bug.

Content source (in priority order):
  1. content_markdown (plain markdown text in English)
  2. content (Lexical editor format with English text)

For fields without content_markdown, we extract text from the Lexical content
field, which is always in English.

Usage:
    python3 scripts/fix-pt-meta.py            # Fix all affected stories
    python3 scripts/fix-pt-meta.py --dry-run   # Preview only
    python3 scripts/fix-pt-meta.py --auto      # Silent mode (for cron)
    python3 scripts/fix-pt-meta.py --id <id>   # Fix a single story by ID
"""

import argparse
import json
import os
import re
import sys
import urllib.request
import urllib.error

# ─── Configuration ────────────────────────────────────────────────────
PAYLOAD_URL = os.environ.get("PAYLOAD_URL", "https://cms.system.simplyenak.com")
PAYLOAD_EMAIL = os.environ.get("PAYLOAD_EMAIL", "admin@simplyenak.com")
PAYLOAD_PASSWORD = os.environ.get("PAYLOAD_PASSWORD", "")
MAX_META_LENGTH = 160

# Portuguese indicator words - comprehensive set
PT_WORDS = {
    'os', 'as', 'dos', 'das', 'num', 'numa', 'nuns', 'numas',
    'que', 'não', 'mais', 'uma', 'para', 'com', 'são', 'é', 'na', 'no',
    'de', 'da', 'do', 'em', 'num', 'numa',
    'como', 'mas', 'pela', 'pelo', 'nos', 'nas', 'seu', 'sua',
    'seus', 'suas', 'essa', 'esse', 'esta', 'este', 'isso', 'isto',
    'estes', 'essas', 'estas',
    'muito', 'muita', 'muitos', 'muitas',
    'entre', 'sobre', 'após', 'até', 'desde', 'durante',
    'antes', 'depois', 'onde', 'quando', 'porque', 'porquê', 'também',
    'ainda', 'já', 'sempre', 'nunca', 'cada', 'outro', 'outra',
    'outros', 'outras', 'todo', 'toda', 'todos', 'todas', 'qual',
    'quais', 'quanto', 'quanta', 'quantos', 'quantas', 'pouco',
    'pouca', 'poucos', 'poucas', 'mesmo', 'mesma', 'mesmos', 'mesmas',
    # Content words - Portuguese-specific
    'mercados', 'alimentos', 'comida', 'comer', 'país', 'cultura',
    'comprar', 'melhor', 'melhores', 'guia', 'visitar', 'visita',
    'locais', 'fazer', 'compras', 'viva', 'abastecem', 'restaurantes',
    'barraca', 'barracas', 'vendedores', 'ambulantes', 'ingredientes',
    'frescas', 'frescos', 'manhãs', 'reputação', 'gastronômica',
    'gastronómica', 'gastronômico', 'gastronómico', 'construída', 'base',
    'ruas', 'mudam', 'trânsito', 'noite', 'tarde', 'cheiro', 'cheiros',
    'come', 'põe',
    'você', 'vocês', 'culinária', 'experiência', 'experiências',
    'deliciosa', 'delicioso', 'deliciosas', 'deliciosos',
    'saborosa', 'saboroso', 'saborosas', 'saborosos',
    'famoso', 'famosa', 'famosos', 'famosas',
    'típico', 'típica', 'típicos', 'típicas',
    'autêntico', 'autêntica', 'prato', 'pratos',
    'petiscos', 'lanche', 'lanches', 'sobremesa', 'sobremesas',
    'bebida', 'bebidas', 'tempero', 'temperos',
    'preparado', 'preparada', 'assado', 'assada', 'cozido', 'cozida',
    'frito', 'frita', 'fritos', 'fritas', 'grelhado', 'grelhada',
    'malásia', 'sudeste', 'asiático', 'asiática',
    'verdadeira', 'verdadeiro', 'maravilhosa', 'maravilhoso',
    'incrível', 'incríveis', 'espetacular', 'espetaculares',
    'ótimo', 'ótima', 'ótimos', 'ótimas',
    'excelente', 'excelentes',
    'cliente', 'clientes', 'pessoas', 'pessoa',
    'viajante', 'viajantes', 'turista', 'turistas',
    'viagem', 'viagens', 'destino', 'destinos',
    'conhecer', 'explorar', 'descobrir', 'provar', 'experimentar',
    'saborear', 'apreciar', 'degustar', 'proveitoso', 'proveitosa',
    'à', 'às',
    # Food/review related PT words
    'preço', 'preços', 'conselho', 'conselhos', 'dica', 'dicas',
    'seção', 'seções', 'categoria', 'categorias', 'avaliação',
    'avaliações', 'leia', 'artigo', 'artigos', 'relacionados',
    'popular', 'populares', 'seleção', 'vale', 'pena', 'maneira',
    'melhores', 'saber', 'veja', 'também', 'sentido', 'cada',
    'porção', 'porções', 'servido', 'servida', 'acompanhado',
    'acompanhada', 'precisa', 'precisa', 'precisam',
    'especialidade', 'especialidades', 'região', 'regiões',
    'encontrar', 'voltar', 'volta', 'paixão', 'busca', 'vida',
    'bairro', 'bairros', 'centro', 'cidade', 'cidades',
    'história', 'tradição', 'tradições', 'combinam', 'próprio',
    'própria', 'próprios', 'próprias', 'desse', 'disso', 'naquela',
    'naquele', 'àquela', 'àquele', 'nessa', 'nesse', 'nesta', 'neste',
    'dela', 'dele', 'delas', 'deles',
    # PT-only accented words
    'é', 'está', 'estão', 'têm', 'vêm', 'põe', 'põem',
    'tradicional', 'tradicionais',
    'diferente', 'diferentes', 'principal', 'principais',
    'primeiro', 'primeira', 'primeiros', 'primeiras',
    'último', 'última', 'últimos', 'últimas',
    'próximo', 'próxima', 'próximos', 'próximas',
    'grande', 'grandes', 'pequeno', 'pequena', 'pequenos', 'pequenas',
    'melhores', 'piores', 'maior', 'maiores', 'menor', 'menores',
}

# Portuguese accented character regex
PT_ACCENTED_RE = re.compile(r'[àáâãçéêíóôõú]', re.IGNORECASE)


# ─── Payload API ──────────────────────────────────────────────────────

def payload_login():
    """Login to Payload and return token."""
    data = json.dumps({"email": PAYLOAD_EMAIL, "password": PAYLOAD_PASSWORD}).encode()
    req = urllib.request.Request(f"{PAYLOAD_URL}/api/users/login", data=data,
                                 headers={"Content-Type": "application/json"})
    try:
        resp = json.loads(urllib.request.urlopen(req, timeout=15).read())
        token = resp.get("token", "")
        if not token:
            print(f"ERROR: Login returned no token. Response: {resp}")
        return token
    except urllib.error.HTTPError as e:
        print(f"ERROR: Login failed with HTTP {e.code}: {e.read().decode()}")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: Login failed: {e}")
        sys.exit(1)


def payload_get_stories(token, limit=100, single_id=None):
    """
    Get all stories from Payload.
    We request the fields we need: content (Lexical), content_markdown, excerpt,
    meta_description, meta, title, slug.
    """
    all_stories = []
    page = 1

    # Request fields explicitly - need depth=0 for meta
    fields = "id,slug,title,excerpt,meta_description,meta,content_markdown,content"

    while True:
        if single_id:
            url = f"{PAYLOAD_URL}/api/stories/{single_id}?depth=0&fields={fields}"
            req = urllib.request.Request(url)
            req.add_header("Authorization", f"Bearer {token}")
            try:
                resp_data = json.loads(urllib.request.urlopen(req, timeout=15).read())
                return [resp_data] if isinstance(resp_data, dict) and resp_data.get('id') else []
            except urllib.error.HTTPError as e:
                print(f"ERROR: Failed to fetch story {single_id}: HTTP {e.code}")
                return []
        else:
            url = f"{PAYLOAD_URL}/api/stories?limit={limit}&page={page}&depth=0&fields={fields}"
            req = urllib.request.Request(url)
            req.add_header("Authorization", f"Bearer {token}")
            try:
                resp = json.loads(urllib.request.urlopen(req, timeout=30).read())
            except urllib.error.HTTPError as e:
                print(f"ERROR: Failed to fetch stories (page {page}): HTTP {e.code}")
                break

            docs = resp.get("docs", [])
            all_stories.extend(docs)

            if not resp.get("hasNextPage", False):
                break
            page += 1

    return all_stories


def payload_patch_story(token, story_id, update_data):
    """Patch a story in Payload with the given fields."""
    data = json.dumps(update_data).encode()
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/stories/{story_id}?depth=0",
        data=data,
        method='PATCH'
    )
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        return resp.status == 200
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"    ❌ Patch failed: HTTP {e.code} - {error_body[:200]}")
        return False


# ─── Language Detection ───────────────────────────────────────────────

def detect_portuguese(text):
    """
    Detect if text contains Portuguese.
    Uses accented characters and Portuguese indicator words.
    Returns True if the text is likely Portuguese.
    """
    if not text or not text.strip():
        return False

    text_lower = text.lower().strip()

    # Method 1: Check for Portuguese accented characters
    accented_matches = PT_ACCENTED_RE.findall(text_lower)
    if len(accented_matches) >= 2:
        return True

    # Method 2: Count Portuguese indicator words
    words = re.findall(r'\b[a-záàâãéêíóôõúç]+\b', text_lower)
    pt_word_count = sum(1 for w in words if w in PT_WORDS)

    # If 3+ PT words in a short text (< 160 chars), it's likely Portuguese
    if pt_word_count >= 3:
        return True

    # For very short texts, 2 PT words with some accents is enough
    if pt_word_count >= 2 and len(accented_matches) >= 1:
        return True

    return False


def detect_portuguese_title(title):
    """
    Specifically detect if a story title is in Portuguese.
    Titles are shorter so we're more aggressive.
    """
    if not title or not title.strip():
        return False

    text_lower = title.lower().strip()
    accented_matches = PT_ACCENTED_RE.findall(text_lower)

    if len(accented_matches) >= 2:
        return True

    words = re.findall(r'\b[a-záàâãéêíóôõúç]+\b', text_lower)
    pt_word_count = sum(1 for w in words if w in PT_WORDS)

    # A single PT word with accent is a strong signal for a title
    if pt_word_count >= 2:
        return True
    if pt_word_count >= 1 and len(accented_matches) >= 1:
        return True

    return False


# ─── Lexical Content Extraction ───────────────────────────────────────

def extract_lexical_text(node):
    """Extract text from Lexical editor format recursively."""
    texts = []
    if isinstance(node, dict):
        text = node.get('text', '')
        if text:
            texts.append(text)
        for child in node.get('children', []):
            if isinstance(child, dict):
                texts.extend(extract_lexical_text(child))
    return texts


def extract_plain_text_from_content(content):
    """
    Extract plain English text from a story's content field.

    Tries content_markdown first (plain markdown), then falls back to
    Lexical content field (rich text editor format).
    """
    if not content:
        return None

    # content could be a dict (Lexical format with 'root' key) or a string
    if isinstance(content, str):
        return content

    if isinstance(content, dict):
        root = content.get('root', content)
        texts = extract_lexical_text(root)
        if texts:
            return ' '.join(texts)

    return None


# ─── Text Processing ──────────────────────────────────────────────────

def strip_markdown(text):
    """Strip markdown formatting from text, returning plain text."""
    if not text:
        return ""

    # Remove code blocks
    text = re.sub(r'```[\s\S]*?```', '', text)
    # Remove inline code
    text = re.sub(r'`([^`]+)`', r'\1', text)

    # Remove images
    text = re.sub(r'!\[([^\]]*)\]\([^)]+\)', r'\1', text)
    # Remove links
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)

    # Remove heading markers
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    # Remove horizontal rules
    text = re.sub(r'^[-*_]{3,}\s*$', '', text, flags=re.MULTILINE)

    # Remove bold/italic
    text = re.sub(r'\*\*\*([^*]+)\*\*\*', r'\1', text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    text = re.sub(r'___([^_]+)___', r'\1', text)
    text = re.sub(r'__([^_]+)__', r'\1', text)
    text = re.sub(r'_([^_]+)_', r'\1', text)
    text = re.sub(r'~~([^~]+)~~', r'\1', text)

    # Remove blockquote markers
    text = re.sub(r'^>\s+', '', text, flags=re.MULTILINE)

    # Remove list markers
    text = re.sub(r'^[\s]*[-*+]\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'^[\s]*\d+[.)]\s+', '', text, flags=re.MULTILINE)

    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)

    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove leading/trailing whitespace
    text = text.strip()

    return text


def truncate_at_sentence(text, max_len=MAX_META_LENGTH):
    """Truncate text at a sentence boundary, staying within max_len."""
    if len(text) <= max_len:
        return text

    truncated = text[:max_len]

    # Look for sentence-ending punctuation within the truncated portion
    for punct in ['. ', '! ', '? ']:
        idx = truncated.rfind(punct)
        if idx >= 0 and idx + 2 <= max_len:
            return truncated[:idx + 1]

    # Try period at end
    idx = truncated.rfind('.')
    if idx >= 0 and idx + 1 <= max_len:
        return truncated[:idx + 1]

    # Word boundary fallback
    idx = truncated.rfind(' ')
    if idx >= 0:
        return truncated[:idx] + '...'

    return truncated


def generate_excerpt(content_plain, max_len=150):
    """Generate excerpt from plain text content.

    First 150 chars of content, stripped of markdown, plain text.
    """
    if not content_plain:
        return None

    text = strip_markdown(content_plain)
    if not text:
        return None

    # Take first max_len chars, break at word boundary
    if len(text) > max_len:
        return truncate_at_sentence(text, max_len)
    return text


def generate_meta_description(content_plain, max_len=155):
    """Generate meta_description from plain text content.

    First 155 chars, plain text, end at sentence boundary.
    """
    if not content_plain:
        return None

    text = strip_markdown(content_plain)
    if not text:
        return None

    return truncate_at_sentence(text, max_len)


def generate_meta_title(story_title):
    """Generate meta.title from story title.

    Format: story.title + ' | Simply Enak'
    Only applies if story.title is in English.
    """
    if not story_title:
        return None

    title = story_title.strip()

    # Don't add " | Simply Enak" if already present
    if "| Simply Enak" in title:
        return title

    # If the title itself is Portuguese, we can't use it for meta.title
    # Return None so the calling code can try to generate from content
    if detect_portuguese_title(title):
        return None

    full = f"{title} | Simply Enak"
    # Keep it under 60 chars for SEO best practices
    if len(full) > 60:
        max_title_len = 60 - len(" | Simply Enak")
        if max_title_len > 0 and len(title) > max_title_len:
            title = title[:max_title_len].rsplit(' ', 1)[0] + '...'
            full = f"{title} | Simply Enak"
    return full


def extract_first_heading_from_lexical(content_field):
    """
    Extract the first heading text from a Lexical content field.

    The Lexical content often starts with an H1/H2 heading that contains
    the actual English title of the story.

    Returns the heading text or None.
    """
    if not isinstance(content_field, dict):
        return None

    root = content_field.get('root', content_field)
    children = root.get('children', [])

    for child in children:
        child_type = child.get('type', '')
        if child_type == 'heading':
            texts = []
            for sub in child.get('children', []):
                if isinstance(sub, dict):
                    t = sub.get('text', '')
                    if t:
                        texts.append(t)
            heading_text = ' '.join(texts).strip()
            if heading_text:
                # Skip generic headings that aren't titles
                generic_headings = [
                    'frequently asked questions', 'faq', 'introduction',
                    'overview', 'summary', 'conclusion', 'what to expect',
                    'tips', 'related', 'more information', 'see also',
                ]
                if heading_text.lower().strip() not in generic_headings:
                    return heading_text
        # Only check the first few children for headings
        if children.index(child) >= 5:
            break

    return None


def slug_to_title(slug):
    """
    Convert a URL slug to a readable title.

    E.g., "traveling-during-fasting-month" -> "Traveling During Fasting Month"
    Handles special cases like "kl" -> "KL", "ipoh" -> "Ipoh", etc.
    """
    if not slug:
        return None

    # Special case mappings
    special_caps = {
        'kl': 'KL',
        'klang': 'Klang',
        'klcc': 'KLCC',
    }

    # Split on hyphen, capitalize each word with special handling
    words = slug.split('-')
    title_parts = []
    for w in words:
        if w.lower() in special_caps:
            title_parts.append(special_caps[w.lower()])
        elif w.isdigit():
            title_parts.append(w)
        elif len(w) <= 2 and w.lower() not in ('to', 'in', 'on', 'at', 'by'):
            # Short words (abbreviations like "kl") -> already handled above
            title_parts.append(w.capitalize())
        else:
            title_parts.append(w.capitalize())

    return ' '.join(title_parts)


def generate_meta_title_from_content(content_plain, content_field=None, story_title=None, slug=None):
    """
    Generate a meta.title from content when the story title is Portuguese.

    Priority:
    1. If story title is English, use it
    2. Extract first heading from Lexical content
    3. Convert slug to readable title
    4. First meaningful sentence from content text
    """
    if not content_plain:
        return None

    # If the story title is English, use it
    if story_title and not detect_portuguese_title(story_title):
        return generate_meta_title(story_title)

    # Try extracting first heading from Lexical content
    if content_field:
        heading = extract_first_heading_from_lexical(content_field)
        if heading:
            # Check the heading isn't Portuguese
            if not detect_portuguese_title(heading):
                full = f"{heading} | Simply Enak"
                if len(full) > 60:
                    max_len = 60 - len(" | Simply Enak")
                    if max_len > 0 and len(heading) > max_len:
                        heading = heading[:max_len].rsplit(' ', 1)[0].rstrip(',;:')
                        full = f"{heading} | Simply Enak"
                return full

    # Try converting slug to title
    if slug:
        slug_title = slug_to_title(slug)
        if slug_title:
            full = f"{slug_title} | Simply Enak"
            if len(full) > 60:
                max_len = 60 - len(" | Simply Enak")
                if max_len > 0 and len(slug_title) > max_len:
                    slug_title = slug_title[:max_len].rsplit(' ', 1)[0]
                    full = f"{slug_title} | Simply Enak"
            return full

    # Last resort: use plain text content
    text = strip_markdown(content_plain)
    if not text:
        return None

    # Skip "Updated" banners
    if text.startswith('Updated') or text.startswith('updated'):
        # Find the first sentence that's not an update notice
        sentences = re.split(r'(?<=[.!?])\s+', text)
        meaningful = [s for s in sentences
                      if not s.strip().startswith('Updated') and not s.strip().startswith('updated')
                      and len(s.strip()) > 30]
        if meaningful:
            first_part = meaningful[0][:50].strip()
        else:
            first_part = text[:50].strip()
    else:
        first_part = text[:50].strip()

    # Clean up and ensure word boundary
    if len(first_part) >= 50:
        idx = first_part.rfind(' ')
        if idx > 20:
            first_part = first_part[:idx]

    first_part = first_part.rstrip('.,!?;:')

    full = f"{first_part} | Simply Enak"
    if len(full) > 60:
        max_len = 60 - len(" | Simply Enak")
        if max_len > 0 and len(first_part) > max_len:
            first_part = first_part[:max_len].rsplit(' ', 1)[0]
            full = f"{first_part} | Simply Enak"

    return full


# ─── Main Logic ───────────────────────────────────────────────────────

def check_story_fields(story):
    """
    Check if a story has Portuguese in any of the meta fields.

    Returns:
        needs_fix: dict of field -> {old, new}
        content_source: string describing what content source was used
    """
    needs_fix = {}

    excerpt = story.get('excerpt', '') or ''
    meta_description = story.get('meta_description', '') or ''
    meta = story.get('meta', {}) or {}
    if not isinstance(meta, dict):
        meta = {}
    meta_title = meta.get('title', '') or ''
    meta_desc_inner = meta.get('description', '') or ''

    content_markdown = story.get('content_markdown', '') or ''
    content_lexical = story.get('content', {})

    # Determine content source
    content_plain = None
    content_source = None

    if content_markdown:
        content_plain = content_markdown
        content_source = 'content_markdown'
    elif content_lexical:
        extracted = extract_plain_text_from_content(content_lexical)
        if extracted:
            content_plain = extracted
            content_source = 'content (Lexical)'

    if not content_plain:
        return needs_fix, 'no content available'

    # Clean the plain text once (strip markdown if from content_markdown)
    if content_source == 'content_markdown':
        content_plain_clean = strip_markdown(content_plain)
    else:
        content_plain_clean = content_plain  # Already from Lexical, no markdown

    if not content_plain_clean:
        return needs_fix, 'content empty after cleaning'

    # Check and generate excerpt
    if detect_portuguese(excerpt):
        new_excerpt = generate_excerpt(content_plain_clean)
        if new_excerpt and new_excerpt != excerpt:
            needs_fix['excerpt'] = {'old': excerpt, 'new': new_excerpt}

    # Check and generate meta_description (top level)
    if detect_portuguese(meta_description):
        new_meta_desc = generate_meta_description(content_plain_clean)
        if new_meta_desc and new_meta_desc != meta_description:
            needs_fix['meta_description'] = {'old': meta_description, 'new': new_meta_desc}

    # Check and generate meta.description (inside meta object)
    if detect_portuguese(meta_desc_inner) and meta_desc_inner != meta_description:
        new_meta_desc = generate_meta_description(content_plain_clean)
        if new_meta_desc and new_meta_desc != meta_desc_inner:
            needs_fix['meta.description'] = {'old': meta_desc_inner, 'new': new_meta_desc}
    elif detect_portuguese(meta_desc_inner):
        # meta_desc_inner is Portuguese but same as meta_description, fix both
        new_meta_desc = generate_meta_description(content_plain_clean)
        if new_meta_desc and new_meta_desc != meta_desc_inner:
            if 'meta_description' not in needs_fix:
                needs_fix['meta_description'] = {'old': meta_description, 'new': new_meta_desc}
            needs_fix['meta.description'] = {'old': meta_desc_inner, 'new': new_meta_desc}

    # Check and generate meta.title (inside meta object)
    if detect_portuguese(meta_title):
        # First try to use the story title (if it's English)
        story_title = story.get('title', '')
        new_meta_title = generate_meta_title(story_title)
        if new_meta_title and new_meta_title != meta_title:
            needs_fix['meta.title'] = {'old': meta_title, 'new': new_meta_title}
        elif not new_meta_title:
            # Story title is also Portuguese, generate from content
            slug = story.get('slug', '')
            content_lexical = story.get('content', {})
            new_meta_title = generate_meta_title_from_content(
                content_plain_clean,
                content_field=content_lexical if isinstance(content_lexical, dict) else None,
                story_title=story_title,
                slug=slug,
            )
            if new_meta_title and new_meta_title != meta_title:
                needs_fix['meta.title'] = {'old': meta_title, 'new': new_meta_title}

    return needs_fix, content_source


def main():
    parser = argparse.ArgumentParser(
        description="Fix Portuguese meta fields in Payload CMS stories",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 scripts/fix-pt-meta.py              # Fix all stories
  python3 scripts/fix-pt-meta.py --dry-run     # Preview only
  python3 scripts/fix-pt-meta.py --auto        # Cron mode (silent)
  python3 scripts/fix-pt-meta.py --id abc123   # Fix one story
        """
    )
    parser.add_argument("--dry-run", action="store_true", help="Preview only, no changes")
    parser.add_argument("--auto", action="store_true", help="Silent mode for cron")
    parser.add_argument("--id", type=str, help="Fix a single story by ID")
    parser.add_argument("--limit", type=int, help="Max stories to check (for testing)")
    args = parser.parse_args()

    if not args.auto:
        print("=" * 60)
        print("  Fix Portuguese Meta Fields in Payload CMS Stories")
        print(f"  Mode: {'DRY RUN (no changes)' if args.dry_run else 'APPLY CHANGES'}")
        print("=" * 60)
        print()

    # ── Step 1: Login ──
    if not args.auto:
        print("🔑 Logging into Payload CMS...")
    token = payload_login()
    if not token:
        print("ERROR: Payload login failed")
        sys.exit(1)
    if not args.auto:
        print("   ✅ Logged in successfully")
        print()

    # ── Step 2: Fetch stories ──
    if not args.auto:
        print("📡 Fetching stories from Payload...")
    stories = payload_get_stories(token, single_id=args.id)
    if not stories:
        print("ERROR: No stories found")
        sys.exit(1)
    if args.limit and len(stories) > args.limit:
        stories = stories[:args.limit]
    if not args.auto:
        print(f"   ✅ Found {len(stories)} stories")
        print()

    # ── Step 3: Check each story ──
    if not args.auto:
        print("🔍 Checking stories for Portuguese meta fields...")
        print()

    issues = []
    no_content_issues = []
    for story in stories:
        story_id = story.get('id', '')
        slug = story.get('slug', '')
        title = story.get('title', '')

        needs_fix, content_source = check_story_fields(story)

        if needs_fix:
            if content_source and 'no content' not in content_source:
                issues.append({
                    'id': story_id,
                    'slug': slug,
                    'title': title,
                    'needs_fix': needs_fix,
                    'content_source': content_source,
                })
            else:
                no_content_issues.append({
                    'id': story_id,
                    'slug': slug,
                    'title': title,
                    'needs_fix': needs_fix,
                })

    # Report no-content issues (can't fix these)
    if no_content_issues and not args.auto:
        print(f"⚠️  {len(no_content_issues)} story(s) have PT meta but no content source — skipping:")
        for iss in no_content_issues:
            fields = ', '.join(iss['needs_fix'].keys())
            print(f"     {iss['slug'] or iss['id'][:12]}: {fields}")

    if not issues:
        if not args.auto:
            print("✅ No fixable Portuguese meta fields found!")
        # Still report un-fixable ones
        if no_content_issues and not args.auto:
            print(f"\n⚠️  {len(no_content_issues)} story(s) skipped (no content available to generate from)")
        return

    if not args.auto:
        print(f"\n📋 Found {len(issues)} fixable stories with Portuguese meta fields:")
        for issue in issues:
            slug = issue['slug'] or issue['id'][:12]
            fields_desc = ', '.join(issue['needs_fix'].keys())
            src = issue['content_source']
            print(f"     📄 {slug}: {fields_desc} (source: {src})")
        print()

    # ── Step 4: Fix each story ──
    fixed_count = 0
    field_fix_count = 0
    error_count = 0

    for idx, issue in enumerate(issues):
        story_id = issue['id']
        slug = issue['slug'] or story_id[:12]
        needs_fix = issue['needs_fix']

        # Build the patch data
        update_data = {}
        for field_name, info in needs_fix.items():
            if field_name == 'meta.title':
                if 'meta' not in update_data:
                    update_data['meta'] = {}
                update_data['meta']['title'] = info['new']
            elif field_name == 'meta.description':
                if 'meta' not in update_data:
                    update_data['meta'] = {}
                update_data['meta']['description'] = info['new']
            else:
                update_data[field_name] = info['new']

        if not args.auto:
            print(f"[{idx+1}/{len(issues)}] 📄 {slug}:")
            for field_name, info in needs_fix.items():
                old_text = info['old'][:80].replace('\n', ' ')
                new_text = info['new'][:80].replace('\n', ' ')
                print(f"     🔄 {field_name}:")
                print(f"        FROM: \"{old_text}...\"")
                print(f"        TO:   \"{new_text}...\"")

        if not args.dry_run:
            success = payload_patch_story(token, story_id, update_data)
            if success:
                fixed_count += 1
                field_fix_count += len(needs_fix)
                if not args.auto:
                    print(f"     ✅ Patched {len(needs_fix)} field(s)")
            else:
                error_count += 1
                if not args.auto:
                    print(f"     ❌ Patch failed")
        else:
            if not args.auto:
                print(f"     📋 Would patch {len(needs_fix)} field(s) [DRY RUN]")

        if not args.auto:
            print()

    # ── Summary ──
    if not args.auto:
        print("=" * 60)
        if args.dry_run:
            print(f"  [DRY RUN] Would fix {fixed_count} stories ({field_fix_count} fields)")
        else:
            print(f"  ✅ Fixed {fixed_count} stories ({field_fix_count} fields)")
        if error_count:
            print(f"  ❌ {error_count} story(s) failed to patch")
        if no_content_issues:
            print(f"  ⚠️  {len(no_content_issues)} story(s) skipped (no content available)")
        print("=" * 60)


if __name__ == "__main__":
    main()
