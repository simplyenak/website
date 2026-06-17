import { useState, useRef } from "react";

interface VideoProps {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export default function Video({
  src,
  poster,
  className = "w-full h-full",
  controls = true,
  autoplay = false,
  muted = false,
  loop = false,
}: VideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowControls(true);
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    setShowControls(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        preload="auto"
        poster={poster}
        playsInline
        webkit-playsinline=""
        x5-playsinline=""
        className={className}
        controls={showControls}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
      />
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10"
          onClick={handlePlayClick}
        >
          <div className="size-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200">
            <svg
              className="size-12 text-gray-800"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
