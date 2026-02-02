import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import FilterPanel from "@/components/FilterPanel";

describe("FilterPanel", () => {
  it("should render without crashing", () => {
    const mockCategoryToggle = jest.fn();
    const mockAreaToggle = jest.fn();
    const { container } = render(
      <FilterPanel
        categories={[]}
        areas={[]}
        selectedCategories={[]}
        selectedAreas={[]}
        onCategoryToggle={mockCategoryToggle}
        onAreaToggle={mockAreaToggle}
      />
    );

    expect(container).toBeInTheDocument();
  });

  it("should not show Clear filters when no filters are selected", () => {
    render(
      <FilterPanel
        categories={[]}
        areas={[]}
        selectedCategories={[]}
        selectedAreas={[]}
        onCategoryToggle={jest.fn()}
        onAreaToggle={jest.fn()}
        onClearFilters={jest.fn()}
      />
    );

    expect(screen.queryByRole("button", { name: /clear all filters/i })).not.toBeInTheDocument();
  });

  it("should show Clear filters when filters are selected and call onClearFilters on click", async () => {
    const user = userEvent.setup();
    const onClearFilters = jest.fn();
    render(
      <FilterPanel
        categories={[
          {
            idCategory: "1",
            strCategory: "Beef",
            strCategoryThumb: "",
            strCategoryDescription: "",
          },
        ]}
        areas={[{ strArea: "Italian" }]}
        selectedCategories={["Beef"]}
        selectedAreas={[]}
        onCategoryToggle={jest.fn()}
        onAreaToggle={jest.fn()}
        onClearFilters={onClearFilters}
      />
    );

    const clearBtn = screen.getByRole("button", { name: /clear all filters/i });
    expect(clearBtn).toBeInTheDocument();

    await user.click(clearBtn);
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });
});
