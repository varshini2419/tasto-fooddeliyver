import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ✅ Add to Cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.foodItem === item._id
      );

      if (existingItem) {
        toast.success(`Increased ${item.name} quantity`);
        return prevCart.map((cartItem) =>
          cartItem.foodItem === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      toast.success(`Added ${item.name} to cart`);
      return [
        ...prevCart,
        {
          foodItem: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image,
        },
      ];
    });
  };

  // ✅ Remove Item
  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.foodItem !== id)
    );
    toast.success('Item removed from cart');
  };

  // ✅ Update Quantity
  const updateQuantity = (id, amount) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.foodItem === id) {
          const newQuantity = item.quantity + amount;
          return newQuantity > 0
            ? { ...item, quantity: newQuantity }
            : item;
        }
        return item;
      });
    });
  };

  // ✅ Clear Cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // 🔥 Subtotal (only items)
  const getCartSubtotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // 🔥 Delivery Charge Logic
  const getDeliveryCharge = () => {
    const subtotal = getCartSubtotal();
    return subtotal > 0 && subtotal < 120 ? 20 : 0;
  };

  // 🔥 Final Total
  const getCartTotal = () => {
    return getCartSubtotal() + getDeliveryCharge();
  };

  // 🔢 Total Items Count
  const getCartCount = () => {
    return cart.reduce(
      (count, item) => count + item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartSubtotal,
        getDeliveryCharge,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};