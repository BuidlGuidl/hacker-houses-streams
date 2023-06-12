import { Faucet } from "./scaffold-eth";
import { hardhat } from "wagmi/chains";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="min-h-0 p-5 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-between items-center w-full z-20 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex space-x-2 pointer-events-auto">{getTargetNetwork().id === hardhat.id && <Faucet />}</div>
          <SwitchTheme className="pointer-events-auto" />
        </div>
      </div>
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div>
              🏰{" "}
              <a
                href="https://twitter.com/buidlguidl"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                BuidlGuidl
              </a>{" "}
              && 🏗️{" "}
              <a
                href="https://github.com/scaffold-eth/scaffold-eth-2"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                Scaffold-ETH 2
              </a>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
