import type { NextApiRequest } from "next";
import handler from "@/pages/api/areas";
import { createMockRes } from "./createMockRes";

jest.mock("@/lib/api", () => ({
  getAreas: jest.fn(),
}));

const { getAreas } = jest.requireMock("@/lib/api");

function createMockReq(method = "GET"): NextApiRequest {
  return { method } as NextApiRequest;
}

describe("GET /api/areas", () => {
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

  it("should return areas on success", async () => {
    const areas = [{ strArea: "Italian" }, { strArea: "Mexican" }];
    (getAreas as jest.Mock).mockResolvedValue({ ok: true, data: areas });

    const req = createMockReq();
    const res = createMockRes();

    await handler(req, res);

    expect(getAreas).toHaveBeenCalled();
    expect(res._status).toBe(200);
    expect(res._json).toEqual({ areas });
  });

  it("should return 500 when API fails", async () => {
    (getAreas as jest.Mock).mockResolvedValue({
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
