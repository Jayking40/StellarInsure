# Kubernetes Deployment Guide

## Overview

Kubernetes manifests are organized using `kustomize`:

- `k8s/base`: shared resources for all environments.
- `k8s/overlays/staging`: staging overrides.
- `k8s/overlays/production`: production overlay.

## Resources Included

The base stack includes:

- Backend `Deployment` + `Service`
- Frontend `Deployment` + `Service`
- PostgreSQL `StatefulSet` + headless `Service`
- Redis `StatefulSet` + headless `Service`
- `Ingress` with TLS termination
- Backend `HorizontalPodAutoscaler`
- `ConfigMap` defaults and `Secret` template

## Secrets

Before applying manifests, create/update `stellarinsure-secrets` with real values.

Template reference: `k8s/base/secret-template.yaml`

Never commit populated secret manifests.

## Deploy Commands

```bash
kubectl apply -k k8s/overlays/staging
kubectl apply -k k8s/overlays/production
```

## Rolling Deployment Behavior

- Backend/frontend deployments use `RollingUpdate` with `maxUnavailable: 0`.
- HPA scales backend pods between 2 and 8 replicas based on CPU utilization.
