import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import MealCard from "@/components/MealCard";

describe("MealCard", () => {
  it("should render without crashing", () => {
    const { container } = render(
      <MealCard id="1" name="Test Meal" thumbnail="https://example.com/image.jpg" />
    );

    expect(container).toBeInTheDocument();
  });

  it("should show tag skeletons when tagsLoading is true", () => {
    const { container } = render(
      <MealCard id="1" name="Test Meal" thumbnail="https://example.com/image.jpg" tagsLoading />
    );

    const skeletons = container.querySelectorAll("[aria-hidden]");
    expect(skeletons.length).toBe(2);
  });
});
