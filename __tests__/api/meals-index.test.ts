import type { NextApiRequest } from "next";
import handler from "@/pages/api/meals/index";
import { createMockRes } from "./createMockRes";

jest.mock("@/lib/api", () => ({
  searchMeals: jest.fn(),
  getMealsByCategory: jest.fn(),
  getMealsByArea: jest.fn(),
}));

const { searchMeals, getMealsByCategory, getMealsByArea } = jest.requireMock("@/lib/api");

function createMockReq(query: NextApiRequest["query"] = {}, method = "GET"): NextApiRequest {
  return { method, query } as NextApiRequest;
}

describe("GET /api/meals", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 405 for non-GET", async () => {
    const req = createMockReq({}, "POST");
    const res = createMockRes();

    await handler(req, res);

    expect(res._status).toBe(405);
    expect(res._json).toEqual({ error: "Method not allowed" });
  });

  it("should return empty meals when no search or filters", async () => {
    const req = createMockReq({});
    const res = createMockRes();

    await handler(req, res);

    expect(res._status).toBe(200);
    expect(res._json).toEqual({ meals: [] });
    expect(searchMeals).not.toHaveBeenCalled();
  });

  it("should return search results when search param is provided", async () => {
    (searchMeals as jest.Mock).mockResolvedValue({
      ok: true,
      data: [{ idMeal: "1", strMeal: "Pasta", strMealThumb: "url" }],
    });

    const req = createMockReq({ search: "pasta" });
    const res = createMockRes();

    await handler(req, res);

    expect(searchMeals).toHaveBeenCalledWith("pasta");
    expect(res._status).toBe(200);
    expect(res._json).toEqual({
      meals: [{ idMeal: "1", strMeal: "Pasta", strMealThumb: "url" }],
    });
  });

  it("should return 500 when search fails", async () => {
    (searchMeals as jest.Mock).mockResolvedValue({
      ok: false,
      error: { message: "API error" },
    });

    const req = createMockReq({ search: "x" });
    const res = createMockRes();

    await handler(req, res);

    expect(res._status).toBe(500);
    expect(res._json).toEqual({ error: "API error" });
  });

  it("should return category results when categories param is provided", async () => {
    (getMealsByCategory as jest.Mock).mockResolvedValue({
      ok: true,
      data: [{ idMeal: "2", strMeal: "Beef Meal", strMealThumb: "url" }],
    });

    const req = createMockReq({ categories: "Beef" });
    const res = createMockRes();

    await handler(req, res);

    expect(getMealsByCategory).toHaveBeenCalledWith("Beef");
    expect(res._status).toBe(200);
    expect((res._json as { meals: unknown[] }).meals).toHaveLength(1);
  });

  it("should return area results when areas param is provided", async () => {
    (getMealsByArea as jest.Mock).mockResolvedValue({
      ok: true,
      data: [{ idMeal: "3", strMeal: "Italian Meal", strMealThumb: "url" }],
    });

    const req = createMockReq({ areas: "Italian" });
    const res = createMockRes();

    await handler(req, res);

    expect(getMealsByArea).toHaveBeenCalledWith("Italian");
    expect(res._status).toBe(200);
    expect((res._json as { meals: unknown[] }).meals).toHaveLength(1);
  });
});
