---
title: Backend
description: Backend architecture — services, data stores, and the API surface.
---

# ⚙️ Backend Architecture

_Placeholder — content coming soon._

## Stack

| Layer | Choice |
|---|---|
| Runtime | _TBD_ |
| Framework | _TBD_ |
| Database | _TBD_ |
| Cache / queue | _TBD_ |

## Responsibilities

- Own all business rules and authorization decisions.
- Issue and revoke sessions — see [Session Management](/docs/auth/oauth-sso/session-management).
- Persist data and guarantee its consistency.

## Boundaries

- The API is the only public surface. Internal services are not reachable from clients.
- Every request is authenticated and authorized server-side, regardless of what the client sends.
