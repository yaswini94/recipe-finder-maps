import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoadingState, { MealCardSkeleton, MealGridSkeleton } from "@/components/LoadingState";

describe("LoadingState", () => {
  it("should render with default message", () => {
    render(<LoadingState />);
    expect(screen.getByText("Loading meals...")).toBeInTheDocument();
  });

  it("should render with custom message", () => {
    render(<LoadingState message="Custom loading message" />);
    expect(screen.getByText("Custom loading message")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<LoadingState />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-busy", "true");
  });
});

describe("MealCardSkeleton", () => {
  it("should render skeleton", () => {
    const { container } = render(<MealCardSkeleton />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });
});

describe("MealGridSkeleton", () => {
  it("should render default 6 skeletons", () => {
    const { container } = render(<MealGridSkeleton />);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(6);
  });

  it("should render custom count of skeletons", () => {
    const { container } = render(<MealGridSkeleton count={3} />);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(3);
  });

  it("should have proper accessibility attributes", () => {
    render(<MealGridSkeleton />);
    const grid = screen.getByRole("status");
    expect(grid).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Loading meals...")).toBeInTheDocument();
  });
});
