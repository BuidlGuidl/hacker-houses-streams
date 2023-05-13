import React from "react";

const Faq = () => {
  return (
    <div className="max-w-3xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-primary-content bg-primary inline-block p-2">F.A.Q.</h1>

      <div className="space-y-6">
        <div className="">
          <h2 className="text-lg font-bold text-primary-content">What is the BG Sand Garden?</h2>
          <p>
            The BG Sand Garden is an initiative by BuidlGuidl aimed at funding focused, high-leverage open-source
            projects. By providing a monthly UBI to handpicked developers, we support ongoing contributions to the
            BuidlGuidl and the Ethereum ecosystem.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-primary-content">What are the core values of BG Sand Garden?</h2>
          <ul className="list-disc list-inside">
            <li>100% remote / 90% async</li>
            <li>Quality over quantity</li>
            <li>Continuous learning and improvement</li>
            <li>We are nice to each other</li>
            <li>Keeping things simple & avoid over-engineering / early optimizations</li>
            <li>Iterative spirit: Start simple (but complete) and build from there</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-primary-content">How can I join the BG Sand Garden?</h2>
          <p>The first step is to be a member of the BuidlGuild or part of any of the project-focused cohorts.</p>
          <p>
            People who have joined the BG Sand Garden have proven their ability to consistently deliver value and align
            with our core values. Candidates for the BG Sand Garden are handpicked by Carlos and the BG Sand Garden
            team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Faq;
