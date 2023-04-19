import { useState } from "react";
import Head from "next/head";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useAccount } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { builderList } from "~~/builderList";
import { Address, Balance, EtherInput } from "~~/components/scaffold-eth";
import {
  useDeployedContractInfo,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventRead,
} from "~~/hooks/scaffold-eth";

const ResponsiveGridLayout = WidthProvider(Responsive);

const layout = [
  { i: "welcome", x: 0, y: 0, w: 7, h: 4 },
  { i: "streams", x: 9, y: 0, w: 5, h: 3 },
  { i: "contract-info", x: 9, y: 1, w: 5, h: 1 },
];

const Example: NextPage = () => {
  const { address } = useAccount();
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const { data: streamContract } = useDeployedContractInfo("YourContract");

  const { data: allBuildersData } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "allBuildersData",
    args: [builderList],
  });

  const { writeAsync: doWithdraw } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "streamWithdraw",
    args: [ethers.utils.parseEther(amount || "0"), reason],
  });

  const events = useScaffoldEventRead({
    contractName: "YourContract",
    eventName: "Withdraw",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  const amIAStreamedBuilder = allBuildersData?.some(builderData => builderData.builderAddress === address);
  return (
    <>
      <Head>
        <title>Jessy's Hacker House | BuidlGuidl Grants</title>
        <meta
          name="description"
          content="We're running an experiment to retroactively fund open-source work by providing a monthly UBI to open-source developers, handpicked by Jessy and Jessy's Hacker House, and rewarding them for their ongoing contributions to the ecosystem."
        />
        <meta property="og:title" content="Jessy's Hacker House | BuidlGuidl Grants" />
        <meta
          property="og:description"
          content="We're running an experiment to retroactively fund open-source work by providing a monthly UBI to open-source developers, handpicked by Jessy and Jessy's Hacker House, and rewarding them for their ongoing contributions to the ecosystem."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:image" content="https://hackerhouse.buidlguidl.com/thumbnail.png" />
        <meta property="twitter:image" content="https://hackerhouse.buidlguidl.com/thumbnail.png" />
      </Head>

      <ResponsiveGridLayout
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 3, sm: 3, xs: 2, xxs: 1 }}
        resizeHandles={["ne", "se", "sw", "nw"]}
      >
        {/* Left */}
        <div className="flex flex-col justify-start border-2 border-gray-300" key="welcome">
          <p className="font-bold text-center text-3xl w-full leading-6 bg-hacker text-primary-content p-2 mt-0">
            Welcome!
          </p>
          <div className="p-4">
            <p>
              We're running an experiment to retroactively fund open-source work by providing a monthly UBI to
              open-source developers, handpicked by Jessy and Jessy's Hacker House, and rewarding them for their ongoing
              contributions to the ecosystem.
            </p>
            <p>
              Chosen developers can submit their monthly projects, automatically claim grant streams, and showcase their
              work to the public.
            </p>
            <p>This initiative is made possible by BuidlGuidl!</p>
          </div>
        </div>
        {/* Right  */}
        <div key="streams" className="flex flex-col border-2 border-gray-300 overflow-y-scroll relative">
          <h1 className="mb-10 font-bold text-xl bg-hacker text-primary-content p-2 w-full text-center sticky top-0 z-10">
            List of Hackers
          </h1>
          <div>
            {allBuildersData?.map(builderData => {
              const cap = ethers.utils.formatEther(builderData.cap || 0);
              const unlocked = ethers.utils.formatEther(builderData.unlockedAmount || 0);
              const percentage = Math.floor((parseFloat(unlocked) / parseFloat(cap)) * 100);
              return (
                <div
                  className="pb-8 flex flex-col items-center justify-center lg:flex-row"
                  key={builderData.builderAddress}
                >
                  <div className="w-1/2 flex">
                    <label
                      htmlFor="withdraw-events-modal"
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedAddress(builderData.builderAddress);
                        setFilteredEvents(events.filter((event: any) => event.args.to === builderData.builderAddress));
                      }}
                    >
                      <Address address={builderData.builderAddress} disableAddressLink={true} />
                    </label>
                  </div>
                  <div className="flex flex-col items-center">
                    <div>
                      Ξ {parseFloat(unlocked).toFixed(4)} / {cap}
                    </div>
                    <progress
                      className="progress w-56 progress-primary bg-white"
                      value={percentage}
                      max="100"
                    ></progress>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Right bottom */}
        <div key="contract-info" className="flex flex-col items-center border-gray-400 border-2">
          <h1 className="font-bold text-xl bg-hacker text-primary-content p-2 w-full text-center">
            Stream contract balance
          </h1>
          <Address address={streamContract?.address} />
          <Balance address={streamContract?.address} className="text-2xl" />
          {address && amIAStreamedBuilder && (
            <label
              htmlFor="withdraw-modal"
              className="btn btn-primary btn-sm px-2 rounded-full font-normal space-x-2 normal-case"
            >
              <BanknotesIcon className="h-4 w-4" />
              <span>Withdraw</span>
            </label>
          )}
        </div>
      </ResponsiveGridLayout>
      <input type="checkbox" id="withdraw-modal" className="modal-toggle" />
      <label htmlFor="withdraw-modal" className="modal cursor-pointer">
        <label className="modal-box relative">
          <input className="h-0 w-0 absolute top-0 left-0" />
          <h3 className="text-xl font-bold mb-8">Withdraw from your stream</h3>
          <label htmlFor="withdraw-modal" className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
            ✕
          </label>
          <div className="space-y-3">
            <div className="flex flex-col gap-6 items-center">
              <input
                type="text"
                className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 w-full font-medium placeholder:text-accent/50 border-2 border-base-300 bg-base-200 rounded-full text-accent"
                placeholder="Reason for withdrawing and link to github plz"
                value={reason}
                onChange={event => setReason(event.target.value)}
              />
              <EtherInput value={amount} onChange={value => setAmount(value)} />
              <button className="btn btn-primary btn-sm" onClick={doWithdraw}>
                Withdraw
              </button>
            </div>
          </div>
        </label>
      </label>
      <input type="checkbox" id="withdraw-events-modal" className="modal-toggle" />
      <label htmlFor="withdraw-events-modal" className="modal cursor-pointer">
        <label className="modal-box relative">
          <input className="h-0 w-0 absolute top-0 left-0" />
          <h3 className="text-xl font-bold mb-8">
            <p className="mb-1">Work History</p>
            <Address address={selectedAddress} />
          </h3>
          <label htmlFor="withdraw-events-modal" className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
            ✕
          </label>
          <div className="space-y-3">
            <ul>
              {filteredEvents.length > 0 ? (
                <div className="flex flex-col">
                  {filteredEvents.map(event => (
                    <div key={event.log.transactionHash} className="flex flex-col">
                      <div>
                        <span className="font-bold">Date: </span>
                        {new Date(event.block.timestamp * 1000).toISOString().split("T")[0]}
                      </div>
                      <div>
                        <span className="font-bold">Amount: </span>Ξ{" "}
                        {ethers.utils.formatEther(event.args.amount.toString())}
                      </div>
                      <div>{event.args.reason}</div>
                      <hr className="my-8" />
                    </div>
                  ))}
                </div>
              ) : (
                <p>No work history</p>
              )}
            </ul>
          </div>
        </label>
      </label>
    </>
  );
};

export default Example;
