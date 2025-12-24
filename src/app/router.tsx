import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './guards/AuthGuard';
import { RoleGuard } from './guards/RoleGuard';
import { UserRole } from '../core/domain/enums';
import { useCurrentUser } from '../core/application/useAuth';
import { LoadingFallback } from '../shared/components/LoadingFallback';

// Lazy load all route components for code splitting
// Auth pages - loaded immediately as they're often the first pages users see
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';

// Landing page - keep eager loading for fast initial render
import { LandingPage } from '../features/landing/LandingPage';

// Lazy load all other pages
const TalentsListPage = lazy(() => import('../features/talents/TalentsListPage'));
const TalentDetailPage = lazy(() => import('../features/talents/TalentDetailPage'));
const ProfilePage = lazy(() => import('../features/profile/ProfilePage'));
const ClientOrgPage = lazy(() => import('../features/clientOrg/ClientOrgPage'));
const MessagesPage = lazy(() => import('../features/messaging/MessagesPage'));
const MyProjectsPage = lazy(() => import('../features/collaborations/MyProjectsPage'));
const MyOpportunitiesPage = lazy(() => import('../features/collaborations/MyOpportunitiesPage'));
const CollaborationDetailPage = lazy(
  () => import('../features/collaborations/CollaborationDetailPage')
);

const HomePage = () => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent shadow-lg"></div>
          <p className="text-slate-600 mt-6 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!user) {
    return <LandingPage />;
  }

  // Redirect authenticated users based on role
  if (user.role === UserRole.CLIENT) {
    return <Navigate to="/talents" replace />;
  }
  if (user.role === UserRole.TALENT) {
    return <Navigate to="/profile" replace />;
  }

  return <Navigate to="/login" replace />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Home page - shows landing page for guests, redirects authenticated users */}
          <Route path="/" element={<HomePage />} />

          {/* Public talent browsing routes - no auth required */}
          <Route path="/talents" element={<TalentsListPage />} />
          <Route path="/talents/:id" element={<TalentDetailPage />} />

          {/* Client-only routes */}
          <Route
            path="/client/organization"
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={[UserRole.CLIENT]}>
                  <ClientOrgPage />
                </RoleGuard>
              </AuthGuard>
            }
          />

          <Route
            path="/projects"
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={[UserRole.CLIENT]}>
                  <MyProjectsPage />
                </RoleGuard>
              </AuthGuard>
            }
          />

          {/* Talent-only routes */}
          <Route
            path="/opportunities"
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={[UserRole.TALENT]}>
                  <MyOpportunitiesPage />
                </RoleGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <RoleGuard allowedRoles={[UserRole.TALENT]}>
                  <ProfilePage />
                </RoleGuard>
              </AuthGuard>
            }
          />

          {/* Shared routes */}
          <Route
            path="/messages"
            element={
              <AuthGuard>
                <MessagesPage />
              </AuthGuard>
            }
          />

          <Route
            path="/collaborations/:id"
            element={
              <AuthGuard>
                <CollaborationDetailPage />
              </AuthGuard>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
