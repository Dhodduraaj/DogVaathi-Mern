import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import CustomerLayout from "./layouts/CustomerLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import Home from "./pages/portfolio/Home.jsx";
import Achievements from "./pages/portfolio/Achievements.jsx";
import Videos from "./pages/portfolio/Videos.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Products from "./pages/store/Products.jsx";
import Cart from "./pages/store/Cart.jsx";
import Orders from "./pages/store/Orders.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminAchievements from "./pages/admin/AdminAchievements.jsx";
import AdminVideos from "./pages/admin/AdminVideos.jsx";
import AdminARModels from "./pages/admin/AdminARModels.jsx";
import AdminCoupons from "./pages/admin/AdminCoupons.jsx";
import ARExperience from "./pages/ARExperience.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/auth/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && user.role === "admin" ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

const App = () => {
  return (
    <Routes>
      {/* Public + customer routes */}
      <Route
        path="/"
        element={
          <CustomerLayout>
            <Home />
          </CustomerLayout>
        }
      />
      <Route
        path="/portfolio/achievements"
        element={
          <CustomerLayout>
            <Achievements />
          </CustomerLayout>
        }
      />
      <Route
        path="/portfolio/videos"
        element={
          <CustomerLayout>
            <Videos />
          </CustomerLayout>
        }
      />
      <Route
        path="/ar-experience"
        element={
          <CustomerLayout>
            <ARExperience />
          </CustomerLayout>
        }
      />
      <Route
        path="/store/products"
        element={
          <CustomerLayout>
            <Products />
          </CustomerLayout>
        }
      />
      <Route
        path="/store/cart"
        element={
          <CustomerLayout>
            <Cart />
          </CustomerLayout>
        }
      />
      <Route
        path="/store/orders"
        element={
          <PrivateRoute>
            <CustomerLayout>
              <Orders />
            </CustomerLayout>
          </PrivateRoute>
        }
      />

      {/* Auth - full screen layout */}
      <Route
        path="/auth/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/auth/register"
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/achievements"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminAchievements />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/videos"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminVideos />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/ar-models"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminARModels />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/coupons"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminCoupons />
            </AdminLayout>
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default App;

