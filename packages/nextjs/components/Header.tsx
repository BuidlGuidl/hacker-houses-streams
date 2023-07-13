import React from "react";
import Link from "next/link";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 p-0 sm:p-4 font-grotesk">
      <div className="flex items-center justify-center mb-4 sm:mb-0 invisible md:visible">
        <img src="logo.svg" alt="Hacker House Logo" className="mx-4" />
        <div className="flex-col items-start">
          <p className="m-0 text-xl md:text-3xl font-bold !leading-7">
            <Link href="/">Your Hacker House</Link>
          </p>
          <p className="m-0 mt-1 text-sm md:text-base">BuidlGuidl Grants</p>
        </div>
      </div>
      <div className="navbar-end flex-grow mr-4 flex justify-center sm:justify-end">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
