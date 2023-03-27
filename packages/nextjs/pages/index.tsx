import { useState } from "react";
import Head from "next/head";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount, useContractReads } from "wagmi";
import { Address, Balance, EtherInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const builderAddresses = ["0x8393A66F048F181FFD8044Ad7E260222848Dff8f", "0x56041eA5Edf5BFB18f515DB4FE61842Ab1ddC578"];

interface StreamInfo {
  cap: ethers.BigNumber;
  last: ethers.BigNumber;
}

const Home: NextPage = () => {
  const { address } = useAccount();
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const { data: contractData } = useDeployedContractInfo("YourContract");

  const streamContract = {
    address: contractData?.address,
    abi: contractData?.abi,
  };

  const streamInfoReads = builderAddresses.map(builderAddress => ({
    ...streamContract,
    functionName: "streamedBuilders",
    args: [builderAddress],
  }));

  const streamUnlockedReads = builderAddresses.map(builderAddress => ({
    ...streamContract,
    functionName: "unlockedBuilderAmount",
    args: [builderAddress],
  }));

  const { data: streamInfoData }: { data: StreamInfo[] | undefined } = useContractReads({
    contracts: streamInfoReads,
    watch: true,
  });

  const { data: streamUnlockedData }: { data: ethers.BigNumber[] | undefined } = useContractReads({
    contracts: streamUnlockedReads,
    watch: true,
  });

  const { writeAsync: doWithdraw } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "streamWithdraw",
    args: [ethers.utils.parseEther(amount || "0"), reason],
  });

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
          <Balance address={streamContract.address} className="text-3xl" />
        </div>
        <div className="mt-6">
          {address && builderAddresses.includes(address) && (
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
        {builderAddresses.map((builderAddress, index) => {
          const cap = ethers.utils.formatEther(streamInfoData?.[index].cap.toString() || 0);
          const unlocked = ethers.utils.formatEther(streamUnlockedData?.[index].toString() || 0);
          const percentage = Math.floor((parseFloat(unlocked) / parseFloat(cap)) * 100);

          return (
            <div className="pb-4 flex gap-4" key={builderAddress}>
              <Address address={builderAddress} />
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
