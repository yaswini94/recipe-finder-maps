import { useId } from "react";
import { ChevronIcon } from "./ChevronIcon";

interface FilterSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function FilterSection({ title, expanded, onToggle, children }: FilterSectionProps) {
  const contentId = useId();

  return (
    <div className="mb-6 last:mb-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        aria-expanded={expanded}
        aria-controls={contentId}
      >
        <span>{title}</span>
        <ChevronIcon expanded={expanded} />
      </button>
      <div
        id={contentId}
        className={`space-y-2 overflow-hidden transition-all duration-200 ${
          expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        role="group"
        aria-label={`${title} filters`}
      >
        {children}
      </div>
    </div>
  );
}
