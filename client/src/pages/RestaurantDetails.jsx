import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { ArrowLeft, Plus, Check } from 'lucide-react';

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useContext(CartContext);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [resResponse, foodResponse] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/food-items/restaurant/${id}`)
        ]);
        setRestaurant(resResponse.data);
        setFoodItems(foodResponse.data);
      } catch (error) {
        console.error('Failed to fetch details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-64 bg-slate-200 rounded-2xl w-full"></div>
        <div className="h-10 bg-slate-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return <div>Restaurant not found.</div>;
  }

  return (
    <div>
      <Link to="/restaurants" className="inline-flex items-center text-slate-500 hover:text-orange-500 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Restaurants
      </Link>

      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm mb-10">
        <div className="h-48 md:h-64 relative bg-slate-800">
          <img 
             src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80" 
             alt={restaurant.name} 
             className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">{restaurant.name}</h1>
            <p className="text-slate-200 text-lg">{restaurant.description}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-6">Menu</h2>
      
      {foodItems.length === 0 ? (
        <p className="text-slate-500">No food items available at this time.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {foodItems.map((item) => {
            const inCart = cart.some(c => c.foodItem === item._id);
            return (
              <div key={item._id} className="bg-white rounded-xl border border-slate-100 p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80" alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                    <p className="text-orange-600 font-bold mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                    <button 
                      onClick={() => addToCart(item)}
                      disabled={!item.isAvailable}
                      className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                        !item.isAvailable 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : inCart 
                            ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {inCart ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
