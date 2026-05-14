interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

/**
 * Fetches data from the Payload CMS API
 * Payload response format differs from Strapi:
 *   - List: { docs: [...], totalDocs, page, totalPages, hasNextPage, hasPrevPage }
 *   - Single: { doc: {...} }
 *
 * This client normalises Payload responses so components can consume
 * data the same way they did with Strapi's { data: [...] } format.
 */
export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: Props): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  const payloadUrl =
    import.meta.env.PUBLIC_PAYLOAD_URL ||
    import.meta.env.VITE_PAYLOAD_URL ||
    "https://cms.system.simplyenak.com";
  const baseUrl = payloadUrl.endsWith("/")
    ? payloadUrl.slice(0, -1)
    : payloadUrl;
  const url = new URL(`${baseUrl}/api/${endpoint}`);

  // Translate Strapi-style query params to Payload format
  // populate=hero.image → depth=2
  // pagination[pageSize]=N → limit=N
  // pagination[page]=N → page=N
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (key === "populate") {
        // Count depth levels from populate param
        const depth = (value.match(/\./g) || []).length + 1;
        url.searchParams.set("depth", String(Math.min(depth + 1, 5)));
      } else if (key === "pagination[pageSize]") {
        url.searchParams.set("limit", value);
      } else if (key === "pagination[page]") {
        url.searchParams.set("page", value);
      } else {
        url.searchParams.append(key, value);
      }
    });
  }

  // Always request at least depth=1 for relational data
  if (!url.searchParams.has("depth")) {
    url.searchParams.set("depth", "1");
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    let errorMessage = `Payload API error: ${res.status} ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.message) errorMessage += ` - ${errorData.message}`;
    } catch {}
    throw new Error(errorMessage);
  }

  let data = await res.json();

  // Normalise Payload response → Strapi-like format for component compatibility
  if (wrappedByKey === "data") {
    // Payload returns { docs: [...] } → map to just the array
    data = Array.isArray(data.docs) ? data.docs : data;
  }

  if (wrappedByKey === "meta") {
    // Payload pagination → Strapi meta.pagination format
    data = {
      pagination: {
        page: data.page || 1,
        pageCount: data.totalPages || 1,
        total: data.totalDocs || 0,
        pageSize: data.limit || data.pageSize || 9,
      },
    };
  }

  if (wrappedByList) {
    data = Array.isArray(data) ? data[0] : data.doc ? data.doc : data;
  }

  return data as T;
}

interface PostProps {
  endpoint: string;
  data: Record<string, any>;
}

/**
 * Posts data to the Payload CMS API
 * Payload expects flat body data (no { data: {} } wrapper like Strapi)
 * Returns { doc, message, errors }
 */
export async function postApi<T>({ endpoint, data }: PostProps): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  const payloadUrl =
    import.meta.env.PUBLIC_PAYLOAD_URL ||
    import.meta.env.VITE_PAYLOAD_URL ||
    "https://cms.system.simplyenak.com";
  const baseUrl = payloadUrl.endsWith("/")
    ? payloadUrl.slice(0, -1)
    : payloadUrl;
  const url = new URL(`${baseUrl}/api/${endpoint}`);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = `Server error: ${res.status} ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.message) errorMessage += ` - ${errorData.message}`;
      if (errorData.errors) {
        errorMessage += `: ${errorData.errors
          .map((e: any) => e.message || e.path)
          .join(", ")}`;
      }
    } catch {}
    throw new Error(errorMessage);
  }

  const responseData = await res.json();
  // Payload returns { doc: {...} } for successful creates
  // Normalise to return the doc directly
  return (responseData.doc || responseData) as T;
}