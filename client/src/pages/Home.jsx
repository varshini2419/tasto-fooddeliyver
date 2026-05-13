import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Utensils, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Home() {
  const [portalStatus, setPortalStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortalStatus = async () => {
      try {
        const { data } = await api.get('/settings/portal-status');
        setPortalStatus(data.isPortalOpen);
        if (data.isPortalOpen) {
          navigate('/restaurants'); // Automatically take them to restaurants if open
        }
      } catch (error) {
        console.error('Failed to fetch portal status', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortalStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {!portalStatus ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full shadow-sm">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-2">Portal is Closed</h2>
          <p className="text-red-600 mb-6">
            Deliveries are not being taken right now. Please contact <span className="font-bold">9999999999</span>.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-sm">
          <Utensils className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Tasto</h2>
          <p className="text-slate-600 mb-6">Hungry? Check out the available food around the campus.</p>
          <Link
            to="/restaurants"
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Browse Restaurants <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      )}
    </div>
  );
}
