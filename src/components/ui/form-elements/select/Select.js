import React from "react";
import "./select.css";

const Select = ({
  label,
  options,
  value,
  onChange,
  className = "",
  ...rest
}) => {
  const selectClass = `select ${className}`;
  return (
    <div className="selectWrapper">
      {label && <label className="label">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className={selectClass}
        {...rest}
      >
        <option value="" selected disabled>Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
