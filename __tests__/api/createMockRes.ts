import type { NextApiResponse } from "next";

export function createMockRes<T>(): NextApiResponse<T> & {
  _status: number;
  _json: unknown;
  _getHeader: (name: string) => string | string[] | undefined;
} {
  const res = {
    _status: 0,
    _json: undefined as unknown,
    _getHeader: (() => undefined) as (name: string) => string | string[] | undefined,
    status(code: number) {
      this._status = code;
      return this;
    },
    json(body: unknown) {
      this._json = body;
      return this;
    },
    setHeader(_name: string, _value: string | string[]) {
      return this;
    },
  };
  res.setHeader = jest.fn().mockReturnValue(res);
  return res as unknown as NextApiResponse<T> & {
    _status: number;
    _json: unknown;
    _getHeader: (name: string) => string | string[] | undefined;
  };
}

describe("createMockRes helper", () => {
  it("should be used by API route tests", () => {
    expect(createMockRes).toBeDefined();
    const res = createMockRes();
    expect(res.status(200).json({ ok: true })).toBe(res);
    expect(res._status).toBe(200);
    expect(res._json).toEqual({ ok: true });
  });
});
