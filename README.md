# Castify Frontend

A production-ready React web application for the Castify talent casting marketplace.

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool
- **React Router** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **Axios** - HTTP client with auth interceptors
- **React Hook Form** + **Zod** - Form handling and validation
- **TailwindCSS** - Styling

## Getting Started

### Prerequisites
- Node.js 18+
- Backend API running at `http://localhost:8080` (default)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Features

- Authentication (Register, Login, JWT)
- Browse and search talents with filters
- Talent profile management
- Client organization management
- Messaging system

## Architecture

Clean Architecture with feature-based modules following React Native-friendly patterns.

For detailed documentation, see the inline code comments.
