import type { NextApiRequest } from "next";
import handler from "@/pages/api/meals/[id]";
import { createMockRes } from "./createMockRes";

jest.mock("@/lib/api", () => ({
  getMealById: jest.fn(),
}));

const { getMealById } = jest.requireMock("@/lib/api");

function createMockReq(query: NextApiRequest["query"] = {}, method = "GET"): NextApiRequest {
  return { method, query } as NextApiRequest;
}

describe("GET /api/meals/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 405 for non-GET", async () => {
    const req = createMockReq({ id: "52772" }, "POST");
    const res = createMockRes();

    await handler(req, res);

    expect(res._status).toBe(405);
    expect(res._json).toEqual({ error: "Method not allowed" });
  });

  it("should return 400 when id is missing", async () => {
    const req = createMockReq({});
    const res = createMockRes();

    await handler(req, res);

    expect(res._status).toBe(400);
    expect(res._json).toEqual({ error: "Missing meal id" });
  });

  it("should return meal when found", async () => {
    const meal = {
      idMeal: "52772",
      strMeal: "Teriyaki Chicken",
      strCategory: "Chicken",
      strArea: "Japanese",
      strMealThumb: "url",
    };
    (getMealById as jest.Mock).mockResolvedValue({ ok: true, data: meal });

    const req = createMockReq({ id: "52772" });
    const res = createMockRes();

    await handler(req, res);

    expect(getMealById).toHaveBeenCalledWith("52772");
    expect(res._status).toBe(200);
    expect(res._json).toEqual({ meal });
  });

  it("should return 404 when meal not found", async () => {
    (getMealById as jest.Mock).mockResolvedValue({
      ok: false,
      error: { code: "HTTP_404", message: "Not found" },
    });

    const req = createMockReq({ id: "99999" });
    const res = createMockRes();

    await handler(req, res);

    expect(res._status).toBe(404);
    expect(res._json).toEqual({ error: "Not found" });
  });

  it("should return 500 on API error", async () => {
    (getMealById as jest.Mock).mockResolvedValue({
      ok: false,
      error: { code: "HTTP_500", message: "Server error" },
    });

    const req = createMockReq({ id: "1" });
    const res = createMockRes();

    await handler(req, res);

    expect(res._status).toBe(500);
  });
});
