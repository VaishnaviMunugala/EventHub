
# EventHub – Online Event Planning and Registration System

## Project Overview
EventHub is a modern, centralized web platform where admins can manage events and users can register online. It replaces manual workflows with a clean, scalable, and automated system.

## Features
- **Landing Page**: Project intro and CTA.
- **Event Listing**: Filterable upcoming events.
- **Online Registration**: Prevent duplicates, enforce limits.
- **User Dashboard**: View history, cancel registrations.
- **Admin Dashboard**: Analytics, Manage Events, Attendance.
- **Security**: JWT Authentication, Role-based access.
- **UI**: Responsive, Dark Mode, Toast Notifications.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Tools**: Axios, Dayjs, Recharts, React Icons

## Installation
1. Clone the repository.
2. Run `npm run install-all` from the root to install dependencies for root, server, and client.
3. Configure `.env` in the `server` directory (copy from `.env.example`).
4. Run `npm start` to launch both client and server.

## Environment Variables
Create a `.env` file in `server/` with:
```
MONGO_URL=...
JWT_SECRET=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
PORT=5000
```