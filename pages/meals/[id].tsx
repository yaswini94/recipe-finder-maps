import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { extractIngredients } from "@/lib/api";
import { fetchMealById } from "@/lib/apiClient";
import { parseQueryParams, stateToQueryString } from "@/lib/queryParams";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { PageLayout } from "@/components/ui/PageLayout";
import { BackLink } from "@/components/ui/BackLink";
import { MealDetailContent } from "@/components/MealDetail";

const TITLE_SUFFIX = " - Recipe Finder";

function getBackHref(query: Record<string, string | string[] | undefined>): string {
  const { id: _id, ...rest } = query;
  const state = parseQueryParams(rest);
  const qs = stateToQueryString(state);
  return qs ? `/${qs}` : "/";
}

export default function MealDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const mealId = typeof id === "string" ? id : null;
  const backHref = getBackHref(router.query);

  const {
    data: meal,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["meal", mealId],
    queryFn: () => fetchMealById(mealId!),
    enabled: !!mealId,
  });

  const error = queryError ? (queryError as Error).message : null;

  if (mealId === null && !meal) {
    return null;
  }

  if (isLoading) {
    return (
      <PageLayout title={`Loading...${TITLE_SUFFIX}`} description="Loading recipe details...">
        <LoadingState message="Loading recipe details..." />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title={`Error${TITLE_SUFFIX}`}
        description="Something went wrong loading this recipe."
      >
        <BackLink href={backHref}>Back to recipes</BackLink>
        <ErrorState message={error} onRetry={() => refetch()} />
      </PageLayout>
    );
  }

  if (!meal) {
    return (
      <PageLayout title={`Not Found${TITLE_SUFFIX}`} description="Recipe not found.">
        <BackLink href={backHref}>Back to recipes</BackLink>
        <ErrorState message="Meal not found" />
      </PageLayout>
    );
  }

  const ingredients = extractIngredients(meal);
  const metaDescription =
    meal.strInstructions?.trim().slice(0, 155).replace(/\s+/g, " ").trim() ||
    `Recipe for ${meal.strMeal}. View ingredients and step-by-step instructions.`;

  return (
    <PageLayout title={`${meal.strMeal}${TITLE_SUFFIX}`} description={metaDescription}>
      <BackLink href={backHref}>Back to recipes</BackLink>
      <MealDetailContent meal={meal} ingredients={ingredients} />
    </PageLayout>
  );
}
