import { FilterCheckbox } from "./FilterCheckbox";

interface FilterCheckboxGroupProps {
  items: string[];
  selectedItems: string[];
  onToggle: (item: string) => void;
  groupName: string;
}

export function FilterCheckboxGroup({
  items,
  selectedItems,
  onToggle,
  groupName,
}: FilterCheckboxGroupProps) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-600">No options available</p>;
  }

  return (
    <div className="max-h-64 overflow-y-auto pr-2">
      {items.map((item) => (
        <FilterCheckbox
          key={item}
          label={item}
          checked={selectedItems.includes(item)}
          onChange={() => onToggle(item)}
          name={`${groupName}-${item}`}
        />
      ))}
    </div>
  );
}
