import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Package, MapPin, Clock, Bike, IndianRupee } from 'lucide-react';

export default function DeliveryDashboard() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [stats, setStats] = useState({
    completedToday: 0,
    activeOrders: 0,
    totalDelivered: 0,
    totalAmountHandledToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        api.get('/orders/delivery/pending'),
        api.get('/orders/delivery/stats')
      ]);
      setPendingOrders(ordersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch delivery dashboard data', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/accept`);
      toast.success('Order accepted successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept order');
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
    { title: 'Completed Today', value: stats.completedToday, icon: Bike, color: 'bg-green-500' },
    { title: 'Amount Handled', value: `₹${stats.totalAmountHandledToday}`, icon: IndianRupee, color: 'bg-orange-500' },
    { title: 'Active Orders', value: stats.activeOrders, icon: Clock, color: 'bg-blue-500' },
    { title: 'Total Delivered', value: stats.totalDelivered, icon: Package, color: 'bg-purple-500' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <Clock className="w-6 h-6 mr-2 text-orange-500" />
          Available Pending Orders
        </h2>

        {pendingOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">No pending orders available right now.</p>
            <p className="text-sm text-slate-400">Take a break or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingOrders.map((order) => (
              <div key={order._id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-600">#{order._id.slice(-6).toUpperCase()}</span>
                  <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Customer</p>
                    <p className="font-medium text-slate-900">{order.customerName}</p>
                    <p className="text-sm text-slate-600">{order.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Delivery Address</p>
                    <p className="text-sm text-slate-800 flex items-start gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>{order.address}, PIN: {order.pinCode}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Order Value</p>
                    <p className="font-bold text-orange-600">₹{order.totalAmount}</p>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleAcceptOrder(order._id)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                      <Bike className="w-5 h-5" /> Accept Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
