export interface Wallet {
    name: string;
    logo: string;
    features: string[];
    link: string;
    color: string;
  }
  
  export interface WalletCategorySlideProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    wallets: Wallet[];
  }
  
  export interface ControlsProps {
    currentSlide: number;
    progress: number;
    isPlaying: boolean;
    onPrev: () => void;
    onNext: () => void;
    onPlayPause: () => void;
    onReset: () => void;
    onGoToSlide: (index: number) => void;
  }