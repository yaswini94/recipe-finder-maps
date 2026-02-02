import { removeFromArray } from "./utils";

describe("removeFromArray", () => {
  it("should remove item from array", () => {
    const result = removeFromArray(["a", "b", "c"], "b");
    expect(result).toEqual(["a", "c"]);
  });

  it("should return new array (immutable)", () => {
    const original = ["a", "b", "c"];
    const result = removeFromArray(original, "b");
    expect(result).not.toBe(original);
    expect(original).toEqual(["a", "b", "c"]);
  });

  it("should return same elements if item not found", () => {
    const result = removeFromArray(["a", "b", "c"], "d");
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should work with numbers", () => {
    const result = removeFromArray([1, 2, 3], 2);
    expect(result).toEqual([1, 3]);
  });

  it("should work with empty array", () => {
    const result = removeFromArray([], "a");
    expect(result).toEqual([]);
  });

  it("should remove all matching items", () => {
    const result = removeFromArray(["a", "b", "a", "c"], "a");
    expect(result).toEqual(["b", "c"]);
  });
});
