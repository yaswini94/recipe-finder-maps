import type { TagVariant } from "@/types/ui";

interface TagProps {
  variant: TagVariant;
  pill?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<TagVariant, string> = {
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  gray: "bg-gray-100 text-gray-800",
};

export function Tag({ variant, pill = false, children }: TagProps) {
  const shapeClass = pill
    ? "rounded-full px-3 py-1 text-sm font-medium"
    : "rounded px-2 py-1 text-sm";
  return <span className={`${variantClasses[variant]} ${shapeClass}`}>{children}</span>;
}
