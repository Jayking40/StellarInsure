"use client";

import React from "react";
import { Icon, type IconName } from "./icon";
import { Skeleton } from "./skeleton";

export type LifecycleEventType =
  | "created"
  | "premium_paid"
  | "trigger_met"
  | "payout"
  | "expired"
  | "cancelled";

export interface LifecycleEvent {
  id: string;
  type: LifecycleEventType;
  label: string;
  description: string;
  timestamp: string;
  amount?: number;
  txHash?: string;
}

interface PolicyLifecycleTimelineProps {
  events: LifecycleEvent[];
  isLoading?: boolean;
}

const EVENT_CONFIG: Record<
  LifecycleEventType,
  {
    icon: IconName;
    tone: "accent" | "success" | "warning" | "danger" | "muted";
  }
> = {
  created: { icon: "document", tone: "accent" },
  premium_paid: { icon: "wallet", tone: "accent" },
  trigger_met: { icon: "zap", tone: "warning" },
  payout: { icon: "spark", tone: "success" },
  expired: { icon: "clock", tone: "muted" },
  cancelled: { icon: "close", tone: "danger" },
};

function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortenHash(hash: string): string {
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

const STELLAR_EXPLORER_BASE = "https://stellar.expert/explorer/testnet/tx/";

export function PolicyLifecycleTimeline({
  events,
  isLoading = false,
}: PolicyLifecycleTimelineProps) {
  if (isLoading) {
    return (
      <div
        className="plc-timeline"
        aria-busy="true"
        aria-label="Loading policy timeline"
      >
        <span className="visually-hidden">
          Loading policy timeline, please wait.
        </span>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`sk-${i}`} className="plc-event plc-event--skeleton">
            <div className="plc-event__icon-col" aria-hidden="true">
              <Skeleton
                style={{ width: 36, height: 36, borderRadius: "50%" }}
              />
              {i < 2 && <span className="plc-connector" aria-hidden="true" />}
            </div>
            <div className="plc-event__body">
              <Skeleton
                style={{ height: 14, width: 120, marginBottom: "0.4rem" }}
              />
              <Skeleton style={{ height: 12, width: 200 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="plc-empty" role="status">
        <span className="plc-empty__icon" aria-hidden="true">
          <Icon name="clock" size="lg" tone="muted" />
        </span>
        <p>No lifecycle events recorded yet.</p>
      </div>
    );
  }

  return (
    <ol className="plc-timeline" aria-label="Policy lifecycle events">
      {events.map((event, index) => {
        const config = EVENT_CONFIG[event.type];
        return (
          <li key={event.id} className={`plc-event plc-event--${event.type}`}>
            <div className="plc-event__icon-col" aria-hidden="true">
              <span className="plc-event__icon">
                <Icon name={config.icon} size="sm" tone={config.tone} />
              </span>
              {index < events.length - 1 && (
                <span className="plc-connector" aria-hidden="true" />
              )}
            </div>
            <div className="plc-event__body">
              <div className="plc-event__header">
                <strong className="plc-event__label">{event.label}</strong>
                <time className="plc-event__time" dateTime={event.timestamp}>
                  {formatEventDate(event.timestamp)}
                </time>
              </div>
              <p className="plc-event__desc">{event.description}</p>
              {event.amount !== undefined && (
                <span className="plc-event__amount">
                  {event.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 7,
                  })}{" "}
                  XLM
                </span>
              )}
              {event.txHash && (
                <a
                  href={`${STELLAR_EXPLORER_BASE}${event.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="plc-event__tx-link"
                  aria-label={`View transaction ${shortenHash(event.txHash)} on Stellar Explorer`}
                >
                  {shortenHash(event.txHash)}
                  <Icon name="arrow-up-right" size="sm" tone="accent" />
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
