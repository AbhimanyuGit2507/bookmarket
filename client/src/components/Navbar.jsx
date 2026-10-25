import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, PlusCircle, Search, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:bg-amber-700 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-900 font-serif">
                The Book<span className="text-amber-600">Market</span>
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-stone-600 -mt-1 tracking-wider uppercase">
                Peer-to-Peer Marketplace
              </span>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
              <input
                type="text"
                placeholder="Search by title, author, keyword, or ISBN..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-stone-100 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-600 rounded-full focus:outline-none transition shadow-inner"
              />
            </div>
          </form>

          {/* Action buttons & User state */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={handleSellClick}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 active:scale-95 rounded-full transition shadow-sm shadow-amber-600/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell a Book</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-semibold text-xs flex items-center justify-center">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-stone-700 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-600">Signed in as</p>
                      <p className="text-sm font-semibold text-stone-900 truncate">{user.email}</p>
                      <p className="text-xs text-stone-600 truncate">{user.city}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-stone-600" />
                      <span>My Listings & Stats</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition"
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
                  className="px-3.5 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-full transition"
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
          <div className="sm:hidden py-4 border-t border-stone-200 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-stone-100 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-600"
              />
            </form>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSellClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-amber-600 rounded-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell a Book</span>
            </button>

            {user ? (
              <div className="space-y-1 pt-2 border-t border-stone-100">
                <div className="px-2 py-1">
                  <p className="text-xs text-stone-600">{user.name}</p>
                  <p className="text-xs text-stone-600 truncate">{user.email}</p>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-md"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-md"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-medium text-stone-700 bg-stone-100 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-medium text-white bg-stone-900 rounded-lg"
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
