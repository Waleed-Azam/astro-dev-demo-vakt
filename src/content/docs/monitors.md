---
title: "Uptime monitors & assertions"
description: "Beyond ping: status codes, body matching, latency budgets and multi-step checks."
order: 2
updated: 2026-07-11
tags: ["Monitors"]
---

A Vakt monitor is a small contract: *this URL must behave like this, this fast, from these places.*

## Assertions

Each check can assert on:

- **Status code** — exact, range, or "not 5xx"
- **Body contains / JSON path** — e.g. `$.status == "ok"`
- **Latency budget** — fail the check (not just warn) past your p99 target
- **Certificate expiry** — alert 30/14/7 days out, automatically

## Multi-region consensus

Single-region blips are noise. Vakt only opens an incident when **2 of 3** (or 3 of 5) regions agree — configurable per monitor. Our regions include Oslo, Frankfurt, Amsterdam, London, Ashburn and Singapore.

## Multi-step flows

Pro plans can script login → add-to-cart → checkout as one monitor with per-step screenshots on failure. Write steps in YAML or record them in the browser extension.
