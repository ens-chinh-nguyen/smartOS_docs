---
title: Frontend
description: Frontend architecture — stack, structure, and responsibilities.
---

# 🖥️ Frontend Architecture

_Placeholder — content coming soon._

## Stack

| Layer | Choice |
|---|---|
| Framework | _TBD_ |
| Styling | _TBD_ |
| State | _TBD_ |
| Build / deploy | _TBD_ |

## Responsibilities

- Render the UI and own client-side routing.
- Hold session state and attach auth tokens to API calls.
- Validate input before it reaches the backend — never as the only validation.

## Boundaries

- Talks to the backend over HTTPS/JSON only. No direct database access.
- Business rules live in the backend; the frontend mirrors them for UX, not for enforcement.
