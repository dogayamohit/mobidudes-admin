import React, { useEffect } from "react";

const Modal = ({
  isOpen,
  onClose,
  children,
  width = "max-w-[600px]",
}) => {

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-5 overflow-y-auto">
      
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-400/50 backdrop-blur-[32px]"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        className={`relative w-full ${width} rounded-3xl bg-white p-6 lg:p-10 shadow-xl`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 sm:right-6 sm:top-6 
            flex h-9.5 w-9.5 sm:h-11 sm:w-11 items-center justify-center 
            rounded-full bg-gray-100 text-gray-400 
            hover:bg-gray-200 hover:text-gray-700"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
