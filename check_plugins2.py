#!/usr/bin/env python3
"""Check plugin discovery paths and buzz plugin loading."""
import sys
sys.path.insert(0, '/usr/local/lib/python3.12/site-packages')

from hermes_cli.plugins import get_plugin_manager
import os
import importlib.util

pm = get_plugin_manager()

# Check what paths are being scanned
home = os.path.expanduser("~")
print(f"Home: {home}")
print(f"Plugins dir: {os.path.join(home, '.hermes', 'plugins')}")
print(f"Exists: {os.path.exists(os.path.join(home, '.hermes', 'plugins'))}")

# Try to manually load the buzz plugin
plugin_dir = "/home/hermes/.hermes/plugins/buzz-platform"
print(f"\nBuzz plugin dir: {plugin_dir}")
print(f"Exists: {os.path.exists(plugin_dir)}")
print(f"Contents: {os.listdir(plugin_dir)}")

# Check plugin.yaml
import yaml
with open(os.path.join(plugin_dir, "plugin.yaml")) as f:
    manifest = yaml.safe_load(f)
print(f"\nPlugin manifest: {manifest}")

# Try importing
spec = importlib.util.spec_from_file_location("buzz_platform", os.path.join(plugin_dir, "__init__.py"))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
print(f"\nModule loaded: {module}")
print(f"Register function: {module.register}")
