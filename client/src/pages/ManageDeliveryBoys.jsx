import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Users, Plus, Trash2, Bike, Edit2 } from 'lucide-react';

export default function ManageDeliveryBoys() {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = async () => {
    try {
      const { data } = await api.get('/admin/delivery-boys');
      setDeliveryBoys(data);
    } catch (error) {
      toast.error('Failed to load delivery boys');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (boy = null) => {
    if (boy) {
      setEditingId(boy._id);
      setFormData({
        name: boy.name,
        phone: boy.phone,
        password: '' // Don't require password on edit
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', phone: '', password: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/delivery-boys/${editingId}`, {
          name: formData.name,
          phone: formData.phone
        });
        toast.success('Delivery boy updated successfully');
      } else {
        await api.post('/admin/delivery-boys', formData);
        toast.success('Delivery boy added successfully');
      }
      
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', password: '' });
      fetchDeliveryBoys();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this delivery boy?')) {
      try {
        await api.delete(`/admin/delivery-boys/${id}`);
        toast.success('Delivery boy removed');
        fetchDeliveryBoys();
      } catch (error) {
        toast.error('Failed to remove delivery boy');
      }
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-slate-200 rounded-xl"></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manage Delivery Boys</h1>
        <button
          onClick={() => openModal()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Partner
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Name</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Phone</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-center">Completed Today</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-center">Total Completed</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deliveryBoys.map((boy) => (
              <tr key={boy._id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Bike className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-800">{boy.name}</span>
                  </div>
                </td>
                <td className="p-4 font-medium text-slate-600">{boy.phone}</td>
                <td className="p-4 text-center">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                    {boy.completedToday}
                  </span>
                </td>
                <td className="p-4 text-center font-bold text-slate-700">{boy.totalCompleted}</td>
                <td className="p-4 flex justify-end gap-2">
                  <button onClick={() => openModal(boy)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(boy._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {deliveryBoys.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  <Users className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                  No delivery boys found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Delivery Boy' : 'Add Delivery Boy'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  pattern="[6-9][0-9]{9}"
                  title="Please enter a valid 10-digit Indian phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Temporary Password</label>
                  <input
                    type="password"
                    required
                    minLength="6"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg">
                  {editingId ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
