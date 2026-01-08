import React from "react";

const Form = ({ onSubmit, children, className = "" }) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault(); // Prevent default form submission
        onSubmit(event);
      }}
      className={className}
    >
      {children}
    </form>
  );
};

export default Form;
