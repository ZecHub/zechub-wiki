import React from 'react';
import dynamic from 'next/dynamic';
import styles from './Button.module.css';

interface ButtonProps {
  href: string;
  text: string;
}

const DynamicButton: React.FC<ButtonProps> = ({ href, text }) => {
  return (
    <a href={href} className={styles.button}>
      {text}
    </a>
  );
};

const Button = dynamic(() => Promise.resolve(DynamicButton), {
  ssr: false,
});

export default Button;
