import type { Meal, Ingredient } from "@/types/meal";
import { CoverImage } from "@/components/ui/CoverImage";
import { Tag } from "../ui/Tag";
import { IngredientList } from "./IngredientList";
import { Instructions } from "./Instructions";
import { YoutubeEmbed } from "./YoutubeEmbed";

interface MealDetailContentProps {
  meal: Meal;
  ingredients: Ingredient[];
}

const heroSizes = "(max-width: 640px) 100vw, (max-width: 768px) 640px, 768px";

export function MealDetailContent({ meal, ingredients }: MealDetailContentProps) {
  const tags =
    meal.strTags
      ?.split(",")
      .filter(Boolean)
      .map((t) => t.trim()) || [];

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <CoverImage
        src={meal.strMealThumb}
        alt={meal.strMeal}
        priority
        sizes={heroSizes}
        containerClassName="relative h-64 sm:h-80 md:h-96 w-full"
      />

      <div className="p-6 sm:p-8">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{meal.strMeal}</h1>

          <div className="flex flex-wrap gap-2">
            {meal.strCategory && (
              <Tag variant="blue" pill>
                {meal.strCategory}
              </Tag>
            )}
            {meal.strArea && (
              <Tag variant="green" pill>
                {meal.strArea}
              </Tag>
            )}
            {tags.map((tag) => (
              <Tag key={tag} variant="gray" pill>
                {tag}
              </Tag>
            ))}
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <section className="md:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h2>
            <IngredientList ingredients={ingredients} />
          </section>

          <section className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
            <Instructions text={meal.strInstructions} />
          </section>
        </div>

        {meal.strYoutube && (
          <section className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Video Tutorial</h2>
            <YoutubeEmbed url={meal.strYoutube} title={`${meal.strMeal} video tutorial`} />
          </section>
        )}
      </div>
    </article>
  );
}
