import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { StreamContractInfo } from "~~/components/StreamContractInfo";
import { Address, EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const Members: NextPage = () => {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  const [builderList, setBuilderList] = useState<string[]>([]);

  const { data: allBuildersData, isLoading: isLoadingBuilderData } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "allBuildersData",
    args: [builderList],
  });

  const { writeAsync: doWithdraw } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "streamWithdraw",
    args: [ethers.utils.parseEther(amount || "0"), reason],
  });

  const { data: withdrawEvents } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "Withdraw",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  const { data: addBuilderEvents, isLoading: isLoadingBuilderEvents } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "AddBuilder",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
  });

  useEffect(() => {
    if (addBuilderEvents && addBuilderEvents.length > 0) {
      const fetchedBuilderList = addBuilderEvents.map((event: any) => event.args.to);
      setBuilderList(fetchedBuilderList);
    }
  }, [addBuilderEvents]);

  return (
    <>
      <div className="max-w-3xl px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-primary-content bg-primary inline-block p-2">Members</h1>
        <div className="mb-16">
          <p className="mt-0 mb-10">
            These are the active builders and their streams. You can click on any builder to see their detailed
            contributions.
          </p>
          {isLoadingBuilderData || isLoadingBuilderEvents ? (
            <div className="m-10">
              <div className="text-5xl animate-bounce mb-2">👾</div>
              <div className="text-lg loading-dots">Loading...</div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {allBuildersData?.map(builderData => {
                const cap = ethers.utils.formatEther(builderData.cap || 0);
                const unlocked = ethers.utils.formatEther(builderData.unlockedAmount || 0);
                const percentage = Math.floor((parseFloat(unlocked) / parseFloat(cap)) * 100);
                return (
                  <div className="flex flex-col md:flex-row gap-2 md:gap-6" key={builderData.builderAddress}>
                    <div className="flex flex-col md:items-center">
                      <div>
                        Ξ {parseFloat(unlocked).toFixed(4)} / {cap}
                      </div>
                      <progress
                        className="progress w-56 progress-primary bg-white"
                        value={percentage}
                        max="100"
                      ></progress>
                    </div>
                    <div className="md:w-1/2 flex">
                      <label
                        htmlFor="withdraw-events-modal"
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedAddress(builderData.builderAddress);
                          setFilteredEvents(
                            withdrawEvents?.filter((event: any) => event.args.to === builderData.builderAddress) || [],
                          );
                        }}
                      >
                        <Address address={builderData.builderAddress} disableAddressLink={true} />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <StreamContractInfo />
      </div>

      <input type="checkbox" id="withdraw-modal" className="modal-toggle" />
      <label htmlFor="withdraw-modal" className="modal cursor-pointer">
        <label className="modal-box relative bg-primary">
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
                placeholder="Reason for withdrawing & links"
                value={reason}
                onChange={event => setReason(event.target.value)}
              />
              <EtherInput value={amount} onChange={value => setAmount(value)} />
              <button className="btn btn-secondary btn-sm" onClick={doWithdraw}>
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
            <p className="mb-1">Contributions</p>
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
                <p>No contributions</p>
              )}
            </ul>
          </div>
        </label>
      </label>
    </>
  );
};

export default Members;
