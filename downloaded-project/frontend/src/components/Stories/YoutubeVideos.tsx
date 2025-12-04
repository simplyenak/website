import { useState, useEffect } from "react";
import ytLogo from "@/assets/images/youtube-logo.webp";
import {
  fetchYouTubeVideos,
  getChannelUrl,
  type YouTubeVideo,
} from "@/lib/youtube";

type YoutubeVideosProps = {
  className?: string;
};

export default function YoutubeVideos({ className = "" }: YoutubeVideosProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [hasMoreVideos, setHasMoreVideos] = useState(true);

  useEffect(() => {
    loadInitialVideos();
  }, []);

  const loadInitialVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchYouTubeVideos(12); // Load 12 videos initially
      setVideos(response.items);
      setNextPageToken(response.nextPageToken);
      setHasMoreVideos(!!response.nextPageToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreVideos = async () => {
    if (!nextPageToken || !hasMoreVideos || loadingMore) return;

    try {
      setLoadingMore(true);
      const response = await fetchYouTubeVideos(6, nextPageToken);
      setVideos((prev) => [...prev, ...response.items]);
      setNextPageToken(response.nextPageToken);
      setHasMoreVideos(!!response.nextPageToken);
      setVisibleCount((prev) => prev + 6);
    } catch (err) {
      console.error("Error loading more videos:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load more videos"
      );
    } finally {
      setLoadingMore(false);
    }
  };

  const displayedVideos = videos.slice(0, visibleCount);
  const canLoadMore = visibleCount < videos.length || hasMoreVideos;

  if (error) {
    return (
      <div className={className}>
        <img
          src={typeof ytLogo === "string" ? ytLogo : ytLogo?.src || ""}
          alt="YouTube Logo"
          className="w-full object-contain mx-auto"
          loading="lazy"
          height={100}
          width={500}
        />
        <div className="text-center py-8 text-red-600">
          <p className="mb-2">Failed to load YouTube videos</p>
          <p className="text-xs text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadInitialVideos}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        src={typeof ytLogo === "string" ? ytLogo : ytLogo?.src || ""}
        alt="YouTube Logo"
        className="w-full object-contain mx-auto"
        loading="lazy"
        height={100}
        width={500}
      />

      {loading && videos.length === 0 ? (
        <div className="space-y-4 my-5">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="w-full aspect-video bg-gray-200 animate-pulse rounded-sm"
            />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No videos found</p>
        </div>
      ) : (
        <div className="space-y-4 my-5">
          {displayedVideos.map((video, index) => (
            <div key={video.id} className="space-y-2">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                className="w-full aspect-video rounded-sm shadow-md border"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                loading="lazy"
              />
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                {video.title}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(video.publishedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2 whitespace-nowrap mt-4">
        {canLoadMore && (
          <button
            className="px-3 py-1.5 text-white bg-black hover:bg-gray-900 border border-black hover:text-white text-xs rounded-sm text-center duration-200 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={loadMoreVideos}
            disabled={loadingMore}
            aria-label="Load more YouTube videos"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        )}
        <a
          href={getChannelUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 text-white bg-primary hover:bg-transparent border border-primary hover:text-primary text-xs rounded-sm text-center duration-200 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 28 28"
            fill="currentColor"
            className="size-4"
          >
            <path d="M11.109 17.625l7.562-3.906-7.562-3.953v7.859zM14 4.156c5.891 0 9.797 0.281 9.797 0.281 0.547 0.063 1.75 0.063 2.812 1.188 0 0 0.859 0.844 1.109 2.781 0.297 2.266 0.281 4.531 0.281 4.531v2.125s0.016 2.266-0.281 4.531c-0.25 1.922-1.109 2.781-1.109 2.781-1.062 1.109-2.266 1.109-2.812 1.172 0 0-3.906 0.297-9.797 0.297v0c-7.281-0.063-9.516-0.281-9.516-0.281-0.625-0.109-2.031-0.078-3.094-1.188 0 0-0.859-0.859-1.109-2.781-0.297-2.266-0.281-4.531-0.281-4.531v-2.125s-0.016-2.266 0.281-4.531c0.25-1.937 1.109-2.781 1.109-2.781 1.062-1.125 2.266-1.125 2.812-1.188 0 0 3.906-0.281 9.797-0.281v0z"></path>
          </svg>
          Subscribe
        </a>
      </div>
    </div>
  );
}
