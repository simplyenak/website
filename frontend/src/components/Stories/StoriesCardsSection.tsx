import React, { useEffect, useState } from "react"
import fetchApi from "@/lib/strapi"
import { getFullMediaUrl } from "@/utils/getFullMediaUrl"
import type { StoriesDetailsPageTypes } from "@/types"

const PAGE_SIZE = 9

type PaginationMeta = {
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export default function StoriesCardsSection() {
  const [stories, setStories] = useState<StoriesDetailsPageTypes[]>([])
  const [page, setPage] = useState<number>(1)
  const [pageCount, setPageCount] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    fetchApi<StoriesDetailsPageTypes[]>({
      endpoint: `storie?populate=hero.bgImage&populate=hero&populate=categories&populate=contents&populate=author.image&populate=youtubeVideos&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`,
      wrappedByKey: "data",
    }).then((data) => {
      setStories(data || [])
      setLoading(false)
    })
    fetchApi<PaginationMeta>({
      endpoint: `storie?pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`,
      wrappedByKey: "meta",
    }).then((meta) => {
      setPageCount(meta?.pagination?.pageCount || 1)
    })
  }, [page])

  const handlePrev = () => setPage((p) => Math.max(1, p - 1))
  const handleNext = () => setPage((p) => Math.min(pageCount, p + 1))
  const handlePage = (p: number) => setPage(p)

  return (
    <section className="md:col-span-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
        {loading ? (
          <div className="col-span-full text-center py-10">Loading...</div>
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
      {PAGE_SIZE < stories.length && (
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
  )
}
