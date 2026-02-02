import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchResultsState from "./SearchResultsState";

describe("SearchResultsState", () => {
  it("should show loading message when loading", () => {
    render(<SearchResultsState count={0} isLoading={true} />);
    expect(screen.getByText("Loading meals...")).toBeInTheDocument();
  });

  it("should show no meals found for count 0", () => {
    render(<SearchResultsState count={0} isLoading={false} />);
    expect(screen.getByText("No meals found")).toBeInTheDocument();
  });

  it("should show singular message for count 1", () => {
    render(<SearchResultsState count={1} isLoading={false} />);
    expect(screen.getByText("1 meal found")).toBeInTheDocument();
  });

  it("should show plural message for count > 1", () => {
    render(<SearchResultsState count={5} isLoading={false} />);
    expect(screen.getByText("5 meals found")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<SearchResultsState count={5} isLoading={false} />);
    const announcer = screen.getByText("5 meals found").closest("div");
    expect(announcer).toHaveAttribute("aria-live", "polite");
    expect(announcer).toHaveAttribute("aria-atomic", "true");
  });

  it("should be visually hidden", () => {
    render(<SearchResultsState count={5} isLoading={false} />);
    const announcer = screen.getByText("5 meals found").closest("div");
    expect(announcer).toHaveClass("sr-only");
  });
});
