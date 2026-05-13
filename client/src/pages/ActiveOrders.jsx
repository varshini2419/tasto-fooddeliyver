import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Package, MapPin, Phone, CheckCircle2, Bike } from 'lucide-react';

export default function ActiveOrders() {
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  const fetchActiveOrders = async () => {
    try {
      const { data } = await api.get('/orders/delivery/my-active-orders');
      setActiveOrders(data);
    } catch (error) {
      console.error('Failed to fetch active orders', error);
      toast.error('Failed to load active orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchActiveOrders(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (activeOrders.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
        <Bike className="mx-auto h-16 w-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Orders</h3>
        <p className="text-slate-500">You don't have any orders assigned to you right now. Head over to the dashboard to accept new orders.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
        <Bike className="w-6 h-6 mr-2 text-orange-500" />
        My Active Deliveries
      </h1>

      {activeOrders.map((order) => (
        <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-slate-600">Order #{order._id.slice(-6).toUpperCase()}</p>
              <p className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              order.status === 'Accepted' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {order.status}
            </span>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Customer Details</h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2 border border-slate-100">
                  <p className="font-bold text-slate-800 text-lg">{order.customerName}</p>
                  <p className="flex items-center text-slate-600">
                    <Phone className="w-4 h-4 mr-2 text-orange-500" /> {order.customerPhone}
                  </p>
                  <p className="flex items-start text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-orange-500 mt-1 flex-shrink-0" />
                    <span>{order.address} <br/> PIN: {order.pinCode}</span>
                  </p>
                </div>
              </div>
            </div>

            <div>
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Order Items</h3>
               <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 max-h-48 overflow-y-auto">
                 {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                      <div className="flex items-center">
                        <span className="text-xs font-bold bg-white text-slate-600 px-2 py-1 rounded mr-2 border border-slate-200">{item.quantity}x</span>
                        <span className="text-sm text-slate-700">{item.name || 'Food Item'}</span>
                      </div>
                    </div>
                 ))}
                 <div className="mt-4 pt-3 border-t border-slate-300 flex justify-between items-center font-bold">
                   <span className="text-slate-800">Total to Collect:</span>
                   <span className="text-lg text-orange-600">₹{order.totalAmount}</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            {order.status === 'Accepted' && (
              <button
                onClick={() => updateStatus(order._id, 'Picked Up')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm"
              >
                Mark as Picked Up
              </button>
            )}
            
            {order.status === 'Picked Up' && (
              <button
                onClick={() => updateStatus(order._id, 'Delivered')}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" /> Mark as Delivered
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
