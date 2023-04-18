import React from "react";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 p-4">
      <div className="flex-col items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="logo" />
        <p className="text-gray-400 m-0 mt-1 bg-hacker text-primary-content">BuidlGuidl Grants</p>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
