import {
  fetchApi,
  searchMeals,
  getMealById,
  getMealsByCategory,
  getMealsByArea,
  getCategories,
  getAreas,
  getAllMeals,
  extractIngredients,
  filterMeals,
  paginateMeals,
} from "./api";
import type { Meal, MealSummary } from "@/types/meal";

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

describe("fetchApi", () => {
  it("should return data on successful fetch", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meals: [] }),
    });

    const result = await fetchApi("/test");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ meals: [] });
    }
  });

  it("should return error on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await fetchApi("/test");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("HTTP_404");
    }
  });

  it("should return error on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchApi("/test");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NETWORK_ERROR");
      expect(result.error.message).toBe("Network error");
    }
  });

  it("should handle abort signal", async () => {
    const abortError = new Error("Aborted");
    abortError.name = "AbortError";
    mockFetch.mockRejectedValueOnce(abortError);

    const result = await fetchApi("/test");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("ABORTED");
    }
  });

  it("should handle non-Error throws", async () => {
    mockFetch.mockRejectedValueOnce("string error");

    const result = await fetchApi("/test");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NETWORK_ERROR");
      expect(result.error.message).toBe("Network error occurred");
    }
  });
});

describe("searchMeals", () => {
  it("should return meals array on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          meals: [{ idMeal: "1", strMeal: "Test", strMealThumb: "url" }],
        }),
    });

    const result = await searchMeals("test");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0].strMeal).toBe("Test");
    }
  });

  it("should return empty array when no meals found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meals: null }),
    });

    const result = await searchMeals("nonexistent");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual([]);
    }
  });

  it("should propagate errors", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const result = await searchMeals("test");
    expect(result.ok).toBe(false);
  });
});

describe("getMealById", () => {
  it("should return meal on success", async () => {
    const mockMeal = { idMeal: "123", strMeal: "Test Meal" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meals: [mockMeal] }),
    });

    const result = await getMealById("123");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual(mockMeal);
    }
  });

  it("should return null when meal not found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meals: null }),
    });

    const result = await getMealById("999");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toBeNull();
    }
  });
});

describe("getMealsByCategory", () => {
  it("should return meals for category", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          meals: [{ idMeal: "1", strMeal: "Beef Meal", strMealThumb: "url" }],
        }),
    });

    const result = await getMealsByCategory("Beef");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
    }
  });

  it("should return empty array when no meals found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meals: null }),
    });

    const result = await getMealsByCategory("Unknown");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual([]);
    }
  });
});

describe("getMealsByArea", () => {
  it("should return meals for area", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          meals: [{ idMeal: "1", strMeal: "Italian Meal", strMealThumb: "url" }],
        }),
    });

    const result = await getMealsByArea("Italian");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
    }
  });

  it("should return empty array when no meals found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meals: null }),
    });

    const result = await getMealsByArea("Unknown");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual([]);
    }
  });
});

describe("getCategories", () => {
  it("should return categories", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          categories: [{ idCategory: "1", strCategory: "Beef" }],
        }),
    });

    const result = await getCategories();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
    }
  });

  it("should return empty array when no categories", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ categories: null }),
    });

    const result = await getCategories();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual([]);
    }
  });
});

describe("getAreas", () => {
  it("should return areas", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          meals: [{ strArea: "Italian" }, { strArea: "Mexican" }],
        }),
    });

    const result = await getAreas();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(2);
    }
  });

  it("should return empty array when no areas", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meals: null }),
    });

    const result = await getAreas();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual([]);
    }
  });
});

describe("getAllMeals", () => {
  it("should aggregate meals from all letters", async () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    alphabet.forEach((letter, i) => {
      if (letter === "a") {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              meals: [{ idMeal: `${i}`, strMeal: `Meal ${letter}`, strMealThumb: "url" }],
            }),
        });
      } else {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ meals: null }),
        });
      }
    });

    const result = await getAllMeals();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("should handle abort during iteration", async () => {
    const abortError = new Error("Aborted");
    abortError.name = "AbortError";
    mockFetch.mockRejectedValueOnce(abortError);

    const result = await getAllMeals();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("ABORTED");
    }
  });

  it("should continue on non-abort errors", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
    for (let i = 1; i < 26; i++) {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: null }),
      });
    }

    const result = await getAllMeals();
    expect(result.ok).toBe(true);
  });
});

