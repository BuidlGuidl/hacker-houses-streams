import React from "react";
import Link from "next/link";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 p-4">
      <div className="flex-col items-start">
        <p className="m-0 text-xl md:text-3xl font-bold !leading-7">
          <Link href="/">Your Hacker House</Link>
        </p>
        <p className="m-0 mt-1">BuidlGuidl Grants</p>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
