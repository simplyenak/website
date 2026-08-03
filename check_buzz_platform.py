#!/usr/bin/env python3
"""Check if buzz platform is available in Hermes."""
import sys

# Check hermes_gateway
try:
    from hermes_gateway.platforms import buzz
    print("buzz platform module found in hermes_gateway.platforms")
except ImportError as e:
    print(f"buzz platform not found: {e}")

# Check hermes_plugins
try:
    from hermes_plugins.buzz_platform import adapter
    print("buzz_platform plugin found")
except ImportError as e:
    print(f"buzz_platform plugin not found: {e}")

# Check hermes version
import hermes_agent
print(f"hermes_agent version: {hermes_agent.__version__}")

# Check if gateway has buzz
from hermes_gateway import platforms
print(f"Available platforms: {dir(platforms)}")
