import { useId } from "react";

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  name: string;
}

export function FilterCheckbox({ label, checked, onChange, name }: FilterCheckboxProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className="flex items-center min-h-11 py-2.5 pr-2 -ml-1 pl-1 rounded cursor-pointer select-none hover:bg-gray-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500 has-[:focus-visible]:ring-offset-1"
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 shrink-0 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
        aria-label={label}
      />
      <span className="ml-3 text-sm text-gray-700 hover:text-gray-900">{label}</span>
    </label>
  );
}
