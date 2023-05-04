import { useState } from "react";
import Head from "next/head";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useQuery } from "urql";
import { useAccount } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { Address, Balance, EtherInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { BuildersQuery } from "~~/queries/AddBuilder";
import { WithdrawsQuery } from "~~/queries/Withdraw";

const Home: NextPage = () => {
  const { address } = useAccount();
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const { data: streamContract } = useDeployedContractInfo("YourContract");

  // Get the Hacker list from the subgraph
  const [addBuilderResult] = useQuery({
    query: BuildersQuery,
  });
  const { data: addBuilderEvents, fetching: isLoadingBuilderEvents } = addBuilderResult;
  const builderList = addBuilderEvents?.addBuilders.map((builder: any) => builder.to);

  // Get the withdrawals from the subgraph
  const [withdrawResult] = useQuery({
    query: WithdrawsQuery,
  });
  const { data: withdrawEvents, fetching: isLoadingWithdrawEvents } = withdrawResult;

  const { data: allBuildersData, isLoading: isLoadingBuilderData } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "allBuildersData",
    args: [builderList],
    enabled: true,
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

      <div className="flex items-center flex-col flex-grow pt-10 mb-20">
        <p className="font-bold text-center text-3xl w-full leading-6 bg-hacker text-primary-content p-2">Welcome!</p>
        <div className="max-w-[40rem] m-auto w-[90%] mb-10">
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

        <h2 className="mt-5 mb-10 font-bold text-xl bg-hacker text-primary-content p-2 w-full text-center">
          Hacker ETH Streams
        </h2>
        <div>
          {isLoadingBuilderData || isLoadingBuilderEvents ? (
            <div className="my-10 text-center">
              <div className="text-5xl animate-bounce mb-2">👾</div>
              <div className="text-lg loading-dots">Loading...</div>
            </div>
          ) : (
            <>
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
                          const filteredEvents = withdrawEvents?.withdraws.filter(
                            (event: any) => event.to.toLowerCase() === builderData.builderAddress.toLowerCase(),
                          );
                          setFilteredEvents(filteredEvents);
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
            </>
          )}
        </div>

        <h2 className="mt-5 mb-10 font-bold text-xl bg-hacker text-primary-content p-2 w-full text-center">
          Contributions
        </h2>
        <div className="m-auto w-[90%] mb-10">
          {isLoadingWithdrawEvents ? (
            <div className="my-10 text-center">
              <div className="text-5xl animate-bounce mb-2">👾</div>
              <div className="text-lg loading-dots">Loading...</div>
            </div>
          ) : (
            <>
              {withdrawEvents?.withdraws.map((event: any) => {
                return (
                  <div className="flex flex-col gap-1 mb-6" key={event.id}>
                    <div>
                      <Address address={event.to} />
                    </div>
                    <div>
                      <strong>{new Date(event.blockTimestamp * 1000).toISOString().split("T")[0]}</strong>
                    </div>
                    <div>
                      Ξ {ethers.utils.formatEther(event.amount)} / {event.reason}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className="my-6 flex flex-col items-center">
          <p className="font-bold mb-2 bg-hacker text-primary-content">Stream contract Balance</p>
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
                    <div key={event.id} className="flex flex-col">
                      <div>
                        <span className="font-bold">Date: </span>
                        {new Date(event.blockTimestamp * 1000).toISOString().split("T")[0]}
                      </div>
                      <div>
                        <span className="font-bold">Amount: </span>Ξ {ethers.utils.formatEther(event.amount.toString())}
                      </div>
                      <div>{event.reason}</div>
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

export default Home;
