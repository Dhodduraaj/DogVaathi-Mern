import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../utils/axios.js";

const Login = () => {
  const { login, user } = useAuth();
  const { refreshCartFromServer } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      refreshCartFromServer();
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });
      
      localStorage.setItem("dogvaathi_token", data.token);
      localStorage.setItem("dogvaathi_user", JSON.stringify(data.user));
      navigate("/");
      window.location.reload(); 
    } catch (err) {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4 text-lg">
        <div className="space-y-1">
          <label className="text-xs text-slate-600 dark:text-slate-300">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-lg text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-600 dark:text-slate-300">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-lg text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
        <span className="mx-4 flex-shrink text-xs text-slate-500">OR</span>
        <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google Login Failed")}
          useOneTap
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        New here?{" "}
        <Link to="/auth/register" className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;

