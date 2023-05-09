import React from "react";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 p-2 md:p-4 items-start">
      <div className="flex-col items-start">
        <p className="m-0 text-xl md:text-3xl font-bold text-primary-content">BG Sand Garden</p>
        <p className="m-0 text-primary-content">BuidlGuidl Grants</p>
      </div>
      <div className="navbar-end flex-grow">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
