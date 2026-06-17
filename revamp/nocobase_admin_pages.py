#!/usr/bin/env python3
"""
Build NocoBase admin pages for Claims, Tour Bookings, Guide Assignments.
Creates schemas via API, routes via API, tree paths via direct SQL.
"""
import requests, json, uuid, sys

# Config
BASE = "https://nocobase.system.simplyenak.com/api"
ADMIN_EMAIL = "admin@simplyenak.com"
ADMIN_PASS = "adminSecurePass123XYZ"

# Generate unique IDs
def uid():
    return uuid.uuid4().hex[:12]

class NocoBaseAdmin:
    def __init__(self):
        self.s = requests.Session()
        r = self.s.post(f"{BASE}/auth:signIn", json={
            "account": ADMIN_EMAIL, "password": ADMIN_PASS
        })
        self.token = r.json()["data"]["token"]
        self.s.headers.update({
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        })
        # Get existing schemas for dedup
        r = self.s.get(f"{BASE}/uiSchemas:list")
        self.existing_schemas = {s["x-uid"]: s for s in r.json()["data"]}

    def create_schema(self, x_uid, data):
        """Create a UI schema entry via API."""
        if x_uid in self.existing_schemas:
            print(f"  Schema {x_uid} already exists, skipping")
            return x_uid
        payload = {"x-uid": x_uid, **data}
        r = self.s.post(f"{BASE}/uiSchemas:create", json=payload)
        if r.status_code == 200:
            print(f"  Created schema {x_uid}: {data.get('x-component', '?')}")
            self.existing_schemas[x_uid] = payload
            return x_uid
        else:
            print(f"  Failed to create schema {x_uid}: {r.status_code} {r.text[:200]}")
            return None

    def create_route(self, data):
        """Create a desktop route entry via API."""
        r = self.s.post(f"{BASE}/desktopRoutes:create", json=data)
        if r.status_code == 200:
            route_id = r.json()["data"]["id"]
            print(f"  Created route {route_id}: {data.get('title', '?')}")
            return route_id
        else:
            print(f"  Failed to create route: {r.status_code} {r.text[:200]}")
            return None

    def create_tree_path(self, ancestor, descendant, depth, type_="null"):
        """Create a tree path entry via direct SQL."""
        return None  # Will do via SQL later

    def build_table_page(self, title, collection_name, icon="TableOutlined", sort=1):
        """Build a full table admin page for a collection."""
        print(f"\n=== Building {title} page (collection: {collection_name}) ===")

        # 1. Generate unique IDs for schemas
        page_schema_uid = uid()
        menu_schema_uid = uid()
        tabs_schema_uid = uid()
        grid_schema_uid = uid()
        row_schema_uid = uid()
        col_schema_uid = uid()
        table_provider_uid = uid()
        table_uid = uid()

        # 2. Create UI schemas
        # Page schema (the route wrapper)
        self.create_schema(page_schema_uid, {
            "type": "void",
            "x-component": "FlowRoute"
        })

        # Menu item schema
        self.create_schema(menu_schema_uid, {
            "type": "void",
            "x-component": "Menu.Item",
            "x-component-props": {"title": title, "icon": icon}
        })

        # Tabs container
        self.create_schema(tabs_schema_uid, {
            "type": "void",
            "x-component": "Tabs",
            "x-component-props": {"size": "large"}
        })

        # Tab pane content
        tab_pane_uid = uid()
        self.create_schema(tab_pane_uid, {
            "type": "void",
            "x-component": "Tabs.TabPane",
            "x-component-props": {"tab": title}
        })

        # Grid layout
        self.create_schema(grid_schema_uid, {
            "type": "void",
            "x-component": "Grid",
            "x-initializer": "table:configureActions"
        })

        # Row
        self.create_schema(row_schema_uid, {
            "type": "void",
            "x-component": "Grid.Row"
        })

        # Col with TableBlockProvider decorator
        self.create_schema(col_schema_uid, {
            "type": "void",
            "x-decorator": "TableBlockProvider",
            "x-decorator-props": {
                "collection": collection_name,
                "dataSource": "main"
            },
            "x-use-decorator-props": "useTableBlockDecoratorProps"
        })

        # Table component
        self.create_schema(table_uid, {
            "type": "void",
            "x-component": "TableV2",
            "x-use-component-props": "useTableBlockProps",
            "x-initializer": "table:configureColumns"
        })

        # Get collection fields to create column schemas
        r = self.s.get(f"{BASE}/collections:list?filter[name]={collection_name}")
        collection_data = r.json()["data"]
        if collection_data:
            coll_key = collection_data[0]["key"]
            r = self.s.get(f"{BASE}/fields:list?filter[collectionKey]={coll_key}")
            fields = r.json().get("data", [])
        else:
            fields = []

        # Create column schemas
        column_schemas = []
        for field in fields:
            field_name = field.get("name")
            field_type = field.get("type", "string")
            field_interface = field.get("interface", None)

            # Determine column type
            if field_interface in ["input", "textarea", "email", "phone"]:
                col_type = "string"
            elif field_interface == "integer":
                col_type = "number"
            elif field_interface in ["float", "percent", "number"]:
                col_type = "number"
            elif field_interface == "boolean":
                col_type = "boolean"
            elif field_interface in ["date", "datetime", "createdAt", "updatedAt"]:
                col_type = "datetime"
            elif field_interface in ["select", "radioGroup"]:
                col_type = "string"
            else:
                col_type = "string"

            col_uid = uid()
            self.create_schema(col_uid, {
                "type": col_type,
                "x-toolbar": "TableColumnSchemaToolbar",
                "x-settings": "fieldSettings:TableColumn",
                "x-component": "CollectionField",
                "x-decorator": "TableColumn.Decorator",
                "x-collection-field": f"{collection_name}.{field_name}"
            })
            column_schemas.append(col_uid)

        # 3. Create desktopRoutes
        # Parent route - the page itself
        page_route_id = self.create_route({
            "title": title,
            "type": "flowPage",
            "icon": icon,
            "sort": sort,
            "schemaUid": page_schema_uid,
            "menuSchemaUid": menu_schema_uid
        })

        # Child route - tabs
        tabs_route_id = self.create_route({
            "parentId": page_route_id,
            "type": "tabs",
            "schemaUid": tabs_schema_uid,
            "tabSchemaName": tab_pane_uid,
            "hidden": True
        })

        return {
            "page_route_id": page_route_id,
            "tabs_route_id": tabs_route_id,
            "schemas": {
                "page": page_schema_uid,
                "menu": menu_schema_uid,
                "tabs": tabs_schema_uid,
                "tab_pane": tab_pane_uid,
                "grid": grid_schema_uid,
                "row": row_schema_uid,
                "col": col_schema_uid,
                "table_provider": table_provider_uid,
                "table": table_uid,
                "columns": column_schemas,
            }
        }


if __name__ == "__main__":
    nb = NocoBaseAdmin()
    
    # Build admin pages for each collection
    pages = [
        ("Claims", "claims", "FileTextOutlined", 2),
        ("Tour Bookings", "tour_bookings", "CalendarOutlined", 3),
        ("Guide Assignments", "guide_assignments", "TeamOutlined", 4),
    ]
    
    results = {}
    for title, collection, icon, sort in pages:
        result = nb.build_table_page(title, collection, icon, sort)
        results[collection] = result
        print(f"\n{title} page created:")
        print(f"  Route ID: {result['page_route_id']}")
        print(f"  Page schema: {result['schemas']['page']}")
        print(f"  Columns: {len(result['schemas']['columns'])} fields")
    
    print("\n\n=== SUMMARY ===")
    for collection, result in results.items():
        print(f"{collection}: route_id={result['page_route_id']}, {len(result['schemas']['columns'])} columns")
