import { Image } from "astro:assets";
import IconArrowRight from "@/assets/icons/icon-arrow-right.tsx";
interface FaqItemProps {
  title: string;
  description: HTMLElement | string;
  image: ImageMetadata;
}

export default function FaqItem({ title, description, image }: FaqItemProps) {
  return (
    <>
      <div className="rounded-md w-full border border-[#3a3a3a33]">
        <button className="flex items-center justify-center gap-3 md:gap-5 text-left cursor-pointer font-merriweather p-5">
          <IconArrowRight className="w-5 md:w-8" />
          <span className="text-[17px] uppercase font-semibold">{title}</span>
        </button>
        <div className="px-5 prose-p:md:text-body text-[#3a3a3a] relative">
          <div className="h-5 w-full" />
          <div
            dangerouslySetInnerHTML={{ __html: description }}
            className="space-y-3"
          />
          <img src={image.src} alt={title} className="object-contain mt-5" />
          <div className="h-5 w-full" />
          <div className="absolute top-0 inset-x-0 w-full h-px bg-[#3a3a3a33]"></div>
        </div>
      </div>
    </>
  );
}
