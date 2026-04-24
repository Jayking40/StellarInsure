# Staging Environment Guide

## Purpose

`staging` is a production-like environment used for QA validation before promoting changes to `master`.

## Access

- Frontend: `https://staging.stellarinsure.example.com`
- Backend API: `https://api.staging.stellarinsure.example.com`

## Deployment Flow

- Pushes to `release/**` trigger `.github/workflows/staging-deploy.yml`.
- The workflow applies `k8s/overlays/staging`.
- A seed step runs `python -m src.seed_staging` when staging DB secrets are configured.

## Required GitHub Secrets

- `STAGING_KUBECONFIG`
- `STAGING_DATABASE_URL`
- `STAGING_JWT_SECRET_KEY`
- `STAGING_WEBHOOK_SECRET_KEY`
- `STAGING_STORAGE_SECRET_KEY`

## Staging Configuration

Use `backend/.env.staging.example` as the baseline. Key staging behaviors:

- `ENVIRONMENT=staging`
- Staging-specific CORS and base URLs
- Feature flags enabled for pre-production testing:
  - `FEATURE_FLAG_ORACLE_V2=true`
  - `FEATURE_FLAG_CLAIM_AUTO_APPROVAL=true`
  - `FEATURE_FLAG_POOL_REBALANCING=true`

## Seeded Data

The staging seed script adds deterministic sample users and an active sample policy for QA smoke tests.
