import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Store, Plus, Edit2, Trash2, List } from 'lucide-react';

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isOpen: true
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data } = await api.get('/restaurants');
      setRestaurants(data);
    } catch (error) {
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (restaurant = null) => {
    if (restaurant) {
      setEditingId(restaurant._id);
      setFormData({
        name: restaurant.name,
        description: restaurant.description,
        isOpen: restaurant.isOpen
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', isOpen: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/restaurants/${editingId}`, formData);
        toast.success('Restaurant updated successfully');
      } else {
        await api.post('/restaurants', formData);
        toast.success('Restaurant created successfully');
      }
      setIsModalOpen(false);
      fetchRestaurants();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant and all its food items?')) {
      try {
        await api.delete(`/restaurants/${id}`);
        toast.success('Restaurant deleted');
        fetchRestaurants();
      } catch (error) {
        toast.error('Failed to delete restaurant');
      }
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-slate-200 rounded-xl"></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manage Restaurants</h1>
        <button
          onClick={() => openModal()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Restaurant
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Name</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Description</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {restaurants.map((restaurant) => (
              <tr key={restaurant._id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-800">{restaurant.name}</td>
                <td className="p-4 text-sm text-slate-500 truncate max-w-xs">{restaurant.description}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {restaurant.isOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <Link to={`/admin/restaurants/${restaurant._id}/items`} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1 text-sm font-medium border border-slate-200">
                    <List className="w-4 h-4" /> Manage Items
                  </Link>
                  <button onClick={() => openModal(restaurant)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(restaurant._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {restaurants.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">
                  <Store className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                  No restaurants found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Restaurant' : 'Add Restaurant'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isOpen"
                  checked={formData.isOpen}
                  onChange={(e) => setFormData({...formData, isOpen: e.target.checked})}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="isOpen" className="text-sm font-medium text-slate-700">Currently Open</label>
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
