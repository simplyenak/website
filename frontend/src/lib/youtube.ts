const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

// Validate environment variables
if (!YOUTUBE_API_KEY) {
  throw new Error("VITE_YOUTUBE_API_KEY environment variable is required");
}

if (!CHANNEL_ID) {
  throw new Error("VITE_YOUTUBE_CHANNEL_ID environment variable is required");
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
    console.log("Fetching from URL:", url);
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("YouTube API Error:", response.status, errorText);
      throw new Error(`YouTube API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Raw YouTube API response:", data);

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

    console.log("Transformed data:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    throw error;
  }
}

export function getChannelUrl(): string {
  return `https://www.youtube.com/channel/${CHANNEL_ID}`;
}
