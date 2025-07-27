import React from "react"
import ytLogo from "@/assets/images/youtube-logo.webp"
// import IconYoutube from "@/assets/icons/icon-youtube.svg"

type YoutubeVideo = {
  youtubeVideoId: string
}

type YoutubeVideosTypes = {
  videosIds: YoutubeVideo[]
  youtubeChannelUrl: string
}

type YoutubeVideosProps = {
  className?: string
  youtubeVideos: YoutubeVideosTypes
}

export default function YoutubeVideos({
  className = "",
  youtubeVideos,
}: YoutubeVideosProps) {
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
        {youtubeVideos.videosIds.map((video, index) => (
          <iframe
            key={video.youtubeVideoId}
            src={`https://www.youtube.com/embed/${video.youtubeVideoId}`}
            title={`YouTube video ${index + 1}`}
            className="w-full aspect-video rounded-sm"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 whitespace-nowrap">
        <button className="px-2.5 py-1.5 text-white bg-black hover:bg-transparent border border-black hover:text-black text-xs rounded-sm text-center duration-300 cursor-pointer">
          Load More…
        </button>
        <a
          href={youtubeVideos.youtubeChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-2.5 py-1.5 text-white bg-primary hover:bg-transparent border border-primary hover:text-primary text-xs rounded-sm text-center duration-300"
        >
          {/* @ts-ignore */}
          {/* <IconYoutube class="size-4" /> */}
          Subscribe
        </a>
      </div>
    </div>
  )
}
