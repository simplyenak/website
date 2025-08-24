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
  return (
    <video
      src={src}
      preload="auto"
      poster={poster}
      playsInline
      webkit-playsinline=""
      x5-playsinline=""
      className={className}
      controls={controls}
      autoPlay={autoplay}
      muted={muted}
      loop={loop}
    />
  );
}
