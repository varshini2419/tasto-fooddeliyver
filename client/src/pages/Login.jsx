import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Utensils, Bike, User, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Login({ defaultView = 'selection' }) {
  const [view, setView] = useState(defaultView); // 'selection', 'customer-options', 'customer-login', 'delivery-login', 'admin-login'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setView(defaultView);
  }, [defaultView]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { phone, password });
      
      // Store token and role internally via context
      login(response.data);
      
      // Navigate based on backend returned role
      if (response.data.role === 'admin') {
        navigate('/admin');
      } else if (response.data.role === 'delivery_boy') {
        navigate('/delivery');
      } else {
        navigate('/restaurants');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const renderSelection = () => (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center mb-4">
        <Utensils className="h-12 w-12 text-orange-500 mb-2" />
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome to Tasto
        </h2>
        <p className="mt-2 text-center text-slate-600">
          Continue as
        </p>
      </div>

      <button 
        onClick={() => setView('customer-options')}
        className="w-full flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-500 transition-colors">
            <User className="w-6 h-6 text-orange-600 group-hover:text-white" />
          </div>
          <span className="text-lg font-bold text-slate-800">Customer</span>
        </div>
      </button>

      <button 
        onClick={() => setView('delivery-login')}
        className="w-full flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:border-slate-800 hover:bg-slate-50 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-3 rounded-lg group-hover:bg-slate-800 transition-colors">
            <Bike className="w-6 h-6 text-slate-600 group-hover:text-white" />
          </div>
          <span className="text-lg font-bold text-slate-800">Delivery Boy</span>
        </div>
      </button>
    </div>
  );

  const renderCustomerOptions = () => (
    <div className="flex flex-col items-center space-y-6 w-full">
      <button onClick={() => setView('selection')} className="self-start text-slate-500 hover:text-orange-500 flex items-center gap-2 mb-4 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      
      <div className="flex flex-col items-center mb-4 w-full">
        <User className="h-12 w-12 text-orange-500 mb-2" />
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Customer
        </h2>
        <p className="mt-2 text-center text-slate-600">
          Order food easily to your hostel or block
        </p>
      </div>

      <button 
        onClick={() => setView('customer-login')}
        className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-orange-600 hover:bg-orange-700 transition-all transform hover:-translate-y-0.5"
      >
        Sign In / Login
      </button>

      <Link 
        to="/signup"
        className="w-full text-center py-3 px-4 border-2 border-orange-200 rounded-lg text-lg font-bold text-orange-600 hover:bg-orange-50 transition-all transform hover:-translate-y-0.5"
      >
        Sign Up
      </Link>
    </div>
  );

  const renderLoginForm = (title, subtitle, backView) => (
    <div className="w-full">
      {backView && (
        <button onClick={() => setView(backView)} className="text-slate-500 hover:text-orange-500 flex items-center gap-2 mb-6 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}
      
      <div className="flex flex-col items-center mb-8">
        <Utensils className="h-10 w-10 text-orange-500 mb-2" />
        <h2 className="text-center text-3xl font-extrabold text-slate-900">{title}</h2>
        <p className="mt-2 text-center text-slate-600">{subtitle}</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              required
              className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-[1.02]"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {view === 'customer-login' && (
          <div className="text-center mt-4">
             <Link to="/signup" className="text-orange-600 font-bold hover:underline">
               Create account
             </Link>
          </div>
        )}
      </form>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      
      <div className="relative max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl z-10">
        {view === 'selection' && renderSelection()}
        {view === 'customer-options' && renderCustomerOptions()}
        {view === 'customer-login' && renderLoginForm('Customer Login', 'Welcome back! Please enter your details.', 'customer-options')}
        {view === 'delivery-login' && renderLoginForm('Delivery Partner', 'Login to your delivery dashboard.', 'selection')}
        {view === 'admin-login' && renderLoginForm('Admin Login', 'Login to the Tasto management portal.', null)}
      </div>
    </div>
  );
}
