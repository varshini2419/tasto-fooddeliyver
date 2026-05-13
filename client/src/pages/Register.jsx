import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Utensils } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    pinCode: '',
    landmark: '',
    hostelBlock: ''
  });
  
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (formData.phone.length !== 10) {
      return toast.error('Phone number must be exactly 10 digits');
    }

    // SRKR Pin Code Validation (534204 is Bhimavaram SRKR Area)
    if (formData.pinCode !== '534204') {
      return toast.error('We currently only deliver to SRKR College area (Pin: 534204)');
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
        pinCode: formData.pinCode,
        landmark: formData.landmark,
        hostelBlock: formData.hostelBlock
      });
      
      login(response.data);
      navigate('/restaurants');

    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

      <div className="relative max-w-2xl w-full bg-white p-10 rounded-2xl shadow-2xl z-10 my-8">
        <div className="flex flex-col items-center mb-8">
          <Utensils className="h-10 w-10 text-orange-500 mb-2" />
          <h2 className="text-center text-3xl font-extrabold text-slate-900">Create an Account</h2>
          <p className="mt-2 text-center text-slate-600">Join Tasto to order food directly to your hostel</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Account Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Account Details</h3>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="John Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                <input type="number" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="10-digit mobile number" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="••••••••" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Confirm Password</label>
                <input type="password" name="confirmPassword" required minLength="6" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="••••••••" />
              </div>
            </div>

            {/* Delivery Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Delivery Details</h3>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">College / Hostel / Block</label>
                <input type="text" name="hostelBlock" required value={formData.hostelBlock} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="e.g. Block A, SRKR Hostels" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Address</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Room No, Building Name..." />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Landmark</label>
                <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Near library, opposite canteen..." />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Pin Code</label>
                <input type="text" name="pinCode" required value={formData.pinCode} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="534204" />
                <p className="text-xs text-slate-500 mt-1">Currently serving pin code 534204 only.</p>
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg shadow-sm text-lg font-bold text-white bg-orange-600 hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 transition-all"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="text-center mt-4">
             <Link to="/login" className="text-slate-600 hover:text-orange-600 font-bold hover:underline transition-colors">
               Already have account? Login
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
