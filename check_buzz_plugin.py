#!/usr/bin/env python3
"""Check if buzz_platform module is available in Hermes container."""
import sys
try:
    from hermes_plugins import buzz_platform
    print("buzz_platform module found")
    print(dir(buzz_platform))
except ImportError as e:
    print(f"buzz_platform not found: {e}")

try:
    from hermes_plugins import telegram_platform
    print("telegram_platform found")
except ImportError as e:
    print(f"telegram_platform not found: {e}")

# Check hermes version
try:
    import hermes_agent
    print(f"hermes_agent version: {hermes_agent.__version__}")
except:
    pass

# Check plugins directory
import os
plugins_dir = "/home/hermes/.hermes/plugins"
if os.path.exists(plugins_dir):
    print(f"Plugins: {os.listdir(plugins_dir)}")

# Check if buzz CLI is accessible
buzz_path = "/usr/local/bin/buzz"
if os.path.exists(buzz_path):
    print(f"buzz CLI found at {buzz_path}")
else:
    print("buzz CLI not found")

# Check config.yaml for buzz
config_path = "/home/hermes/.hermes/config.yaml"
if os.path.exists(config_path):
    with open(config_path) as f:
        config = f.read()
    if "buzz" in config.lower():
        print("buzz found in config.yaml")
    else:
        print("buzz NOT in config.yaml")
