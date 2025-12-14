import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './guards/AuthGuard';
import { RoleGuard } from './guards/RoleGuard';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { TalentsListPage } from '../features/talents/TalentsListPage';
import { TalentDetailPage } from '../features/talents/TalentDetailPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { ClientOrgPage } from '../features/clientOrg/ClientOrgPage';
import { MessagesPage } from '../features/messaging/MessagesPage';
import { UserRole } from '../core/domain/enums';
import { useCurrentUser } from '../core/application/useAuth';

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

  // Redirect based on user role
  if (user?.role === UserRole.CLIENT) {
    return <Navigate to="/talents" replace />;
  }
  if (user?.role === UserRole.TALENT) {
    return <Navigate to="/profile" replace />;
  }
  return <Navigate to="/login" replace />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <AuthGuard>
              <HomePage />
            </AuthGuard>
          }
        />

        {/* Client-only routes */}
        <Route
          path="/talents"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={[UserRole.CLIENT]}>
                <TalentsListPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/talents/:id"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={[UserRole.CLIENT]}>
                <TalentDetailPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

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

        {/* Talent-only routes */}
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
      </Routes>
    </BrowserRouter>
  );
};
