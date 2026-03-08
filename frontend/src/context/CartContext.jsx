import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../utils/axios.js";

const CartContext = createContext(null);

const STORAGE_KEY = "dogvaathi_cart";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const syncUser = useCallback(() => {
    const storedUser = localStorage.getItem("dogvaathi_user");
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  // Load cart: from API if logged in, else from localStorage
  useEffect(() => {
    const u = syncUser();
    if (u && localStorage.getItem("dogvaathi_token")) {
      setCartLoading(true);
      api
        .get("/cart")
        .then((res) => {
          setItems(Array.isArray(res.data) ? res.data : []);
        })
        .catch(() => setItems([]))
        .finally(() => setCartLoading(false));
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch {
          setItems([]);
        }
      }
    }
  }, [syncUser]);

  // Persist to localStorage when not logged in
  useEffect(() => {
    const u = syncUser();
    if (!u || !localStorage.getItem("dogvaathi_token")) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, syncUser]);

  const syncCartToBackend = useCallback((newItems) => {
    api.put("/cart", {
      items: newItems.map((i) => ({ productId: i._id, quantity: i.quantity })),
    }).catch(() => {});
  }, []);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p._id === product._id);
      const next = existing
        ? prev.map((p) =>
            p._id === product._id
              ? { ...p, quantity: p.quantity + quantity }
              : p
          )
        : [...prev, { ...product, quantity }];
      if (localStorage.getItem("dogvaathi_token")) {
        syncCartToBackend(next);
      }
      return next;
    });
    toast.success("Added to cart");
  };

  const removeFromCart = (id) => {
    setItems((prev) => {
      const next = prev.filter((p) => p._id !== id);
      if (localStorage.getItem("dogvaathi_token")) {
        syncCartToBackend(next);
      }
      return next;
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(id);
    }
    setItems((prev) => {
      const next = prev.map((p) =>
        p._id === id ? { ...p, quantity } : p
      );
      if (localStorage.getItem("dogvaathi_token")) {
        syncCartToBackend(next);
      }
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    if (localStorage.getItem("dogvaathi_token")) {
      api.put("/cart", { items: [] }).catch(() => {});
    }
    localStorage.removeItem(STORAGE_KEY);
  };

  /** Call after login to replace cart with server cart */
  const refreshCartFromServer = useCallback(() => {
    if (!localStorage.getItem("dogvaathi_token")) return;
    setCartLoading(true);
    api
      .get("/cart")
      .then((res) => {
        setItems(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setItems([]))
      .finally(() => setCartLoading(false));
  }, []);

  // On logout, reset cart to guest localStorage cart
  useEffect(() => {
    const onLogout = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      setItems(stored ? JSON.parse(stored) : []);
    };
    window.addEventListener("dogvaathi_logout", onLogout);
    return () => window.removeEventListener("dogvaathi_logout", onLogout);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        cartLoading,
        refreshCartFromServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
