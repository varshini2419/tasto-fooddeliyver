import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Store, ClipboardList, TrendingUp, Power, Utensils, Bike, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, portalRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/settings/portal-status')
      ]);
      setStats(statsRes.data);
      setIsPortalOpen(portalRes.data.isPortalOpen);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Please login again');
        localStorage.clear();
        window.location.href = '/login';
      } else {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Revenue Today', value: `₹${stats?.totalRevenueToday || 0}`, icon: TrendingUp, color: 'bg-emerald-500' },
    { title: 'Total Orders Today', value: stats?.totalOrdersToday || 0, icon: ClipboardList, color: 'bg-blue-500' },
    { title: 'Pending Orders', value: stats?.pendingOrders || 0, icon: ClipboardList, color: 'bg-yellow-500' },
    { title: 'Accepted Orders', value: stats?.acceptedOrders || 0, icon: CheckCircle2, color: 'bg-purple-500' },
    { title: 'Delivered Orders', value: stats?.deliveredOrders || 0, icon: CheckCircle2, color: 'bg-green-500' },
    { title: 'Delivery Boys', value: stats?.totalDeliveryBoys || 0, icon: Bike, color: 'bg-slate-700' },
    { title: 'Restaurants', value: stats?.totalRestaurants || 0, icon: Store, color: 'bg-orange-500' },
    { title: 'Food Items', value: stats?.totalFoodItems || 0, icon: Utensils, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Portal Status</h2>
          <p className="text-sm text-slate-500">Control whether customers can place orders right now.</p>
        </div>
        <div className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold ${isPortalOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <Power className="w-5 h-5" />
          {isPortalOpen ? 'TAKING ORDERS (ON)' : 'CLOSED (OFF)'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 border border-slate-100">
            <div className={`${stat.color} p-4 rounded-lg text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
