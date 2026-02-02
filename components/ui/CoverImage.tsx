import Image from "next/image";

interface CoverImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  containerClassName?: string;
}

const defaultSizes = "(max-width: 640px) 200px, (max-width: 1024px) 192px, 192px";

export function CoverImage({
  src,
  alt,
  priority = false,
  sizes = defaultSizes,
  quality = 65,
  containerClassName = "relative h-48 w-full bg-gray-200",
}: CoverImageProps) {
  return (
    <div className={containerClassName}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? undefined : "lazy"}
        className="object-cover"
        sizes={sizes}
        quality={quality}
      />
    </div>
  );
}
