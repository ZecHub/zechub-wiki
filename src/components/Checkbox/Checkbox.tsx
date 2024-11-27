import React from "react";

interface CheckboxProps {
  checked?: boolean;            // Controlled state: whether the checkbox is checked or not
  defaultChecked?: boolean;     // Uncontrolled state: initial checked state
  onChange?: (checked: boolean) => void; // Event handler for when the checkbox state changes
  label?: string;               // Text label to display next to the checkbox
  className?: string;           // Additional CSS classes
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  defaultChecked,
  onChange,
  label,
  className = "",
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  return (
    <label className={`checkbox-container ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={handleChange}
        className="checkbox-input"
      />
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
};

export default Checkbox;
