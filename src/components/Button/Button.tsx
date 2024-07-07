import React from "react";

interface ButtonProps {
  href?: string;
  text: string;
  className?: string;
  onClick?: () => void;
  styles?: React.CSSProperties
}

const Button: React.FC<ButtonProps> = ({ href, text, className, onClick, styles }) => {
  if (href) {
    return (
      <a href={href} className={`button-class ${className}`} style={styles}>
        {text}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`button-class ${className}`}
      style={styles}
    >
      {text}
    </button>
  );
};

export default Button;
