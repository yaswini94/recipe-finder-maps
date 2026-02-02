import { LinkCard } from "@/components/ui/LinkCard";
import { CoverImage } from "@/components/ui/CoverImage";
import { CardContent } from "@/components/ui/CardContent";
import { CardTitle } from "@/components/ui/CardTitle";
import { CardTags } from "@/components/ui/CardTags";
import { Tag } from "../ui/Tag";

/**
 * Props for the MealCard component
 */
interface MealCardProps {
  /** Unique meal identifier for routing to detail page */
  id: string;
  /** Display name of the meal */
  name: string;
  /** URL of the meal's thumbnail image */
  thumbnail: string;
  /** Optional category name (e.g., "Beef", "Dessert") */
  category?: string;
  /** Optional area/cuisine name (e.g., "Italian", "Chinese") */
  area?: string;
  /** Set true for the first card (LCP image) so it loads with high priority */
  priority?: boolean;
  returnToQuery?: string;
  tagsLoading?: boolean;
}

/**
 * MealCard Component
 *
 * Displays a clickable card with meal information including thumbnail, name, and tags.
 * Links to the meal detail page at `/meals/[id]`.
 *
 * Features:
 * - Responsive image with lazy loading and optimized sizing
 * - Color-coded tags (blue for category, green for area)
 * - Hover effect with elevated shadow
 * - Truncated meal name (single line with ellipsis)
 */
export default function MealCard({
  id,
  name,
  thumbnail,
  category,
  area,
  priority = false,
  returnToQuery,
  tagsLoading = false,
}: MealCardProps) {
  const href = returnToQuery ? `/meals/${id}?${returnToQuery}` : `/meals/${id}`;
  return (
    <LinkCard href={href}>
      <CoverImage src={thumbnail} alt={name} priority={priority} />
      <CardContent>
        <CardTitle>{name}</CardTitle>
        <CardTags>
          {tagsLoading ? (
            <>
              <span
                className="h-6 w-16 rounded bg-gray-200 animate-pulse inline-block"
                aria-hidden
              />
              <span
                className="h-6 w-20 rounded bg-gray-200 animate-pulse inline-block"
                aria-hidden
              />
            </>
          ) : (
            <>
              {category && <Tag variant="blue">{category}</Tag>}
              {area && <Tag variant="green">{area}</Tag>}
            </>
          )}
        </CardTags>
      </CardContent>
    </LinkCard>
  );
}
