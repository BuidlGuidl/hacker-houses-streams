import React from "react";
import Image from "next/image";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 p-0 sm:p-4 font-grotesk">
      <div className="flex items-center justify-center mb-4 sm:mb-0 invisible md:visible">
        <div className="flex-col items-start">
          <Image src="/jessy.png" alt="Hacker House Logo" width={523} height={36} className="mx-4" />
          <div className="m-0 mt-1 pl-4 text-sm md:text-base">
            <span className="pr-2">selection committee:</span>
            <a href="https://twitter.com/13yearoldvc" target="_blank" rel="noreferrer">
              Jessy
            </a>
            ,{" "}
            <a href="https://twitter.com/0xjepsen" target="_blank" rel="noreferrer">
              Waylon
            </a>
            ,{" "}
            <a href="https://twitter.com/Autoparallel" target="_blank" rel="noreferrer">
              Colin
            </a>
            , and{" "}
            <a href="https://twitter.com/solidityslayer" target="_blank" rel="noreferrer">
              Alexis
            </a>
          </div>
        </div>
      </div>
      <div className="navbar-end flex-grow mr-4 flex justify-center sm:justify-end">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
