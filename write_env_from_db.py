#!/usr/bin/env python3
"""Extract env from Dokploy DB and write to compose directory."""
import subprocess
import base64

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return r.stdout.strip(), r.stderr.strip()

# Extract env from DB
print("=== Extracting env from Dokploy DB ===")
cmd = 'docker exec dc44c278fd21 psql -U dokploy -d dokploy -t -A -c "SELECT env FROM compose WHERE \\"composeId\\" = \'anLRMqo5Mx1kQ-hvWg4mQ\';"'
stdout, _ = run(cmd)
env_content = stdout
print(f"Env: {len(env_content)} chars")
print(f"Has BUZZ_PRIVATE_KEY: {'BUZZ_PRIVATE_KEY' in env_content}")

# Write to /tmp first
with open('/tmp/hermes-env-from-db.txt', 'w') as f:
    f.write(env_content)
print("Written to /tmp/hermes-env-from-db.txt")

# Now write to compose directory via Dokploy container
# Use base64 to avoid quoting issues
env_b64 = base64.b64encode(env_content.encode()).decode()
cmd = f'docker exec ef7fbf5ac1b1 bash -c "echo {env_b64} | base64 -d > /etc/dokploy/compose/compose-index-auxiliary-program-qm58zh/code/.env"'
stdout, stderr = run(cmd)
print(f"Write to compose dir: stdout={stdout}, stderr={stderr}")

# Verify
cmd = 'docker exec ef7fbf5ac1b1 wc -l /etc/dokploy/compose/compose-index-auxiliary-program-qm58zh/code/.env'
stdout, _ = run(cmd)
print(f"Verify: {stdout}")
