import type { MealSummary, Category, Area, Meal } from "@/types/meal";

async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const qs =
    params && Object.keys(params).length ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(path + qs);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? res.statusText);
  }
  return data as T;
}

export async function fetchCategories(): Promise<Category[]> {
  const data = await apiGet<{ categories: Category[] }>("/api/categories");
  return data.categories;
}

export async function fetchAreas(): Promise<Area[]> {
  const data = await apiGet<{ areas: Area[] }>("/api/areas");
  return data.areas;
}

export async function fetchBaseMeals(
  search: string,
  categories: string[],
  areas: string[]
): Promise<MealSummary[]> {
  const params: Record<string, string> = {};
  if (search.trim()) params.search = search.trim();
  if (categories.length) params.categories = categories.join(",");
  if (areas.length) params.areas = areas.join(",");
  const data = await apiGet<{ meals: MealSummary[] }>("/api/meals", params);
  return data.meals;
}

export async function fetchMealById(id: string): Promise<Meal | null> {
  const data = await apiGet<{ meal: Meal | null }>(`/api/meals/${id}`);
  return data.meal;
}
