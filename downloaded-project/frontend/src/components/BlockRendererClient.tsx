"use client";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

interface ImageGridProps {
  images: Array<{
    url: string;
    width: number;
    height: number;
    alternativeText?: string | null;
  }>;
}

function ImageGrid({ images }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 size-full overflow-hidden pb-6">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.url}
          alt={image.alternativeText || ""}
          className="size-full object-cover"
        />
      ))}
    </div>
  );
}

export default function BlockRendererClient({
  content,
}: {
  readonly content: BlocksContent;
}) {
  if (!content) return null;

  const renderContent = () => {
    if (!Array.isArray(content)) {
      return (
        <BlocksRenderer
          content={content}
          blocks={{
            image: ({ image }) => {
              return (
                <img
                  src={image.url}
                  alt={image.alternativeText || ""}
                  className="w-full h-auto object-cover"
                />
              );
            },
          }}
        />
      );
    }

    const elements = [];
    let i = 0;

    while (i < content.length) {
      const currentBlock = content[i] as any;
      const nextBlock = content[i + 1] as any;

      if (currentBlock.type === "image" && nextBlock?.type === "image") {
        elements.push(
          <ImageGrid
            key={`grid-${i}`}
            images={[currentBlock.image, nextBlock.image]}
          />
        );
        i += 2;
      } else {
        elements.push(
          <BlocksRenderer
            key={`block-${i}`}
            content={[currentBlock]}
            blocks={{
              image: ({ image }) => {
                return (
                  <img
                    src={image.url}
                    alt={image.alternativeText || ""}
                    className="w-full h-auto object-cover"
                  />
                );
              },
            }}
          />
        );
        i += 1;
      }
    }

    return <>{elements}</>;
  };

  return renderContent();
}
