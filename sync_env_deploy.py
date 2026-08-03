#!/usr/bin/env python3
"""Sync env from Dokploy DB to compose directory, then deploy."""
import subprocess
import os

# Run inside Dokploy container to avoid quoting issues
script = '''
import subprocess
import os

# Read env from DB
result = subprocess.run(
    ["docker", "exec", "dc44c278fd21", "psql", "-U", "dokploy", "-d", "dokploy", "-t", "-A",
     "-c", "SELECT env FROM compose WHERE \\"composeId\\" = 'anLRMqo5Mx1kQ-hvWg4mQ';"],
    capture_output=True, text=True
)
env = result.stdout.strip()
print(f"Env: {len(env)} chars")
print(f"Has BUZZ_PRIVATE_KEY: {'BUZZ_PRIVATE_KEY' in env}")

# Write to .env file
with open("/etc/dokploy/compose/compose-index-auxiliary-program-qm58zh/code/.env", "w") as f:
    f.write(env)
print("Written to .env file")

# Verify
with open("/etc/dokploy/compose/compose-index-auxiliary-program-qm58zh/code/.env") as f:
    content = f.read()
print(f"Read back: {len(content)} chars")
print(f"First 100 chars: {content[:100]}")
'''

# Write script to container
with open('/tmp/sync_env.py', 'w') as f:
    f.write(script)

# Copy to container and run
subprocess.run(['docker', 'cp', '/tmp/sync_env.py', 'ef7fbf5ac1b1:/tmp/sync_env.py'])
result = subprocess.run(['docker', 'exec', 'ef7fbf5ac1b1', 'python3', '/tmp/sync_env.py'], capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print(f"STDERR: {result.stderr}")
