interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
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

  const strapiUrl =
    import.meta.env.PUBLIC_STRAPI_URL ||
    import.meta.env.VITE_STRAPI_URL ||
    "https://api.system.simplyenak.com";
  const baseUrl = strapiUrl.endsWith("/") ? strapiUrl.slice(0, -1) : strapiUrl;
  const url = new URL(`${baseUrl}/api/${endpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  const res = await fetch(url.toString());
  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data as T;
}

interface PostProps {
  endpoint: string;
  data: Record<string, any>;
}

/**
 * Posts data to the Strapi API
 * @param endpoint - The endpoint to post to
 * @param data - The data to post
 * @returns
 */
export async function postApi<T>({ endpoint, data }: PostProps): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  const strapiUrl =
    import.meta.env.PUBLIC_STRAPI_URL ||
    import.meta.env.VITE_STRAPI_URL ||
    "https://api.system.simplyenak.com";
  const baseUrl = strapiUrl.endsWith("/") ? strapiUrl.slice(0, -1) : strapiUrl;
  const url = new URL(`${baseUrl}/api/${endpoint}`);

  console.log("Posting to:", url.toString());
  console.log("Data being sent:", { data });

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  console.log("Response status:", res.status);
  console.log("Response headers:", Object.fromEntries(res.headers.entries()));

  if (!res.ok) {
    let errorMessage = `Server error: ${res.status} ${res.statusText}`;

    try {
      const errorData = await res.json();
      console.error("Error response data:", errorData);
      if (errorData.error) {
        errorMessage += ` - ${
          errorData.error.message || JSON.stringify(errorData.error)
        }`;
      }
    } catch (e) {
      console.error("Could not parse error response as JSON");
    }

    throw new Error(errorMessage);
  }

  const responseData = await res.json();
  console.log("Success response:", responseData);
  return responseData as T;
}
