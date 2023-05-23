import React from "react";
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";
import { BanknotesIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const StreamContractInfo = () => {
  const { address } = useAccount();
  const { data: streamContract } = useDeployedContractInfo("YourContract");

  const { data: owner } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "owner",
  });

  const { data: builderData } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "streamedBuilders",
    args: [address],
  }) as {
    data: { cap: BigNumber } | undefined;
  };

  const amIAStreamdBuilder = builderData?.cap.gt(0);

  return (
    <>
      <div className="mt-16">
        <p className="font-bold mb-2 text-secondary">
          Stream Contract
          <span
            className="tooltip text-white font-normal"
            data-tip="All streams and contributions are handled by a contract on Optimism"
          >
            <QuestionMarkCircleIcon className="h-5 w-5 inline-block ml-2" />
          </span>
        </p>
        <div className="flex gap-2 items-center">
          <Address address={streamContract?.address} /> /
          <Balance address={streamContract?.address} className="text-3xl" />
        </div>
        {address && amIAStreamdBuilder && (
          <div className="mt-3">
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
      <div className="mt-8">
        <p className="font-bold mb-2 text-secondary">Owner</p>
        <Address address={owner} />
      </div>
    </>
  );
};
