import { useState, useEffect, useRef } from "react";

const MultiSelect = ({
  label,
  options,
  defaultSelected = [],
  value,
  onChange,
  disabled = false,
  placeholder = "Select options",
}) => {
  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const selectedOptions = isControlled ? value : internalSelected;

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const updateSelection = (newSelected) => {
    if (!isControlled) setInternalSelected(newSelected);
    onChange && onChange(newSelected);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      setFocusedIndex(-1);
    }
  };

  const handleSelect = (optionValue) => {
    const newSelected = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((v) => v !== optionValue)
      : [...selectedOptions, optionValue];

    updateSelection(newSelected);
  };

  const removeOption = (optionValue) => {
    updateSelection(selectedOptions.filter((v) => v !== optionValue));
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    e.preventDefault();
    switch (e.key) {
      case "Enter":
        if (!isOpen) setIsOpen(true);
        else if (focusedIndex >= 0)
          handleSelect(options[focusedIndex].value);
        break;

      case "Escape":
        setIsOpen(false);
        break;

      case "ArrowDown":
        if (!isOpen) setIsOpen(true);
        else
          setFocusedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : 0
          );
        break;

      case "ArrowUp":
        if (isOpen)
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : options.length - 1
          );
        break;
    }
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700"
        id={`${label}-label`}
      >
        {label}
      </label>

      <div className="relative z-20 w-full">
        <div
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          className="w-full"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={`${label}-label`}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          <div
            className={`mb-2 flex min-h-11 rounded-lg border border-gray-300 py-1.5 pl-3 pr-3 shadow-theme-xs transition focus:border-brand-300 ${
              disabled
                ? "cursor-not-allowed bg-gray-50 opacity-50"
                : "cursor-pointer bg-white"
            }`}
          >
            <div className="flex flex-wrap flex-auto gap-2">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((value) => {
                  const text =
                    options.find((o) => o.value === value)?.text || value;

                  return (
                    <div
                      key={value}
                      className="group flex items-center rounded-full bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800 hover:border-gray-200"
                    >
                      <span>{text}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!disabled) removeOption(value);
                        }}
                        className="pl-2 text-gray-500 hover:text-gray-400"
                        aria-label={`Remove ${text}`}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="p-1 text-sm text-gray-400 pointer-events-none">
                  {placeholder}
                </div>
              )}
            </div>

            <div className="flex items-center w-7">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown();
                }}
                disabled={disabled}
                className="w-5 h-5 text-gray-700"
              >
                <svg
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M4.8 7.4L10 12.6L15.2 7.4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div
            className="absolute left-0 z-40 w-full max-h-select overflow-y-auto rounded-lg bg-white shadow-sm"
            role="listbox"
            aria-label={label}
          >
            {options.map((option, index) => {
              const isSelected = selectedOptions.includes(option.value);
              const isFocused = index === focusedIndex;

              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={isSelected}
                  className={`cursor-pointer border-b border-gray-200 p-2 ${
                    isFocused ? "bg-brand-50" : ""
                  } ${isSelected ? "bg-brand-100" : ""}`}
                >
                  <span className="text-gray-800">{option.text}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
