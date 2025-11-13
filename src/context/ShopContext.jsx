import { createContext, useEffect, useState } from "react";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "R";
  const delivery_fee = 10;

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState("");

  // Initial state loads user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? true : false;
  });

  // NEW STATE: To control when the app is ready after checking local storage
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false);

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // ------------------- Products -------------------
  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      const normalized = data.map((product) => ({
        ...product,
        image: Array.isArray(product.image)
          ? product.image
          : [product.image].filter(Boolean),
        sizes:
          Array.isArray(product.sizes) && product.sizes.length > 0
            ? product.sizes
            : ["S", "M", "L", "XL"],
      }));

      setProducts(normalized);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Auth -------------------
  const login = (userData) => {
    const storedUser = {
      _id: userData._id || userData.userId,
      userName: userData.userName,
      email: userData.email,
      avatar: userData.avatar,
      phone: userData.phone,
      address: userData.address,
    };

    setUser(storedUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(storedUser));
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setCartItems({});
  };

  // Function to verify the user ID stored in localStorage with the backend
  const verifyUserSession = async (userId) => {
    if (!userId) {
      setInitialAuthCheckComplete(true);
      return;
    }

    try {
      // Send the stored ID in the Authorization header for the server to validate
      const res = await fetch(`http://localhost:3000/user/${userId}`, {
        headers: {
          "Authorization": `Bearer ${userId}`
        }
      });

      if (!res.ok) {
        // If server says the ID is bad/expired, force log out
        logout();
      }
      // If res.ok, the local state (set from localStorage) is preserved

    } catch (error) {
      console.error("Session verification failed:", error);
      logout(); // Network failure should also clear stale session
    } finally {
      setInitialAuthCheckComplete(true); // Mark check as complete
    }
  };

  // ------------------- Cart -------------------
  const loadCart = async (userId) => {
    if (!userId) return;
    try {
      setCartLoading(true);
      setCartError("");
      // Assuming your cart API supports the Authorization header check
      const res = await fetch(`http://localhost:3000/cart/${userId}`, {
        headers: { 'Authorization': `Bearer ${userId}` } // Add header to cart load
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCartItems(data.items || {});
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCartError("Failed to load cart. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  // 🔑 FIX: Function to clear the local cart state instantly
  const clearCartState = () => {
    setCartItems({});
  };
  
  const addToCart = async (itemId, size = "M") => {
    const newCart = structuredClone(cartItems);
    if (!newCart[itemId]) newCart[itemId] = {};
    newCart[itemId][size] = (newCart[itemId][size] || 0) + 1;

    setCartItems(newCart);

    if (isAuthenticated && user?._id) {
      try {
        await fetch("http://localhost:3000/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${user._id}`, // Ensure auth for cart modification
          },
          body: JSON.stringify({
            userId: user._id,
            itemId,
            size,
            quantity: newCart[itemId][size],
          }),
        });
      } catch (error) {
        console.error("Failed to save cart:", error);
        setCartError("Failed to update cart. Please try again.");
      }
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const newCart = structuredClone(cartItems);
    if (!newCart[itemId]) return;

    if (quantity <= 0) {
      delete newCart[itemId][size];
      if (Object.keys(newCart[itemId]).length === 0) delete newCart[itemId];
    } else {
      newCart[itemId][size] = quantity;
    }

    setCartItems(newCart);

    if (isAuthenticated && user?._id) {
      try {
        const authHeader = { 'Authorization': `Bearer ${user._id}` };

        if (quantity <= 0) {
          // DELETE request to remove the item/size from MongoDB
          await fetch(
            `http://localhost:3000/cart/${user._id}/${itemId}/${size}`,
            { method: "DELETE", headers: authHeader }
          );
        } else {
          // PUT request to update the quantity in MongoDB
          await fetch(`http://localhost:3000/cart/${user._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...authHeader },
            body: JSON.stringify({ itemId, size, quantity }),
          });
        }
      } catch (error) {
        console.error("Failed to update cart in backend:", error);
        setCartError("Failed to update cart. Please try again.");
      }
    }
  };

  const getCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product) {
        for (const size in cartItems[itemId]) {
          total += product.price * cartItems[itemId][size];
        }
      }
    }
    return total;
  };

  const getCartCount = () => {
    let count = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        count += cartItems[itemId][size];
      }
    }
    return count;
  };

  // ------------------- Lifecycle -------------------
  useEffect(() => {
    loadProducts();

    // Check and verify the user session immediately on mount
    if (user?._id) {
      verifyUserSession(user._id);
    } else {
      setInitialAuthCheckComplete(true);
    }
  }, []); // Only runs on component mount

  useEffect(() => {
    // Load cart only if authenticated state is confirmed AND the initial check is complete
    if (isAuthenticated && user?._id && initialAuthCheckComplete) {
      loadCart(user._id);
    } else if (!isAuthenticated) {
      setCartItems({});
    }
  }, [isAuthenticated, user, initialAuthCheckComplete]);

  // ------------------- Context Value -------------------
  const value = {
    products,
    currency,
    delivery_fee,
    cartItems,
    addToCart,
    updateQuantity,
    getCartAmount,
    getCartCount,
    loading,
    cartLoading,
    cartError,
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    loadProducts,
    login,
    logout,
    clearCartState, // 🔑 Export the new function
  };

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;