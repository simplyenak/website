#!/usr/bin/env python3
"""Check if buzz plugin is discovered by Hermes plugin manager."""
import sys
sys.path.insert(0, '/usr/local/lib/python3.12/site-packages')

from hermes_cli.plugins import get_plugin_manager

pm = get_plugin_manager()
print("All discovered plugins:")
for p in pm.list_plugins():
    print(f"  {p}")
