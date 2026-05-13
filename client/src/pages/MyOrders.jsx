import { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Clock, CheckCircle2, Bike, MapPin } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"><Clock className="w-4 h-4" /> Pending</span>;
      case 'Accepted':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Accepted</span>;
      case 'Picked Up':
        return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"><Bike className="w-4 h-4" /> Picked Up</span>;
      case 'Delivered':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"><MapPin className="w-4 h-4" /> Delivered</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl h-40 border border-slate-100 shadow-sm"></div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="mx-auto h-16 w-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
        <p className="text-slate-500">Looks like you haven't placed any orders.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-slate-500 font-medium">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="divide-y divide-slate-100">
                {order.items.map((item, index) => (
                  <div key={index} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-slate-100 text-slate-600 rounded-md flex items-center justify-center font-medium mr-3">
                        {item.quantity}x
                      </span>
                      <span className="font-medium text-slate-800">Item</span>
                    </div>
                    <span className="text-slate-600 font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-800">Total</span>
                <span className="text-xl font-bold text-orange-600">₹{order.totalAmount}</span>
              </div>
            </div>

            {order.deliveryBoy && (
              <div className="bg-orange-50 border-t border-orange-100 p-4 sm:px-6 flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm text-orange-500">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Delivery Partner Assigned</p>
                  <p className="text-sm text-slate-600">{order.deliveryBoy.name} • {order.deliveryBoy.phone}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
