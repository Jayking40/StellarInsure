"use client";

import React, { useState } from "react";
import { Icon } from "./icon";
import "./transaction-retry-ui.css";

export interface TransactionRetryUIProps {
  transactionId: number;
  transactionHash: string;
  transactionType: string;
  amount: number;
  onRetry: (transactionId: number) => Promise<void>;
  onDismiss?: () => void;
}

export function TransactionRetryUI({
  transactionId,
  transactionHash,
  transactionType,
  amount,
  onRetry,
  onDismiss,
}: TransactionRetryUIProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);
  const [retrySuccess, setRetrySuccess] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryError(null);
    setRetrySuccess(false);

    try {
      await onRetry(transactionId);
      setRetrySuccess(true);
      setRetryAttempts((prev) => prev + 1);
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        onDismiss?.();
      }, 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to retry transaction. Please try again.";
      setRetryError(errorMessage);
    } finally {
      setIsRetrying(false);
    }
  };

  if (retrySuccess) {
    return (
      <div className="tx-retry-container tx-retry-container--success" role="status" aria-live="polite">
        <div className="tx-retry-content">
          <span className="tx-retry-icon" aria-hidden="true">
            <Icon name="check" size="md" tone="success" />
          </span>
          <div className="tx-retry-message">
            <h3 className="tx-retry-title">Transaction Retry Successful</h3>
            <p className="tx-retry-description">
              Your {transactionType} transaction for {amount} XLM has been resubmitted to the network.
            </p>
          </div>
        </div>
        <button
          className="tx-retry-close"
          onClick={onDismiss}
          aria-label="Dismiss success message"
        >
          <Icon name="x" size="sm" tone="muted" />
        </button>
      </div>
    );
  }

  return (
    <div className="tx-retry-container" role="region" aria-label="Transaction retry options">
      <div className="tx-retry-content">
        <span className="tx-retry-icon" aria-hidden="true">
          <Icon name="alert-circle" size="md" tone="danger" />
        </span>
        <div className="tx-retry-message">
          <h3 className="tx-retry-title">Transaction Failed</h3>
          <p className="tx-retry-description">
            Your {transactionType} transaction for {amount} XLM failed to process. You can retry it now.
          </p>
          {retryAttempts > 0 && (
            <p className="tx-retry-attempts">
              Retry attempt {retryAttempts} of 3
            </p>
          )}
          {retryError && (
            <div className="tx-retry-error" role="alert">
              <Icon name="alert-triangle" size="sm" tone="danger" aria-hidden="true" />
              <span>{retryError}</span>
            </div>
          )}
        </div>
      </div>

      <div className="tx-retry-actions">
        <button
          className="tx-retry-btn tx-retry-btn--primary"
          onClick={handleRetry}
          disabled={isRetrying || retryAttempts >= 3}
          aria-busy={isRetrying}
          aria-label={isRetrying ? "Retrying transaction" : "Retry transaction"}
        >
          {isRetrying ? (
            <>
              <span className="tx-retry-spinner" aria-hidden="true" />
              Retrying...
            </>
          ) : retryAttempts >= 3 ? (
            <>
              <Icon name="x" size="sm" aria-hidden="true" />
              Max Retries Reached
            </>
          ) : (
            <>
              <Icon name="refresh-cw" size="sm" aria-hidden="true" />
              Retry Transaction
            </>
          )}
        </button>

        {onDismiss && (
          <button
            className="tx-retry-btn tx-retry-btn--secondary"
            onClick={onDismiss}
            disabled={isRetrying}
            aria-label="Dismiss retry options"
          >
            Dismiss
          </button>
        )}
      </div>

      <div className="tx-retry-info">
        <p className="tx-retry-info-text">
          <Icon name="info" size="sm" tone="muted" aria-hidden="true" />
          Transaction ID: <code>{transactionHash.slice(0, 16)}...</code>
        </p>
      </div>
    </div>
  );
}