describe("extractIngredients", () => {
  it("should extract ingredients from meal", () => {
    const meal = {
      strIngredient1: "Chicken",
      strMeasure1: "500g",
      strIngredient2: "Salt",
      strMeasure2: "1 tsp",
      strIngredient3: "",
      strMeasure3: "",
    } as unknown as Meal;

    const ingredients = extractIngredients(meal);
    expect(ingredients).toHaveLength(2);
    expect(ingredients[0]).toEqual({ ingredient: "Chicken", measure: "500g" });
    expect(ingredients[1]).toEqual({ ingredient: "Salt", measure: "1 tsp" });
  });

  it("should handle null measures", () => {
    const meal = {
      strIngredient1: "Chicken",
      strMeasure1: null,
    } as unknown as Meal;

    const ingredients = extractIngredients(meal);
    expect(ingredients).toHaveLength(1);
    expect(ingredients[0]).toEqual({ ingredient: "Chicken", measure: "" });
  });

  it("should skip null ingredients", () => {
    const meal = {
      strIngredient1: null,
      strMeasure1: "500g",
    } as unknown as Meal;

    const ingredients = extractIngredients(meal);
    expect(ingredients).toHaveLength(0);
  });

  it("should trim whitespace", () => {
    const meal = {
      strIngredient1: "  Chicken  ",
      strMeasure1: "  500g  ",
    } as unknown as Meal;

    const ingredients = extractIngredients(meal);
    expect(ingredients[0]).toEqual({ ingredient: "Chicken", measure: "500g" });
  });
});

describe("filterMeals", () => {
  const meals: MealSummary[] = [
    { idMeal: "1", strMeal: "Beef Stew", strMealThumb: "url1" },
    { idMeal: "2", strMeal: "Chicken Curry", strMealThumb: "url2" },
    { idMeal: "3", strMeal: "Pasta", strMealThumb: "url3" },
  ];

  const mealDetails = new Map([
    ["1", { category: "Beef", area: "British" }],
    ["2", { category: "Chicken", area: "Indian" }],
    ["3", { category: "Pasta", area: "Italian" }],
  ]);

  it("should return all meals when no filters", () => {
    const result = filterMeals(meals, mealDetails, [], []);
    expect(result).toHaveLength(3);
  });

  it("should filter by category", () => {
    const result = filterMeals(meals, mealDetails, ["Beef"], []);
    expect(result).toHaveLength(1);
    expect(result[0].idMeal).toBe("1");
  });

  it("should filter by area", () => {
    const result = filterMeals(meals, mealDetails, [], ["Italian"]);
    expect(result).toHaveLength(1);
    expect(result[0].idMeal).toBe("3");
  });

  it("should filter by both category and area", () => {
    const result = filterMeals(meals, mealDetails, ["Chicken"], ["Indian"]);
    expect(result).toHaveLength(1);
    expect(result[0].idMeal).toBe("2");
  });

  it("should return empty when no matches", () => {
    const result = filterMeals(meals, mealDetails, ["Dessert"], []);
    expect(result).toHaveLength(0);
  });

  it("should exclude meals without details", () => {
    const mealsWithUnknown: MealSummary[] = [
      ...meals,
      { idMeal: "4", strMeal: "Unknown", strMealThumb: "url4" },
    ];
    const result = filterMeals(mealsWithUnknown, mealDetails, ["Beef"], []);
    expect(result).toHaveLength(1);
  });
});

describe("paginateMeals", () => {
  const meals: MealSummary[] = Array.from({ length: 25 }, (_, i) => ({
    idMeal: String(i + 1),
    strMeal: `Meal ${i + 1}`,
    strMealThumb: `url${i + 1}`,
  }));

  it("should return first page", () => {
    const result = paginateMeals(meals, 1, 10);
    expect(result.meals).toHaveLength(10);
    expect(result.totalPages).toBe(3);
    expect(result.meals[0].idMeal).toBe("1");
  });

  it("should return second page", () => {
    const result = paginateMeals(meals, 2, 10);
    expect(result.meals).toHaveLength(10);
    expect(result.meals[0].idMeal).toBe("11");
  });

  it("should return last page with remaining items", () => {
    const result = paginateMeals(meals, 3, 10);
    expect(result.meals).toHaveLength(5);
    expect(result.meals[0].idMeal).toBe("21");
  });

  it("should clamp page to valid range", () => {
    const result = paginateMeals(meals, 100, 10);
    expect(result.meals).toHaveLength(5);
    expect(result.totalPages).toBe(3);
  });

  it("should handle page less than 1", () => {
    const result = paginateMeals(meals, 0, 10);
    expect(result.meals).toHaveLength(10);
    expect(result.meals[0].idMeal).toBe("1");
  });

  it("should return at least 1 total page for empty array", () => {
    const result = paginateMeals([], 1, 10);
    expect(result.meals).toHaveLength(0);
    expect(result.totalPages).toBe(1);
  });
});
