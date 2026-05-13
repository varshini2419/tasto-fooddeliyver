import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Power, AlertTriangle } from 'lucide-react';

export default function PortalSettings() {
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchPortalStatus();
  }, []);

  const fetchPortalStatus = async () => {
    try {
      const { data } = await api.get('/settings/portal-status');
      setIsPortalOpen(data.isPortalOpen);
    } catch (error) {
      toast.error('Failed to load portal status');
    } finally {
      setLoading(false);
    }
  };

  const togglePortal = async () => {
    setToggling(true);
    try {
      const { data } = await api.put('/settings/portal-status', {
        isPortalOpen: !isPortalOpen
      });
      setIsPortalOpen(data.isPortalOpen);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle portal');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-slate-200 rounded-xl"></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Portal Settings</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
        <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-colors ${
          isPortalOpen ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          <Power className="w-12 h-12" />
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          {isPortalOpen ? 'Portal is OPEN' : 'Portal is CLOSED'}
        </h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          {isPortalOpen 
            ? 'Customers can currently browse restaurants and place new orders.' 
            : 'Ordering is disabled. Customers will see a "Deliveries are not being taken" message.'}
        </p>

        <button
          onClick={togglePortal}
          disabled={toggling}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white shadow-sm transition-all transform hover:scale-[1.02] ${
            isPortalOpen 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {toggling ? 'Updating...' : (isPortalOpen ? 'Stop Taking Orders' : 'Start Taking Orders')}
        </button>
      </div>

      {!isPortalOpen && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-yellow-800">What customers see:</h4>
            <p className="text-sm text-yellow-700 mt-1">
              "Deliveries are not being taken right now. Please contact 9999999999."
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
