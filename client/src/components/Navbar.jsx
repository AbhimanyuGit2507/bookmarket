import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  PlusCircle,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  MapPin,
  BookmarkCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenSellModal }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    navigate('/');
  };

  const handleSellClick = () => {
    if (!user) {
      navigate('/login?redirect=dashboard');
      return;
    }
    if (onOpenSellModal) {
      onOpenSellModal();
    } else {
      navigate('/dashboard?new=true');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e7e2d7]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md shadow-amber-900/15 group-hover:shadow-amber-900/30 group-hover:scale-105 transition-all duration-300">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-serif">
                  The Book<span className="text-amber-700">Market</span>
                </span>
                <span className="hidden lg:inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200">
                  Peer-to-Peer
                </span>
              </div>
              <p className="hidden sm:block text-[11px] font-medium text-stone-500 tracking-wide">
                Community Second-Hand Books
              </p>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search title, author, keyword, or ISBN..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-[#f3efe6]/80 hover:bg-[#f3efe6] focus:bg-white border border-[#e7e2d7] focus:border-amber-600 rounded-full focus:outline-none transition shadow-xs text-stone-800 placeholder-stone-400"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Action buttons & User state */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={handleSellClick}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 active:scale-95 rounded-full transition shadow-sm shadow-amber-800/25 border border-amber-500/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell a Book</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#e7e2d7] bg-white/80 hover:bg-white hover:border-amber-400 transition shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-stone-800 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white border border-[#e7e2d7] rounded-2xl shadow-elevated py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-stone-100 bg-[#faf8f5]/60">
                      <p className="text-[11px] font-medium text-stone-500">Signed in as</p>
                      <p className="text-xs font-bold text-stone-900 truncate">{user.email}</p>
                      <div className="flex items-center gap-1 text-[11px] text-stone-600 mt-1">
                        <MapPin className="w-3 h-3 text-amber-700" />
                        <span className="truncate">{user.city}</span>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm text-stone-700 hover:bg-[#faf8f5] hover:text-amber-900 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-700" />
                      <span>Seller Dashboard & Stats</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenSellModal ? onOpenSellModal() : navigate('/dashboard?new=true');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm text-stone-700 hover:bg-[#faf8f5] hover:text-amber-900 transition"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-700" />
                      <span>Post a New Listing</span>
                    </button>

                    <div className="my-1 border-t border-stone-100" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-900 bg-[#f3efe6] hover:bg-[#e7e2d7] border border-[#e7e2d7] rounded-full transition shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 border-t border-[#e7e2d7] space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white rounded-xl border border-[#e7e2d7] focus:outline-none focus:border-amber-600"
              />
            </form>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSellClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-amber-600 rounded-xl"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell a Book</span>
            </button>

            {user ? (
              <div className="space-y-1 pt-2 border-t border-stone-200">
                <div className="px-2 py-1">
                  <p className="text-xs font-bold text-stone-900">{user.name}</p>
                  <p className="text-xs text-stone-500 truncate">{user.email}</p>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-lg"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Seller Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold text-stone-700 bg-white border border-[#e7e2d7] rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold text-white bg-stone-900 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
