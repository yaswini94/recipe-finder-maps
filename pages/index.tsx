import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import ActiveFilters from "@/components/ActiveFilters";
import MealCard from "@/components/MealCard";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { MealGridSkeleton } from "@/components/LoadingState";
import SearchResultsState from "@/components/SearchResultsState";
import { useUrlState } from "@/hooks/useUrlState";
import { useMealsQuery } from "@/hooks/useMealsQuery";
import { buildQueryParams } from "@/lib/queryParams";

export default function Home() {
  const {
    state,
    setSearch,
    toggleCategory,
    toggleArea,
    removeCategory,
    removeArea,
    setPage,
    clearFilters,
  } = useUrlState();

  const {
    meals,
    totalPages,
    isLoading,
    isFetching,
    error,
    categories,
    areas,
    filtersLoading,
    mealDetailsMap,
    detailsLoading,
    refetch,
  } = useMealsQuery({
    search: state.search,
    categories: state.categories,
    areas: state.areas,
    page: state.page,
  });

  const [searchInputValue, setSearchInputValue] = useState(state.search);

  useEffect(() => {
    setSearchInputValue(state.search);
  }, [state.search]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchInputValue(query);
      setSearch(query);
    },
    [setSearch]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setPage]
  );

  const showEmpty = !isLoading && !error && meals.length === 0;
  const showResults = !isLoading && !error && meals.length > 0;

  return (
    <>
      <Head>
        <title>Recipe Finder - Discover Delicious Meals</title>
        <meta
          name="description"
          content="Search and discover delicious meals from around the world"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-8" role="banner">
            <h1 className="text-4xl font-bold mb-2 text-gray-900">Recipe Finder</h1>
            <p className="text-gray-700">
              Search and discover delicious meals from around the world
            </p>
          </header>

          <nav className="mb-6" aria-label="Search">
            <SearchBar
              placeholder="Search for meals..."
              defaultValue={searchInputValue}
              onSearch={handleSearch}
            />
          </nav>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-64 flex-shrink-0">
              <FilterPanel
                categories={categories}
                areas={areas}
                selectedCategories={state.categories}
                selectedAreas={state.areas}
                onCategoryToggle={toggleCategory}
                onAreaToggle={toggleArea}
                onClearFilters={clearFilters}
                isLoading={filtersLoading}
              />
            </div>

            <main className="flex-1" id="main-content" aria-busy={isLoading || isFetching}>
              <SearchResultsState count={meals.length} isLoading={isLoading} />

              <ActiveFilters
                selectedCategories={state.categories}
                selectedAreas={state.areas}
                onRemoveCategory={removeCategory}
                onRemoveArea={removeArea}
              />

              {isFetching && !isLoading && (
                <p className="text-sm text-gray-500 mb-2" role="status" aria-live="polite">
                  Updating results…
                </p>
              )}

              {isLoading && <MealGridSkeleton count={6} />}

              {error && <ErrorState message={error} onRetry={() => refetch()} />}

              {showEmpty && (
                <EmptyState
                  searchQuery={state.search}
                  selectedCategories={state.categories}
                  selectedAreas={state.areas}
                />
              )}

              {showResults && (
                <section aria-label="Meal results">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6" role="list">
                    {meals.map((meal, index) => {
                      const details = mealDetailsMap.get(meal.idMeal);
                      const returnToQuery = buildQueryParams(state).toString();
                      return (
                        <li key={meal.idMeal}>
                          <MealCard
                            id={meal.idMeal}
                            name={meal.strMeal}
                            thumbnail={meal.strMealThumb}
                            category={details?.category}
                            area={details?.area}
                            priority={index === 0}
                            returnToQuery={returnToQuery || undefined}
                            tagsLoading={detailsLoading}
                          />
                        </li>
                      );
                    })}
                  </ul>

                  <Pagination
                    currentPage={state.page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
