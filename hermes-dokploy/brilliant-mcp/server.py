#!/usr/bin/env python3
"""
Brilliant MCP Server — wraps the Brilliant Knowledge Base REST API as MCP tools.
Streamable HTTP transport on port 8002.
"""

import os
import sys
import json
import httpx
from mcp.server.fastmcp import FastMCP

API_KEY = os.environ.get("BRILLIANT_API_KEY", "bkai_4e5b_0c44de6066575071394f")
API_URL = os.environ.get("BRILLIANT_URL", "http://cortex-api:8000")
AUTH_HEADER = {"Authorization": f"Bearer {API_KEY}"}
JSON_HEADER = {"Content-Type": "application/json"}

mcp = FastMCP("Brilliant Knowledge Base", host="0.0.0.0", port=int(os.environ.get("PORT", "8002")))


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

async def _api(method: str, path: str, body: dict = None) -> dict:
    """Make an authenticated request to the Brilliant REST API."""
    url = f"{API_URL.rstrip('/')}{path}"
    headers = {**AUTH_HEADER}
    async with httpx.AsyncClient(timeout=30) as client:
        if method == "GET":
            r = await client.get(url, headers=headers)
        elif method == "POST":
            r = await client.post(url, headers={**headers, **JSON_HEADER}, json=body or {})
        elif method == "PUT":
            r = await client.put(url, headers={**headers, **JSON_HEADER}, json=body or {})
        elif method == "DELETE":
            r = await client.delete(url, headers=headers)
        else:
            return {"error": f"Unsupported method: {method}"}

        try:
            return r.json()
        except Exception:
            return {"status_code": r.status_code, "text": r.text[:500]}


# ---------------------------------------------------------------------------
# Read tools
# ---------------------------------------------------------------------------

@mcp.tool()
async def search_entries(
    query: str = "",
    content_type: str = "",
    limit: int = 20,
    offset: int = 0,
) -> str:
    """Search and list Brilliant knowledge base entries.
    
    Args:
        query: Free-text search query
        content_type: Filter by content type (e.g. 'insight', 'context', 'tour')
        limit: Max results to return (default 20)
        offset: Pagination offset (default 0)
    Returns:
        JSON string of matching entries
    """
    params = f"?limit={limit}&offset={offset}"
    if query:
        params += f"&search={query}"
    if content_type:
        params += f"&type={content_type}"
    result = await _api("GET", f"/entries{params}")
    return json.dumps(result, indent=2)


@mcp.tool()
async def get_entry(entry_id: str) -> str:
    """Get a single Brilliant entry by its UUID.
    
    Args:
        entry_id: UUID of the entry (e.g. '75a684df-03d4-47a1-bb73-a563edb372fe')
    Returns:
        JSON string of the entry
    """
    result = await _api("GET", f"/entries/{entry_id}")
    return json.dumps(result, indent=2)


@mcp.tool()
async def get_types() -> str:
    """List all available content types in the Brilliant knowledge base.
    
    Returns:
        JSON string of content types with names and descriptions
    """
    result = await _api("GET", "/types")
    return json.dumps(result, indent=2)


@mcp.tool()
async def get_index() -> str:
    """Get the Brilliant index — counts per content type and total entries.
    
    Returns:
        JSON string of the index
    """
    result = await _api("GET", "/index")
    return json.dumps(result, indent=2)


# ---------------------------------------------------------------------------
# Write tools
# ---------------------------------------------------------------------------

@mcp.tool()
async def create_entry(
    title: str,
    content: str,
    logical_path: str,
    content_type: str = "context",
    summary: str = "",
    tags: str = "",
) -> str:
    """Create a new entry in the Brilliant knowledge base.
    
    Args:
        title: Entry title
        content: Entry body content (markdown)
        logical_path: Hierarchical path (e.g. '/tours/kl-street-food')
        content_type: Content type (default 'context')
        summary: Optional short summary
        tags: Comma-separated tags
    Returns:
        JSON string of the created entry
    """
    body = {
        "title": title,
        "content": content,
        "logical_path": logical_path,
        "content_type": content_type,
    }
    if summary:
        body["summary"] = summary
    if tags:
        body["tags"] = [t.strip() for t in tags.split(",") if t.strip()]
    result = await _api("POST", "/entries", body)
    return json.dumps(result, indent=2)


