import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Menu } from "~~/components/Menu";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header
 */
export const Header = () => (
  <>
    <Head>
      <title>BG Sand Garden | BuidlGuidl Grants</title>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <meta
        name="description"
        content="We're running an experiment to fund focused, high-leverage open-source work by providing a monthly UBI to
            developers, handpicked by Carlos & BG Sand Garden, rewarding them for their ongoing contributions to
            BuidlGuidl and Ethereum Ecosystem."
      />
      <meta property="og:title" content="BG Sand Garden | BuidlGuidl Grants" />
      <meta
        property="og:description"
        content="We're running an experiment to fund focused, high-leverage open-source work by providing a monthly UBI to
            developers, handpicked by Carlos & BG Sand Garden, rewarding them for their ongoing contributions to
            BuidlGuidl and Ethereum Ecosystem."
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:image" content="https://sand-garden.vercel.app/thumbnail.png" />
      <meta property="twitter:image" content="https://sand-garden.vercel.app/thumbnail.png" />
    </Head>
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 p-4 items-start">
      <div className="flex-col items-start">
        <p className="m-0 text-xl md:text-3xl font-bold text-secondary !leading-7">
          <Link href="/">BG Sand Garden</Link>
        </p>
        <p className="m-0 text-secondary leading-5 opacity-50">BuidlGuidl Grants</p>
      </div>
      <div className="navbar-end flex-grow">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
    <Menu />
  </>
);
