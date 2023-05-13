import React from "react";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const Projects: NextPage = () => {
  const { data: withdrawEvents, isLoading: isLoadingWithdrawEvents } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "Withdraw",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  const sortedWithdrawEvents = withdrawEvents?.sort((a: any, b: any) => b.block.number - a.block.number);

  return (
    <>
      <div className="max-w-5xl px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-primary-content bg-primary inline-block p-2">Projects</h1>
        <h2 className="font-bold mb-2 text-secondary">Contributions</h2>
        {isLoadingWithdrawEvents ? (
          <div className="m-10">
            <div className="text-5xl animate-bounce mb-2">👾</div>
            <div className="text-lg loading-dots">Loading...</div>
          </div>
        ) : (
          <>
            {sortedWithdrawEvents?.length === 0 && (
              <div className="my-2">
                <p>No contributions yet!</p>
              </div>
            )}
            {sortedWithdrawEvents?.map((event: any) => {
              return (
                <div
                  className="flex flex-col gap-1 mb-6"
                  key={`${event.log.address}_${event.log.blockNumber}`}
                  data-test={`${event.log.address}_${event.log.blockNumber}`}
                >
                  <div>
                    <Address address={event.args.to} />
                  </div>
                  <div>
                    <strong>{new Date(event.block.timestamp * 1000).toISOString().split("T")[0]}</strong>
                  </div>
                  <div>
                    Ξ {ethers.utils.formatEther(event.args.amount)} / {event.args.reason}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default Projects;
