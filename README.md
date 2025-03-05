# Orphanage Admin Panel

A comprehensive management system for orphanage collaborators, donations, and email campaigns.

## Overview

This admin panel is built using the MERN stack (with PostgreSQL instead of MongoDB) and provides a robust platform for managing collaborators, tracking donations, and running email campaigns for an orphanage organization.

### Key Features

- 👥 **Collaborator Management**

  - Track both financial and physical collaborators
  - Store detailed contact information and contribution history
  - Manage collaborator addresses and communication preferences

- 💰 **Donation Tracking**

  - Record and manage monetary contributions
  - Support for multiple currencies
  - Various payment method tracking
  - Link donations to specific collaborators

- 📧 **Email Campaign System**
  - Create and manage email campaigns
  - Filter recipients based on contribution type and contact history
  - Preview campaign recipients before sending
  - Track campaign status and recipient counts
  - Integration with SendGrid for reliable email delivery

## Tech Stack

### Frontend

- React 18 with TypeScript
- Vite for build tooling
- Material-UI (MUI) for component library
- TanStack Query for state management
- React Router for navigation
- Axios for API communication

### Backend

- Node.js with Express
- TypeScript
- Sequelize ORM with PostgreSQL
- SendGrid for email services
- Zod for validation
- JWT for authentication (prepared)

## Project Structure

```
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript type definitions
│   └── ...
│
└── backend/               # Express backend application
    ├── config/           # Configuration files
    ├── controllers/      # Route controllers
    ├── middleware/       # Express middlewares
    ├── migrations/       # Database migrations
    ├── models/          # Sequelize models
    ├── routes/          # Express routes
    ├── seeders/         # Database seeders
    ├── services/        # Business logic services
    └── src/             # Application source
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 15 or higher
- SendGrid API key for email functionality

### Environment Variables

#### Backend

```env
DATABASE_URL=postgres://user:pass@localhost:5432/orphanage-db
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender@domain.com
NODE_ENV=development
```

#### Frontend

```env
VITE_API_URL=http://localhost:3333/api
```

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up the database:

   ```bash
   cd backend
   npm run migrate
   npm run seed  # Optional: Add demo data
   ```

4. Start the development servers:

   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm run dev
   ```

## Current Status

The project is currently in active development with core features implemented:

- ✅ Basic CRUD operations for collaborators
- ✅ Donation tracking system
- ✅ Email campaign management
- ✅ Frontend interface with Material-UI
- ✅ Database migrations and seeds
- ✅ Basic validation and error handling

## Future Plans

1. **Authentication & Authorization**

   - Implement JWT-based authentication
   - Role-based access control
   - Admin user management

2. **Technical Improvements**
   - CI/CD pipeline
   - API documentation with Swagger
   - Unit and integration tests
   - Docker containerization
   - Rate limiting and security enhancements
