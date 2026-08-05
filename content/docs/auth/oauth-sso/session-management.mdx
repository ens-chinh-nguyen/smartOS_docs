---
title: Session Management & JWT Token Lifecycle
description: Specifications for Access/Refresh token Lifetimes (TTL), token rotation rules, and session revocation policies.
---

# ⏳ Session & Token Management

## 🎯 1. JWT Token Architecture & Lifetimes (TTL)

The system enforces a **Dual Token System**:

| Token Type | Storage Location | Time-To-Live (TTL) | Business Purpose |
| :--- | :--- | :--- | :--- |
| **Access Token** | Memory / Authorization Header | 15 Minutes | Short-lived API request authorization |
| **Refresh Token** | HttpOnly, Secure Cookie | 7 Days | Obtains new Access Tokens upon expiration |

---

## 🛑 2. Session Revocation Triggers

Active user sessions are revoked **immediately** under any of the following business conditions:

1. **User Sign-Out**: Clearing the Refresh Cookie and blacklisting the Refresh Token ID in Redis.
2. **Password Modification**: Triggered via [Account Security Settings](/docs/user/profile-management/account-settings) -> Signs out all other active devices.
3. **Role/Permission Alteration**: When an Admin modifies roles in [RBAC Permissions](/docs/user/rbac-permissions), all existing Access/Refresh Tokens are invalidated to force a fresh claim load.
4. **Account Suspension/Ban**: When an Admin bans a user in [User Account Lifecycle](/docs/user/rbac-permissions/user-lifecycle), all active sessions are instantly killed.

---

## 🔗 3. Related References

- 🔄 **Initial Issuance**: Tokens are generated via [Email/Password Login](/docs/auth/login-flow) or [OAuth SSO](/docs/auth/oauth-sso/google-github).
- 👤 **Session Control Panel**: Users view and manage active logins in [Account Settings](/docs/user/profile-management/account-settings).
- 🛡️ **Role Control**: See how RBAC modifications revoke sessions in [RBAC Permissions](/docs/user/rbac-permissions).
