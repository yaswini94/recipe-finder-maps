import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ActiveFilters from "./ActiveFilters";

describe("ActiveFilters", () => {
  it("should render without crashing", () => {
    const mockRemoveCategory = jest.fn();
    const mockRemoveArea = jest.fn();
    const { container } = render(
      <ActiveFilters
        selectedCategories={[]}
        selectedAreas={[]}
        onRemoveCategory={mockRemoveCategory}
        onRemoveArea={mockRemoveArea}
      />
    );

    expect(container).toBeInTheDocument();
  });

  it("should return null when no filters are selected", () => {
    const { container } = render(
      <ActiveFilters
        selectedCategories={[]}
        selectedAreas={[]}
        onRemoveCategory={jest.fn()}
        onRemoveArea={jest.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should display category and area badges when selected", () => {
    render(
      <ActiveFilters
        selectedCategories={["Beef", "Dessert"]}
        selectedAreas={["Italian"]}
        onRemoveCategory={jest.fn()}
        onRemoveArea={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /remove beef filter/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /remove dessert filter/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /remove italian filter/i })).toBeInTheDocument();
  });

  it("should call onRemoveCategory when category badge is clicked", async () => {
    const user = userEvent.setup();
    const onRemoveCategory = jest.fn();
    render(
      <ActiveFilters
        selectedCategories={["Beef"]}
        selectedAreas={[]}
        onRemoveCategory={onRemoveCategory}
        onRemoveArea={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /remove beef filter/i }));

    expect(onRemoveCategory).toHaveBeenCalledWith("Beef");
  });

  it("should call onRemoveArea when area badge is clicked", async () => {
    const user = userEvent.setup();
    const onRemoveArea = jest.fn();
    render(
      <ActiveFilters
        selectedCategories={[]}
        selectedAreas={["Italian"]}
        onRemoveCategory={jest.fn()}
        onRemoveArea={onRemoveArea}
      />
    );

    await user.click(screen.getByRole("button", { name: /remove italian filter/i }));

    expect(onRemoveArea).toHaveBeenCalledWith("Italian");
  });
});
