import { Outlet, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Utensils, ShoppingBag, LogOut, LogIn } from 'lucide-react';

export default function CustomerLayout() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <Utensils className="h-8 w-8 text-orange-500" />
                <span className="font-bold text-2xl text-slate-900 tracking-tight">Tasto</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/restaurants" className="text-slate-600 hover:text-orange-500 font-medium">Restaurants</Link>
                  <Link to="/my-orders" className="text-slate-600 hover:text-orange-500 font-medium">My Orders</Link>
                  <Link to="/cart" className="text-slate-600 hover:text-orange-500 font-medium relative">
                    <ShoppingBag className="w-6 h-6" />
                  </Link>
                  <button onClick={logout} className="text-slate-600 hover:text-red-500 ml-4">
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium">
                  <LogIn className="w-5 h-5" /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
