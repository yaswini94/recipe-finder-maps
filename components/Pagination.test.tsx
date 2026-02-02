import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Pagination from "@/components/Pagination";

describe("Pagination", () => {
  it("should render without crashing", () => {
    const mockOnPageChange = jest.fn();
    const { container } = render(
      <Pagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />
    );

    expect(container).toBeInTheDocument();
  });

  it("should return null when totalPages is 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={jest.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should show page numbers and call onPageChange when a page is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    expect(screen.getByRole("button", { name: /page 2/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /page 3/i }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("should call onPageChange with previous page when Previous is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: /previous page/i }));

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("should call onPageChange with next page when Next is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: /next page/i }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("should show ellipsis for many pages", () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={jest.fn()} />);

    const ellipsis = document.querySelectorAll('[aria-hidden="true"]');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it("should show disabled Previous on first page and disabled Next on last page", () => {
    const onPageChange = jest.fn();
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />
    );

    expect(screen.getByText(/previous/i).closest("span")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText(/next/i).closest("button")).toBeInTheDocument();

    rerender(<Pagination currentPage={3} totalPages={3} onPageChange={onPageChange} />);

    expect(screen.getByText(/next/i).closest("span")).toHaveAttribute("aria-disabled", "true");
  });
});
