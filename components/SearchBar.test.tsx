import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SearchBar from "@/components/SearchBar";

describe("SearchBar", () => {
  it("should render without crashing", () => {
    const mockOnSearch = jest.fn();
    const { container } = render(<SearchBar onSearch={mockOnSearch} />);

    expect(container).toBeInTheDocument();
  });

  it("should call onSearch with input value when form is submitted", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole("textbox", { name: /search for meals/i });
    await user.type(input, "pasta");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith("pasta");
  });

  it("should use defaultValue to pre-populate input", () => {
    render(<SearchBar defaultValue="chicken" onSearch={jest.fn()} />);

    expect(screen.getByRole("textbox", { name: /search for meals/i })).toHaveValue("chicken");
  });

  it("should use custom placeholder when provided", () => {
    render(<SearchBar placeholder="Find recipes..." onSearch={jest.fn()} />);

    expect(screen.getByPlaceholderText("Find recipes...")).toBeInTheDocument();
  });
});
