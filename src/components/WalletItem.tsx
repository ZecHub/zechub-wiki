// components/WalletItem.tsx
import React from 'react';

interface WalletItemProps {
  title: string;
  link: string;
  logo: string;
  tags: string[];
}

const WalletItem: React.FC<WalletItemProps> = ({ title, link, logo, tags }) => {
  return (
    <div className="wallet-item w-full h-full inline-block p-2">
      <a href={link} target="_blank" rel="noopener noreferrer"><img src={logo} alt={`${title} Logo`} /></a>
      <h5>{title}</h5>
      <div>{tags.map(tag => <span key={tag}>{tag}</span>)}</div>
    </div>
  );
};

export default WalletItem;
