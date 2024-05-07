import dynamic from 'next/dynamic';
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  href: string;
  text: string;
}

const DynamicButton: React.FC<ButtonProps> = ({ href, text }) => {
  return (
    <a
      href={href}
      className={`${styles.button} ${
        text == 'Sprout Pool' ? 'hover:text-slate-200' : 'hover:text-black'
      } font-bold `}
      target='_blank'
      rel='external'
    >
      {text}
    </a>
  );
};

const Button = dynamic(() => Promise.resolve(DynamicButton), {
  ssr: false,
});

export default Button;
