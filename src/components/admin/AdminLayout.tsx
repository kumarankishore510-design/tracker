import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Bus,
  MapPin,
  Package,
  Calculator,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to login if unauthenticated
  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bookings & Calendar', path: '/admin/bookings', icon: CalendarDays },
    { name: 'Vehicle Fleet (5 Vans)', path: '/admin/vehicles', icon: Bus },
    { name: 'Destinations', path: '/admin/destinations', icon: MapPin },
    { name: 'Tour Packages', path: '/admin/packages', icon: Package },
    { name: 'Pricing Engine', path: '/admin/pricing', icon: Calculator },
    { name: 'Company Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#102A43] text-white flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F28C28] flex items-center justify-center text-white font-bold">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight">SKS TRAVELS</span>
                <span className="block text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  Admin Control Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive(item.path)
                      ? 'bg-[#F28C28] text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions Bottom */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center space-x-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-bold truncate text-white">
                {user?.name || 'Administrator'}
              </span>
              <span className="block text-[10px] text-emerald-400 capitalize font-medium">
                {user?.role || 'Superadmin'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-center space-x-1 py-2 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center space-x-1 py-2 px-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              SKS Travels Management Console
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-xs font-bold text-[#102A43] hover:text-[#F28C28] flex items-center space-x-1"
            >
              <span>Back to Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 md:hidden"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Child Page Content */}
        <main className="p-6 sm:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
