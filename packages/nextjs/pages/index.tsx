import { useState } from "react";
import Head from "next/head";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address, Balance, EtherInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const streamedBuilders = [
  "0x8393A66F048F181FFD8044Ad7E260222848Dff8f",
  "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  "0x61B647D3b5a04Eec7E78B1d9CFbF9deA593c7865",
];

const Home: NextPage = () => {
  const { address } = useAccount();
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
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

  const amIAStreamedBuilder = allBuildersData?.some(builderData => builderData.builderAddress === address);
  return (
    <>
      <Head>
        <title>Scaffold-eth App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-10">
        Welcome <Address address={address} />
        <div className="pt-6">
          <span className="font-bold">Stream contract Balance</span>{" "}
          <Balance address={streamContract?.address} className="text-3xl" />
        </div>
        <div className="mt-6">
          {address && amIAStreamedBuilder && (
            <div className="flex flex-col gap-3 items-center">
              <input
                type="text"
                className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 w-full font-medium placeholder:text-accent/50 text-gray-400 border-2 border-base-300 bg-base-200 rounded-full text-accent"
                placeholder="Reason for withdrawing"
                value={reason}
                onChange={event => setReason(event.target.value)}
              />
              <EtherInput value={amount} onChange={value => setAmount(value)} />
              <button className="btn btn-primary" onClick={doWithdraw}>
                Withdraw
              </button>
            </div>
          )}
        </div>
        <h1 className="mt-5 mb-3 font-bold text-3xl">List of Hackers</h1>
        {allBuildersData?.map(builderData => {
          const cap = ethers.utils.formatEther(builderData.cap || 0);
          const unlocked = ethers.utils.formatEther(builderData.unlockedAmount || 0);
          const percentage = Math.floor((parseFloat(unlocked) / parseFloat(cap)) * 100);
          return (
            <div className="pb-4 flex gap-4" key={builderData.builderAddress}>
              <Address address={builderData.builderAddress} />
              <div>
                {unlocked} / {cap}
              </div>
              <progress className="progress w-56" value={percentage} max="100"></progress>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;
