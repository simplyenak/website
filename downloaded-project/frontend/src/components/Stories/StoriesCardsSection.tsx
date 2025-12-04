import React, { useEffect, useState } from "react";
import fetchApi from "@/lib/strapi";
import { getFullMediaUrl } from "@/utils/getFullMediaUrl";
import type { StoriesDetailsPageTypes } from "@/types";

const PAGE_SIZE = 9;

type PaginationMeta = {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};
export default function StoriesCardsSection() {
  const [stories, setStories] = useState<StoriesDetailsPageTypes[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      setError(null);

      try {
        const [storiesData, metaData] = await Promise.all([
          fetchApi<StoriesDetailsPageTypes[]>({
            endpoint: `storie?populate=hero.bgImage&populate=hero&populate=categories&populate=contents&populate=author.image&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`,
            wrappedByKey: "data",
          }),
          fetchApi<PaginationMeta>({
            endpoint: `storie?pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`,
            wrappedByKey: "meta",
          }),
        ]);

        setStories(storiesData || []);
        setPageCount(metaData?.pagination?.pageCount || 1);
      } catch (err) {
        console.error("Failed to load stories:", err);
        setError("Failed to load stories. Please try again.");
        setTimeout(() => {
          loadStories();
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, [page]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(pageCount, p + 1));
  const handlePage = (p: number) => setPage(p);

  return (
    <section className="md:col-span-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden relative w-full h-[380px] bg-gradient-to-br from-gray-100 to-gray-200"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite] z-10"></div>

              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 flex flex-col justify-end p-4 md:p-6 space-y-4 z-20">
                <div className="flex items-center gap-2">
                  <div
                    className="bg-white/30 backdrop-blur-sm h-6 w-16 rounded-sm animate-pulse"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  ></div>
                  <div
                    className="bg-white/30 backdrop-blur-sm h-6 w-20 rounded-sm animate-pulse"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  ></div>
                </div>
                <div className="space-y-3">
                  <div
                    className="bg-white/40 backdrop-blur-sm h-6 w-full rounded animate-pulse"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  ></div>
                  <div
                    className="bg-white/40 backdrop-blur-sm h-6 w-3/4 rounded animate-pulse"
                    style={{ animationDelay: `${index * 0.25}s` }}
                  ></div>
                  <div
                    className="bg-white/30 backdrop-blur-sm h-4 w-1/2 rounded animate-pulse"
                    style={{ animationDelay: `${index * 0.3}s` }}
                  ></div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300"></div>

              <div className="absolute top-4 right-4 z-30">
                <div
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm animate-pulse"
                  style={{ animationDelay: `${index * 0.35}s` }}
                ></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Unable to Load Stories
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="flex items-center justify-center text-sm text-red-500">
                <svg
                  className="animate-spin w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Retrying automatically...
              </div>
            </div>
          </div>
        ) : stories.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No Stories Available
              </h3>
              <p className="text-gray-600">
                There are currently no stories to display. Please check back
                later.
              </p>
            </div>
          </div>
        ) : (
          stories.map((story, index) => (
            <a
              key={story.slug}
              href={`/stories/${story.slug}`}
              className="group rounded-lg overflow-hidden relative w-full h-[380px]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 text-white from-40% flex flex-col justify-end z-10 p-4 md:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  {story.categories.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-body uppercase font-semibold text-black px-3 py-1 rounded-sm max-w-max"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <h4 className="text-h4 !font-bold capitalize line-clamp-3">
                  {story.hero.title}
                </h4>
              </div>
              {/* Replace Image with <img> if not using Astro assets */}
              <img
                src={getFullMediaUrl(story.hero.bgImage)}
                alt={story.hero.bgImage.name}
                className="size-full object-cover group-hover:scale-110 transition-transform duration-300"
                height={380}
                width={768}
              />
            </a>
          ))
        )}
      </div>
      {!loading && !error && pageCount > 1 && (
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
