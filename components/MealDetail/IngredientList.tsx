import type { Ingredient } from "@/types/meal";

interface IngredientListProps {
  ingredients: Ingredient[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  if (ingredients.length === 0) {
    return <p className="text-gray-500">No ingredients listed</p>;
  }

  return (
    <ul className="space-y-2" aria-label="Ingredients list">
      {ingredients.map((item, index) => (
        <li
          key={index}
          className="flex justify-between text-gray-700 py-2 border-b border-gray-100"
        >
          <span>{item.ingredient}</span>
          <span className="text-gray-500 font-medium">{item.measure}</span>
        </li>
      ))}
    </ul>
  );
}
