import React from "react";

const Faq = () => {
  return (
    <div className="max-w-3xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-secondary bg-primary inline-block p-2">F.A.Q.</h1>

      <div className="space-y-10">
        <div>
          <h2 className="font-bold text-secondary">What is the BG Sand Garden?</h2>
          <p>
            The BG Sand Garden is an initiative by BuidlGuidl aimed at funding focused, high-leverage open-source
            projects. By providing a monthly UBI to handpicked developers, we support ongoing contributions to the
            BuidlGuidl and the Ethereum ecosystem.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-secondary">
            What is the difference between the BuidlGuidl and the BG Sand Garden?
          </h2>
          <p>
            The BG Sand Garden is just a working group inside the BuidlGuidl community. Maintaining the spirit of the
            BuidlGuidl – learning and experimentation – the BG Sand Garden adds intentionality, a focus on quality, and
            commits to delivering complete projects.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-secondary">What are the core values of the BG Sand Garden?</h2>
          <ul className="list-disc list-inside">
            <li>100% remote / 90% async</li>
            <li>Quality over quantity</li>
            <li>Continuous learning and improvement</li>
            <li>Keeping things simple & avoid over-engineering / early optimizations</li>
            <li>Iterative spirit: Start simple (but complete) and build from there</li>
            <li>Avoid bloated processes</li>
            <li>Being nice to each other</li>
            <li>Self-accountability</li>
            <li>Self-organization</li>
            <li>Keeping your peers in the loop</li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-secondary">How can I join the BG Sand Garden?</h2>
          <p>There is no single path or application process to join the BG Sand Garden.</p>
          <p>
            Members are usually part of the BuidlGuidl or participant in any of the project-focused cohorts, and have
            proven their ability to consistently deliver value and align with our core values.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-secondary">How do streams work?</h2>
          <p>
            Streams represent the MAX amount that a developer can withdraw each month. When full, it doesn't recharge
            until a withdrawal is made.
          </p>
          <p>Developers can withdraw from their stream when working on any of the BG Sand Garden's projects.</p>
        </div>
        <div>
          <h2 className="font-bold text-secondary">Who is funding this initiative?</h2>
          <p>The BG Sand Garden is funded by the BuidlGuidl.</p>
        </div>
      </div>
    </div>
  );
};

export default Faq;
