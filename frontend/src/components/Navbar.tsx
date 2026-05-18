import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { LogOut, LayoutDashboard, Briefcase } from 'lucide-react';

const Navbar: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600 tracking-tight">
                JobTracker
              </Link>
            </div>
            <nav className="hidden md:flex space-x-2">
              <Link
                to="/"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/jobs"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/jobs' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Applications
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile nav (bottom bar style) */}
      <div className="md:hidden border-t border-gray-100 flex p-2 gap-2 overflow-x-auto bg-white">
        <Link
          to="/"
          className={`flex-1 flex justify-center items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            location.pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
        </Link>
        <Link
          to="/jobs"
          className={`flex-1 flex justify-center items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            location.pathname === '/jobs' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Briefcase className="w-4 h-4 mr-2" /> Jobs
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
