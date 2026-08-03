#!/usr/bin/env python3
"""Check Dokploy DB state for Hermes compose."""
import subprocess

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return r.stdout.strip(), r.stderr.strip()

# Check DB
cmd = """docker exec dc44c278fd21 psql -U dokploy -d dokploy -t -A -c "SELECT length(composeFile), length(env), CASE WHEN env LIKE '%BUZZ_PRIVATE_KEY%' THEN 'yes' ELSE 'no' END FROM compose WHERE composeId = 'anLRMqo5Mx1kQ-hvWg4mQ';" """
stdout, stderr = run(cmd)
print(f"DB check (compose_len, env_len, has_buzz_key): {stdout}")
if stderr:
    print(f"Error: {stderr}")

# Check key value
cmd2 = """docker exec dc44c278fd21 psql -U dokploy -d dokploy -t -A -c "SELECT substring(env from position('BUZZ_PRIVATE_KEY' in env) for 80) FROM compose WHERE composeId = 'anLRMqo5Mx1kQ-hvWg4mQ';" """
stdout2, _ = run(cmd2)
print(f"Key value: {stdout2}")

# Check if ROCKETCHAT removed
cmd3 = """docker exec dc44c278fd21 psql -U dokploy -d dokploy -t -A -c "SELECT CASE WHEN env LIKE '%ROCKETCHAT%' THEN 'still there' ELSE 'removed' END FROM compose WHERE composeId = 'anLRMqo5Mx1kQ-hvWg4mQ';" """
stdout3, _ = run(cmd3)
print(f"RocketChat: {stdout3}")
