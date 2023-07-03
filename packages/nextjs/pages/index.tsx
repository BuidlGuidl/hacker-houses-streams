import React from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { StreamContractInfo } from "~~/components/StreamContractInfo";

const Home: NextPage = () => {
  return (
    <>
      <div className="max-w-3xl px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-primary-content bg-primary inline-block p-2">Welcome</h1>
        <div>
          <p className="mt-0">
            We're running an experiment to fund focused, high-leverage open-source work by providing a monthly UBI to
            developers, handpicked by Carlos & BG Sand Garden, rewarding them for their ongoing contributions to
            BuidlGuidl and the Ethereum Ecosystem.
          </p>
          <p>
            Our emphasis is on quality over quantity, striving for well-crafted products. Our approach embraces
            iteration, refining our builds while fostering a culture of continuous learning and improvement.
          </p>
          <p>
            <Link href="/members" className="link link-primary">
              Members
            </Link>{" "}
            contributing to any of the active{" "}
            <Link href="/projects" className="link link-primary">
              projects
            </Link>{" "}
            can submit their work and claim grant streams, while showcasing their contributions to the public.
          </p>
          <p>This initiative is made possible by BuidlGuidl!</p>
          <p>
            Read more at the{" "}
            <Link href="/faq" className="link link-primary">
              F.A.Q
            </Link>
          </p>
        </div>
        <div className="mb-10">
          <StreamContractInfo showWithdrawButton={false} />
        </div>
      </div>
    </>
  );
};

export default Home;
