# Hacker Houses Streams

Hacker Houses Streams aim to retroactively fund open-source work by providing a monthly UBI to open-source developers, handpicked by the Hacker House Leader, and rewarding them for their ongoing contributions to the ecosystem.

Chosen developers can submit their monthly projects, automatically claim grant streams, and showcase their work to the public.

![Placeholder image from Hacker-Houses-Streams](https://user-images.githubusercontent.com/55535804/241392637-f9719113-165e-481a-a0a5-6bf4b343ce1a.png)

**Stream mechanism:**

- Each developer has set a monthly MAX stream.
- They can do partial or full withdrawals of their available stream when they make a contribution.
- After each withdrawal, their available stream gets recharged over the next 30 days.

If you want to set your own Hacker House Stream, you can fork this project, where you'll find all the tools to kick it off.

## Features of the Contract

We provide a contract that includes basic features for your Hacker House Stream.

- **Donations to the Hacker House**. Anyone can show their support to the Hacker House by providing funds, and a message for the team.
- **List of hackers and their MAX monthly stream**.
- **Withdrawals from the hackers**. Each hacker can do withdrawals from their available streams when they contribute to a Hacker House project.
- **Rechargable streams**. After a withdrawal, the hacker's monthly stream gets recharged during the next 30 days, until reaching their cap (MAX monthly stream).

## Hacker House Website

You get a generic template to set your Hacker House Website. Feel free to add all the visual and copy changes to adapt it to your Hacker House. The template it's a one-page with:

- **Hacker House welcome**
- **List of hackers and their streams** (current available and monthly max)
- **List of contributions made by hackers** (text submitted by developers for each withdrawal). In that text they can share links to their work (PR, Repo, design..)

Here you can view some of the current Hacker Houses.

| Hacker House         | Links                                                                                                                                   | Description                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Jessy's Hacker House | [Repo](https://github.com/BuidlGuidl/hacker-houses-streams/tree/jessy-streams-hacker-house) [Live](https://hackerhouse.buidlguidl.com/) | One-page template with Jessy's Hacker House design touch                                           |
| Sand Garden          | [Repo](https://github.com/BuidlGuidl/hacker-houses-streams/tree/carlos-sand-garden) [Live](http://sandgarden.buidlguidl.com/)           | Multi-page template, includes a Projects section with the list of the projects they are working on |

## Steps to set your own Hacker House

You'll need to complete a few steps to have your Hacker House running:

- [0. Checking prerequisites](#0-checking-prerequisites)
- [1. Clone/Fork this repo & install dependencies](#1-clonefork-this-repo--install-dependencies)
- [2. Configure on-chain data for your Hacker House Stream](#2-configure-on-chain-data-for-your-hacker-house-stream)
- [3. Configure website](#3-configure-website)
- [4. Test your local environment](#4-test-your-local-environment)
- [5. Deploy to a Live Network](#5-deploy-to-a-live-network)
  - [5.1 Deploy your Smart Contracts](#51-deploy-your-smart-contracts)
  - [5.2 Deploy your NextJS App](#52-deploy-your-nextjs-app)
  - [5.3 Disabling type and linting error checks](#53-disabling-type-and-linting-error-checks)

### 0. Checking prerequisites

This project is powered by [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2). Before you begin, make sure you meet its requirements:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

### 1. Clone/Fork this repo & install dependencies

```shell
git clone https://github.com/buidlguidl/hacker-houses-streams.git
cd hacker-houses-streams
yarn install
```

### 2. Configure on-chain data for your Hacker House Stream

After forking this generic Hacker House Stream repo, you'll need to tweak it for your House, starting with contract parameters.

- Paste your builder's addresses into `builderList.ts`.

  ```jsx
  const builderList = [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    "0x60583563d5879c2e59973e5718c7de2147971807",
  ];
  ```

  > **Note:** Add the Ethereum Address `0x...`, ENS names will get resolved at the front-end.

- Check the contract deploy script in `packages/hardhat/deploy/00_deploy_your_contract.ts`.

  - Adapt monthly stream for each builder.

    ```jsx
    const builderStakes = Array(builderList.length).fill("500000000000000000");
    ```

  - Transfer ownership from the contract to the Leader of the Hacker House.

    ```jsx
    console.log("🏷 handing ownership over to atg.eth");
    await yourContract.transferOwnership(
      "0x34aA3F359A9D614239015126635CE7732c18fDF3"
    );
    ```

- Make sure to check `packages/nextjs/scaffold.config.ts`.
  - You might want to change `targetNetwork` to `chains.hardhat` for local testing.

### 3. Configure website

- Set your metadata on `packages/nextjs/pages/index.tsx`:
  ```jsx
  <Head>
    <title>Your Hacker House | BuidlGuidl Grants</title>
    <meta
      name="description"
      content="We're running an experiment to retroactively fund open-source work by providing a monthly UBI to open-source developers, handpicked by Your-name and Your Hacker House, and rewarding them for their ongoing contributions to the ecosystem."
    />
    <meta property="og:title" content="Your Hacker House | BuidlGuidl Grants" />
    <meta
      property="og:description"
      content="We're running an experiment to retroactively fund open-source work by providing a monthly UBI to open-source developers, handpicked by Your-name and Your Hacker House, and rewarding them for their ongoing contributions to the ecosystem."
    />
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      property="og:image"
      content="https://hackerhouse.buidlguidl.com/thumbnail.png"
    />
    <meta
      property="twitter:image"
      content="https://hackerhouse.buidlguidl.com/thumbnail.png"
    />
  </Head>
  ```
- Adapt generic template copys on `packages/nextjs/pages/index.tsx`.
- Customize Look and Feel for each component, you can use Tailwind CSS and daisyUI.
  - `packages/nextjs/pages/index.tsx`
  - `packages\nextjs\tailwind.config.js`
  - `packages\nextjs\styles\globals.css`

### 4. Test your local environment

1. Start your NextJS app:

   ```shell
   yarn start
   ```

   Visit your app on: `http://localhost:3000`.

   ***

   If you want to test the contract locally, you can do so by following steps 2 and 3.
   Remember to can tweak the app config in `packages/nextjs/scaffold.config.ts` so it points to the local network.

   If your app is pointing to a live network, copy `.env.example` to `.env` and fill in the required keys.

2. Run a local network on a second terminal:

   ```shell
   yarn chain
   ```

   This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.js`.

3. On a third terminal, deploy the test contract:

   ```shell
   yarn deploy
   ```

   This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

### 5. Deploy to a Live Network

When you deploy to a live network, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_DEPLOY_BLOCK` to the right value (it optimizes the reading of events)

- Make sure to add that ENVAR to your Vercel project as well.

#### 5.1 Deploy your Smart Contracts

Once you are ready to deploy your smart contracts, there are a few things you need to adjust.

1. Select the network

By default, `yarn deploy` will deploy the contract to the local network. You can change the defaultNetwork in `packages/hardhat/hardhat.config.js.` You could also simply run `yarn deploy --network target_network` to deploy to another network.

Check the `hardhat.config.js` for the networks that are pre-configured. You can also add other network settings to the `hardhat.config.js file`. Here are the [Alchemy docs](https://docs.alchemy.com/docs/how-to-add-alchemy-rpc-endpoints-to-metamask) for information on specific networks.

Example: To deploy the contract to the Sepolia network, run the command below:

```shell
yarn deploy --network sepolia
```

2. Generate a new account or add one to deploy the contract(s) from. Additionally you will need to add your Alchemy API key. Rename `.env.example` to `.env` and fill the required keys.

```jsx
(ALCHEMY_API_KEY = ""), (DEPLOYER_PRIVATE_KEY = "");
```

The deployer account is the account that will deploy your contracts. Additionally, the deployer account will be used to execute any function calls that are part of your deployment script.

You can generate a random account / private key with `yarn generate` or add the private key of your crypto wallet. `yarn generate` will create a random account and add the DEPLOYER_PRIVATE_KEY to the .env file. You can check the generated account with `yarn account`.

3. Deploy your smart contract(s)

Run the command below to deploy the smart contract to the target network. Make sure to have some funds in your deployer account to pay for the transaction.

```shell
yarn deploy --network network_name
```

4. Verify your smart contract

You can verify your smart contract on Etherscan by running:

```shell
yarn verify --network network_name
```

#### 5.2 Deploy your NextJS App

Run `yarn vercel` and follow the steps to deploy to Vercel. Once you log in (email, github, etc), the default options should work. It'll give you a public URL.

If you want to redeploy to the same production URL you can run `yarn vercel --prod`. If you omit the `--prod` flag it will deploy it to a preview/test URL.

**Make sure your `packages/nextjs/scaffold.config.ts` file has the values you need.**

**Hint**: We recommend connecting the project GitHub repo to Vercel so you the gets automatically deployed when pushing to `main`

#### 5.3 Disabling type and linting error checks

> **Hint**
> Typescript helps you catch errors at compile time, which can save time and improve code quality, but can be challenging for those who are new to the language or who are used to the more dynamic nature of JavaScript. Below are the steps to disable type & lint check at different levels

##### Disabling commit checks

We run `pre-commit` [git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) which lints the staged files and don't let you commit if there is an linting error.

To disable this, go to `.husky/pre-commit` file and comment out `yarn lint-staged --verbose`

```diff
- yarn lint-staged --verbose
+ # yarn lint-staged --verbose
```

##### Deploying to Vercel without any checks

Vercel by default runs types and lint checks while developing `build` and deployment fails if there is a types or lint error.

To ignore types and lint error checks while deploying, use :

```shell
yarn vercel:yolo
```

##### Disabling Github Workflow

We have github workflow setup checkout `.github/workflows/lint.yaml` which runs types and lint error checks every time code is **pushed** to `main` branch or **pull request** is made to `main` branch

To disable it, **delete `.github` directory**
