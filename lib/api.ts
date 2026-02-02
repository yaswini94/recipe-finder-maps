import type {
  Meal,
  MealSummary,
  Category,
  Area,
  MealResponse,
  MealSummaryResponse,
  CategoryResponse,
  AreaResponse,
  Ingredient,
} from "@/types/meal";
import type { ApiResponse } from "@/types/api";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";

export type { ApiResult, ApiError, ApiResponse } from "@/types/api";

export async function fetchApi<T>(endpoint: string, signal?: AbortSignal): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, { signal });

    if (!response.ok) {
      return {
        ok: false,
        error: {
          code: `HTTP_${response.status}`,
          message: `Request failed with status ${response.status}`,
        },
      };
    }

    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        ok: false,
        error: { code: "ABORTED", message: "Request was aborted" },
      };
    }
    return {
      ok: false,
      error: {
        code: "NETWORK_ERROR",
        message: error instanceof Error ? error.message : "Network error occurred",
      },
    };
  }
}

export async function searchMeals(
  query: string,
  signal?: AbortSignal
): Promise<ApiResponse<MealSummary[]>> {
  const result = await fetchApi<MealSummaryResponse>(
    `/search.php?s=${encodeURIComponent(query)}`,
    signal
  );
  if (!result.ok) return result;
  return { ok: true, data: result.data.meals || [] };
}

export async function getMealById(
  id: string,
  signal?: AbortSignal
): Promise<ApiResponse<Meal | null>> {
  const result = await fetchApi<MealResponse>(`/lookup.php?i=${encodeURIComponent(id)}`, signal);
  if (!result.ok) return result;
  const meal = result.data.meals?.[0] || null;
  return { ok: true, data: meal };
}

export async function getMealsByCategory(
  category: string,
  signal?: AbortSignal
): Promise<ApiResponse<MealSummary[]>> {
  const result = await fetchApi<MealSummaryResponse>(
    `/filter.php?c=${encodeURIComponent(category)}`,
    signal
  );
  if (!result.ok) return result;
  return { ok: true, data: result.data.meals || [] };
}

export async function getMealsByArea(
  area: string,
  signal?: AbortSignal
): Promise<ApiResponse<MealSummary[]>> {
  const result = await fetchApi<MealSummaryResponse>(
    `/filter.php?a=${encodeURIComponent(area)}`,
    signal
  );
  if (!result.ok) return result;
  return { ok: true, data: result.data.meals || [] };
}

export async function getCategories(signal?: AbortSignal): Promise<ApiResponse<Category[]>> {
  const result = await fetchApi<CategoryResponse>("/categories.php", signal);
  if (!result.ok) return result;
  return { ok: true, data: result.data.categories || [] };
}

export async function getAreas(signal?: AbortSignal): Promise<ApiResponse<Area[]>> {
  const result = await fetchApi<AreaResponse>("/list.php?a=list", signal);
  if (!result.ok) return result;
  return { ok: true, data: result.data.meals || [] };
}

export async function getAllMeals(signal?: AbortSignal): Promise<ApiResponse<MealSummary[]>> {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const results: MealSummary[] = [];

  for (const letter of alphabet) {
    const result = await fetchApi<MealSummaryResponse>(`/search.php?f=${letter}`, signal);
    if (!result.ok) {
      if (result.error.code === "ABORTED") return result;
      continue;
    }
    if (result.data.meals) {
      results.push(...result.data.meals);
    }
  }

  return { ok: true, data: results };
}

export function extractIngredients(meal: Meal): Ingredient[] {
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal] as string | null;
    const measure = meal[`strMeasure${i}` as keyof Meal] as string | null;

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }

  return ingredients;
}

export function filterMeals(
  meals: MealSummary[],
  mealDetails: Map<string, { category: string; area: string }>,
  categories: string[],
  areas: string[]
): MealSummary[] {
  if (categories.length === 0 && areas.length === 0) {
    return meals;
  }

  return meals.filter((meal) => {
    const details = mealDetails.get(meal.idMeal);
    if (!details) return false;

    const categoryMatch = categories.length === 0 || categories.includes(details.category);
    const areaMatch = areas.length === 0 || areas.includes(details.area);

    return categoryMatch && areaMatch;
  });
}

export function paginateMeals(
  meals: MealSummary[],
  page: number,
  itemsPerPage: number
): { meals: MealSummary[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(meals.length / itemsPerPage));
  const validPage = Math.min(Math.max(1, page), totalPages);
  const start = (validPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return {
    meals: meals.slice(start, end),
    totalPages,
  };
}
