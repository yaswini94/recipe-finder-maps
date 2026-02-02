import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useMealsQuery } from "./useMealsQuery";

const mockFetch = jest.fn();
global.fetch = mockFetch;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 5 * 60 * 1000 },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

const defaultMealsResponse = {
  meals: [
    {
      idMeal: "52772",
      strMeal: "Teriyaki Chicken",
      strMealThumb: "https://example.com/thumb.jpg",
    },
  ],
};

const defaultCategoriesResponse = { categories: [{ idCategory: "1", strCategory: "Beef" }] };
const defaultAreasResponse = { areas: [{ strArea: "Italian" }] };
const defaultMealDetailResponse = {
  meal: {
    idMeal: "52772",
    strMeal: "Teriyaki Chicken",
    strCategory: "Chicken",
    strArea: "Japanese",
    strMealThumb: "https://example.com/thumb.jpg",
  },
};

function mockAllEndpoints() {
  mockFetch
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(defaultCategoriesResponse) })
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(defaultAreasResponse) })
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(defaultMealsResponse) })
    .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(defaultMealDetailResponse) });
}

describe("useMealsQuery", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should return empty meals when no search or filters (no list API call)", async () => {
    mockFetch.mockImplementation((url: string) => {
      if (typeof url === "string" && url.includes("categories")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(defaultCategoriesResponse),
        });
      }
      if (typeof url === "string" && url.includes("areas")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(defaultAreasResponse) });
      }
      return Promise.reject(new Error("Unexpected fetch: " + url));
    });

    const { result } = renderHook(
      () => useMealsQuery({ search: "", categories: [], areas: [], page: 1 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.categories).toHaveLength(1);
      expect(result.current.areas).toHaveLength(1);
    });

    expect(result.current.meals).toHaveLength(0);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(mockFetch.mock.calls.length).toBe(2);
  });

  it("should return meals and filters after loading when has search", async () => {
    mockAllEndpoints();

    const { result } = renderHook(
      () => useMealsQuery({ search: "chicken", categories: [], areas: [], page: 1 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.meals).toHaveLength(1);
    expect(result.current.meals[0].strMeal).toBe("Teriyaki Chicken");
    expect(result.current.categories).toHaveLength(1);
    expect(result.current.areas).toHaveLength(1);
    expect(result.current.totalPages).toBe(1);
  });

  it("should use cached data on re-render with same params (no extra API calls)", async () => {
    mockAllEndpoints();

    const Wrapper = createWrapper();
    const { result, rerender } = renderHook(
      () => useMealsQuery({ search: "chicken", categories: [], areas: [], page: 1 }),
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const callCountAfterFirstLoad = mockFetch.mock.calls.length;
    expect(callCountAfterFirstLoad).toBeGreaterThan(0);

    rerender();

    await waitFor(() => {
      expect(result.current.meals).toHaveLength(1);
    });

    expect(mockFetch.mock.calls.length).toBe(callCountAfterFirstLoad);
  });

  it("should refetch when search params change (new query key)", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(defaultCategoriesResponse) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(defaultAreasResponse) });

    const Wrapper = createWrapper();
    const { result, rerender } = renderHook(
      ({ search }) => useMealsQuery({ search, categories: [], areas: [], page: 1 }),
      {
        wrapper: Wrapper,
        initialProps: { search: "" },
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.meals).toHaveLength(0);
    const callCountInitial = mockFetch.mock.calls.length;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(defaultMealsResponse),
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(defaultMealDetailResponse),
    });

    rerender({ search: "chicken" });

    await waitFor(() => {
      expect(result.current.meals).toHaveLength(1);
    });

    expect(mockFetch.mock.calls.length).toBeGreaterThan(callCountInitial);
  });
});
