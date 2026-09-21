"""Redirect jev-ultrafast's hardcoded TypeSafe endpoint to a compatible gateway.

jev-ultrafast pins `https://api.typesafe.ai/v1/systemone` inside
`jev_ultrafast/model.py`. OpenCode Zen exposes the same System One route
(`https://opencode.ai/zen/v1/systemone`, model `jev-1.13-free`), so set
JEV_API_URL to that and this shim rewrites the call.

Env:
  JEV_API_URL        full systemone URL to use instead (unset = upstream default)
  TYPESAFE_API_KEY   bearer token for that URL (Zen key when routing via Zen)
  TYPESAFE_MODEL     model id sent in the body (e.g. jev-1.13-free)

The shim patches the module global, which `choose()` resolves at call time, so
the text-model helper (a different URL) is left untouched.
"""
import os

UPSTREAM = "https://api.typesafe.ai/v1/systemone"


def install():
    """Patch jev_ultrafast.model.post_json to honour JEV_API_URL. Idempotent."""
    target = (os.environ.get("JEV_API_URL") or "").strip()
    if not target or target == UPSTREAM:
        return False

    from jev_ultrafast import model as m

    if getattr(m.post_json, "_jev_url_redirect", None):
        return True

    original = m.post_json

    def post_json(url, key, body, _original=original):
        if url == UPSTREAM:
            url = target
        return _original(url, key, body)

    post_json._jev_url_redirect = True
    m.post_json = post_json

    print(f"jev: systemone endpoint redirected to {target}", flush=True)
    return True
