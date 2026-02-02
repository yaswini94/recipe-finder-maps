interface CardTitleProps {
  children: React.ReactNode;
  as?: "h2" | "h3" | "h4";
}

export function CardTitle({ children, as: Component = "h3" }: CardTitleProps) {
  return (
    <Component className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
      {children}
    </Component>
  );
}
