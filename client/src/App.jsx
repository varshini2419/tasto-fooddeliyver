import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import DeliveryLayout from './layouts/DeliveryLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Pages
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageRestaurants from './pages/ManageRestaurants';
import ManageFoodItems from './pages/ManageFoodItems';
import ManageOrders from './pages/ManageOrders';
import ManageDeliveryBoys from './pages/ManageDeliveryBoys';
import PortalSettings from './pages/PortalSettings';

// Delivery Pages
import DeliveryDashboard from './pages/DeliveryDashboard';
import ActiveOrders from './pages/ActiveOrders';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <Routes>
          {/* Public Routes without Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Login defaultView="admin-login" />} />
          <Route path="/delivery/login" element={<Login defaultView="delivery-login" />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/register" element={<Navigate to="/signup" replace />} />
          
          {/* Customer Routes (with Customer Layout) */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />
            
            {/* Protected Customer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/restaurants/:id" element={<RestaurantDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/my-orders" element={<MyOrders />} />
            </Route>
          </Route>

          {/* Admin Routes (Protected, Admin Layout) */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/restaurants" element={<ManageRestaurants />} />
              <Route path="/admin/restaurants/:restaurantId/items" element={<ManageFoodItems />} />
              <Route path="/admin/food-items" element={<Navigate to="/admin/restaurants" replace />} />
              <Route path="/admin/orders" element={<ManageOrders />} />
              <Route path="/admin/delivery-boys" element={<ManageDeliveryBoys />} />
              <Route path="/admin/settings" element={<PortalSettings />} />
            </Route>
          </Route>

          {/* Delivery Boy Routes (Protected, Delivery Layout) */}
          <Route element={<ProtectedRoute allowedRoles={['delivery_boy']} />}>
            <Route element={<DeliveryLayout />}>
              <Route path="/delivery" element={<DeliveryDashboard />} />
              <Route path="/delivery/orders" element={<ActiveOrders />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
