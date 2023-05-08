import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Balance, BlockieAvatar } from "~~/components/scaffold-eth";
import { TAutoConnect, useAutoConnect, useNetworkColor } from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

// todo: move this later scaffold config.  See TAutoConnect for comments on each prop
const tempAutoConnectConfig: TAutoConnect = {
  enableBurnerWallet: true,
  autoConnect: true,
};

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const NewCustomButton = () => {
  useAutoConnect(tempAutoConnectConfig);

  const networkColor = useNetworkColor();
  const configuredNetwork = getTargetNetwork();
  const btnStyle =
    "hover:scale-[1.05] transition-all ease-linear border-[2px] border-l-[#FFFFFF] border-t-[#FFFFFF] border-[#0A0A0A] flex flex-wrap py-[23px] font-medium text-[#2A2A2A] bg-hacker justify-center items-center gap-2 text-sm w-full";
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, openChainModal, mounted }) => {
        const connected = mounted && account && chain;

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <button className={btnStyle} onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== configuredNetwork.id) {
                return (
                  <>
                    <span className="text-xs" style={{ color: networkColor }}>
                      {configuredNetwork.name}
                    </span>
                    <button className={btnStyle} onClick={openChainModal} type="button">
                      <span>Wrong network</span>
                      <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
                    </button>
                  </>
                );
              }

              return (
                <button onClick={openAccountModal} type="button" className={btnStyle}>
                  <div className="flex flex-col items-center">
                    <Balance address={account.address} className="min-h-0 h-auto" />
                    <span className="text-xs" style={{ color: networkColor }}>
                      {chain.name}
                    </span>
                  </div>
                  <BlockieAvatar address={account.address} size={24} ensImage={account.ensAvatar} />
                  <span className="ml-2 mr-1">{account.displayName}</span>
                  <span>
                    <ChevronDownIcon className="h-6 w-4" />
                  </span>
                </button>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
