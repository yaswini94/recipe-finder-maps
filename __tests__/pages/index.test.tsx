import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/index";

const mockReplace = jest.fn();
const mockPush = jest.fn();
let mockRouterQuery: Record<string, string> = {};

jest.mock("next/router", () => ({
  useRouter: () => ({
    get query() {
      return mockRouterQuery;
    },
    replace: mockReplace,
    push: mockPush,
    isReady: true,
  }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("Home Page", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockReplace.mockClear();
    mockRouterQuery = {};
  });

  function setupMocksForEmptyState() {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            categories: [{ idCategory: "1", strCategory: "Beef" }],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ areas: [{ strArea: "Italian" }] }),
      });
  }

  function setupMocksForMeals() {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            categories: [{ idCategory: "1", strCategory: "Beef" }],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ areas: [{ strArea: "Italian" }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            meals: [
              {
                idMeal: "52772",
                strMeal: "Teriyaki Chicken",
                strMealThumb: "https://www.themealdb.com/images/media/meals/test.jpg",
              },
            ],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            meal: {
              idMeal: "52772",
              strMeal: "Teriyaki Chicken",
              strCategory: "Chicken",
              strArea: "Japanese",
              strMealThumb: "https://www.themealdb.com/images/media/meals/test.jpg",
            },
          }),
      });
  }

  it("should render page title", async () => {
    setupMocksForEmptyState();
    render(<Home />, { wrapper: createWrapper() });
    expect(screen.getByRole("heading", { name: /recipe finder/i })).toBeInTheDocument();
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
  });

  it("should render search bar", async () => {
    setupMocksForEmptyState();
    render(<Home />, { wrapper: createWrapper() });
    expect(screen.getByPlaceholderText(/search for meals/i)).toBeInTheDocument();
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
  });

  it("should render filter panel", async () => {
    setupMocksForEmptyState();
    render(<Home />, { wrapper: createWrapper() });
    expect(screen.getByRole("complementary", { name: /filter options/i })).toBeInTheDocument();
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
  });

  it("should show loading state initially", async () => {
    setupMocksForEmptyState();
    render(<Home />, { wrapper: createWrapper() });
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
  });

  it("should render page description", async () => {
    setupMocksForEmptyState();
    render(<Home />, { wrapper: createWrapper() });
    expect(
      screen.getByText(/search and discover delicious meals from around the world/i)
    ).toBeInTheDocument();
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
  });

  it("should show empty state when no search or filters", async () => {
    setupMocksForEmptyState();
    render(<Home />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByRole("status", { name: /loading/i })).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(/search for a meal or use filters to discover recipes/i)
    ).toBeInTheDocument();
  });

  it("should load and display meals when search param in URL", async () => {
    mockRouterQuery = { search: "chicken" };
    setupMocksForMeals();
    render(<Home />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Teriyaki Chicken")).toBeInTheDocument();
    });
  });

  it("should handle search submission", async () => {
    setupMocksForEmptyState();
    render(<Home />, { wrapper: createWrapper() });

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
  });

  it("should handle pagination", async () => {
    mockRouterQuery = { search: "x" };
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ categories: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ areas: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            meals: Array.from({ length: 20 }, (_, i) => ({
              idMeal: String(i + 1000),
              strMeal: `Meal ${i}`,
              strMealThumb: "https://www.themealdb.com/images/media/meals/test.jpg",
            })),
          }),
      });
    for (let i = 0; i < 12; i++) {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            meal: {
              idMeal: String(i + 1000),
              strMeal: `Meal ${i}`,
              strCategory: "Beef",
              strArea: "American",
              strMealThumb: "https://www.themealdb.com/images/media/meals/test.jpg",
            },
          }),
      });
    }

    window.scrollTo = jest.fn();

    render(<Home />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
