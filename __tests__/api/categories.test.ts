import type { NextApiRequest } from "next";
import handler from "@/pages/api/categories";
import { createMockRes } from "./createMockRes";

jest.mock("@/lib/api", () => ({
  getCategories: jest.fn(),
}));

const { getCategories } = jest.requireMock("@/lib/api");

function createMockReq(method = "GET"): NextApiRequest {
  return { method } as NextApiRequest;
}

describe("GET /api/categories", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 405 for non-GET", async () => {
    const req = createMockReq("POST");
    const res = createMockRes();

    await handler(req, res);

    expect(res._status).toBe(405);
    expect(res._json).toEqual({ error: "Method not allowed" });
  });

  it("should return categories on success", async () => {
    const categories = [
      { idCategory: "1", strCategory: "Beef", strCategoryThumb: "", strCategoryDescription: "" },
    ];
    (getCategories as jest.Mock).mockResolvedValue({ ok: true, data: categories });

    const req = createMockReq();
    const res = createMockRes();

    await handler(req, res);

    expect(getCategories).toHaveBeenCalled();
    expect(res._status).toBe(200);
    expect(res._json).toEqual({ categories });
  });

  it("should return 500 when API fails", async () => {
    (getCategories as jest.Mock).mockResolvedValue({
      ok: false,
      error: { message: "Network error" },
    });

    const req = createMockReq();
    const res = createMockRes();

    await handler(req, res);

    expect(res._status).toBe(500);
    expect(res._json).toEqual({ error: "Network error" });
  });
});
