import {
  parseQueryParams,
  buildQueryParams,
  stateToQueryString,
  isDefaultState,
  ITEMS_PER_PAGE,
} from "./queryParams";

describe("queryParams", () => {
  describe("parseQueryParams", () => {
    it("should return defaults for empty query", () => {
      const result = parseQueryParams({});
      expect(result).toEqual({
        search: "",
        categories: [],
        areas: [],
        page: 1,
      });
    });

    it("should parse search string", () => {
      const result = parseQueryParams({ search: "chicken" });
      expect(result.search).toBe("chicken");
    });

    it("should trim search string", () => {
      const result = parseQueryParams({ search: "  pasta  " });
      expect(result.search).toBe("pasta");
    });

    it("should handle search as array (takes first)", () => {
      const result = parseQueryParams({ search: ["beef", "pork"] });
      expect(result.search).toBe("beef");
    });

    it("should parse categories from comma-separated string", () => {
      const result = parseQueryParams({ categories: "Beef,Chicken,Dessert" });
      expect(result.categories).toEqual(["Beef", "Chicken", "Dessert"]);
    });

    it("should parse categories from array", () => {
      const result = parseQueryParams({ categories: ["Beef", "Chicken"] });
      expect(result.categories).toEqual(["Beef", "Chicken"]);
    });

    it("should handle categories with whitespace", () => {
      const result = parseQueryParams({ categories: " Beef , Chicken " });
      expect(result.categories).toEqual(["Beef", "Chicken"]);
    });

    it("should filter empty category values", () => {
      const result = parseQueryParams({ categories: "Beef,,Chicken," });
      expect(result.categories).toEqual(["Beef", "Chicken"]);
    });

    it("should parse areas from comma-separated string", () => {
      const result = parseQueryParams({ areas: "Italian,Mexican" });
      expect(result.areas).toEqual(["Italian", "Mexican"]);
    });

    it("should parse areas from array", () => {
      const result = parseQueryParams({ areas: ["Italian", "Mexican"] });
      expect(result.areas).toEqual(["Italian", "Mexican"]);
    });

    it("should parse valid page number", () => {
      const result = parseQueryParams({ page: "5" });
      expect(result.page).toBe(5);
    });

    it("should fallback to 1 for invalid page number", () => {
      const result = parseQueryParams({ page: "invalid" });
      expect(result.page).toBe(1);
    });

    it("should fallback to 1 for negative page number", () => {
      const result = parseQueryParams({ page: "-5" });
      expect(result.page).toBe(1);
    });

    it("should fallback to 1 for zero page number", () => {
      const result = parseQueryParams({ page: "0" });
      expect(result.page).toBe(1);
    });

    it("should handle page as array (takes first)", () => {
      const result = parseQueryParams({ page: ["3", "5"] });
      expect(result.page).toBe(3);
    });

    it("should parse full query with all params", () => {
      const result = parseQueryParams({
        search: "pasta",
        categories: "Italian,Dessert",
        areas: "Mexican",
        page: "2",
      });
      expect(result).toEqual({
        search: "pasta",
        categories: ["Italian", "Dessert"],
        areas: ["Mexican"],
        page: 2,
      });
    });

    it("should handle non-string values gracefully", () => {
      const result = parseQueryParams({
        search: undefined,
        categories: undefined,
        areas: undefined,
        page: undefined,
      });
      expect(result).toEqual({
        search: "",
        categories: [],
        areas: [],
        page: 1,
      });
    });
  });

  describe("buildQueryParams", () => {
    it("should return empty params for default state", () => {
      const result = buildQueryParams({});
      expect(result.toString()).toBe("");
    });

    it("should include search when non-empty", () => {
      const result = buildQueryParams({ search: "chicken" });
      expect(result.get("search")).toBe("chicken");
    });

    it("should trim search value", () => {
      const result = buildQueryParams({ search: "  beef  " });
      expect(result.get("search")).toBe("beef");
    });

    it("should not include empty search", () => {
      const result = buildQueryParams({ search: "   " });
      expect(result.has("search")).toBe(false);
    });

    it("should include categories as comma-separated", () => {
      const result = buildQueryParams({ categories: ["Beef", "Chicken"] });
      expect(result.get("categories")).toBe("Beef,Chicken");
    });

    it("should not include empty categories array", () => {
      const result = buildQueryParams({ categories: [] });
      expect(result.has("categories")).toBe(false);
    });

    it("should include areas as comma-separated", () => {
      const result = buildQueryParams({ areas: ["Italian", "Mexican"] });
      expect(result.get("areas")).toBe("Italian,Mexican");
    });

    it("should not include empty areas array", () => {
      const result = buildQueryParams({ areas: [] });
      expect(result.has("areas")).toBe(false);
    });

    it("should include page when greater than 1", () => {
      const result = buildQueryParams({ page: 3 });
      expect(result.get("page")).toBe("3");
    });

    it("should not include page 1 (default)", () => {
      const result = buildQueryParams({ page: 1 });
      expect(result.has("page")).toBe(false);
    });

    it("should build full query params", () => {
      const result = buildQueryParams({
        search: "pasta",
        categories: ["Italian"],
        areas: ["Mexican", "Chinese"],
        page: 2,
      });
      expect(result.get("search")).toBe("pasta");
      expect(result.get("categories")).toBe("Italian");
      expect(result.get("areas")).toBe("Mexican,Chinese");
      expect(result.get("page")).toBe("2");
    });
  });

  describe("stateToQueryString", () => {
    it("should return empty string for default state", () => {
      const result = stateToQueryString({});
      expect(result).toBe("");
    });

    it("should return query string with ? prefix", () => {
      const result = stateToQueryString({ search: "chicken" });
      expect(result).toBe("?search=chicken");
    });

    it("should URL encode special characters", () => {
      const result = stateToQueryString({ search: "chicken & beef" });
      expect(result).toContain("search=chicken");
      expect(result).toContain("%26");
    });
  });

  describe("isDefaultState", () => {
    it("should return true for default state", () => {
      const result = isDefaultState({
        search: "",
        categories: [],
        areas: [],
        page: 1,
      });
      expect(result).toBe(true);
    });

    it("should return false when search is set", () => {
      const result = isDefaultState({
        search: "chicken",
        categories: [],
        areas: [],
        page: 1,
      });
      expect(result).toBe(false);
    });

    it("should return false when categories are set", () => {
      const result = isDefaultState({
        search: "",
        categories: ["Beef"],
        areas: [],
        page: 1,
      });
      expect(result).toBe(false);
    });

    it("should return false when areas are set", () => {
      const result = isDefaultState({
        search: "",
        categories: [],
        areas: ["Italian"],
        page: 1,
      });
      expect(result).toBe(false);
    });

    it("should return false when page is not 1", () => {
      const result = isDefaultState({
        search: "",
        categories: [],
        areas: [],
        page: 2,
      });
      expect(result).toBe(false);
    });
  });

  describe("ITEMS_PER_PAGE", () => {
    it("should export ITEMS_PER_PAGE constant", () => {
      expect(ITEMS_PER_PAGE).toBe(12);
    });
  });
});
