"use client";
import React, { useState } from "react";
import "./dropdown.mobile.css";

interface DropdownMobileProps {
  label: string;
  children: React.ReactNode;
}

const DropdownMobile: React.FC<DropdownMobileProps> = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="dropdown-mobile">
      <div className="dropdown-mobile-label" onClick={handleClick}>
        {label}{" "}
        <span className={`arrow ${isOpen ? "rotate" : ""}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="9"
            viewBox="0 0 10 9"
            fill="none"
          >
            <path
              d="M8.5 2.5L4.92667 6.073C4.90348 6.09622 4.87594 6.11464 4.84563 6.12721C4.81531 6.13978 4.78282 6.14625 4.75 6.14625C4.71718 6.14625 4.68469 6.13978 4.65437 6.12721C4.62406 6.11464 4.59652 6.09622 4.57333 6.073L1 2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <div className={`dropdown-mobile-content ${isOpen ? "open" : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default DropdownMobile;
