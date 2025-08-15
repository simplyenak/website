import { useState } from "react";
import ytLogo from "@/assets/images/youtube-logo.webp";

type YoutubeVideo = {
  youtubeVideoId: string;
};

type YoutubeVideosTypes = {
  videosIds: YoutubeVideo[];
  youtubeChannelUrl: string;
};

type YoutubeVideosProps = {
  className?: string;
  youtubeVideos: YoutubeVideosTypes;
};

export default function YoutubeVideos({
  className = "",
  youtubeVideos,
}: YoutubeVideosProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  const totalVideos = youtubeVideos?.videosIds?.length ?? 0;
  const canLoadMore = visibleCount < totalVideos;

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
      <div className="space-y-4 my-5">
        {youtubeVideos.videosIds.slice(0, visibleCount).map((video, index) => (
          <iframe
            key={video.youtubeVideoId}
            src={`https://www.youtube.com/embed/${video.youtubeVideoId}`}
            title={`YouTube video ${index + 1}`}
            className="w-full aspect-video rounded-sm shadow-md border"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 whitespace-nowrap mt-4">
        {canLoadMore && (
          <button
            className="px-3 py-1.5 text-white bg-black hover:bg-gray-900 border border-black hover:text-white text-xs rounded-sm text-center duration-200 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-black/30"
            onClick={() =>
              setVisibleCount((prev) => Math.min(prev + 6, totalVideos))
            }
            aria-label="Load more YouTube videos"
          >
            Load More ({Math.min(visibleCount + 6, totalVideos) - visibleCount}{" "}
            more)
          </button>
        )}
        <a
          href={youtubeVideos.youtubeChannelUrl}
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
