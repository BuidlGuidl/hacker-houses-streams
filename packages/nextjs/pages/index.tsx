import Head from "next/head";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address } = useAccount();

  const { data: yourUnlockedStreamAmount } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "unlockedBuilderAmount",
    args: [address],
  });

  const { writeAsync: doWithdraw } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "streamWithdraw",
    args: [ethers.utils.parseEther("0.5"), "hello world this is my withdraw"],
  });

  return (
    <>
      <Head>
        <title>Scaffold-eth App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-10">
        Welcome <Address address={address} />
      </div>
      <div className="flex items-center flex-col flex-grow pt-10">
        Your unlocked stream amount is: {yourUnlockedStreamAmount && ethers.utils.formatEther(yourUnlockedStreamAmount)}
      </div>
      <div className="flex items-center flex-col flex-grow pt-10">
        <button onClick={doWithdraw} className="btn btn-primary">
          Withdraw
        </button>
      </div>
    </>
  );
};

export default Home;
