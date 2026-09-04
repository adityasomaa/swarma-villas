#!/usr/bin/env bash
# Restart the production server and PROVE it is serving the current build.
#
# Next reads .next lazily, so a server that was running during a rebuild keeps
# handing out the old HTML with references to chunks that no longer exist. The
# page then renders with no CSS and every visual check that follows is measuring
# a stylesheet-free document. This script refuses to return until the stylesheet
# the page actually links resolves.
set -euo pipefail
PORT="${1:-3100}"

powershell.exe -NoProfile -Command "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force" >/dev/null 2>&1 || true
sleep 2

nohup npx next start -p "$PORT" > scratch/server.log 2>&1 &
for i in $(seq 1 30); do
  sleep 2
  html=$(curl -s "http://localhost:$PORT/template-1" || true)
  css=$(printf '%s' "$html" | grep -o '/_next/static/chunks/[^"]*\.css' | head -1 || true)
  [ -z "$css" ] && continue
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT$css")
  if [ "$code" = "200" ]; then
    echo "server ready on $PORT — stylesheet $css serves 200"
    exit 0
  fi
done
echo "server did not come up with a valid stylesheet" >&2
exit 1
