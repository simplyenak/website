#!/usr/bin/env python3
"""Extract Hermes compose file and env from Dokploy DB."""
import subprocess
import json

# Get compose file
cmd = """ssh simplyenak 'PG=$(docker ps --filter name=dokploy-postgres --format "{{.ID}}" | head -1); docker exec $PG psql -U dokploy -d dokploy -t -A -c "SELECT \\"composeFile\\" FROM compose WHERE \\"composeId\\'"'"' = '"'"'anLRMqo5Mx1kQ-hvWg4mQ'"'"';"'"""
result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
print("=== COMPOSE FILE ===")
print(result.stdout)
print("=== STDERR ===")
print(result.stderr)