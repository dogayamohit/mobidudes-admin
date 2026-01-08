import React from "react";
import { Link } from "react-router-dom";

const Alert = ({
  variant,
  title,
  message,
  showLink = false,
  linkHref = "#",
  linkText = "Learn more",
}) => {
  /* Tailwind classes per variant (default colors only) */
  const variantClasses = {
    success: {
      container: "border-green-500 bg-green-100",
      icon: "text-green-600",
    },
    error: {
      container: "border-red-500 bg-red-100",
      icon: "text-red-600",
    },
    warning: {
      container: "border-yellow-500 bg-yellow-100",
      icon: "text-yellow-600",
    },
    info: {
      container: "border-sky-500 bg-sky-100",
      icon: "text-sky-600",
    },
  };

  /* Icons */
  const icons = {
    success: (
      <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 1.9C6.42 1.9 1.9 6.42 1.9 12S6.42 22.1 12 22.1 22.1 17.58 22.1 12 17.58 1.9 12 1.9Zm3.62 7.56a.9.9 0 0 1 0 1.27l-3.8 3.79a.9.9 0 0 1-1.27 0l-2.17-2.17a.9.9 0 1 1 1.27-1.27l1.54 1.54 3.16-3.16a.9.9 0 0 1 1.27 0Z"
        />
      </svg>
    ),
    error: (
      <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 1.9C6.4 1.9 1.85 6.4 1.85 12S6.4 22.15 12 22.15 22.15 17.6 22.15 12 17.6 1.9 12 1.9Zm0 11.9a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm.75-6.5v5.7a.75.75 0 1 1-1.5 0V7.3a.75.75 0 1 1 1.5 0Z" />
      </svg>
    ),
    warning: (
      <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 1.85C6.4 1.85 1.85 6.4 1.85 12S6.4 22.15 12 22.15 22.15 17.6 22.15 12 17.6 1.85 12 1.85Zm0 5.2a1 1 0 0 1 1 1v4.6a1 1 0 1 1-2 0v-4.6a1 1 0 0 1 1-1Zm0 9.2a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
      </svg>
    ),
    info: (
      <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 1.85C6.4 1.85 1.85 6.4 1.85 12S6.4 22.15 12 22.15 22.15 17.6 22.15 12 17.6 1.85 12 1.85Zm0 5.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm1 4v5a1 1 0 1 1-2 0v-5a1 1 0 1 1 2 0Z" />
      </svg>
    ),
  };

  return (
    <div
      className={`rounded-xl border p-4 ${variantClasses[variant].container}`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${variantClasses[variant].icon}`}>
          {icons[variant]}
        </div>

        <div>
          <h4 className="mb-1 text-sm font-semibold text-gray-800">
            {title}
          </h4>

          <p className="text-sm text-gray-600">{message}</p>

          {showLink && (
            <Link
              to={linkHref}
              className="mt-3 inline-block text-sm font-medium text-gray-600 underline hover:text-gray-800"
            >
              {linkText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
