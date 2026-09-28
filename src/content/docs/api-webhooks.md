---
title: "API & webhooks"
description: "Manage monitors as code and pipe events into your stack."
order: 4
updated: 2026-05-14
tags: ["API"]
---

Everything in the dashboard exists in the REST API — monitors, incidents, rotations, status pages.

## Quick example

```bash
curl -X POST https://api.vakt.demo/v1/monitors \
  -H "Authorization: Bearer $VAKT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Checkout","url":"https://shop.example.com/api/health","interval":60,"regions":["osl1","fra1","ams3"]}'
```

## Webhooks

Subscribe to `incident.opened`, `incident.acknowledged`, `incident.resolved` and `monitor.degraded`. Payloads are signed (`X-Vakt-Signature`, HMAC-SHA256) and retried with backoff for 24 hours.

## Terraform

The official provider manages monitors, notification policies and status pages. Example modules for a standard SaaS setup ship in the docs repo.
