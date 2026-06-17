import { useState, useRef, useEffect } from "react";
import IconArrowRight from "@/assets/icons/icon-arrow-right.tsx";

interface FaqItemProps {
  title: string;
  description: HTMLElement | string;
  image: ImageMetadata;
}

export default function FaqItem({ title, description, image }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentId = `faq-content-${title.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className="rounded-md w-full border border-[#3a3a3a33] overflow-hidden"
    >
      <div className="grid grid-rows-[auto_0fr] transition-all duration-500 ease-in-out">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="flex items-center justify-between gap-3 md:gap-5 text-left cursor-pointer font-merriweather p-5 hover:bg-gray-50 transition-colors duration-200 w-full"
        >
          <div className="flex items-center gap-3 md:gap-5">
            <IconArrowRight
              aria-hidden="true"
              className={`w-5 md:w-8 transition-transform duration-300 ${
                isOpen ? "rotate-90" : "rotate-0"
              }`}
            />
            <span className="text-[17px] uppercase font-semibold">{title}</span>
          </div>
        </button>
        <div
          id={contentId}
          className={`grid grid-rows-[0fr] transition-all duration-500 ease-in-out ${
            isOpen ? "grid-rows-[1fr]" : ""
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-5 prose-p:md:text-body text-[#3a3a3a] relative">
              <div className="h-5 w-full" />
              <div
                dangerouslySetInnerHTML={{ __html: description }}
                className="space-y-3"
              />
              <img
                src={image.src}
                alt={title}
                className="object-contain mt-5"
              />
              <div className="h-5 w-full" />
              <div
                className={`absolute top-0 left-0 h-px bg-[#3a3a3a33] transition-all duration-700 ease-in-out ${
                  isOpen ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
