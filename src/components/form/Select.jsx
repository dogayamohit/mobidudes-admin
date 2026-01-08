import { FiChevronDown } from "react-icons/fi";

const Select = ({
  options = [],
  placeholder = "Select an option",
  value = "",
  onChange = () => { },
  className = "",
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 ${value ? "text-gray-800" : "text-gray-400"
          }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        <FiChevronDown size={18} />
      </span>
    </div>
  );
};

export default Select;
