import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MealDetailPage from "@/pages/meals/[id]";

const mockPush = jest.fn();
let mockQuery: Record<string, string | undefined> = { id: "52772" };

jest.mock("next/router", () => ({
  useRouter: () => ({
    query: mockQuery,
    push: mockPush,
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

const mockMeal = {
  idMeal: "52772",
  strMeal: "Teriyaki Chicken Casserole",
  strCategory: "Chicken",
  strArea: "Japanese",
  strInstructions: "Step 1: Cook the chicken.\nStep 2: Add sauce.\nStep 3: Serve hot.",
  strMealThumb: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  strTags: "Meat,Casserole",
  strYoutube: "https://www.youtube.com/watch?v=abc12345678",
  strIngredient1: "Chicken",
  strMeasure1: "500g",
  strIngredient2: "Soy sauce",
  strMeasure2: "2 tbsp",
  strIngredient3: "",
  strMeasure3: "",
};

describe("MealDetailPage", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockQuery = { id: "52772" };
  });

  it("should show loading state initially", () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));
    render(<MealDetailPage />, { wrapper: createWrapper() });
    expect(screen.getByText(/loading recipe details/i)).toBeInTheDocument();
  });

  it("should display meal details after loading", async () => {
    mockQuery = { id: "99994" };
    const mealForDetails = {
      ...mockMeal,
      idMeal: "99994",
      strCategory: "Beef",
      strArea: "British",
      strIngredient1: "Onion",
      strMeasure1: "1",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meal: mealForDetails }),
    });

    render(<MealDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /teriyaki chicken casserole/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Beef")).toBeInTheDocument();
    expect(screen.getByText("British")).toBeInTheDocument();
  });

  it("should display ingredients", async () => {
    mockQuery = { id: "99993" };
    const mealForIngredients = {
      ...mockMeal,
      idMeal: "99993",
      strIngredient1: "Tofu",
      strMeasure1: "300g",
      strIngredient2: "Soy sauce",
      strMeasure2: "2 tbsp",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meal: mealForIngredients }),
    });

    render(<MealDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Tofu")).toBeInTheDocument();
    });

    expect(screen.getByText("300g")).toBeInTheDocument();
    expect(screen.getByText("Soy sauce")).toBeInTheDocument();
    expect(screen.getByText("2 tbsp")).toBeInTheDocument();
  });

  it("should display instructions", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meal: mockMeal }),
    });

    render(<MealDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/step 1: cook the chicken/i)).toBeInTheDocument();
    });
  });

  it("should display tags", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meal: mockMeal }),
    });

    render(<MealDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Meat")).toBeInTheDocument();
    });

    expect(screen.getByText("Casserole")).toBeInTheDocument();
  });

  it("should display YouTube embed and link", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meal: mockMeal }),
    });

    render(<MealDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTitle(/video tutorial/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /open.*youtube/i })).toBeInTheDocument();
    });
  });

  it("should display back link", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meal: mockMeal }),
    });

    render(<MealDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /back to recipes/i })).toBeInTheDocument();
    });
  });

  it("should handle meal not found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meal: null }),
    });

    render(<MealDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/meal not found/i)).toBeInTheDocument();
    });
  });

  it("should handle API error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<MealDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("should handle retry after error", async () => {
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meal: mockMeal }),
    });

    render(<MealDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /try again/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /teriyaki chicken casserole/i })
      ).toBeInTheDocument();
    });
  });

  it("should not load when id is undefined", () => {
    mockQuery = {};
    mockFetch.mockClear();

    render(<MealDetailPage />, { wrapper: createWrapper() });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should handle meal without youtube link", async () => {
    mockQuery = { id: "99991" };
    const mealWithoutYoutube = { ...mockMeal, idMeal: "99991", strYoutube: "" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meal: mealWithoutYoutube }),
    });

    render(<MealDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /teriyaki chicken casserole/i })
      ).toBeInTheDocument();
    });

    expect(screen.queryByTitle(/video tutorial/i)).not.toBeInTheDocument();
  });

  it("should handle meal without tags", async () => {
    mockQuery = { id: "99992" };
    const mealWithoutTags = { ...mockMeal, idMeal: "99992", strTags: null };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meal: mealWithoutTags }),
    });

    render(<MealDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /teriyaki chicken casserole/i })
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Meat")).not.toBeInTheDocument();
  });
});
