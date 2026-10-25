import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
  Quote,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneOrWhatsApp: '',
    city: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
                "The reading of all good books is like conversation with the finest minds of past centuries."
              </blockquote>
              <cite className="block text-xs font-semibold text-amber-300 not-italic uppercase tracking-wider">
                — René Descartes
              </cite>
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-6 border-t border-white/10 space-y-3 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct WhatsApp reach with zero platform commissions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Free peer listing for textbooks, fiction, and manga</span>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 -mb-12 -mr-12 w-64 h-64 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
              Create Reader Account
            </h2>
            <p className="text-xs text-stone-500 mt-1.5">
              List your books in seconds and coordinate peer pickups directly.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Turner"
                className="w-full px-4 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 transition shadow-2xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                className="w-full px-4 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 transition shadow-2xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Password (min. 6 chars) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider flex items-center justify-between">
                  <span>WhatsApp / Phone <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="tel"
                  name="phoneOrWhatsApp"
                  required
                  value={formData.phoneOrWhatsApp}
                  onChange={handleChange}
                  placeholder="+14155552671"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 transition shadow-2xs text-stone-900"
                />
                <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                  ✓ For direct buyer WhatsApp connect
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                  City / Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="San Francisco, CA"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 transition shadow-2xs text-stone-900"
                />
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
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-stone-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-amber-800 hover:text-amber-900 underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
