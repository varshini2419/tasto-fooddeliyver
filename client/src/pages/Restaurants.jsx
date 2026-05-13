import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Store, Clock } from 'lucide-react';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await api.get('/restaurants');
        setRestaurants(data);
      } catch (error) {
        console.error('Failed to fetch restaurants', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl h-64 border border-slate-100 shadow-sm"></div>
        ))}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-20">
        <Store className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-900">No restaurants available</h3>
        <p className="text-slate-500">Please check back later.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Available Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <Link 
            key={restaurant._id} 
            to={`/restaurants/${restaurant._id}`}
            className="group block bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="h-48 bg-slate-200 relative">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" 
                alt={restaurant.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">{restaurant.name}</h2>
                <span className={`px-2 py-1 text-xs font-bold rounded-md flex items-center gap-1 ${restaurant.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  <Clock className="w-3 h-3" />
                  {restaurant.isOpen ? 'OPEN' : 'CLOSED'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-600 line-clamp-2">{restaurant.description || 'Delicious campus food.'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
