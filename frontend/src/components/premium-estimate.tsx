"use client";

import React from "react";
import { Icon } from "@/components/icon";

export interface PremiumBreakdown {
  label: string;
  amount: string;
  unit: string;
  tooltip?: string;
}

interface PremiumEstimateProps {
  isLoading?: boolean;
  isError?: boolean;
  totalAmount: string;
  currency: string;
  breakdown?: PremiumBreakdown[];
  onRecalculate?: () => void;
}

export function PremiumEstimate({
  isLoading,
  isError,
  totalAmount,
  currency,
  breakdown = [],
  onRecalculate,
}: PremiumEstimateProps) {
  if (isError) {
    return (
      <div className="premium-estimate premium-estimate--error" role="alert">
        <Icon name="alert" size="md" tone="warning" />
        <div className="premium-estimate__error-body">
          <p>Failed to calculate premium estimate.</p>
          {onRecalculate && (
            <button className="cta-secondary" type="button" onClick={onRecalculate}>
              Retry Calculation
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`premium-estimate ${isLoading ? "premium-estimate--loading" : ""}`}>
      <div className="premium-estimate__header">
        <h3 className="panel-heading">Premium Estimate</h3>
        {isLoading && (
          <span className="premium-estimate__spinner" aria-label="Calculating estimate...">
            <Icon name="clock" size="sm" tone="accent" />
          </span>
        )}
      </div>

      <div className="premium-estimate__total">
        <span className="metadata-label">Total Premium</span>
        <div className="premium-estimate__total-value">
          <strong>{totalAmount}</strong>
          <span>{currency}</span>
        </div>
      </div>

      {breakdown.length > 0 && (
        <dl className="premium-breakdown">
          {breakdown.map((item, index) => (
            <div key={index} className="premium-breakdown__row">
              <dt>
                {item.label}
                {item.tooltip && (
                  <span className="premium-breakdown__info" title={item.tooltip}>
                    <Icon name="help" size="sm" tone="muted" />
                  </span>
                )}
              </dt>
              <dd>
                {item.amount} {item.unit}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <p className="premium-estimate__disclaimer">
        Estimation is based on current network fees and actuarial data. Final premium is confirmed
        upon signing.
      </p>

      {onRecalculate && !isLoading && (
        <button
          className="cta-secondary premium-estimate__recalc"
          type="button"
          onClick={onRecalculate}
        >
          <Icon name="refresh" size="sm" tone="accent" />
          Recalculate
        </button>
      )}
    </div>
  );
}
