import React, { useState } from "react";

const PAGE_SIZE = 9;

type Story = {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  hero_image?: string | null;
  categories?: string[];
};

interface Props {
  stories: Story[];
}

export default function StoriesCardsSection({ stories = [] }: Props) {
  const [page, setPage] = useState<number>(1);
  const pageCount = Math.ceil(stories.length / PAGE_SIZE);
  const pagedStories = stories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(pageCount, p + 1));
  const handlePage = (p: number) => setPage(p);

  if (stories.length === 0) {
    return (
      <section className="md:col-span-5">
        <div className="col-span-full flex flex-col items-center justify-center py-16">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Stories Available
            </h3>
            <p className="text-gray-600">
              There are currently no stories to display. Please check back
              later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="md:col-span-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
        {pagedStories.map((story) => (
          <a
            key={story.slug}
            href={`/stories/${story.slug}/`}
            className="group rounded-lg overflow-hidden relative w-full h-[380px]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 text-white from-40% flex flex-col justify-end z-10 p-4 md:p-6 space-y-4">
              <div className="flex items-center gap-2">
                {(story.categories ?? []).map((cat, idx) => (
                  <span
                    key={idx}
                    className="bg-white text-body uppercase font-semibold text-black px-3 py-1 rounded-sm max-w-max"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <h4 className="text-h4 !font-bold capitalize line-clamp-3">
                {story.title}
              </h4>
            </div>
            {story.hero_image && (
              <img
                src={story.hero_image}
                alt={story.title}
                className="size-full object-cover group-hover:scale-110 transition-transform duration-300"
                height={380}
                width={768}
              />
            )}
          </a>
        ))}
      </div>
      {pageCount > 1 && (
        <div className="w-full md:max-w-[60%] px-5 md:px-10 py-3 bg-text/15 flex items-center justify-between rounded-md mx-auto mt-10">
          <button
            className="uppercase text-body font-semibold hover:text-primary duration-300 cursor-pointer"
            onClick={handlePrev}
            disabled={page === 1}
          >
            prev
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i + 1}
                className={`size-6 md:size-8 rounded-full ${
                  page === i + 1
                    ? "bg-white text-primary"
                    : "hover:bg-white hover:text-primary"
                } grid place-items-center font-semibold text-body cursor-pointer duration-300`}
                onClick={() => handlePage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            className="uppercase text-body font-semibold hover:text-primary duration-300 cursor-pointer"
            onClick={handleNext}
            disabled={page === pageCount}
          >
            next
          </button>
        </div>
      )}
    </section>
  );
}
