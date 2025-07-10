# Outreach-Hub

**Outreach-Hub** is a multi-tenant SaaS platform designed for businesses to efficiently manage their contacts, create message templates, and run targeted campaigns. Built as a full-stack web application, it helps developers progressively learn and implement core backend and frontend technologies.

---

## -> Project Summary

Outreach-Hub offers two distinct portals:

### - Admin Portal

For admin users to:
- Manage business workspaces
- Manage workspace users

### - OutreachHub Portal

For workspace users to:

- Manage and tag contacts
- Create and manage message templates ("Text" and "Text & Image")
- Launch and monitor targeted campaigns
- View campaign analytics

---

## - Key Features

### - Authentication

- Login & Logout functionality for both Admin and Workspace users

### - Admin Portal

Accessible only by **admin users**:

- **Workspaces Module**
- Create, view, update, delete business workspaces
- **Workspace Users Sub-Module**
- Manage users within each workspace

### - OutreachHub Portal

Accessible only by **workspace users**, with role-based permissions:

- **Editor**: Full access (CRUD operations)
- **Viewer**: Read-only access

#### Modules:

##### - Home Module

- Welcome message & workspace analytics
- **Charts**:
- Campaigns per day (filterable by date range)
- Messages sent per type per day
- Contacts reached per day
- **Tables**:
- 5 recent campaigns with targeted contact tags
- Top 5 tags by number of contacts

##### - Contacts Module

- Manage contact records (CRUD)
- Tagging support for campaign targeting
- Primary identifier: phone number

##### - Message Templates Module

- Manage templates of types:
- "Text"
- "Text & Image"

##### - Campaigns Module

- Full campaign lifecycle:
- Draft → Launch → Running → Completed
- Features:
- Create, update, delete, and **copy** campaigns
- Launch action to simulate message dispatch
- Live status updates using polling
- Stores message data per contact at send time

= Note: Only campaigns in **draft** state are editable. Launched campaigns are immutable.

- Author: [ASIF ALAM](https://github.com/as-if-it)
---