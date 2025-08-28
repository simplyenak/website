const YOUTUBE_API_KEY = import.meta.env.PUBLIC_VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = import.meta.env.PUBLIC_VITE_YOUTUBE_CHANNEL_ID;

// Check if YouTube API is properly configured
export function isYouTubeConfigured(): boolean {
  return !!(YOUTUBE_API_KEY && CHANNEL_ID);
}

export function getYouTubeConfigError(): string | null {
  if (!YOUTUBE_API_KEY) {
    return "PUBLIC_VITE_YOUTUBE_API_KEY environment variable is required";
  }
  if (!CHANNEL_ID) {
    return "PUBLIC_VITE_YOUTUBE_CHANNEL_ID environment variable is required";
  }
  return null;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  channelTitle: string;
}

export interface YouTubeApiResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export async function fetchYouTubeVideos(
  maxResults: number = 10,
  pageToken?: string
): Promise<YouTubeApiResponse> {
  const configError = getYouTubeConfigError();
  if (configError) {
    throw new Error(configError);
  }

  const params = new URLSearchParams({
    part: "snippet",
    channelId: CHANNEL_ID,
    maxResults: maxResults.toString(),
    order: "date",
    type: "video", // Only get videos, not playlists or channels
    key: YOUTUBE_API_KEY,
  });

  if (pageToken) {
    params.append("pageToken", pageToken);
  }

  const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("YouTube API Error:", response.status, errorText);
      throw new Error(`YouTube API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Transform the response to match our interface
    const transformedData: YouTubeApiResponse = {
      items:
        data.items?.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          publishedAt: item.snippet.publishedAt,
          thumbnails: item.snippet.thumbnails,
          channelTitle: item.snippet.channelTitle,
        })) || [],
      nextPageToken: data.nextPageToken,
      pageInfo: data.pageInfo,
    };

    return transformedData;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    throw error;
  }
}

export function getChannelUrl(): string {
  const configError = getYouTubeConfigError();
  if (configError) {
    return "#"; // Return a safe fallback URL
  }
  return `https://www.youtube.com/channel/${CHANNEL_ID}`;
}
