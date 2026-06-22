#!/bin/bash
echo "=== Container Status ==="
docker ps --filter 'name=hermes' --format '{{.Names}} {{.Status}}'

echo ""
echo "=== Service Health ==="
docker service ps compose-index-auxiliary-program-qm58zh_hermes --no-trunc | grep -E 'Running|Ready' | head -2

echo ""
echo "=== Privilege Drop (gateway as hermes user) ==="
docker exec compose-index-auxiliary-program-qm58zh_hermes.1.7dioaqwkjppowavjj1jwbcmzh sh -c 'for pid in $(ls /proc/ | grep -E "^[0-9]+$"); do uid=$(cat /proc/$pid/status 2>/dev/null | grep ^Uid: | head -1 | awk "{print \$2}"); cmd=$(cat /proc/$pid/cmdline 2>/dev/null | tr "\000" " " | head -c 80); if [ -n "$uid" ]; then echo "PID=$pid UID=$uid CMD=$cmd"; fi; done' | grep -v 'ssh-keyscan\|health_server\|entrypoint'

echo ""
echo "=== Dashboard Security Check ==="
echo "Dashboard without auth:"
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:9119/ 2>/dev/null || echo "  endpoint not reachable directly"
echo "Dashboard with API key:"
curl -s -o /dev/null -w "HTTP %{http_code}\n" -H 'X-API-Key: ***REMOVED***' http://localhost:9119/ 2>/dev/null || echo "  endpoint not reachable directly"

echo ""
echo "=== Config Security Highlights ==="
docker exec compose-index-auxiliary-program-qm58zh_hermes.1.7dioaqwkjppowavjj1jwbcmzh sh -c 'grep -E "insecure:|approvals:|audit|redact|tirith|retention" /home/hermes/.hermes/config.yaml | head -10'

echo ""
echo "=== Version ==="
docker exec compose-index-auxiliary-program-qm58zh_hermes.1.7dioaqwkjppowavjj1jwbcmzh hermes --version 2>/dev/null || echo "hermes CLI not in PATH"

echo ""
echo "=== Health Check ==="
# Health server runs on the container bridge
HEALTH_CONTAINER=$(docker ps --filter "name=hermes" --format "{{.ID}}" | head -1)
HEALTH_IP=$(docker inspect "$HEALTH_CONTAINER" --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' 2>/dev/null)
curl -sf "http://${HEALTH_IP}:8080/health" 2>/dev/null && echo "Health OK" || echo "Health check via IP: $HEALTH_IP"

echo ""
echo "=== Done ==="
