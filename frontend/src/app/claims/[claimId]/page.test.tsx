import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ClaimDetailPageClient from "./claim-detail-page-client";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("ClaimDetailPageClient", () => {
  it("shows loading skeleton initially", () => {
    const { container } = render(
      <ClaimDetailPageClient params={{ claimId: "CLM-0091" }} />,
    );
    expect(container.querySelector(".ob-skeleton")).toBeTruthy();
  });

  it("renders claim summary after loading", async () => {
    render(<ClaimDetailPageClient params={{ claimId: "CLM-0091" }} />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "CLM-0091" }),
      ).toBeInTheDocument(),
    );
    expect(screen.getByText("Claim Summary")).toBeInTheDocument();
    expect(
      screen.getByText("Northern Plains Weather Guard"),
    ).toBeInTheDocument();
  });

  it("renders evidence section", async () => {
    render(<ClaimDetailPageClient params={{ claimId: "CLM-0091" }} />);
    await waitFor(() =>
      expect(screen.getByText("Evidence")).toBeInTheDocument(),
    );
    expect(screen.getByText("Rainfall Station Export")).toBeInTheDocument();
    expect(screen.getByText(/NOAA Weather API/i)).toBeInTheDocument();
  });

  it("renders review events section", async () => {
    render(<ClaimDetailPageClient params={{ claimId: "CLM-0091" }} />);
    await waitFor(() =>
      expect(screen.getByText("Review Events")).toBeInTheDocument(),
    );
    // "Evidence Verified" appears in both review events and lifecycle - use getAllByText
    expect(
      screen.getAllByText("Evidence Verified").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Claim Approved")).toBeInTheDocument();
  });

  it("renders lifecycle timeline section", async () => {
    render(<ClaimDetailPageClient params={{ claimId: "CLM-0091" }} />);
    await waitFor(() =>
      expect(screen.getByText("Claim Lifecycle")).toBeInTheDocument(),
    );
    expect(
      screen.getAllByText("Claim Submitted").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Payout Issued")).toBeInTheDocument();
  });

  it("renders payout amount and tx link for approved claim", async () => {
    render(<ClaimDetailPageClient params={{ claimId: "CLM-0091" }} />);
    await waitFor(() =>
      expect(
        screen.getAllByText(/4,500\.00 XLM/i).length,
      ).toBeGreaterThanOrEqual(1),
    );
    expect(
      screen.getByRole("link", {
        name: /view payout transaction on stellar explorer/i,
      }),
    ).toBeInTheDocument();
  });

  it("shows pending status for pending claim", async () => {
    render(<ClaimDetailPageClient params={{ claimId: "CLM-0042" }} />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "CLM-0042" }),
      ).toBeInTheDocument(),
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows error state for unknown claim", async () => {
    render(<ClaimDetailPageClient params={{ claimId: "CLM-unknown" }} />);
    await waitFor(() =>
      expect(screen.getByText(/claim not found/i)).toBeInTheDocument(),
    );
    expect(
      screen.getByRole("link", { name: /back to policies/i }),
    ).toBeInTheDocument();
  });

  it("shows error state for error record", async () => {
    render(<ClaimDetailPageClient params={{ claimId: "CLM-error" }} />);
    await waitFor(() =>
      expect(screen.getByText(/claim not found/i)).toBeInTheDocument(),
    );
  });

  it("has accessible main landmark", async () => {
    render(<ClaimDetailPageClient params={{ claimId: "CLM-0091" }} />);
    await waitFor(() => expect(screen.getByRole("main")).toBeInTheDocument());
  });
});
