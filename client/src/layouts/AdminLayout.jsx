import { Outlet, Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Store, Pizza, Users, ClipboardList, Settings as SettingsIcon, LogOut, Utensils } from 'lucide-react';

export default function AdminLayout() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Restaurants', path: '/admin/restaurants', icon: Store },
    { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { name: 'Delivery Boys', path: '/admin/delivery-boys', icon: Users },
    { name: 'Portal Settings', path: '/admin/settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Utensils className="h-6 w-6 text-orange-500 mr-2" />
          <span className="text-xl font-bold">Tasto Admin</span>
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
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-orange-500 text-white' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {link.name}
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
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center px-8">
          <h1 className="text-xl font-semibold text-slate-800">
            {links.find(l => l.path === location.pathname)?.name || (location.pathname.includes('/items') ? 'Manage Food Items' : 'Admin Panel')}
          </h1>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
