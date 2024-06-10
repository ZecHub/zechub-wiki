import React from 'react';

interface ButtonProps {
  href?: string;
  text: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ href, text, onClick }) => {
  if (href) {
    return (
      <a href={href} className="button-class">
        {text}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="button-class">
      {text}
    </button>
  );
};

export default Button;
