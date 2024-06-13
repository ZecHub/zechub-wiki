import React from "react";

interface ButtonProps {
  href?: string;
  text: string;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ href, text, className, onClick }) => {
  if (href) {
    return (
      <a href={href} className={`button-class ${className}`}>
        {text}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`button-class ${className}`}>
      {text}
    </button>
  );
};

export default Button;
