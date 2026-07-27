export interface WalletProps {
  name: string;
  description: string;
  path: string;
  image: string;
}

const config: Array<WalletProps> = [
  {
    name: "Mobile Wallets",
    description:
      "Mobile wallets allow you to access your Zcash anywhere and on the go.",
    path: "/mobile-wallets",
    image: "/content-images/Mobile-Phones-0073811a1d.webp",
  },
  {
    name: "Desktop Wallets",
    description:
      "Desktop wallets are downloadable applications that provide access to Zcash from Windows, MacOS, or Linux.",
    path: "/desktop-wallets",
    image: "/content-images/Desktop-Wallets-7e8335e293.webp",
  },
  {
    name: "Hardware Wallets",
    description:
      "Hardware wallets stores your Zcash securely offline physical device.",
    path: "/hardware-wallets",
    image: "/content-images/Hardware-Wallets-74bf5c3b6f.webp",
  },
  {
    name: "Web Wallets",
    description:
      "Web wallets are wallets that you can access from your browser. They give a users a web interface to interact with their funds.",
    path: "/web-wallets",
    image: "/content-images/Web-Wallets-d266943ff6.webp",
  },
];

export default config;
