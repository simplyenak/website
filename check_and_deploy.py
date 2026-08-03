#!/usr/bin/env python3
"""Check Dokploy DB and trigger Hermes deploy."""
import subprocess

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return r.stdout.strip(), r.stderr.strip()

# Check DB
print("=== Checking Dokploy DB ===")
cmd = 'docker exec dc44c278fd21 psql -U dokploy -d dokploy -t -A -c "SELECT length(\\"composeFile\\"), length(env) FROM compose WHERE \\"composeId\\" = \'anLRMqo5Mx1kQ-hvWg4mQ\';"'
stdout, _ = run(cmd)
print(f"compose_len|env_len: {stdout}")

# Check for BUZZ key
cmd = 'docker exec dc44c278fd21 psql -U dokploy -d dokploy -t -A -c "SELECT CASE WHEN env LIKE \'%BUZZ_PRIVATE_KEY%\' THEN \'has_key\' ELSE \'no_key\' END FROM compose WHERE \\"composeId\\" = \'anLRMqo5Mx1kQ-hvWg4mQ\';"'
stdout, _ = run(cmd)
print(f"BUZZ key: {stdout}")

# Check RocketChat removed
cmd = 'docker exec dc44c278fd21 psql -U dokploy -d dokploy -t -A -c "SELECT CASE WHEN env LIKE \'%ROCKETCHAT%\' THEN \'still_there\' ELSE \'removed\' END FROM compose WHERE \\"composeId\\" = \'anLRMqo5Mx1kQ-hvWg4mQ\';"'
stdout, _ = run(cmd)
print(f"RocketChat: {stdout}")

# Trigger deploy via Dokploy container
print("\n=== Triggering deploy ===")
cmd = 'docker exec ef7fbf5ac1b1 bash -c "cd /etc/dokploy/compose/compose-index-auxiliary-program-qm58zh/code && docker stack deploy -c docker-compose.yml compose-index-auxiliary-program-qm58zh"'
stdout, stderr = run(cmd)
print(f"Deploy stdout: {stdout}")
if stderr:
    print(f"Deploy stderr: {stderr}")
