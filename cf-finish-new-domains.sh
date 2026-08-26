#!/bin/bash
# Finish custom-domain activation for whatcanieatinmy.com + whenisdurianseason.com
# Prereq: CLOUDFLARE_API_TOKEN_DNS (Zone:DNS Edit, both zones) in ~/.cloudflare/tokens.env
# Idempotent: safe to re-run. Creates apex+www CNAMEs, waits for Pages validation, verifies live.
set -euo pipefail

source ~/.cloudflare/tokens.env
: "${CLOUDFLARE_API_TOKEN_DNS:?Add CLOUDFLARE_API_TOKEN_DNS to ~/.cloudflare/tokens.env first}"
TOK="$CLOUDFLARE_API_TOKEN_DNS"
UA="Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0"

cf() { curl -s -m 20 -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" "$@"; }

ZONES_JSON=$(cf "https://api.cloudflare.com/client/v4/zones?per_page=50")
python3 -c "import json,sys;d=json.loads('''$ZONES_JSON''');sys.exit(0 if d.get('success') else 1)" \
  || { echo "Token cannot list zones — wrong scopes?"; exit 1; }

zone_id() { python3 -c "import json;d=json.loads('''$ZONES_JSON''');print(next(z['id'] for z in d['result'] if z['name']=='$1') if any(z['name']=='$1' for z in d['result']) else '')"; }

ensure_cname() { # zone_name, record_name, target
  local zid; zid=$(zone_id "$1")
  [ -n "$zid" ] || { echo "zone $1 not visible to token — include it in token zone scope"; return 1; }
  local existing; existing=$(cf "https://api.cloudflare.com/client/v4/zones/$zid/dns_records?name=$2" | python3 -c "import json,sys;d=json.load(sys.stdin);r=d.get('result') or [];print(next((x['id'] for x in r if x['type']=='CNAME'), ''))")
  if [ -n "$existing" ]; then
    echo "  $2 CNAME already exists ($existing) — skipping"
  else
    cf -X POST -d "{\"type\":\"CNAME\",\"name\":\"$2\",\"content\":\"$3\",\"proxied\":true}" \
      "https://api.cloudflare.com/client/v4/zones/$zid/dns_records" | python3 -c "import json,sys;d=json.load(sys.stdin);print('  created $2 -> $3' if d['success'] else f'  FAILED $2: {d.get(\"errors\")}')"
  fi
}

declare -A DOM=(
  [whatcanieatinmy.com]=whatcanieatinmy.pages.dev
  [www.whatcanieatinmy.com]=whatcanieatinmy.pages.dev
  [whenisdurianseason.com]=whenisdurianseason.pages.dev
  [www.whenisdurianseason.com]=whenisdurianseason.pages.dev
)

echo "== Creating CNAMEs =="
for name in "${!DOM[@]}"; do
  zone="${name#www.}"; [ "$zone" = "$name" ] || zone="${name#www.}"
  ensure_cname "$zone" "$name" "${DOM[$name]}"
done

echo "== Waiting for Pages domain activation (max 5 min) =="
for i in $(seq 1 15); do
  sleep 20
  pending=0
  for proj in whatcanieatinmy whenisdurianseason; do
    st=$(cf "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$proj/domains" \
      | python3 -c "import json,sys;d=json.load(sys.stdin);print(','.join(f\"{x['name']}={x['status']}\" for x in (d.get('result') or []) if not x['name'].endswith('pages.dev')))")
    echo "  [$proj] $st"
    echo "$st" | grep -qvE "active" && pending=1 || true
  done
  [ "$pending" = 0 ] && break
done

echo "== Live verification =="
for u in https://whatcanieatinmy.com/ https://www.whatcanieatinmy.com/ https://whenisdurianseason.com/ https://www.whenisdurianseason.com/; do
  code=$(curl -s -o /tmp/vfy.html -w "%{http_code}" -m 20 -A "$UA" "$u" || echo ERR)
  title=$(grep -oE "<title>[^<]*</title>" /tmp/vfy.html 2>/dev/null | head -1 | cut -c8-60)
  echo "  $code $u  $title"
done
