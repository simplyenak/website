#!/usr/bin/env python3
"""
Vbout Integration Script
Syncs waitlist emails and manages subscribers across satellite sites.
"""

import os
import sys
import time
import json
import requests
from typing import Optional

# Configuration
API_KEY = os.environ.get("VBOUT_API_KEY", "")
BASE_URL = "https://api.vbout.com/1"

# List IDs (created via API)
LISTS = {
    "wtm": {"id": "193083", "name": "WTM Subscribers", "domain": "whattoeatinmalaysia.com"},
    "wcieim": {"id": "193084", "name": "WCIEIM Subscribers", "domain": "whatcanieatinmy.com"},
    "durian": {"id": "193085", "name": "Durian Subscribers", "domain": "whenisdurianseason.com"},
    "cte": {"id": "193086", "name": "CTE Subscribers", "domain": "culinarytravelexperts.com"},
}


def api_call(endpoint: str, params: dict) -> dict:
    """Make an API call to Vbout with rate limiting."""
    url = f"{BASE_URL}/{endpoint}"
    params["key"] = API_KEY
    params["format"] = "json"
    
    try:
        resp = requests.post(url, data=params, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"API error: {e}")
        return {}


def add_contact(email: str, first_name: str = "", last_name: str = "", 
                list_id: str = None, phone: str = "") -> Optional[str]:
    """Add a contact to a Vbout list. Returns contact ID or None."""
    params = {
        "email": email,
        "firstname": first_name,
        "lastname": last_name,
        "status": "active",
    }
    if list_id:
        params["listid"] = list_id
    if phone:
        params["cellphone"] = phone
    
    result = api_call("emailmarketing/addcontact.json", params)
    data = result.get("response", {}).get("data", {})
    if data.get("id"):
        return data["id"]
    print(f"Failed to add contact: {data.get('errorMessage', 'Unknown error')}")
    return None


def sync_waitlist_email(waitlist_email: str, site: str = "wtm") -> bool:
    """Sync a waitlist email to Vbout list."""
    list_info = LISTS.get(site)
    if not list_info:
        print(f"Unknown site: {site}")
        return False
    
    # Extract name from email if possible
    email_part = waitlist_email.split("@")[0]
    first_name = email_part.split(".")[0].title() if "." in email_part else email_part.title()
    
    contact_id = add_contact(
        email=waitlist_email,
        first_name=first_name,
        list_id=list_info["id"]
    )
    
    if contact_id:
        print(f"✅ Synced {waitlist_email} → {list_info['name']} (ID: {contact_id})")
        return True
    return False


def get_contact_count(list_id: str) -> int:
    """Get contact count from contacts endpoint."""
    result = api_call("emailmarketing/getcontacts.json", {"listid": list_id})
    data = result.get("response", {}).get("data", {}).get("contacts", {})
    return data.get("count", 0)


def get_list_stats() -> dict:
    """Get stats for all lists."""
    stats = {}
    for key, info in LISTS.items():
        count = get_contact_count(info["id"])
        stats[key] = {"name": info["name"], "count": count}
        time.sleep(1)  # Rate limiting
    return stats


def delete_contact(contact_id: str) -> bool:
    """Delete a contact by ID."""
    result = api_call("emailmarketing/deletecontact.json", {"id": contact_id})
    return result.get("response", {}).get("header", {}).get("status") == "ok"


def main():
    """Main entry point."""
    print("=" * 60)
    print("Vbout Email Marketing Integration")
    print("=" * 60)
    
    # Get account info
    result = api_call("app/me.json", {})
    business = result.get("response", {}).get("data", {}).get("business", {})
    print(f"\n📊 Account: {business.get('businessName', 'Unknown')}")
    print(f"   Package: {business.get('package', 'Unknown')}")
    print(f"   Timezone: {business.get('timezone', 'Unknown')}")
    
    # Show current lists with counts
    print("\n📋 Email Lists:")
    stats = get_list_stats()
    for key, info in stats.items():
        status = "✅" if info["count"] > 0 else "⚪"
        print(f"  {status} {info['name']}: {info['count']} subscribers")
    
    # Show email templates
    result = api_call("emailmarketing/getemailtemplates.json", {})
    templates = result.get("response", {}).get("data", {}).get("templates", {}).get("items", [])
    print(f"\n📧 Email Templates: {len(templates)} available")
    
    # Show audiences
    result = api_call("emailmarketing/getaudiences.json", {})
    audiences = result.get("response", {}).get("data", {}).get("audiences", {}).get("items", [])
    print(f"👥 Audiences: {len(audiences)} available")
    
    print("\n📌 Notes:")
    print("  • Domain sender verification must be done in Vbout UI:")
    print("    https://app.vbout.com/Settings → Domain Sender Verification")
    print("  • Add SPF/DKIM records to Cloudflare after verification")
    print("  • Use sync_waitlist_email() to add subscribers from wtm-access")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
