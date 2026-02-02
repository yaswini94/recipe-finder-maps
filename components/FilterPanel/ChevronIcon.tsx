interface ChevronIconProps {
  expanded: boolean;
}

export function ChevronIcon({ expanded }: ChevronIconProps) {
  return (
    <svg
      className={`w-5 h-5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
