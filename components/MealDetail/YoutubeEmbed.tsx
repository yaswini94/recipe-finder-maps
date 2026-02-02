interface YoutubeEmbedProps {
  url: string;
  title: string;
}

function getYoutubeVideoId(url: string): string | null {
  try {
    const trimmed = url.trim();
    const youtuBeMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (youtuBeMatch) return youtuBeMatch[1];
    const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];
    return null;
  } catch {
    return null;
  }
}

export function YoutubeEmbed({ url, title }: YoutubeEmbedProps) {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) return null;

  const embedSrc = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="space-y-2">
      <div
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        <iframe
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:underline"
        aria-label={`Open ${title} on YouTube`}
      >
        <svg
          className="h-4 w-4 shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        Watch on YouTube
      </a>
    </div>
  );
}
