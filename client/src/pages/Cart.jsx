import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    pinCode: '534204' // Default to SRKR pin code
  });

  const handleOrder = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) return;

    setLoading(true);
    try {
      await api.post('/orders', {
        ...formData,
        items: cart,
        totalAmount: getCartTotal()
      });
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/my-orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/restaurants" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
        <ShoppingBag className="w-6 h-6 mr-3 text-orange-500" />
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.foodItem} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-orange-600 font-medium">₹{item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.foodItem, -1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-white rounded transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium text-slate-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.foodItem, 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-white rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.foodItem)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
              <span className="text-lg font-medium text-slate-600">Total Amount:</span>
              <span className="text-2xl font-bold text-slate-900">₹{getCartTotal()}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Delivery Details</h2>
            <form onSubmit={handleOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  pattern="[6-9][0-9]{9}"
                  title="Please enter a valid 10-digit Indian phone number"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
                <textarea
                  required
                  rows="3"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none"
                  placeholder="Hostel Name, Room Number, etc."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pin Code (SRKR Area Only)</label>
                <input
                  type="text"
                  required
                  value={formData.pinCode}
                  onChange={(e) => setFormData({...formData, pinCode: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="534204"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg shadow-sm transition-colors mt-4 flex justify-center items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  `Place Order - ₹${getCartTotal()}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
