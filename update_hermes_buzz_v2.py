#!/usr/bin/env python3
"""Update Dokploy DB with new composeFile and env for Hermes + Buzz."""
import subprocess
import sys

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return r.stdout.strip(), r.stderr.strip()

# Read current compose file from disk (easier than DB extraction)
print("=== Reading current Hermes compose file ===")
stdout, _ = run("cat /etc/dokploy/compose/compose-index-auxiliary-program-qm58zh/code/docker-compose.yml")
compose_file = stdout
print(f"Read {len(compose_file)} chars")

# Read current .env
stdout, _ = run("cat /etc/dokploy/compose/compose-index-auxiliary-program-qm58zh/code/.env")
env_content = stdout
print(f"Read {len(env_content)} chars of env")

# Modify compose file: remove Rocket Chat, add Buzz
lines = compose_file.split('\n')
new_lines = []
for line in lines:
    if any(x in line for x in ['ROCKETCHAT_URL', 'ROCKETCHAT_USERNAME', 'ROCKETCHAT_PASSWORD', 'ROCKETCHAT_ALLOWED_USERS', 'ROCKETCHAT_HOME_CHANNEL']):
        continue
    new_lines.append(line)
compose_file = '\n'.join(new_lines)

# Add Buzz env vars after TZ line
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

# Add buzz CLI volume mount
compose_file = compose_file.replace(
    '      - hermes-data:/home/hermes/.hermes',
    '      - hermes-data:/home/hermes/.hermes\n      - /home/maarten/buzz-binaries/buzz:/usr/local/bin/buzz:ro'
)

# Modify env
env_lines = env_content.split('\n')
new_env = [l for l in env_lines if 'ROCKETCHAT_' not in l]
new_env.extend([
    'BUZZ_RELAY_URL=https://buzz.system.simplyenak.com',
    'BUZZ_PRIVATE_KEY=***REMOVED***',
    'BUZZ_HOME_CHANNEL=233f0c82-dcf3-450e-ab04-d0eea5c69511',
    'BUZZ_ALLOWED_USERS=7e8539c5ccbb1138d92a1f414efef9c833f080627956114ea7350747e564b989',
    'BUZZ_ALLOW_ALL_USERS=false',
    'BUZZ_POLL_INTERVAL=4',
    'BUZZ_CLI_PATH=/usr/local/bin/buzz',
])
env_content = '\n'.join(new_env)

# Write modified files to /tmp first
with open('/tmp/hermes-compose-new.yml', 'w') as f:
    f.write(compose_file)
with open('/tmp/hermes-env-new.txt', 'w') as f:
    f.write(env_content)

print(f"Modified compose: {len(compose_file)} chars")
print(f"Modified env: {len(env_content)} chars")

# Now update Dokploy DB using dokploy's own postgres container
# Use python to connect to postgres and update
update_script = '''
import psycopg2
import sys

compose_file = open('/tmp/hermes-compose-new.yml').read()
env_content = open('/tmp/hermes-env-new.txt').read()

# Escape single quotes
compose_escaped = compose_file.replace("'", "''")
env_escaped = env_content.replace("'", "''")

conn = psycopg2.connect(
    host='dokploy-postgres',
    port=5432,
    dbname='dokploy',
    user='dokploy',
    password='dokploy'
)
cur = conn.cursor()

# Update composeFile and env
cur.execute(f"""UPDATE compose SET "composeFile" = '{compose_escaped}', env = '{env_escaped}' WHERE "composeId" = 'anLRMqo5Mx1kQ-hvWg4mQ'""")
conn.commit()

print(f"Updated {cur.rowcount} rows")
cur.close()
conn.close()
'''

with open('/tmp/update_dokploy.py', 'w') as f:
    f.write(update_script)

print("=== Update script written to /tmp/update_dokploy.py ===")
print("Run: python3 /tmp/update_dokploy.py")