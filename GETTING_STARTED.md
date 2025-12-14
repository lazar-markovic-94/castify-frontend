# Getting Started with Castify Frontend

## Prerequisites

1. **Node.js 18+** installed
2. **Backend API running** at http://localhost:8080
3. **Git** (optional, for version control)

## Quick Start

### 1. Navigate to Project Directory

```bash
cd /Users/lazarmarkovic/Documents/MyProjects/castify-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

The `.env` file is already created with default settings:

```env
VITE_API_BASE_URL=http://localhost:8080
```

If your backend runs on a different port, update this file.

### 4. Start Backend (if not already running)

In a separate terminal:

```bash
cd /Users/lazarmarkovic/Documents/MyProjects/castify
mvn clean compile  # Compile if needed
mvn spring-boot:run  # Or your preferred method
```

Wait for backend to start on port 8080.

### 5. Start Frontend Development Server

```bash
npm run dev
```

The app will start at: **http://localhost:5173**

## First Time User Flow

### 1. Register an Account

1. Open http://localhost:5173
2. You'll be redirected to `/login`
3. Click "Sign up" link
4. Fill in the registration form:
   - Email: your@email.com
   - Password: min 8 characters
   - Phone: optional
   - Role: Choose TALENT or CLIENT
5. Click "Create Account"

### 2. Complete Your Profile

#### If you registered as TALENT:
1. After login, go to "My Profile" in the nav
2. Fill in your talent profile:
   - Full Name
   - Bio
   - Location (City, Country)
   - Profile Image URL (optional)
3. Click "Create Profile"

#### If you registered as CLIENT:
1. After login, go to "My Organization" in the nav
2. Fill in organization details:
   - Organization Name
   - Organization Type
   - Description
   - Contact Info
3. Click "Create Organization"

### 3. Explore Features

#### As a CLIENT:
- **Browse Talents**: Click "Browse Talents" in nav
- **Filter**: Use the left sidebar to filter by capabilities
- **View Profile**: Click "View Profile" on any talent card
- **Send Message**: Click "Send Message" on talent detail page

#### As a TALENT:
- **View Profile**: Click "My Profile" in nav
- **Edit Profile**: (Coming soon - currently read-only)
- **Check Messages**: Click "Messages" in nav

## Testing with Existing Data

The backend has test data populated. You can log in as:

### Test Talent Account
- Email: `john.actor@example.com`
- Password: `password123`

### Test Client Account
- Email: `abc.productions@example.com`
- Password: `password123`

## Common Commands

```bash
# Development
npm run dev              # Start dev server with HMR

# Production
npm run build            # Build for production
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint
```

## Troubleshooting

### Port Already in Use

If port 5173 is taken:

```bash
# Kill the process
lsof -ti:5173 | xargs kill -9

# Or change the port in vite.config.ts:
export default defineConfig({
  server: { port: 3000 }
})
```

### Backend Connection Error

1. Verify backend is running: `curl http://localhost:8080/api/auth/me`
2. Check CORS is enabled in backend
3. Verify `.env` has correct `VITE_API_BASE_URL`

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Login Redirects to Login

This means the backend rejected the token:
1. Clear localStorage: Browser DevTools → Application → Local Storage → Clear
2. Try logging in again
3. Check backend logs for authentication errors

## Development Tips

### React Query DevTools

Open the floating icon in bottom-right corner to see:
- Active queries
- Cached data
- Query state
- Mutation status

### Browser DevTools

- **Network Tab**: See API requests/responses
- **Application Tab**: Check localStorage for token
- **Console**: View any errors or logs

### Hot Reload

Vite provides instant feedback:
- Save any file
- Browser auto-refreshes
- State is preserved (where possible)

## File Upload Feature (Not Implemented)

Currently, profile images and media use URLs only. To add file upload:

1. Install: `npm install react-dropzone`
2. Create upload service in `core/data`
3. Add upload endpoint to repository
4. Update forms to handle files

## Next Steps

1. ✅ Register and log in
2. ✅ Create your profile/organization
3. ✅ Browse talents (as client)
4. ✅ Send messages
5. 📝 Provide feedback on UX
6. 📝 Test edge cases
7. 📝 Report bugs

## Project Structure Quick Reference

```
src/
├── app/          → Router, providers, guards, layouts
├── core/         → Business logic (domain, data, application)
├── features/     → Feature pages (auth, talents, profile, etc.)
└── shared/       → Reusable components and utilities
```

## Need Help?

- **Backend API Docs**: http://localhost:8080/swagger-ui.html
- **Project Summary**: See PROJECT_SUMMARY.md
- **README**: See README.md

## Enjoy Building!

Happy coding! 🚀
