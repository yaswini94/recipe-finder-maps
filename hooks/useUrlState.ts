import { useRouter } from "next/router";
import { useCallback, useRef, useEffect } from "react";
import { parseQueryParams, buildQueryParams } from "@/lib/queryParams";
import type { SearchState } from "@/types/query";

const DEBOUNCE_MS = 300;

export function useUrlState() {
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const state = router.isReady ? parseQueryParams(router.query) : parseQueryParams({});

  const updateUrl = useCallback(
    (newState: Partial<SearchState>, options?: { replace?: boolean; debounce?: boolean }) => {
      const merged: SearchState = {
        search: newState.search ?? state.search,
        categories: newState.categories ?? state.categories,
        areas: newState.areas ?? state.areas,
        page: newState.page ?? state.page,
      };

      const params = buildQueryParams(merged);
      const queryString = params.toString();
      const url = queryString ? `/?${queryString}` : "/";

      const navigate = () => {
        if (options?.replace !== false) {
          router.replace(url, undefined, { shallow: true });
        } else {
          router.push(url, undefined, { shallow: true });
        }
      };

      if (options?.debounce) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(navigate, DEBOUNCE_MS);
      } else {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }
        navigate();
      }
    },
    [router, state]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const setSearch = useCallback(
    (search: string) => {
      updateUrl({ search, page: 1, categories: [], areas: [] }, { debounce: true });
    },
    [updateUrl]
  );

  const toggleCategory = useCallback(
    (category: string) => {
      const newCategories = state.categories.includes(category)
        ? state.categories.filter((c) => c !== category)
        : [...state.categories, category];
      updateUrl({ categories: newCategories, page: 1 });
    },
    [state.categories, updateUrl]
  );

  const toggleArea = useCallback(
    (area: string) => {
      const newAreas = state.areas.includes(area)
        ? state.areas.filter((a) => a !== area)
        : [...state.areas, area];
      updateUrl({ areas: newAreas, page: 1 });
    },
    [state.areas, updateUrl]
  );

  const removeCategory = useCallback(
    (category: string) => {
      const newCategories = state.categories.filter((c) => c !== category);
      updateUrl({ categories: newCategories, page: 1 });
    },
    [state.categories, updateUrl]
  );

  const removeArea = useCallback(
    (area: string) => {
      const newAreas = state.areas.filter((a) => a !== area);
      updateUrl({ areas: newAreas, page: 1 });
    },
    [state.areas, updateUrl]
  );

  const setPage = useCallback(
    (page: number) => {
      updateUrl({ page });
    },
    [updateUrl]
  );

  const clearFilters = useCallback(() => {
    updateUrl({ categories: [], areas: [], page: 1 });
  }, [updateUrl]);

  return {
    state,
    setSearch,
    toggleCategory,
    toggleArea,
    removeCategory,
    removeArea,
    setPage,
    clearFilters,
  };
}
