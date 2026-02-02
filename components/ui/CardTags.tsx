interface CardTagsProps {
  children: React.ReactNode;
}

export function CardTags({ children }: CardTagsProps) {
  return <div className="flex flex-wrap gap-2 text-sm text-gray-600">{children}</div>;
}
