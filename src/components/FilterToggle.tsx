// components/FilterToggle.tsx
import React from 'react';

interface FilterToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const FilterToggle: React.FC<FilterToggleProps> = ({ label, checked, onChange }) => {
  return (
    <label>
      {label}
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
};

export default FilterToggle;
