import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Address } from "~~/components/scaffold-eth";

type ContributionEvent = {
  log: {
    address: string;
    blockNumber: string;
  };
  block: {
    timestamp: number;
  };
  args: {
    to: string;
    amount: ethers.BigNumber;
    reason: string;
  };
};

type ContributionsProps = {
  withdrawEvents: ContributionEvent[] | undefined;
  isLoadingWithdrawEvents: boolean;
};

export const Contributions = ({ withdrawEvents, isLoadingWithdrawEvents }: ContributionsProps) => {
  const [sortedWithdrawEvents, setSortedWithdrawEvents] = useState<ContributionEvent[]>([]);

  useEffect(() => {
    if (withdrawEvents) {
      setSortedWithdrawEvents(withdrawEvents.sort((a: any, b: any) => b.block.number - a.block.number));
    }
  }, [withdrawEvents]);

  return (
    <div className="m-auto w-[100%] max-w-[42rem] px-2">
      {isLoadingWithdrawEvents ? (
        <div className="my-10 text-center">
          <div className="text-5xl animate-bounce mb-2">👾</div>
          <div className="text-lg loading-dots">Loading...</div>
        </div>
      ) : sortedWithdrawEvents && sortedWithdrawEvents.length > 0 ? (
        sortedWithdrawEvents.map((event: ContributionEvent) => {
          return (
            <div
              className="flex flex-col gap-1 border-b-2 p-6"
              key={`${event.log.address}_${event.log.blockNumber}`}
              data-test={`${event.log.address}_${event.log.blockNumber}`}
            >
              <div className="flex flex-row justify-between">
                <div className="w-1/3">
                  <div>
                    <Address address={event.args.to} />
                  </div>
                  <div className="font-normal">
                    {new Date(event.block.timestamp * 1000).toISOString().split("T")[0]} ·{" "}
                    <strong>Ξ {ethers.utils.formatEther(event.args.amount)}</strong>
                  </div>
                </div>
                <div className="w-2/3 text-left">{event.args.reason}</div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center">No contributions yet!</p>
      )}
    </div>
  );
};
