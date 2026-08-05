---
title: Role-Based Access Control (RBAC)
description: Detailed permission matrix for ADMIN, MANAGER, and MEMBER user roles across system resources.
---

# 👑 Role-Based Access Control (RBAC)

## 🎯 1. Access Control Model
The application adopts a **Role-Based Access Control (RBAC)** architecture. Every user is assigned one or more Roles, and each Role encompasses a discrete set of granular Permissions.

---

## 📊 2. Permission Matrix

| System Resource / Action | ADMIN | MANAGER | MEMBER |
| :--- | :---: | :---: | :---: |
| Read Own Profile | ✅ | ✅ | ✅ |
| Update Own Profile | ✅ | ✅ | ✅ |
| View System Users List | ✅ | ✅ | ❌ |
| Update User Role | ✅ | ❌ | ❌ |
| Ban / Suspend User Account | ✅ | ✅ | ❌ |
| Delete User Account | ✅ | ❌ | ❌ |

---

## ⚡ 3. Real-Time Impact of Role Changes on Sessions

When an Administrator modifies a user's Role:
1. The Backend updates the `user_roles` database record.
2. An Invalidate Signal is emitted to the Redis store managed by [Auth Session Management](/docs/auth/oauth-sso/session-management).
3. On the user's next API request, the [Active Access Token](/docs/auth/login-flow) is rejected, forcing a token re-issuance with updated role claims.

---

## 🔗 4. Related References

- 🚫 **Account Suspensions**: Review ban enforcement rules in [Account Lifecycle & Lockout](/docs/user/rbac-permissions/user-lifecycle).
- 🔑 **Default OAuth Role**: Social sign-ups via [Google/GitHub OAuth](/docs/auth/oauth-sso/google-github) default to `MEMBER`.
- 🔐 **Token Invalidation**: Learn backend details in [Session Management](/docs/auth/oauth-sso/session-management).
