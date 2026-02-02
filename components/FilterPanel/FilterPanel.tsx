import { useState, useCallback } from "react";
import type { Category, Area } from "@/types/meal";
import { FilterSection } from "./FilterSection";
import { FilterCheckboxGroup } from "./FilterCheckboxGroup";

/**
 * Props for the FilterPanel component
 */
interface FilterPanelProps {
  /** Array of available category options */
  categories: Category[];
  /** Array of available area/cuisine options */
  areas: Area[];
  /** Array of currently selected categories */
  selectedCategories: string[];
  /** Array of currently selected areas */
  selectedAreas: string[];
  /** Callback when a category is toggled */
  onCategoryToggle: (category: string) => void;
  /** Callback when an area is toggled */
  onAreaToggle: (area: string) => void;
  onClearFilters?: () => void;
  /** Whether filters are loading */
  isLoading?: boolean;
}

/**
 * FilterPanel Component (Placeholder)
 *
 * Placeholder component for filter functionality.
 * To be implemented with category and area/cuisine filters.
 *
 * The component receives all necessary props for implementation:
 * - categories/areas: Available filter options
 * - selectedCategories/selectedAreas: Currently active filters
 * - onCategoryToggle/onAreaToggle: Callbacks to update filter state
 *
 * This should be implemented with checkboxes or similar UI controls.
 **/
export default function FilterPanel({
  categories,
  areas,
  selectedCategories,
  selectedAreas,
  onCategoryToggle,
  onAreaToggle,
  onClearFilters,
  isLoading = false,
}: FilterPanelProps) {
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [areaExpanded, setAreaExpanded] = useState(true);

  const hasActiveFilters = selectedCategories.length > 0 || selectedAreas.length > 0;

  const toggleCategorySection = useCallback(() => {
    setCategoryExpanded((prev) => !prev);
  }, []);

  const toggleAreaSection = useCallback(() => {
    setAreaExpanded((prev) => !prev);
  }, []);

  return (
    <aside
      className="bg-white rounded-lg shadow-md p-6"
      aria-label="Filter options"
      aria-busy={isLoading}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>

      <FilterSection title="Category" expanded={categoryExpanded} onToggle={toggleCategorySection}>
        <FilterCheckboxGroup
          items={categories.map((c) => c.strCategory)}
          selectedItems={selectedCategories}
          onToggle={onCategoryToggle}
          groupName="category"
        />
      </FilterSection>

      <FilterSection title="Area / Cuisine" expanded={areaExpanded} onToggle={toggleAreaSection}>
        <FilterCheckboxGroup
          items={areas.map((a) => a.strArea)}
          selectedItems={selectedAreas}
          onToggle={onAreaToggle}
          groupName="area"
        />
      </FilterSection>

      {hasActiveFilters && onClearFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClearFilters}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-label="Clear all filters (keeps search)"
          >
            Clear Filters
          </button>
        </div>
      )}
    </aside>
  );
}
