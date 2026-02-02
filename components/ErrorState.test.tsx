import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ErrorState from "./ErrorState";

describe("ErrorState", () => {
  it("should render error message", () => {
    render(<ErrorState message="Network error occurred" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Network error occurred")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<ErrorState message="Error message" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "assertive");
  });

  it("should render retry button when onRetry provided", () => {
    render(<ErrorState message="Error" onRetry={jest.fn()} />);
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("should not render retry button when onRetry not provided", () => {
    render(<ErrorState message="Error" />);
    expect(screen.queryByRole("button", { name: /try again/i })).not.toBeInTheDocument();
  });

  it("should call onRetry when button clicked", async () => {
    const user = userEvent.setup();
    const mockRetry = jest.fn();

    render(<ErrorState message="Error" onRetry={mockRetry} />);

    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});
