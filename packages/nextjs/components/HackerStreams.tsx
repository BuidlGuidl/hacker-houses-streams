import React, { useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Address } from "~~/components/scaffold-eth";

type BuilderData = {
  cap: BigNumber;
  unlockedAmount: BigNumber;
  builderAddress: string;
};

type HackerStreamsProps = {
  allBuildersData: readonly BuilderData[] | undefined;
  withdrawEvents: any[] | undefined;
  isLoadingBuilderData: boolean;
  isLoadingBuilderEvents: boolean;
};

export const HackerStreams = ({
  allBuildersData,
  withdrawEvents,
  isLoadingBuilderData,
  isLoadingBuilderEvents,
}: HackerStreamsProps) => {
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  return (
    <div className="p-10">
      {isLoadingBuilderData || isLoadingBuilderEvents ? (
        <div className="my-10 text-center">
          <div className="text-5xl animate-bounce mb-2">👾</div>
          <div className="text-lg loading-dots">Loading...</div>
        </div>
      ) : (
        <>
          {allBuildersData?.map((builderData: BuilderData) => {
            if (builderData.cap.isZero()) return;
            const cap = ethers.utils.formatEther(builderData.cap || 0);
            const unlocked = ethers.utils.formatEther(builderData.unlockedAmount || 0);
            const percentage = Math.floor((parseFloat(unlocked) / parseFloat(cap)) * 100);

            const uniqueModalId = `withdraw-events-modal-${builderData.builderAddress}`;

            return (
              <div
                className="pb-8 gap-2 md:items-end flex flex-col md:flex-row md:gap-6"
                key={builderData.builderAddress}
              >
                <div className="md:w-1/2 flex">
                  <label
                    htmlFor={uniqueModalId}
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

                  <input id={uniqueModalId} type="checkbox" className="modal-toggle" />

                  <label htmlFor={uniqueModalId} className="modal cursor-pointer">
                    <label className="modal-box relative">
                      {/* dummy input to capture event onclick on modal box */}
                      <input className="h-0 w-0 absolute top-0 left-0" />
                      <h3 className="text-xl font-bold mb-8">
                        <p className="mb-1">Contributions</p>
                        <Address address={selectedAddress} />
                      </h3>
                      <label htmlFor={uniqueModalId} className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
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
                </div>

                <div className="flex flex-col md:items-center">
                  <div>
                    Ξ {parseFloat(unlocked).toFixed(4)} / {cap}
                  </div>
                  <progress className="progress w-56 progress-primary bg-white" value={percentage} max="100"></progress>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
