import { renderHook, act } from "@testing-library/react";
import { useUrlState } from "./useUrlState";

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock("next/router", () => ({
  useRouter: () => ({
    query: {},
    replace: mockReplace,
    push: mockPush,
  }),
}));

describe("useUrlState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return default state", () => {
    const { result } = renderHook(() => useUrlState());

    expect(result.current.state).toEqual({
      search: "",
      categories: [],
      areas: [],
      page: 1,
    });
  });

  it("should set search with debounce", () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current.setSearch("chicken");
    });

    expect(mockReplace).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockReplace).toHaveBeenCalledWith("/?search=chicken", undefined, { shallow: true });
  });

  it("should toggle category immediately", () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current.toggleCategory("Beef");
    });

    expect(mockReplace).toHaveBeenCalledWith("/?categories=Beef", undefined, { shallow: true });
  });

  it("should toggle area immediately", () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current.toggleArea("Italian");
    });

    expect(mockReplace).toHaveBeenCalledWith("/?areas=Italian", undefined, { shallow: true });
  });

  it("should remove category", () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current.removeCategory("Beef");
    });

    expect(mockReplace).toHaveBeenCalledWith("/", undefined, { shallow: true });
  });

  it("should remove area", () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current.removeArea("Italian");
    });

    expect(mockReplace).toHaveBeenCalledWith("/", undefined, { shallow: true });
  });

  it("should set page", () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current.setPage(3);
    });

    expect(mockReplace).toHaveBeenCalledWith("/?page=3", undefined, { shallow: true });
  });

  it("should reset page to 1 when filters change", () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current.toggleCategory("Beef");
    });

    expect(mockReplace).toHaveBeenCalled();
  });

  it("should cancel debounced update when new search is triggered", () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current.setSearch("chicken");
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      result.current.setSearch("beef");
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/?search=beef", undefined, { shallow: true });
  });

  it("should cleanup on unmount", () => {
    const { result, unmount } = renderHook(() => useUrlState());

    act(() => {
      result.current.setSearch("test");
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("should clear pending debounce on immediate update", () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current.setSearch("chicken");
    });

    act(() => {
      result.current.toggleCategory("Beef");
    });

    expect(mockReplace).toHaveBeenCalledWith("/?categories=Beef", undefined, { shallow: true });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockReplace).toHaveBeenCalled();
  });

  it("should remove existing category when toggled again", () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current.toggleCategory("Beef");
    });

    mockReplace.mockClear();

    act(() => {
      result.current.toggleCategory("Beef");
    });
  });

  it("should remove existing area when toggled again", () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current.toggleArea("Italian");
    });

    mockReplace.mockClear();

    act(() => {
      result.current.toggleArea("Italian");
    });
  });
});
