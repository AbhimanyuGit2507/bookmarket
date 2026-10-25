import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  LogIn,
  AlertCircle,
  Sparkles,
  UserCheck,
  Eye,
  EyeOff,
  Quote,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-[#e7e2d7] shadow-book overflow-hidden">
        
        {/* Left Editorial Branding Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-lg tracking-tight">The BookMarket</span>
            </div>

            <div className="space-y-4">
              <Quote className="w-8 h-8 text-amber-500/40" />
              <blockquote className="font-serif text-lg sm:text-xl font-light italic leading-relaxed text-stone-200">
                "A room without books is like a body without a soul."
              </blockquote>
              <cite className="block text-xs font-semibold text-amber-300 not-italic uppercase tracking-wider">
                — Marcus Tullius Cicero
              </cite>
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-6 border-t border-white/10 space-y-3 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct WhatsApp connections with local readers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero transaction commission or hidden platform fees</span>
            </div>
          </div>

          {/* Ambient blur */}
          <div className="absolute right-0 bottom-0 -mb-12 -mr-12 w-64 h-64 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
              Sign In to Your Account
            </h2>
            <p className="text-xs text-stone-500 mt-1.5">
              Access your saved books, manage seller listings, and connect with buyers.
            </p>
          </div>

          {/* Evaluator 1-Click Demo Accounts */}
          <div className="mb-6 p-4 bg-[#faf8f5] rounded-2xl border border-[#e7e2d7]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Evaluator 1-Click Credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillDemoAccount('seller@bookmarket.com', 'password123')}
                className="py-2 px-3 bg-white hover:bg-amber-100/60 border border-[#e7e2d7] rounded-xl text-xs font-bold text-amber-950 transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Demo Seller</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('buyer@bookmarket.com', 'password123')}
                className="py-2 px-3 bg-white hover:bg-amber-100/60 border border-[#e7e2d7] rounded-xl text-xs font-bold text-amber-950 transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Demo Buyer</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@bookmarket.com"
                className="w-full px-4 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 transition shadow-2xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-11 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 transition shadow-2xs text-stone-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-5 rounded-xl text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 active:scale-98 transition shadow-sm shadow-amber-800/30 flex items-center justify-center gap-2 disabled:opacity-50"
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

          <p className="mt-8 text-center text-xs text-stone-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-amber-800 hover:text-amber-900 underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
