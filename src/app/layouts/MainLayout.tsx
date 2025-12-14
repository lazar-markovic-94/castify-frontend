import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../shared/components/ui/Button';
import { useCurrentUser } from '../../core/application/useAuth';
import { storageService } from '../../core/data/storage';
import { UserRole } from '../../core/domain/enums';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    storageService.clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Castify
              </span>
            </Link>

            <nav className="flex items-center gap-8">
              {user?.role === UserRole.CLIENT && (
                <>
                  <Link to="/talents" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group">
                    Browse Talents
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </Link>
                  <Link to="/client/organization" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group">
                    My Organization
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </Link>
                  <Link to="/messages" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group">
                    Messages
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </Link>
                </>
              )}

              {user?.role === UserRole.TALENT && (
                <>
                  <Link to="/profile" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group">
                    My Profile
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </Link>
                  <Link to="/messages" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group">
                    Messages
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </Link>
                </>
              )}

              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user?.email?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-slate-600 hidden md:block">{user?.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="border-slate-300 hover:border-blue-600 hover:text-blue-600">
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">{children}</main>
    </div>
  );
};
