import { useState } from "react";
import Head from "next/head";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { Address, Balance, EtherInput } from "~~/components/scaffold-eth";
import {
  useDeployedContractInfo,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventRead,
} from "~~/hooks/scaffold-eth";

const streamedBuilders = [
  "0x46792084f2FA64244ec3Ab3e9F992E01dbFB023d", // saucepoint.eth
  "0xD623Aa1E070bF70De7Ef830e019496BE3d4cD33A", // 0xyush.eth
  "0xD84CD3989866c9da74Fb073e38E1F84a0F2a7660", // dhvanipa.eth
  "0x5cdD68A64C1bfF7eCd276cfc0532db7B15be9a86", // wandcrafting.eth
  "0xf51C53b2C184Aa43A7d24aA4f0Cf13D0e8b56c51", // zemse.eth
  "0xD0040c2127cfCb87d1ce71F8360059178897a39a", // 18yearoldvc.eth high byte
  "0x644B0d17ba4FABcd87260f24a1eEb7fEdb8224c7", // gluonix.eth
  "0xDA22919e01E249Ba4c96DbA46beE29E4981835FC", // darrylyeo.eth

  "0x97735C60c5E3C2788b7EE570306775e687095D19", // plotchy
  "0xf1a96Ce1cc0a5103Aeed21bCF89f83020f413Cb5", // philogy
  "0x83A49Ed2632592FaC36896DDBd27fD612e0d2F77", // Sohan
  "0xb47A9B6F062c33ED78630478dFf9056687F840f2", // Jtriley
  "0x9B9ba2d5a3C2799478158B186Bf0326Ff17D0160", // Andrew Miller

  "0xA85572Cd96f1643458f17340b6f0D6549Af482F5", // fiveoutofnine.eth
];

const Home: NextPage = () => {
  const { address } = useAccount();
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const { data: streamContract } = useDeployedContractInfo("YourContract");

  const { data: allBuildersData } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "allBuildersData",
    args: [streamedBuilders],
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
        <title>Scaffold-eth App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-10 mb-20">
        <h1 className="font-bold text-center text-3xl w-[90%] leading-6">
          Jessy's Hacker House <br />
          <span className="text-xl text-gray-400">BuidlGuidl Grants</span>
        </h1>
        <div className="max-w-[40rem] m-auto w-[90%]">
          <p>
            We're running an experiment to retroactively fund open-source work by providing a monthly UBI to open-source
            developers, handpicked by Jessy and Jessy's Hacker House, and rewarding them for their ongoing contributions
            to the ecosystem.
          </p>
          <p>
            Chosen developers can submit their monthly projects, automatically claim grant streams, and showcase their
            work to the public.
          </p>
          <p>This initiative is made possible by BuidlGuidl!</p>
        </div>

        <h1 className="mt-5 mb-3 font-bold text-xl">List of Hackers</h1>
        <div>
          {allBuildersData?.map(builderData => {
            const cap = ethers.utils.formatEther(builderData.cap || 0);
            const unlocked = ethers.utils.formatEther(builderData.unlockedAmount || 0);
            const percentage = Math.floor((parseFloat(unlocked) / parseFloat(cap)) * 100);
            return (
              <div className="pb-8 flex gap-4" key={builderData.builderAddress}>
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
                  <progress className="progress w-56" value={percentage} max="100"></progress>
                </div>
              </div>
            );
          })}
        </div>

        <div className="my-6 flex flex-col items-center">
          <p className="font-bold mb-2">Stream contract Balance</p>
          <Address address={streamContract?.address} />
          <Balance address={streamContract?.address} className="text-3xl" />
          {address && amIAStreamedBuilder && (
            <div className="mt-6">
              <label
                htmlFor="withdraw-modal"
                className="btn btn-primary btn-sm px-2 rounded-full font-normal space-x-2 normal-case"
              >
                <BanknotesIcon className="h-4 w-4" />
                <span>Withdraw</span>
              </label>
            </div>
          )}
        </div>
      </div>
      <input type="checkbox" id="withdraw-modal" className="modal-toggle" />
      <label htmlFor="withdraw-modal" className="modal cursor-pointer">
        <label className="modal-box relative">
          {/* dummy input to capture event onclick on modal box */}
          <input className="h-0 w-0 absolute top-0 left-0" />
          <h3 className="text-xl font-bold mb-8">Withdraw from your stream</h3>
          <label htmlFor="withdraw-modal" className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
            ✕
          </label>
          <div className="space-y-3">
            <div className="flex flex-col gap-6 items-center">
              <input
                type="text"
                className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 w-full font-medium placeholder:text-accent/50 text-gray-400 border-2 border-base-300 bg-base-200 rounded-full text-accent"
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
          {/* dummy input to capture event onclick on modal box */}
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

export default Home;
