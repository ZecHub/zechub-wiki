"use client";
import React from "react";
import { FadeInAnimation } from "@/components/ui/FadeInAnimation";
import walletsConfig, { WalletProps } from "@/constants/walletsConfig";
import WalletTile from "@/components/WalletTile";

const WalletsPage = () => {
  return (
    <main>
      <h1 className="text-3xl font-bold text-center my-5">Zcash Wallets</h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-4 p-2">
        {walletsConfig.map((wallet: WalletProps) => (
          <FadeInAnimation key={wallet.name} className="w-full h-full">
            <WalletTile
              name={wallet.name}
              description={wallet.description}
              path={wallet.path}
              image={wallet.image}
            />
          </FadeInAnimation>
        ))}
      </div>
    </main>
  );
};

export default WalletsPage;
