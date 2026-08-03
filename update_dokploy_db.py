#!/usr/bin/env python3
"""Update Dokploy DB with new composeFile and env for Hermes + Buzz."""
import subprocess

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return r.stdout.strip(), r.stderr.strip()

# Read modified files
with open('/tmp/hermes-compose-new.yml') as f:
    compose_file = f.read()
with open('/tmp/hermes-env-new.txt') as f:
    env_content = f.read()

print(f"Compose: {len(compose_file)} chars")
print(f"Env: {len(env_content)} chars")

# Write SQL to file and execute via docker exec
sql = f"""UPDATE compose SET "composeFile" = '{compose_file.replace("'", "''")}', env = '{env_content.replace("'", "''")}' WHERE "composeId" = 'anLRMqo5Mx1kQ-hvWg4mQ';"""

with open('/tmp/update_hermes.sql', 'w') as f:
    f.write(sql)

print("SQL written to /tmp/update_hermes.sql")
print(f"SQL length: {len(sql)} chars")

# Execute via docker exec into dokploy-postgres container
cmd = 'docker exec -i dc44c278fd21 psql -U dokploy -d dokploy < /tmp/update_hermes.sql'
stdout, stderr = run(cmd)
print(f"STDOUT: {stdout}")
print(f"STDERR: {stderr}")