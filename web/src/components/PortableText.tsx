import type { PortableTextBlock } from "@/lib/sanity/client";

interface PortableTextProps {
  blocks: PortableTextBlock[];
  className?: string;
}

const textWrapClass = "break-words [overflow-wrap:anywhere]";

function renderBlock(block: PortableTextBlock, index: number) {
  if (block._type !== "block" || !block.children?.length) return null;

  const text = block.children.map((child) => child.text).join("");

  if (!text) return null;

  if (block.style === "h2" || block.style === "h3") {
    return (
      <h3
        key={index}
        className={`mt-8 font-display text-2xl font-bold text-bfc-black first:mt-0 ${textWrapClass}`}
      >
        {text}
      </h3>
    );
  }

  if (block.style === "blockquote") {
    return (
      <blockquote
        key={index}
        className={`mt-4 border-l-4 border-bfc-red pl-4 text-lg italic text-black/80 ${textWrapClass}`}
      >
        {text}
      </blockquote>
    );
  }

  return (
    <p key={index} className={`mt-4 text-base leading-7 text-black/75 ${textWrapClass}`}>
      {text}
    </p>
  );
}

export default function PortableText({ blocks, className }: PortableTextProps) {
  return (
    <div className={`${textWrapClass} ${className ?? ""}`}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
