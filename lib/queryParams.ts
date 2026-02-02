import type { ParsedUrlQuery } from "querystring";
import type { SearchState } from "@/types/query";

const DEFAULTS: SearchState = {
  search: "",
  categories: [],
  areas: [],
  page: 1,
};

const ITEMS_PER_PAGE = 12;

export { ITEMS_PER_PAGE };

function parseString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value) && typeof value[0] === "string") return value[0].trim();
  return "";
}

function parseStringArray(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (Array.isArray(value)) {
    return value
      .filter((v): v is string => typeof v === "string")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function parsePositiveInt(value: unknown, fallback: number): number {
  const str = parseString(value);
  if (!str) return fallback;
  const num = parseInt(str, 10);
  if (Number.isNaN(num) || num < 1) return fallback;
  return num;
}

export function parseQueryParams(query: ParsedUrlQuery): SearchState {
  return {
    search: parseString(query.search),
    categories: parseStringArray(query.categories),
    areas: parseStringArray(query.areas),
    page: parsePositiveInt(query.page, DEFAULTS.page),
  };
}

export function buildQueryParams(state: Partial<SearchState>): URLSearchParams {
  const params = new URLSearchParams();

  if (state.search && state.search.trim()) {
    params.set("search", state.search.trim());
  }

  if (state.categories && state.categories.length > 0) {
    params.set("categories", state.categories.join(","));
  }

  if (state.areas && state.areas.length > 0) {
    params.set("areas", state.areas.join(","));
  }

  if (state.page && state.page > 1) {
    params.set("page", state.page.toString());
  }

  return params;
}

export function stateToQueryString(state: Partial<SearchState>): string {
  const params = buildQueryParams(state);
  const str = params.toString();
  return str ? `?${str}` : "";
}

export function isDefaultState(state: SearchState): boolean {
  return (
    state.search === DEFAULTS.search &&
    state.categories.length === 0 &&
    state.areas.length === 0 &&
    state.page === DEFAULTS.page
  );
}
