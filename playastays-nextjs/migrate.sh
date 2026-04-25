#!/usr/bin/env bash
# Rename dynamic route folders for unified city + service hub dispatchers.
# Safe to re-run: skips if target already exists.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
APP="$ROOT/src/app"

echo "== PlayaStays route migration: [city]/[ciudad] → [slug] =="
cd "$APP"

if [[ -d "[city]" ]] && [[ ! -d "[slug]" ]]; then
  mv "[city]" "[slug]"
  echo "✓ Renamed src/app/[city] → src/app/[slug]"
elif [[ -d "[slug]" ]]; then
  echo "· src/app/[slug] already exists — skip EN rename"
else
  echo "! src/app/[city] not found — skip EN rename"
fi

cd "$APP/es"
if [[ -d "[ciudad]" ]] && [[ ! -d "[slug]" ]]; then
  mv "[ciudad]" "[slug]"
  echo "✓ Renamed src/app/es/[ciudad] → src/app/es/[slug]"
elif [[ -d "[slug]" ]]; then
  echo "· src/app/es/[slug] already exists — skip ES rename"
else
  echo "! src/app/es/[ciudad] not found — skip ES rename"
fi

echo ""
echo "Next: ensure app/[slug]/page.tsx dispatches city hub vs service hub;"
echo "      nested routes use params.slug; remove duplicate top-level hub page.tsx files."
echo "Done."
