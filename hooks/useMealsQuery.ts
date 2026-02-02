import { useMemo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import type { SearchState } from "@/types/query";
import { fetchCategories, fetchAreas, fetchBaseMeals, fetchMealById } from "@/lib/apiClient";
import { paginateMeals } from "@/lib/api";
import { ITEMS_PER_PAGE } from "@/lib/queryParams";

export function useMealsQuery({ search, categories, areas, page }: SearchState) {
  const hasSearchOrFilters = search.trim() !== "" || categories.length > 0 || areas.length > 0;

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });

  const areasQuery = useQuery({
    queryKey: ["areas"],
    queryFn: fetchAreas,
    staleTime: 10 * 60 * 1000,
  });

  const mealsQuery = useQuery({
    queryKey: ["meals", search, categories, areas],
    queryFn: () => fetchBaseMeals(search, categories, areas),
    enabled: hasSearchOrFilters,
  });

  const allMeals = hasSearchOrFilters ? (mealsQuery.data ?? []) : [];

  const { paginated, mealIdsToFetch } = useMemo(() => {
    const paginated = paginateMeals(allMeals, page, ITEMS_PER_PAGE);
    return {
      paginated,
      mealIdsToFetch: paginated.meals.map((m) => m.idMeal),
    };
  }, [allMeals, page]);

  const mealDetailQueries = useQueries({
    queries: mealIdsToFetch.map((id) => ({
      queryKey: ["meal", id],
      queryFn: () => fetchMealById(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const mealDetailsMap = useMemo(() => {
    const map = new Map<string, { category: string; area: string }>();
    mealDetailQueries.forEach((q, i) => {
      const meal = q.data;
      const id = mealIdsToFetch[i];
      if (id && meal) {
        map.set(id, { category: meal.strCategory, area: meal.strArea });
      }
    });
    return map;
  }, [mealDetailQueries, mealIdsToFetch]);

  const detailsLoading =
    mealIdsToFetch.length > 0 && mealDetailQueries.some((q) => q.isLoading || q.isPending);

  const mealsLoading = hasSearchOrFilters && (mealsQuery.isLoading || mealsQuery.isPending);
  const isLoading = mealsLoading || detailsLoading;
  const error = mealsQuery.error ? (mealsQuery.error as Error).message : null;

  return {
    meals: paginated.meals,
    totalPages: paginated.totalPages,
    isLoading,
    isFetching: mealsQuery.isFetching,
    error,
    categories: categoriesQuery.data ?? [],
    areas: areasQuery.data ?? [],
    filtersLoading: categoriesQuery.isLoading || areasQuery.isLoading,
    mealDetailsMap,
    detailsLoading,
    refetch: mealsQuery.refetch,
  };
}
