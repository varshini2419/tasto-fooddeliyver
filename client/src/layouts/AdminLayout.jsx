import { Outlet, Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Store, Pizza, Users, ClipboardList, Settings as SettingsIcon, LogOut, Utensils, Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Restaurants', path: '/admin/restaurants', icon: Store },
    { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { name: 'Delivery Boys', path: '/admin/delivery-boys', icon: Users },
    { name: 'Portal Settings', path: '/admin/settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[75%] max-w-[280px] bg-slate-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center">
            <Utensils className="h-6 w-6 text-orange-500 mr-2" />
            <span className="text-xl font-bold">Tasto</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-300 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* User Info */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <p className="text-sm text-slate-400">Welcome,</p>
          <p className="font-semibold truncate">{user?.name || 'Admin User'}</p>
          <p className="text-xs text-orange-400 uppercase tracking-wider mt-1">{user?.role || 'Admin'}</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="flex items-center w-full px-3 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-red-400 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full h-screen overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center px-4 md:px-8 shrink-0">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden mr-4 text-slate-600 hover:text-orange-500 transition-colors focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-slate-800 truncate">
            {links.find(l => l.path === location.pathname)?.name || (location.pathname.includes('/items') ? 'Manage Food Items' : 'Admin Panel')}
          </h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full bg-slate-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
