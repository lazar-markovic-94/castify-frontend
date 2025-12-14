import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../../core/application/useAuth';
import { UserRole } from '../../core/domain/enums';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
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

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user?.role === UserRole.TALENT) {
      return <Navigate to="/profile" replace />;
    }
    if (user?.role === UserRole.CLIENT) {
      return <Navigate to="/talents" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
