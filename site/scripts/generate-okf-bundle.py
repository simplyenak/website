#!/usr/bin/env python3
# OKF Bundle Generator for Simply Enak
# Reads Payload CMS JSON snapshots and generates an OKF knowledge bundle.
# Output: site/public/okf/
import json, re
from datetime import datetime, timezone
from pathlib import Path

DATA_DIR = Path("src/data/content").resolve()
OUT_DIR = Path("public/okf").resolve()
SITE_URL = "https://simplyenak.com"

def extract_text(j):
    if not j: return ""
    if isinstance(j, str): return j
    r = j.get("root", j.get("en",{}).get("root"))
    if not r or not r.get("children"): return json.dumps(j)
    parts = []
    for c in r["children"]:
        if c.get("children"): parts.extend(ch.get("text","") for ch in c["children"] if ch.get("text"))
        elif c.get("text"): parts.append(c["text"])
    return " ".join(parts)

def extract_md(s):
    md = s.get("content_markdown","")
    if md and len(md)>200: return md
    t = extract_text(s.get("content"))
    return t if len(t)>200 else md

def fm(**kw):
    lines = ["---"]
    for k,v in kw.items():
        if v is None: continue
        if isinstance(v,list):
            if v:
                lines.append(f"{k}:")
                for i in v: lines.append(f"  - {i}")
        elif isinstance(v,bool): lines.append(f"{k}: {str(v).lower()}")
        elif isinstance(v,int): lines.append(f"{k}: {v}")
        else:
            sv=str(v)
            q = ":" in sv or "#" in sv or "{" in sv
            lines.append(f'{k}: "{sv}"' if q else f"{k}: {sv}")
    lines.append("---")
    return "\n".join(lines)

def gen_tour(t):
    slug, name = t["slug"], t["name"]
    desc = t.get("short_description") or t.get("tagline") or ""
    price, cur = t.get("price",0), t.get("currency","MYR")
    duration, loc = t.get("duration",""), t.get("location","")
    dietary = [d.get("name","") for d in t.get("dietary_options",[]) if d.get("name")]
    ls = loc.lower().replace(" ","-") if loc else ""
    ll = f"[{loc}](location--{ls}.md)" if ls else loc
    tags = ["malaysian-food","food-tour"]
    if loc: tags.append(loc.lower().replace(" ","-"))
    if dietary: tags.extend(d.lower().replace(" ","-") for d in dietary)
    f = fm(type="tour", title=name, description=desc, tags=tags, timestamp=t.get("updatedAt",""),
           price=f"{cur} {price}", duration=duration, location=loc,
           dietary_options=dietary or None, url=f"{SITE_URL}/tours/{slug}/")
    body = f"""# {name}

{desc}

## Details

- **Price**: {cur} {price} per person
- **Duration**: {duration}
- **Location**: {ll}
- **Booking**: [{SITE_URL}/tours/{slug}/]({SITE_URL}/tours/{slug}/)

## Dietary

{', '.join(dietary) if dietary else 'Accommodated on request.'}
"""
    return {"f": f"tour--{slug}.md", "c": f + "\n" + body, "t": name, "d": desc[:120], "type": "tour"}

def gen_guide(s):
    slug, title = s["slug"], s["title"]
    md = extract_md(s)
    excerpt = s.get("excerpt") or s.get("meta_description") or title
    hints = {"kuala-lumpur":"Kuala Lumpur","kl":"Kuala Lumpur","penang":"Penang","george-town":"Penang","ipoh":"Ipoh","melaka":"Melaka","malaysia":"Malaysia"}
    loc = "Malaysia"
    for h,l in hints.items():
        if h in slug: loc=l; break
    meta = s.get("meta",{})
    cats = meta.get("categories","")
    tags = ["malaysian-food","food-guide"]
    if cats: tags.append(cats.lower().replace(" ","-").replace("&","and"))
    if loc: tags.append(loc.lower().replace(" ","-"))
    f = fm(type="guide", title=title, description=excerpt[:200], tags=tags,
           timestamp=s.get("updatedAt",s.get("publishedDate","")),
           author=s.get("author",{}).get("name","Simply Enak"), location=loc,
           url=f"{SITE_URL}/stories/{slug}/")
    summary = md[:800].strip()
    if len(md)>800: summary += "..."
    body = f"""# {title}

{excerpt}

**Full article**: [{SITE_URL}/stories/{slug}/]({SITE_URL}/stories/{slug}/)

---

{summary}
"""
    return {"f": f"guide--{slug}.md", "c": f+"\n"+body, "t": title, "d": excerpt[:120], "type": "guide"}

