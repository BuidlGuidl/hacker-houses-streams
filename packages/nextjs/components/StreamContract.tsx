import { useState } from "react";
import { ethers } from "ethers";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { Address, Balance, EtherInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

type StreamContractProps = {
  amIAStreamedBuilder?: boolean;
};

export const StreamContract = ({ amIAStreamedBuilder }: StreamContractProps) => {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");

  const { data: streamContract } = useDeployedContractInfo("YourContract");

  const { data: owner } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "owner",
  });

  const { writeAsync: doWithdraw } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "streamWithdraw",
    args: [ethers.utils.parseEther(amount || "0"), reason],
  });

  return (
    <>
      <div className="my-6 flex flex-col items-center">
        <p className="font-bold mb-2 bg-secondary text-secondary-content px-1">Stream contract Balance</p>
        <Address address={streamContract?.address} />
        <Balance address={streamContract?.address} className="text-3xl" />
        {amIAStreamedBuilder && (
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

      <div className="my-6 flex flex-col items-center">
        <p className="font-bold mb-2 bg-secondary text-secondary-content px-1">Owner</p>
        <Address address={owner} />
      </div>

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
                className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 w-full font-medium placeholder:text-accent/50 text-gray-400 border-2 border-base-300 bg-base-200 rounded-full text-accent"
                placeholder="Reason for withdrawing and link to github plz"
                value={reason}
                onChange={event => setReason(event.target.value)}
              />
              <EtherInput value={amount} onChange={value => setAmount(value)} />
              <button className="btn btn-primary btn-sm" onClick={doWithdraw}>
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </label>
      </label>
    </>
  );
};
