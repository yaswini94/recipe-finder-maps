import Link from "next/link";

interface LinkCardProps {
  href: string;
  children: React.ReactNode;
}

export function LinkCard({ href, children }: LinkCardProps) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      {children}
    </Link>
  );
}
