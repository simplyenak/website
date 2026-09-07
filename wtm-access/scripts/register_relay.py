# Register thrivecart-purchase-ingest relay script + WTM_HOOKKEY secret in Pyrunner.
# Run inside the pyrunner container: docker exec -e WTM_HOOKKEY=$(cat /tmp/wtm-hookkey) python3 /tmp/register_relay.py
# (reads script code from /tmp/thrivecart_purchase_ingest.py inside the container)
import django
import os
import secrets
import sys

sys.path.insert(0, "/app")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pyrunner.settings")
django.setup()

from core.models import Script, Environment, Secret
from core.services import EncryptionService

HOOKKEY = os.environ.get("WTM_HOOKKEY", "")
if not HOOKKEY:
    print("ABORTED: WTM_HOOKKEY env not provided")
    sys.exit(1)

env = Environment.objects.filter(is_default=True).first()
code = open("/tmp/thrivecart_purchase_ingest.py").read()

# 1) Register the relay script (32-char hex webhook token)
obj, created = Script.objects.update_or_create(
    name="thrivecart-purchase-ingest",
    defaults={
        "description": "Relay ThriveCart purchase/refund webhook to wtm-access internal endpoint (single source of truth).",
        "code": code,
        "environment": env,
        "webhook_token": secrets.token_hex(16),
        "is_enabled": True,
        "notify_on": "failure",
    },
)
print("SCRIPT", "created" if created else "updated", obj.name)
print("WEBHOOK_URL", "https://pyrunner.system.simplyenak.com/webhook/%s/" % obj.webhook_token)

# 2) Upsert WTM_HOOKKEY secret so the script reads it at runtime
sec, _ = Secret.objects.update_or_create(
    key="WTM_HOOKKEY",
    defaults={"encrypted_value": EncryptionService.encrypt(HOOKKEY), "description": "wtm-access webhook auth key"},
)
print("SECRET WTM_HOOKKEY set (encrypted len %d)" % len(sec.encrypted_value))
print("DONE")