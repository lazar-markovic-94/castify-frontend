import { ReactNode, useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    storageService.clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-white font-bold text-lg sm:text-xl">C</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Castify
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {/* Anonymous user navigation */}
              {!user && (
                <>
                  <Link to="/talents" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group">
                    Browse Talents
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </Link>
                </>
              )}

              {/* Client navigation */}
              {user?.role === UserRole.CLIENT && (
                <>
                  <Link to="/talents" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group">
                    Browse Talents
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </Link>
                  <Link to="/projects" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group">
                    My Projects
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

              {/* Talent navigation */}
              {user?.role === UserRole.TALENT && (
                <>
                  <Link to="/profile" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group">
                    My Profile
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </Link>
                  <Link to="/opportunities" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group">
                    My Opportunities
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </Link>
                  <Link to="/messages" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors relative group">
                    Messages
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </Link>
                </>
              )}

              {/* Authenticated user section */}
              {user && (
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
              )}

              {/* Anonymous user buttons */}
              {!user && (
                <div className="flex items-center gap-3">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-slate-700 hover:text-blue-600">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t border-slate-200 pt-4 space-y-3">
              {/* Anonymous user navigation */}
              {!user && (
                <>
                  <Link
                    to="/talents"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    Browse Talents
                  </Link>
                </>
              )}

              {/* Client navigation */}
              {user?.role === UserRole.CLIENT && (
                <>
                  <Link
                    to="/talents"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    Browse Talents
                  </Link>
                  <Link
                    to="/projects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    My Projects
                  </Link>
                  <Link
                    to="/client/organization"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    My Organization
                  </Link>
                  <Link
                    to="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    Messages
                  </Link>
                </>
              )}

              {/* Talent navigation */}
              {user?.role === UserRole.TALENT && (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/opportunities"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    My Opportunities
                  </Link>
                  <Link
                    to="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    Messages
                  </Link>
                </>
              )}

              {/* Authenticated user section */}
              {user && (
                <div className="px-4 py-2 border-t border-slate-200 mt-3 pt-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{user?.email?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-sm text-slate-600">{user?.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full border-slate-300 hover:border-blue-600 hover:text-blue-600"
                  >
                    Logout
                  </Button>
                </div>
              )}

              {/* Anonymous user buttons */}
              {!user && (
                <div className="px-4 py-2 border-t border-slate-200 mt-3 pt-3 space-y-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full border-slate-300 hover:border-blue-600 hover:text-blue-600">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">{children}</main>
    </div>
  );
};
