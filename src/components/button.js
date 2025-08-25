import React from "react";
import "./Button.css";

function Button({ children, onClick }) {
  return (
    <button className="blue-btn" onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
