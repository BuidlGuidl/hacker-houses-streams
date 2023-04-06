import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("YourContract", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const yourContract = await hre.ethers.getContract("YourContract", deployer);

  console.log("🫡 adding batch of builders");
  await yourContract.addBatch(
    [
      "0x46792084f2FA64244ec3Ab3e9F992E01dbFB023d", // saucepoint.eth
      "0xD623Aa1E070bF70De7Ef830e019496BE3d4cD33A", // 0xyush.eth
      "0xD84CD3989866c9da74Fb073e38E1F84a0F2a7660", // dhvanipa.eth
      "0x5cdD68A64C1bfF7eCd276cfc0532db7B15be9a86", // wandcrafting.eth
      "0xf51C53b2C184Aa43A7d24aA4f0Cf13D0e8b56c51", // zemse.eth
      "0xD0040c2127cfCb87d1ce71F8360059178897a39a", // 18yearoldvc.eth high byte
      "0x644B0d17ba4FABcd87260f24a1eEb7fEdb8224c7", // gluonix.eth
      "0xDA22919e01E249Ba4c96DbA46beE29E4981835FC", // darrylyeo.eth

      "0x97735C60c5E3C2788b7EE570306775e687095D19", // plotchy
      "0xf1a96Ce1cc0a5103Aeed21bCF89f83020f413Cb5", // philogy
      "0x83A49Ed2632592FaC36896DDBd27fD612e0d2F77", // Sohan
      "0xb47A9B6F062c33ED78630478dFf9056687F840f2", // Jtriley
      "0x9B9ba2d5a3C2799478158B186Bf0326Ff17D0160", // Andrew Miller
    ],
    [
      "500000000000000000",
      "500000000000000000",
      "500000000000000000",
      "500000000000000000",
      "500000000000000000",
      "500000000000000000",
      "500000000000000000",
      "500000000000000000",
      "500000000000000000",
      "500000000000000000",
      "500000000000000000",
      "500000000000000000",
      "500000000000000000",
    ],
  );

  console.log("🏷 handing ownership over to atg.eth");
  await yourContract.transferOwnership("0x34aA3F359A9D614239015126635CE7732c18fDF3");

  /*
  // ToDo. Remove on production.
  console.log("Deploying stream test data...");
  // const FRONTEND_ADDRESS = "0x8393A66F048F181FFD8044Ad7E260222848Dff8f";
  const streamTestData = [
    // [FRONTEND_ADDRESS, ethers.utils.parseEther("1")],
    ["0x60583563d5879c2e59973e5718c7de2147971807", ethers.utils.parseEther("1")],
    ["0x34aA3F359A9D614239015126635CE7732c18fDF3", ethers.utils.parseEther("1")],
    ["0xc1470707Ed388697A15B9B9f1f5f4cC882E28a45", ethers.utils.parseEther("1")],
    ["0x61B647D3b5a04Eec7E78B1d9CFbF9deA593c7865", ethers.utils.parseEther("0.5")],
  ];
  // Get the deployed contract
  const yourContract = await hre.ethers.getContract("YourContract", deployer);

  let tx;
  for (const [address, amount] of streamTestData) {
    tx = await yourContract.addBuilderStream(address, amount);
    await tx.wait();
  }

  console.log("Transferring ownership to the frontend address: 0x34aA3F359A9D614239015126635CE7732c18fDF3");
  await yourContract.transferOwnership("0x34aA3F359A9D614239015126635CE7732c18fDF3");
  // console.log("Transferring ownership to the frontend address:", FRONTEND_ADDRESS);
  // await yourContract.transferOwnership(FRONTEND_ADDRESS);
  */
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
