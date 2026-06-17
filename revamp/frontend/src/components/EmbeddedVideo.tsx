import { useState } from "react";

interface EmbeddedVideoProps {
  iframeSrc: string;
  poster?: string;
  title?: string;
  className?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1";
  showPlayButton?: boolean;
  playButtonText?: string;
}

export default function EmbeddedVideo({
  iframeSrc,
  poster,
  title,
  className = "w-full",
  aspectRatio = "16:9",
  showPlayButton = true,
  playButtonText = "Play Video",
}: EmbeddedVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const aspectRatioClasses = {
    "16:9": "aspect-video",
    "4:3": "aspect-4/3",
    "1:1": "aspect-square",
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <div
        className={`${className} ${aspectRatioClasses[aspectRatio]} relative`}
      >
        <iframe
          src={`${iframeSrc}?autoplay=${isPlaying ? 1 : 0}`}
          title={title || "Embedded Video"}
          className="w-full h-full rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className={`${className} ${aspectRatioClasses[aspectRatio]} relative group cursor-pointer`}
      onClick={handlePlay}
    >
      {poster && (
        <img
          src={poster}
          alt={title || "Video Poster"}
          className="w-full h-full object-cover rounded-lg"
        />
      )}

      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg cursor-pointer">
          <div className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
            <svg
              className="size-12 text-gray-800"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          {playButtonText && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
              {playButtonText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
