import Link from "next/link";

interface BackLinkProps {
  href: string;
  children: React.ReactNode;
}

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <nav className="mb-6">
      <Link
        href={href}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        aria-label={typeof children === "string" ? children : undefined}
      >
        <svg
          className="w-5 h-5 mr-2 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {children}
      </Link>
    </nav>
  );
}