def gen_faq(f):
    q = f["question"]
    a = extract_text(f.get("answer"))
    slug = re.sub(r"[^a-z0-9]+","-",q.lower()).strip("-")[:60]
    f2 = fm(type="faq", title=q, tags=["faq","booking"], timestamp=f.get("updatedAt",""))
    return {"f": f"faq--{slug}.md", "c": f2+"\n# "+q+"\n\n"+a+"\n", "t": q, "type": "faq"}

def gen_loc(l):
    name = l.get("name","")
    sub = l.get("subtitle","")
    slug = l.get("slug",name.lower().replace(" ","-"))
    f2 = fm(type="location", title=name, description=sub or f"Food tours in {name}",
            tags=["malaysia",name.lower().replace(" ","-")], timestamp=l.get("updatedAt",""))
    body = f"# {name}\n\n{sub or f'Simply Enak runs food tours in {name}.'}\n\nSee [index](index.md) for related tours and guides.\n"
    return {"f": f"location--{slug}.md", "c": f2+"\n"+body, "t": name, "d": sub or f"Food tours in {name}", "type": "location"}

def gen_index(concepts):
    lines = ["# Simply Enak — Knowledge Bundle","","> Malaysian food tours in Kuala Lumpur, Penang, and Ipoh. Small groups, real neighborhoods, heritage vendors since 2011.","",
             f"- **Tours**: {sum(1 for c in concepts if c['type']=='tour')} items",
             f"- **Guides**: {sum(1 for c in concepts if c['type']=='guide')} items",
             f"- **FAQs**: {sum(1 for c in concepts if c['type']=='faq')} items",
             f"- **Locations**: {sum(1 for c in concepts if c['type']=='location')} items","","## Tours",""]
    for c in concepts:
        if c['type']!='tour': continue
        lines.append(f'- [{c["t"]}]({c["f"]}): {c.get("d","")}')
    lines.extend(["","## Food Guides",""])
    for c in concepts:
        if c['type']!='guide': continue
        lines.append(f'- [{c["t"]}]({c["f"]}): {c.get("d","")}')
    lines.extend(["","## Locations",""])
    for c in concepts:
        if c['type']!='location': continue
        lines.append(f'- [{c["t"]}]({c["f"]}): {c.get("d","")}')
    lines.extend(["","## Frequently Asked Questions",""])
    for c in concepts:
        if c['type']!='faq': continue
        lines.append(f'- [{c["t"]}]({c["f"]})')
    lines.extend(["","---",f"Generated: {datetime.now(timezone.utc).isoformat()}",f"Source: {SITE_URL}",""])
    return "\n".join(lines)

def main():
    print(f"OKF Generator\n  In: {DATA_DIR}\n  Out: {OUT_DIR}\n")
    tours = json.load(open(DATA_DIR/"tours.json"))
    stories = json.load(open(DATA_DIR/"stories.json"))
    faqs = json.load(open(DATA_DIR/"faqs.json"))
    locations = json.load(open(DATA_DIR/"locations.json"))
    pt = [t for t in tours if t.get("_status")=="published"]
    ps = [s for s in stories if s.get("status")=="published" and s.get("workflowStatus")=="published" and len(extract_md(s))>200]
    pf = [f for f in faqs if f.get("workflowStatus")!="draft"]
    pl = [l for l in locations if l.get("name")]
    print(f"  Tours:{len(pt)} Guides:{len(ps)} FAQs:{len(pf)} Locations:{len(pl)}\n")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    concepts = []
    for item in pt:
        c = gen_tour(item); (OUT_DIR/c["f"]).write_text(c["c"]); concepts.append(c); print(f"  + {c['f']}")
    for item in ps:
        c = gen_guide(item); (OUT_DIR/c["f"]).write_text(c["c"]); concepts.append(c)
    for item in pf:
        c = gen_faq(item); (OUT_DIR/c["f"]).write_text(c["c"]); concepts.append(c)
    for item in pl:
        c = gen_loc(item); (OUT_DIR/c["f"]).write_text(c["c"]); concepts.append(c)
    (OUT_DIR/"index.md").write_text(gen_index(concepts))
    (OUT_DIR/"log.md").write_text("""# Changelog\n\n## 2026-07-06 — Initial bundle\n\n- Added 7 tours with pricing, locations, dietary options\n- Added 44 food guides with full content\n- Added 9 frequently asked questions\n- Added 3 locations (Kuala Lumpur, Penang, Ipoh)\n\nOKF version: 0.1\n""")
    print(f"\n  + index.md\n  + log.md")
    counts = {}
    for c in concepts: counts[c["type"]] = counts.get(c["type"],0)+1
    print(f"\nDone: {sum(counts.values())} concepts")
    for t,n in sorted(counts.items()): print(f"  {t}: {n}")

if __name__=="__main__": main()