@mcp.tool()
async def update_entry(
    entry_id: str,
    title: str = "",
    content: str = "",
    summary: str = "",
    tags: str = "",
) -> str:
    """Update an existing Brilliant entry. Only provided fields are updated.
    
    Args:
        entry_id: UUID of the entry to update
        title: New title (optional)
        content: New content (optional)
        summary: New summary (optional)
        tags: Comma-separated tags (optional)
    Returns:
        JSON string of the updated entry
    """
    body = {}
    if title:
        body["title"] = title
    if content:
        body["content"] = content
    if summary:
        body["summary"] = summary
    if tags:
        body["tags"] = [t.strip() for t in tags.split(",") if t.strip()]
    result = await _api("PUT", f"/entries/{entry_id}", body)
    return json.dumps(result, indent=2)


@mcp.tool()
async def delete_entry(entry_id: str) -> str:
    """Delete/archive an entry from the Brilliant knowledge base.
    
    Args:
        entry_id: UUID of the entry to delete
    Returns:
        JSON string confirmation
    """
    result = await _api("DELETE", f"/entries/{entry_id}")
    return json.dumps(result, indent=2)


# ---------------------------------------------------------------------------
# Governance tools
# ---------------------------------------------------------------------------

@mcp.tool()
async def list_staging(limit: int = 20, offset: int = 0) -> str:
    """List staging entries pending review.
    
    Args:
        limit: Max results (default 20)
        offset: Pagination offset (default 0)
    Returns:
        JSON string of staging entries
    """
    result = await _api("GET", f"/staging?limit={limit}&offset={offset}")
    return json.dumps(result, indent=2)


@mcp.tool()
async def submit_staging(
    title: str,
    content: str,
    target_path: str,
    content_type: str = "context",
    summary: str = "",
    tags: str = "",
) -> str:
    """Submit a new entry to staging for review before publishing.
    
    Args:
        title: Entry title
        content: Entry body content
        target_path: Target logical path (e.g. '/tours/kl-street-food')
        content_type: Content type (default 'context')
        summary: Optional short summary
        tags: Comma-separated tags
    Returns:
        JSON string confirmation
    """
    body = {
        "entry": {
            "title": title,
            "content": content,
            "logical_path": target_path,
            "content_type": content_type,
        },
        "target_path": target_path,
        "change_description": f"Submit {title} for review",
    }
    if summary:
        body["entry"]["summary"] = summary
    if tags:
        body["entry"]["tags"] = [t.strip() for t in tags.split(",") if t.strip()]
    result = await _api("POST", "/staging", body)
    return json.dumps(result, indent=2)


# ---------------------------------------------------------------------------
# Import tools
# ---------------------------------------------------------------------------

@mcp.tool()
async def import_vault(
    data: str,
    import_type: str = "json",
    overwrite: bool = False,
) -> str:
    """Import entries into the Brilliant knowledge base in bulk.
    
    Args:
        data: JSON string of entries to import (list of entry objects)
        import_type: Format of data (default 'json')
        overwrite: Whether to overwrite existing entries (default False)
    Returns:
        JSON string of import results
    """
    try:
        parsed = json.loads(data)
    except json.JSONDecodeError as e:
        return json.dumps({"error": f"Invalid JSON: {e}"})
    body = {
        "entries": parsed if isinstance(parsed, list) else [parsed],
        "overwrite": overwrite,
    }
    result = await _api("POST", "/import", body)
    return json.dumps(result, indent=2)


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@mcp.tool()
async def health_check() -> str:
    """Check if the Brilliant REST API is reachable.
    
    Returns:
        JSON string of health status
    """
    result = await _api("GET", "/health")
    return json.dumps(result, indent=2)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8002"))
    print(f"Starting Brilliant MCP Server on port {port}...", flush=True)
    mcp.run(transport="streamable-http")
