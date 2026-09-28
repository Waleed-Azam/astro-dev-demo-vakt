---
title: "Quickstart — first monitor in 4 minutes"
description: "Sign up, add a URL, get your first alert. No credit card, no sales call."
order: 1
updated: 2026-08-20
tags: ["Setup"]
---

## 1. Create your account

Sign up with work email or SSO. You'll land on an empty dashboard with a sample monitor you can delete.

## 2. Add your first monitor

Paste any URL — homepage, API health endpoint, checkout flow. Vakt detects the protocol and suggests sensible defaults:

- **Interval:** 60 seconds from 3 regions (upgradeable to 30s × 12 regions)
- **Alerts:** email immediately; Slack/PagerDuty after the second failure
- **Confirmations:** an outage needs 2 failing regions before it pages you (no 3am false alarms)

## 3. Trigger a test alert

Point a monitor at `https://httpstat.us/500` and watch the full path fire: detection → notification → incident timeline → recovery. Delete it after — or keep it as a canary.

## 4. Invite the team

Seats are free on trial. Set up an on-call rotation under **Team → Rotations** so alerts follow the sun, not your sleep.

> Next: [Uptime monitors](monitors) for advanced assertions, or [Status pages](status-pages) to publish your 99.9% to the world.
