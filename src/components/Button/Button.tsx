import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  href?: string;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, href, text }) => {
  if (href) {
    return (
      <a href={href} className="btn" target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="btn">
      {text}
    </button>
  );
};

export default Button;
