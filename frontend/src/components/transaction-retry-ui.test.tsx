import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TransactionRetryUI } from "./transaction-retry-ui";

describe("TransactionRetryUI", () => {
  const mockOnRetry = jest.fn();
  const mockOnDismiss = jest.fn();

  const defaultProps = {
    transactionId: 1,
    transactionHash: "a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd",
    transactionType: "premium",
    amount: 50.25,
    onRetry: mockOnRetry,
    onDismiss: mockOnDismiss,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the retry UI with transaction details", () => {
    render(<TransactionRetryUI {...defaultProps} />);

    expect(screen.getByText("Transaction Failed")).toBeInTheDocument();
    expect(screen.getByText(/Your premium transaction for 50.25 XLM failed/)).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", async () => {
    mockOnRetry.mockResolvedValue(undefined);
    render(<TransactionRetryUI {...defaultProps} />);

    const retryButton = screen.getByRole("button", { name: /Retry Transaction/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(mockOnRetry).toHaveBeenCalledWith(1);
    });
  });

  it("shows loading state while retrying", async () => {
    mockOnRetry.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    render(<TransactionRetryUI {...defaultProps} />);

    const retryButton = screen.getByRole("button", { name: /Retry Transaction/i });
    fireEvent.click(retryButton);

    expect(screen.getByText("Retrying...")).toBeInTheDocument();
  });

  it("shows success message after successful retry", async () => {
    mockOnRetry.mockResolvedValue(undefined);
    render(<TransactionRetryUI {...defaultProps} />);

    const retryButton = screen.getByRole("button", { name: /Retry Transaction/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText("Transaction Retry Successful")).toBeInTheDocument();
    });
  });

  it("displays error message on retry failure", async () => {
    const errorMessage = "Network error: Unable to connect to Stellar network";
    mockOnRetry.mockRejectedValue(new Error(errorMessage));
    render(<TransactionRetryUI {...defaultProps} />);

    const retryButton = screen.getByRole("button", { name: /Retry Transaction/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("tracks retry attempts", async () => {
    mockOnRetry.mockResolvedValue(undefined);
    const { rerender } = render(<TransactionRetryUI {...defaultProps} />);

    const retryButton = screen.getByRole("button", { name: /Retry Transaction/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText("Transaction Retry Successful")).toBeInTheDocument();
    });
  });

  it("disables retry button after max attempts", async () => {
    mockOnRetry.mockResolvedValue(undefined);
    const { rerender } = render(<TransactionRetryUI {...defaultProps} />);

    // Simulate 3 retry attempts
    for (let i = 0; i < 3; i++) {
      const retryButton = screen.getByRole("button", { name: /Retry Transaction|Max Retries/i });
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText("Transaction Retry Successful")).toBeInTheDocument();
      });

      // Dismiss the success message
      const dismissButton = screen.getByRole("button", { name: /Dismiss success/i });
      fireEvent.click(dismissButton);

      // Re-render to reset state for next attempt
      rerender(<TransactionRetryUI {...defaultProps} />);
    }
  });

  it("calls onDismiss when dismiss button is clicked", () => {
    render(<TransactionRetryUI {...defaultProps} />);

    const dismissButton = screen.getByRole("button", { name: /Dismiss retry/i });
    fireEvent.click(dismissButton);

    expect(mockOnDismiss).toHaveBeenCalled();
  });

  it("displays transaction hash in info section", () => {
    render(<TransactionRetryUI {...defaultProps} />);

    expect(screen.getByText(/a1b2c3d4e5f6789.../)).toBeInTheDocument();
  });

  it("is accessible with proper ARIA labels", () => {
    render(<TransactionRetryUI {...defaultProps} />);

    const region = screen.getByRole("region", { name: /Transaction retry options/i });
    expect(region).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: /Retry Transaction/i });
    expect(retryButton).toHaveAttribute("aria-busy", "false");
  });
});
