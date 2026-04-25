import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  PolicyLifecycleTimeline,
  type LifecycleEvent,
} from "./policy-lifecycle-timeline";

const MOCK_EVENTS: LifecycleEvent[] = [
  {
    id: "evt-1",
    type: "created",
    label: "Policy Created",
    description: "Policy was deployed on the Stellar network.",
    timestamp: "2026-03-01T08:00:00.000Z",
  },
  {
    id: "evt-2",
    type: "premium_paid",
    label: "Premium Paid",
    description: "Initial premium deposited into the policy vault.",
    timestamp: "2026-03-01T09:00:00.000Z",
    amount: 125.5,
    txHash: "a1b2c3d4e5f6789012345678901234567890abcd",
  },
  {
    id: "evt-3",
    type: "trigger_met",
    label: "Trigger Condition Met",
    description: "Oracle confirmed rainfall below threshold.",
    timestamp: "2026-04-10T14:00:00.000Z",
  },
  {
    id: "evt-4",
    type: "payout",
    label: "Payout Issued",
    description: "Payout sent to the policyholder wallet.",
    timestamp: "2026-04-10T14:05:00.000Z",
    amount: 5000,
    txHash: "b2c3d4e5f6789012345678901234567890abcde",
  },
];

describe("PolicyLifecycleTimeline", () => {
  it("renders all lifecycle events", () => {
    render(<PolicyLifecycleTimeline events={MOCK_EVENTS} />);
    expect(screen.getByText("Policy Created")).toBeInTheDocument();
    expect(screen.getByText("Premium Paid")).toBeInTheDocument();
    expect(screen.getByText("Trigger Condition Met")).toBeInTheDocument();
    expect(screen.getByText("Payout Issued")).toBeInTheDocument();
  });

  it("renders event descriptions", () => {
    render(<PolicyLifecycleTimeline events={MOCK_EVENTS} />);
    expect(
      screen.getByText(/deployed on the Stellar network/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/oracle confirmed/i)).toBeInTheDocument();
  });

  it("renders amounts when provided", () => {
    render(<PolicyLifecycleTimeline events={MOCK_EVENTS} />);
    expect(screen.getByText(/125\.50 XLM/i)).toBeInTheDocument();
    expect(screen.getByText(/5,000\.00 XLM/i)).toBeInTheDocument();
  });

  it("renders tx hash links with accessible labels", () => {
    render(<PolicyLifecycleTimeline events={MOCK_EVENTS} />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows empty state when no events", () => {
    render(<PolicyLifecycleTimeline events={[]} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/no lifecycle events/i)).toBeInTheDocument();
  });

  it("shows loading skeleton when isLoading is true", () => {
    const { container } = render(
      <PolicyLifecycleTimeline events={[]} isLoading />,
    );
    expect(container.querySelector(".ob-skeleton")).toBeTruthy();
    expect(screen.getByText(/loading policy timeline/i)).toBeInTheDocument();
  });

  it("has accessible list label", () => {
    render(<PolicyLifecycleTimeline events={MOCK_EVENTS} />);
    expect(
      screen.getByRole("list", { name: "Policy lifecycle events" }),
    ).toBeInTheDocument();
  });

  it("renders timestamps as time elements", () => {
    const { container } = render(
      <PolicyLifecycleTimeline events={MOCK_EVENTS} />,
    );
    const timeEls = container.querySelectorAll("time");
    expect(timeEls.length).toBe(MOCK_EVENTS.length);
  });
});
