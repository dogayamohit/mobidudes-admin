import React from "react";

const TextArea = ({
  placeholder = "Enter your message",
  rows = 3,
  value = "",
  onChange,
  className = "",
  disabled = false,
  error = false,
  hint = "",
}) => {
  const handleChange = (e) => {
    onChange && onChange(e.target.value);
  };

  let textareaClasses = `
    w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs
    focus:outline-none transition-colors
    ${className}
  `;

  if (disabled) {
    textareaClasses += `
      bg-gray-100 text-gray-500 border-gray-300
      cursor-not-allowed opacity-50
    `;
  } else if (error) {
    textareaClasses += `
      bg-transparent text-gray-900 border-gray-300
      focus:border-error-300 focus:ring-2 focus:ring-error-500/10
    `;
  } else {
    textareaClasses += `
      bg-transparent text-gray-900 border-gray-300
      focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10
    `;
  }

  return (
    <div className="relative">
      <textarea
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={textareaClasses}
      />

      {hint && (
        <p
          className={`mt-2 text-sm ${
            error ? "text-error-500" : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;
