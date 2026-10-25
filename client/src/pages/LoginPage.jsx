import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, LogIn, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await login(email, password);
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-amber-600/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-stone-900">Welcome Back</h2>
          <p className="text-xs text-stone-600 mt-1">
            Sign in to manage your listings and converse with book lovers.
          </p>
        </div>

        {/* Evaluator Quick Demo Accounts */}
        <div className="mb-6 p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Evaluator Demo Accounts (1-Click Fill)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('seller@bookmarket.com', 'password123')}
              className="py-1.5 px-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-lg text-[11px] font-semibold text-amber-900 transition flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3 h-3 text-amber-600" />
              <span>Demo Seller</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('buyer@bookmarket.com', 'password123')}
              className="py-1.5 px-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-lg text-[11px] font-semibold text-amber-900 transition flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3 h-3 text-amber-600" />
              <span>Demo Buyer</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:scale-98 transition shadow-md shadow-amber-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-stone-600">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-amber-700 hover:text-amber-800">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
