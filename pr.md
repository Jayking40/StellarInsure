# PR Description: StellarInsure Performance & Logic Enhancements

This Pull Request addresses several frontend features and contract-level improvements to enhance the reliability and usability of the StellarInsure protocol.

## Changes:

### Smart Contracts (#20)
- **Improved Claim Payout Logic**: Implemented contract balance verification before processing payouts.
- **Treasury Tracking**: Added storage support for tracking total premiums collected and total payouts distributed.
- **Enhanced Events**: Introduced `PayoutEvent` for better transparency during token transfers.
- **Error Handling**: Added `InsufficientContractBalance` error to handle treasury shortfalls.
- **Treasury Queries**: Added `get_treasury_stats` method to monitor protocol health.

### Frontend Enhancements (#76, #74, #84)
- **Trigger Condition Builder**: Replaced free-text trigger input with a rule-based condition builder for threshold selection (e.g., Temperature > 35°C).
- **Premium Estimate Panel**: Added a reusable estimation panel with breakdown details and recalculation states.
- **Validation Error Summary**: Implemented a top-level validation summary component that anchors to invalid fields for better UX.

## Fixes:
- Fixes: #20 fixed
- Fixes: #74 fixed
- Fixes: #76 fixed
- Fixes: #84 fixed

## Checklist:
- [x] Contract logic verified for balance safety.
- [x] Frontend components match the premium design system.
- [x] Responsive behavior validated for mobile/desktop.
- [x] New events and storage keys integrated.
- [x] Validation flow improved with clickable summaries.
