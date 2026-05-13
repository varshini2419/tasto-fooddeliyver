import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Utensils, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';

export default function ManageFoodItems() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchRestaurantDetails();
    fetchFoodItems();
  }, [restaurantId]);

  const fetchRestaurantDetails = async () => {
    try {
      const { data } = await api.get(`/restaurants/${restaurantId}`);
      setRestaurant(data);
    } catch (error) {
      toast.error('Failed to load restaurant details');
    }
  };

  const fetchFoodItems = async () => {
    try {
      const { data } = await api.get(`/food-items/restaurant/${restaurantId}`);
      setFoodItems(data);
    } catch (error) {
      toast.error('Failed to load food items');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        name: item.name,
        price: item.price,
        isAvailable: item.isAvailable
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', price: '', isAvailable: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/food-items/${editingId}`, formData);
        toast.success('Food item updated');
      } else {
        await api.post('/food-items', { ...formData, restaurantId });
        toast.success('Food item created');
      }
      setIsModalOpen(false);
      fetchFoodItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await api.delete(`/food-items/${id}`);
        toast.success('Food item deleted');
        fetchFoodItems();
      } catch (error) {
        toast.error('Failed to delete food item');
      }
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-slate-200 rounded-xl"></div>;

  return (
    <div className="space-y-6">
      <Link to="/admin/restaurants" className="inline-flex items-center text-slate-500 hover:text-orange-500 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Restaurants
      </Link>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Menu</h1>
          <p className="text-slate-500 text-sm mt-1">{restaurant ? restaurant.name : 'Loading...'}</p>
        </div>
        
        <button
          onClick={() => openModal()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors flex-shrink-0"
        >
          <Plus className="w-5 h-5" /> Add Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Item Name</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Price</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Availability</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {foodItems.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-800">{item.name}</td>
                <td className="p-4 font-medium text-orange-600">₹{item.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {foodItems.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">
                  <Utensils className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                  No food items in this restaurant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Food Item' : 'Add Food Item'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="isAvailable" className="text-sm font-medium text-slate-700">Item is Available</label>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
