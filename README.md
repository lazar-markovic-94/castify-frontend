# Castify Frontend

A production-ready React 19 web application for the Castify talent casting marketplace. Built with TypeScript, Vite, and modern React patterns following Clean Architecture principles.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [Environment Configuration](#environment-configuration)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Tech Stack

- **React 19.2.0** - Latest React with concurrent features
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.2.4** - Lightning-fast build tool and dev server
- **React Router 7.10.1** - Client-side routing with data loading
- **TanStack Query 5.90.12** - Server state management and caching
- **React Hook Form 7.68.0** - Performant form handling
- **Zod 4.1.13** - Schema validation
- **Axios 1.13.2** - HTTP client with interceptors
- **TailwindCSS 3.4.19** - Utility-first CSS framework
- **Leaflet 1.9.4** - Interactive maps for location features
- **Nginx 1.25-alpine** - Production web server

## Architecture

This project follows **Clean Architecture** (Feature-Sliced Design) with clear separation of concerns:

```
castify-frontend/
├── src/
│   ├── app/                       # Application layer
│   │   ├── guards/                # Route guards (auth, role-based)
│   │   ├── layouts/               # Layout components
│   │   └── providers/             # Context providers (Query, Router, Auth)
│   ├── core/                      # Core business logic
│   │   ├── application/           # Application services
│   │   ├── data/                  # Data layer (repositories)
│   │   └── domain/                # Domain models and types
│   ├── features/                  # Feature modules (pages)
│   │   ├── auth/                  # Authentication
│   │   ├── talents/               # Talent browsing & details
│   │   ├── profile/               # Talent profile management
│   │   ├── clientOrg/             # Client organization
│   │   ├── messaging/             # Messaging system
│   │   ├── collaborations/        # Collaboration tracking
│   │   └── landing/               # Landing page
│   └── shared/                    # Shared utilities
│       ├── components/            # Reusable UI components
│       ├── hooks/                 # Custom React hooks
│       ├── contexts/              # Shared contexts
│       ├── utils/                 # Utility functions
│       └── lib/                   # Third-party lib configs
└── public/                        # Static assets
```

### Layer Responsibilities

| Layer | Responsibility | Dependencies |
|-------|---------------|--------------|
| **app** | Application bootstrap, routing, global providers | features, core, shared |
| **core** | Business logic, domain models, data access | shared |
| **features** | Feature-specific pages and components | core, shared |
| **shared** | Reusable components, hooks, utilities | None (pure UI/utils) |

### Data Flow

```
User Interaction
    ↓
Feature Component (React)
    ↓
TanStack Query Hook
    ↓
Repository (Axios)
    ↓
Backend API (JWT Auth)
    ↓
Response → Cache → Update UI
```

## Project Structure

```
castify-frontend/
├── .dockerignore              # Docker build exclusions
├── Dockerfile                 # Multi-stage production build
├── nginx.conf                 # Nginx configuration for SPA
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML entry point
├── public/                    # Static assets
│   └── vite.svg               # Favicon
└── src/
    ├── main.tsx               # Application entry point
    ├── App.tsx                # Root component
    ├── index.css              # Global styles
    ├── vite-env.d.ts          # Vite type declarations
    │
    ├── app/
    │   ├── guards/
    │   │   ├── AuthGuard.tsx          # Require authentication
    │   │   ├── RoleGuard.tsx          # Require specific role
    │   │   └── PublicOnlyGuard.tsx    # Redirect if authenticated
    │   ├── layouts/
    │   │   ├── MainLayout.tsx         # Main app layout with nav
    │   │   └── LandingLayout.tsx      # Landing page layout
    │   └── providers/
    │       ├── QueryProvider.tsx      # TanStack Query setup
    │       └── RouterProvider.tsx     # React Router setup
    │
    ├── core/
    │   ├── application/
    │   │   └── services/
    │   │       ├── AuthService.ts     # Authentication logic
    │   │       └── StorageService.ts  # Local storage wrapper
    │   ├── data/
    │   │   └── repositories/
    │   │       ├── AuthRepository.ts      # Auth API calls
    │   │       ├── TalentRepository.ts    # Talent API calls
    │   │       ├── ClientRepository.ts    # Client API calls
    │   │       └── MessagingRepository.ts # Messaging API calls
    │   └── domain/
    │       ├── models/                # TypeScript interfaces
    │       │   ├── User.ts
    │       │   ├── Talent.ts
    │       │   ├── Client.ts
    │       │   └── Message.ts
    │       └── types/                 # Shared types and enums
    │
    ├── features/
    │   ├── auth/
    │   │   ├── LoginPage.tsx          # Login form
    │   │   └── RegisterPage.tsx       # Registration form
    │   ├── talents/
    │   │   ├── TalentsListPage.tsx    # Search & browse talents
    │   │   ├── TalentDetailPage.tsx   # Talent profile view
    │   │   └── components/
    │   │       ├── TalentCard.tsx
    │   │       ├── SearchFilters.tsx
    │   │       └── RatingDisplay.tsx
    │   ├── profile/
    │   │   └── ProfilePage.tsx        # Talent profile management
    │   ├── clientOrg/
    │   │   └── ClientOrgPage.tsx      # Client organization setup
    │   ├── messaging/
    │   │   └── MessagesPage.tsx       # Messaging interface
    │   ├── collaborations/
    │   │   ├── MyProjectsPage.tsx         # Client's projects
    │   │   ├── MyOpportunitiesPage.tsx    # Talent's opportunities
    │   │   └── CollaborationDetailPage.tsx
    │   └── landing/
    │       └── LandingPage.tsx        # Public landing page
    │
    └── shared/
        ├── components/
        │   └── ui/
        │       ├── Button.tsx
        │       ├── Input.tsx
        │       ├── Card.tsx
        │       ├── Badge.tsx
        │       ├── Spinner.tsx
        │       └── ... (other UI components)
        ├── hooks/
        │   ├── useAuth.ts             # Authentication hook
        │   ├── useDebounce.ts         # Debounce hook
        │   └── useMediaQuery.ts       # Responsive design hook
        ├── contexts/
        │   └── AuthContext.tsx        # Auth state management
        ├── utils/
        │   ├── api.ts                 # Axios instance & interceptors
        │   ├── formatters.ts          # Date, number formatters
        │   └── validators.ts          # Validation utilities
        └── lib/
            ├── queryClient.ts         # TanStack Query config
            └── cn.ts                  # Tailwind class merger
```

## Features

### Implemented Features ✅

#### Authentication & Authorization
- ✅ User registration with role selection (TALENT/CLIENT)
- ✅ JWT-based login with auto-refresh
- ✅ Protected routes with `AuthGuard`
- ✅ Role-based access control with `RoleGuard`
- ✅ Persistent authentication state
- ✅ Automatic logout on token expiration

#### Landing Page
- ✅ Hero section with call-to-action
- ✅ Feature highlights
- ✅ How it works section
- ✅ Testimonials
- ✅ Statistics showcase
- ✅ Responsive design

#### Talent Discovery (Public)
- ✅ Browse talents with pagination
- ✅ Advanced search filters:
  - Text search (name, bio)
  - Location-based search (map integration)
  - Language filtering
  - Tag filtering
  - Content type filtering
- ✅ Talent cards with avatar, bio, tags
- ✅ Sort by rating, experience
- ✅ Responsive grid layout

#### Talent Profile View (Public)
- ✅ Full profile details
- ✅ Portfolio gallery with media viewer
- ✅ Social media links
- ✅ Location display with interactive map
- ✅ Skills and capabilities
- ✅ Rating and review display ⭐
- ✅ Statistics (collaborations, earnings)
- ✅ Contact button (for clients)

#### Talent Profile Management (TALENT role)
- ✅ Multi-step profile creation wizard
- ✅ Bio and basic information
- ✅ Location selection with map picker
- ✅ Language proficiency management
- ✅ Tags and skills
- ✅ Content type capabilities
- ✅ Social media links
- ✅ Portfolio management (upload, reorder, delete)
- ✅ Profile visibility toggle
- ✅ Real-time validation with Zod
- ✅ Form state management with React Hook Form

#### Client Organization (CLIENT role)
- ✅ Organization setup form
- ✅ Organization type (Agency, Brand, Individual)
- ✅ Company details with website
- ✅ Profile completion tracking

#### Messaging System
- ✅ Conversation list with unread indicators
- ✅ Real-time message thread view
- ✅ Send messages with validation
- ✅ Conversation creation from talent profile
- ✅ Auto-scroll to latest messages
- ✅ Message timestamps

#### Collaboration Tracking ⭐ NEW
- ✅ **My Projects** (CLIENT): Track hired talents and projects
- ✅ **My Opportunities** (TALENT): View collaboration invitations
- ✅ **Collaboration Details**: View project details, status, deliverables
- ✅ Status tracking (Pending, In Progress, Completed, Cancelled)
- ✅ Timeline visualization

#### Rating & Review System ⭐ NEW
- ✅ Rate talents (1-5 stars)
- ✅ Write reviews
- ✅ View all ratings for a talent
- ✅ Average rating display
- ✅ Leaderboard of top-rated talents

### Infrastructure Features

- ✅ **TanStack Query**: Server state caching, auto-refetch, optimistic updates
- ✅ **Axios Interceptors**: Auto JWT token injection, error handling
- ✅ **Form Validation**: Zod schemas with React Hook Form
- ✅ **Responsive Design**: Mobile-first with Tailwind breakpoints
- ✅ **Loading States**: Skeleton loaders, spinners
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Docker Support**: Multi-stage production build
- ✅ **Nginx SPA Config**: Proper routing for client-side navigation

## Prerequisites

- **Node.js 18+** (18.x or 20.x recommended)
- **npm 9+** or **yarn 1.22+**
- **Backend API** running (see backend README)

## Getting Started

### Option 1: Local Development (Recommended)

#### 1. Clone and Install

```bash
cd castify-frontend
npm install
```

#### 2. Configure Environment

Create a `.env` file:

```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:8080

# Optional: Enable debug mode
VITE_DEBUG=true
```

#### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

#### 4. Verify the Application

Open your browser:
- Landing page: `http://localhost:5173`
- Login: `http://localhost:5173/login`

### Option 2: Docker Development

Run with Docker Compose (from parent directory):

```bash
cd ..
docker-compose up -d --build frontend
```

Frontend will be available at `http://localhost:80`.

View logs:

```bash
docker-compose logs -f frontend
```

## Running with Docker

### Frontend Docker Image

The Dockerfile uses a **multi-stage build** for optimization:

**Stage 1: Builder** (node:18-alpine)
- Installs dependencies
- Builds production bundle with Vite
- Optimizes assets (minification, tree-shaking)

**Stage 2: Runtime** (nginx:1.25-alpine)
- Only serves static files
- Custom nginx config for SPA routing
- Gzip compression enabled
- Security headers configured
- Final image: ~25MB (vs 1.2GB single-stage)

### Build Frontend Image

```bash
docker build -t castify-frontend:latest .
```

### Run Frontend Container

```bash
docker run -d \
  -p 80:80 \
  --name castify-frontend \
  castify-frontend:latest
```

## Environment Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | Yes | `http://localhost:8080` |
| `VITE_DEBUG` | Enable debug logging | No | `false` |
| `VITE_APP_NAME` | Application name | No | `Castify` |

### Development Environment

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_DEBUG=true
```

### Production Environment

```env
VITE_API_BASE_URL=https://api.castify.com
VITE_DEBUG=false
```

**Important**: Vite embeds environment variables at **build time**, not runtime. Rebuild the app after changing `.env` values.

## Development

### Available Scripts

```bash
# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint

# Type check (without emitting files)
npm run type-check  # (if configured)
```

### Development Server

Vite dev server features:
- ⚡ Lightning-fast HMR (Hot Module Replacement)
- 🔄 Auto-reload on file changes
- 🔍 Source maps for debugging
- 📦 On-demand compilation

Default port: `5173` (configurable in `vite.config.ts`)

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: React and React Hooks rules
- **Formatting**: Consistent indentation (2 spaces)
- **Imports**: Absolute imports with `@/` alias
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions

### Adding a New Feature

Example: Adding a "Favorites" feature

1. **Create Domain Model** (`src/core/domain/models/Favorite.ts`):
   ```typescript
   export interface Favorite {
     favoriteId: string;
     userId: string;
     talentId: string;
     createdAt: string;
   }
   ```

2. **Create Repository** (`src/core/data/repositories/FavoriteRepository.ts`):
   ```typescript
   export const FavoriteRepository = {
     getMyFavorites: () => api.get<Favorite[]>('/api/favorites'),
     addFavorite: (talentId: string) => api.post('/api/favorites', { talentId }),
     removeFavorite: (favoriteId: string) => api.delete(`/api/favorites/${favoriteId}`)
   };
   ```

3. **Create Custom Hook** (`src/shared/hooks/useFavorites.ts`):
   ```typescript
   export const useFavorites = () => {
     return useQuery({
       queryKey: ['favorites'],
       queryFn: () => FavoriteRepository.getMyFavorites()
     });
   };
   ```

4. **Create Feature Page** (`src/features/favorites/FavoritesPage.tsx`):
   ```typescript
   export const FavoritesPage = () => {
     const { data: favorites, isLoading } = useFavorites();
     // ... component implementation
   };
   ```

5. **Add Route** in `App.tsx` or router config

## Building for Production

### Build Command

```bash
npm run build
```

This creates an optimized production bundle in the `dist/` directory with:
- ✅ Minified JavaScript/CSS
- ✅ Tree-shaking (dead code elimination)
- ✅ Code splitting
- ✅ Asset hashing for cache busting
- ✅ Source maps (optional)

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js    # Main bundle
│   ├── vendor-[hash].js   # Third-party dependencies
│   └── index-[hash].css   # Compiled styles
└── vite.svg
```

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally on `http://localhost:4173` for testing.

### Build Performance

Typical build times:
- Development: ~1-2s (HMR)
- Production: ~15-30s (full optimization)

Bundle size (gzipped):
- Main bundle: ~150KB
- Vendor bundle: ~200KB
- Total: ~350KB

## Deployment

### Docker Deployment (Recommended)

From the parent directory:

```bash
# Build and start all services
docker-compose up -d --build

# Frontend will be available at http://localhost:80
```

### Manual Deployment (Static Hosting)

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (auto-detects Vite)
vercel --prod
```

#### AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Nginx Configuration

The included `nginx.conf` provides:
- ✅ SPA routing (all routes fallback to `index.html`)
- ✅ Gzip compression
- ✅ Security headers (X-Frame-Options, X-Content-Type-Options)
- ✅ Asset caching (1 year for static files)
- ✅ No caching for `index.html` (ensures latest version)

For custom deployments, use this config as a template.

## API Integration

### Axios Configuration

The app uses a centralized Axios instance (`src/shared/utils/api.ts`) with:

#### Request Interceptor
- Auto-injects JWT token in `Authorization` header
- Adds `Content-Type: application/json`

#### Response Interceptor
- Handles 401 (Unauthorized) → Auto logout
- Handles 403 (Forbidden) → Redirect to home
- Extracts error messages for display

### TanStack Query Setup

Query client configuration:
- **Stale Time**: 5 minutes (data considered fresh)
- **Cache Time**: 10 minutes (cache retention)
- **Retry**: 3 attempts with exponential backoff
- **Refetch on Window Focus**: Enabled (keeps data fresh)

### API Endpoints Used

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/auth/register` | POST | Register new user | No |
| `/api/auth/login` | POST | Login and get JWT | No |
| `/api/me` | GET | Get current user | Yes |
| `/api/talents` | GET | Search talents | No |
| `/api/talents/{id}` | GET | Get talent details | No |
| `/api/talents/me/profile` | POST/PUT | Update profile | Yes (TALENT) |
| `/api/client/org` | POST/PUT | Update organization | Yes (CLIENT) |
| `/api/conversations` | GET/POST | List/create conversations | Yes |
| `/api/conversations/{id}/messages` | GET/POST | Get/send messages | Yes |
| `/api/ratings/{talentId}` | POST/GET | Rate/get ratings | Varies |
| `/api/ratings/leaderboard` | GET | Get top talents | No |

See backend README for complete API documentation.

## Styling

### Tailwind CSS

The project uses **Tailwind CSS** for styling with:
- **Utility-first approach**: Compose styles with classes
- **Responsive design**: Mobile-first breakpoints
- **Custom theme**: Configured in `tailwind.config.js`
- **Dark mode**: Ready for dark mode support (not yet implemented)

#### Breakpoints

```javascript
sm: '640px'   // Small devices
md: '768px'   // Medium devices
lg: '1024px'  // Large devices
xl: '1280px'  // Extra large devices
2xl: '1536px' // 2X large devices
```

#### Custom Colors (if configured)

```javascript
primary: '#...'
secondary: '#...'
accent: '#...'
```

### Component Library

The app uses custom UI components in `src/shared/components/ui/`:
- `Button`: Primary, secondary, outline variants
- `Input`: Text, email, password inputs with validation
- `Card`: Content containers
- `Badge`: Status indicators
- `Spinner`: Loading indicators

All components are built with Tailwind and support composition via `className` prop.

### Class Name Utility

Uses `clsx` and `tailwind-merge` for conditional classes:

```typescript
import { cn } from '@/shared/lib/cn';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  customClassName
)} />
```

## Testing

### Current Status

⚠️ **Testing infrastructure not yet implemented**

### Recommended Setup

```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom
```

### Test Structure (Recommended)

```
src/
├── features/
│   └── auth/
│       ├── LoginPage.tsx
│       └── LoginPage.test.tsx
└── shared/
    └── components/
        └── ui/
            ├── Button.tsx
            └── Button.test.tsx
```

### Running Tests (Once Configured)

```bash
npm run test          # Run tests
npm run test:ui       # Run with UI
npm run test:coverage # Generate coverage report
```

## Troubleshooting

### Development Server Issues

**Problem**: Port 5173 already in use

**Solution**:
```bash
# Check what's using the port
lsof -i :5173

# Or specify a different port
npm run dev -- --port 3000
```

### Build Errors

**Problem**: TypeScript compilation errors

**Solution**:
```bash
# Type check without building
npx tsc --noEmit

# Fix errors, then rebuild
npm run build
```

**Problem**: Out of memory during build

**Solution**:
```bash
# Increase Node memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### API Connection Issues

**Problem**: CORS errors

**Solution**: Ensure backend has correct `ALLOWED_ORIGINS` configured:
```bash
# Backend .env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Problem**: 401 Unauthorized errors

**Solution**:
1. Check if token is stored: `localStorage.getItem('token')`
2. Verify token is valid (not expired)
3. Check if backend is running
4. Clear localStorage and login again

### Docker Issues

**Problem**: Frontend container can't connect to backend

**Solution**: Use correct network configuration in `docker-compose.yml`:
```yaml
# Frontend should use backend service name
VITE_API_BASE_URL=http://backend:8080  # For container-to-container
# OR
VITE_API_BASE_URL=http://localhost:8080  # For browser-to-host
```

**Problem**: Changes not reflected in Docker container

**Solution**:
```bash
# Rebuild without cache
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Route Not Found (404)

**Problem**: Refreshing the page gives 404 in production

**Solution**: Ensure nginx is configured to fallback to `index.html`:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

This is already configured in the included `nginx.conf`.

### Performance Issues

**Problem**: Slow initial load

**Solution**:
1. Enable code splitting in `vite.config.ts`
2. Lazy load routes with `React.lazy()`
3. Optimize images (use WebP, compress)
4. Enable gzip/brotli compression on server

**Problem**: Slow re-renders

**Solution**:
1. Use `React.memo()` for expensive components
2. Optimize TanStack Query with proper cache times
3. Use `useMemo` and `useCallback` for expensive computations
4. Check React DevTools Profiler for bottlenecks

## Contributing

### Development Workflow

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make changes following the architecture patterns
3. Test manually in development mode
4. Build to verify: `npm run build`
5. Preview production build: `npm run preview`
6. Update README if adding new features
7. Commit with conventional commits: `feat: add favorites feature`
8. Push and create a Pull Request

### Code Standards

- **TypeScript**: Use strict types, avoid `any`
- **Components**: Functional components with hooks
- **Props**: Define interfaces for component props
- **State**: Use TanStack Query for server state, `useState` for UI state
- **Styling**: Use Tailwind classes, avoid inline styles
- **Imports**: Use absolute imports (`@/`) when configured
- **Naming**:
  - Components: `PascalCase` (e.g., `TalentCard.tsx`)
  - Hooks: `camelCase` with `use` prefix (e.g., `useAuth.ts`)
  - Utils: `camelCase` (e.g., `formatDate.ts`)

## License

This project is created for educational and demonstration purposes.

## Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ using React 19, TypeScript, and Vite**
