#!/usr/bin/env python3
"""Extract Hermes compose from Dokploy DB, modify for Buzz, write back."""
import subprocess
import re
import json

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return r.stdout.strip(), r.stderr.strip()

# Step 1: Extract composeFile and env from Dokploy DB
print("=== Extracting Hermes compose from Dokploy DB ===")
cmd = """ssh simplyenak 'PG=$(docker ps --filter name=dokploy-postgres --format "{{.ID}}" | head -1); docker exec $PG psql -U dokploy -d dokploy -t -A -c "SELECT \\"composeFile\\" FROM compose WHERE \\"composeId\\" = '"'"'anLRMqo5Mx1kQ-hvWg4mQ'"'"';"'"""
stdout, stderr = run(cmd)
if stderr:
    print(f"STDERR: {stderr}")
compose_file = stdout

print(f"Compose file length: {len(compose_file)} chars")
print(f"First 300 chars:\n{compose_file[:300]}")

# Step 2: Extract env
cmd = """ssh simplyenak 'PG=$(docker ps --filter name=dokploy-postgres --format "{{.ID}}" | head -1); docker exec $PG psql -U dokploy -d dokploy -t -A -c "SELECT env FROM compose WHERE \\"composeId\\" = '"'"'anLRMqo5Mx1kQ-hvWg4mQ'"'"';"'"""
stdout, stderr = run(cmd)
env_content = stdout
print(f"\nEnv length: {len(env_content)} chars")

# Step 3: Modify compose file
# 3a. Remove Rocket Chat env vars
lines = compose_file.split('\n')
new_lines = []
for line in lines:
    if 'ROCKETCHAT_URL' in line or 'ROCKETCHAT_USERNAME' in line or \
       'ROCKETCHAT_PASSWORD' in line or 'ROCKETCHAT_ALLOWED_USERS' in line or \
       'ROCKETCHAT_HOME_CHANNEL' in line:
        continue
    new_lines.append(line)
compose_file = '\n'.join(new_lines)

# 3b. Add Buzz env vars after TZ line
buzz_env = """      - BUZZ_RELAY_URL=${BUZZ_RELAY_URL:-https://buzz.system.simplyenak.com}
      - BUZZ_PRIVATE_KEY=${BUZZ_PRIVATE_KEY}
      - BUZZ_HOME_CHANNEL=${BUZZ_HOME_CHANNEL:-233f0c82-dcf3-450e-ab04-d0eea5c69511}
      - BUZZ_ALLOWED_USERS=${BUZZ_ALLOWED_USERS:-7e8539c5ccbb1138d92a1f414efef9c833f080627956114ea7350747e564b989}
      - BUZZ_ALLOW_ALL_USERS=${BUZZ_ALLOW_ALL_USERS:-false}
      - BUZZ_POLL_INTERVAL=${BUZZ_POLL_INTERVAL:-4}
      - BUZZ_CLI_PATH=${BUZZ_CLI_PATH:-/usr/local/bin/buzz}"""

lines = compose_file.split('\n')
new_lines = []
for line in lines:
    new_lines.append(line)
    if line.strip().startswith('- TZ='):
        new_lines.append(buzz_env)
compose_file = '\n'.join(new_lines)

# 3c. Add buzz CLI volume mount to hermes service
# Find volumes: section for hermes service and add buzz binary mount
compose_file = compose_file.replace(
    '      - hermes-data:/home/hermes/.hermes',
    '      - hermes-data:/home/hermes/.hermes\n      - /home/maarten/buzz-binaries/buzz:/usr/local/bin/buzz:ro'
)

print(f"\nModified compose file length: {len(compose_file)} chars")

# Step 4: Modify env content - remove ROCKETCHAT, add BUZZ
env_lines = env_content.split('\n')
new_env = []
for line in env_lines:
    if 'ROCKETCHAT_' in line:
        continue
    new_env.append(line)
# Add Buzz env vars
new_env.append('BUZZ_RELAY_URL=https://buzz.system.simplyenak.com')
new_env.append('BUZZ_PRIVATE_KEY=***REMOVED***')
new_env.append('BUZZ_HOME_CHANNEL=233f0c82-dcf3-450e-ab04-d0eea5c69511')
new_env.append('BUZZ_ALLOWED_USERS=7e8539c5ccbb1138d92a1f414efef9c833f080627956114ea7350747e564b989')
new_env.append('BUZZ_ALLOW_ALL_USERS=false')
new_env.append('BUZZ_POLL_INTERVAL=4')
new_env.append('BUZZ_CLI_PATH=/usr/local/bin/buzz')
env_content = '\n'.join(new_env)

print(f"Modified env length: {len(env_content)} chars")
print(f"New env:\n{env_content}")

# Step 5: Write modified compose and env to files
with open('/var/home/maarten/website-optimization/hermes-compose-new.yml', 'w') as f:
    f.write(compose_file)
with open('/var/home/maarten/website-optimization/hermes-env-new.txt', 'w') as f:
    f.write(env_content)

print("\n=== Files written locally ===")
print("Now need to update Dokploy DB with new composeFile and env")