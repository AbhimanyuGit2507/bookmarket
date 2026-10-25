import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  BookOpenCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  MessageCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import BookSkeleton from '../components/BookSkeleton';
import FilterSidebar from '../components/FilterSidebar';

const QUICK_CATEGORIES = [
  { label: 'Engineering & CS', icon: '💻' },
  { label: 'Fiction & Sci-Fi', icon: '🚀' },
  { label: 'Non-Fiction', icon: '📚' },
  { label: 'Comics & Manga', icon: '🎨' },
  { label: 'Exam Prep', icon: '📝' },
];

export default function HomePage({ onOpenSellModal }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state from URL search params
  const filters = {
    search: searchParams.get('search') || '',
    genre: searchParams.get('genre') || '',
    condition: searchParams.get('condition') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  const updateFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    const params = new URLSearchParams();

    Object.entries(updated).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.set(key, val);
      }
    });

    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  useEffect(() => {
    let isMounted = true;

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.genre) params.set('genre', filters.genre);
        if (filters.condition) params.set('condition', filters.condition);
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        if (filters.sort) params.set('sort', filters.sort);
        params.set('page', filters.page);
        params.set('limit', 9);

        const res = await api.get(`/books?${params.toString()}`);
        if (isMounted && res.data.success) {
          setBooks(res.data.data);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Failed to fetch books:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBooks();

    return () => {
      isMounted = false;
    };
  }, [
    filters.search,
    filters.genre,
    filters.condition,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    filters.page,
  ]);

  const activeFilterCount = [
    filters.search,
    filters.genre,
    filters.condition,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Editorial Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950 text-white p-8 sm:p-14 mb-10 shadow-2xl border border-stone-800">
        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold mb-5 backdrop-blur-md border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Peer-to-Peer Second-Hand Book Marketplace</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight leading-[1.12] mb-5">
            Give Great Books a <span className="italic font-normal text-amber-300">Second Chapter</span>.
          </h1>

          {/* Paragraph */}
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl font-light">
            Skip expensive bookstore markups and corporate fees. Buy and sell textbooks, literary classics, and manga directly from nearby readers with zero platform cut.
          </p>

          {/* Quick-filter genre buttons inside Hero */}
          <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2.5">
              Explore by Popular Genres:
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => handleFilterChange('genre', cat.label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border backdrop-blur-sm ${
                    filters.genre === cat.label
                      ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-stone-200 border-white/15'
                  }`}
                >
                  <span className="mr-1.5">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CTAs & Value Props */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <button
              onClick={onOpenSellModal}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white transition shadow-lg shadow-amber-600/30 active:scale-95"
            >
              Post a Book for Sale
            </button>

            <div className="hidden sm:flex items-center gap-6 text-xs text-stone-400 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Direct Peer</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Instant WhatsApp Chat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background blur elements */}
        <div className="absolute right-0 top-0 -mt-16 -mr-16 w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-20 w-80 h-80 bg-stone-700/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Catalog & Filter Grid */}
      <div id="catalog" className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
        />

        {/* Main Books Catalog Section */}
        <main className="flex-1 w-full">
          {/* Top Bar: Search info, Active filter tags, Mobile filter trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#e7e2d7]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight">
                {filters.genre ? `${filters.genre}` : 'Browse Marketplace Catalog'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Showing {books.length} of {pagination.total} pre-loved book{pagination.total === 1 ? '' : 's'} available
                {filters.search && ` for keyword "${filters.search}"`}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white border border-[#e7e2d7] rounded-xl shadow-xs hover:bg-[#faf8f5] text-stone-800"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>

              {/* Quick sort toggle */}
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <span className="hidden sm:inline font-medium">Sort by:</span>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="bg-white border border-[#e7e2d7] rounded-xl py-1.5 px-3 text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-600 shadow-xs"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-2xl border border-[#e7e2d7] shadow-xs">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider ml-1">
                Active Filters:
              </span>

              {filters.search && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-[#f3efe6] border border-[#e7e2d7] px-3 py-1 rounded-full text-stone-800 font-semibold shadow-xs">
                  Keyword: "{filters.search}"
                  <button onClick={() => handleFilterChange('search', '')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.genre && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-[#f3efe6] border border-[#e7e2d7] px-3 py-1 rounded-full text-stone-800 font-semibold shadow-xs">
                  Genre: {filters.genre}
                  <button onClick={() => handleFilterChange('genre', '')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.condition && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-[#f3efe6] border border-[#e7e2d7] px-3 py-1 rounded-full text-stone-800 font-semibold shadow-xs">
                  Condition: {filters.condition}
                  <button onClick={() => handleFilterChange('condition', '')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-[#f3efe6] border border-[#e7e2d7] px-3 py-1 rounded-full text-stone-800 font-semibold shadow-xs">
                  Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                  <button
                    onClick={() => updateFilters({ minPrice: '', maxPrice: '', page: 1 })}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs text-amber-800 hover:text-amber-900 font-bold ml-auto mr-1 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}

          {/* Book Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
              {[...Array(6)].map((_, i) => (
                <BookSkeleton key={i} />
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            /* Clean Empty State */
            <div className="bg-white rounded-3xl border border-[#e7e2d7] p-12 text-center max-w-lg mx-auto my-8 shadow-book">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200/60">
                <BookOpenCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-serif text-stone-900 mb-2">
                No matching books found
              </h3>
              <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                We couldn't find any listings matching your current category or search criteria. Try clearing some filters or searching with another author or title keyword.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-full transition shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => updateFilters({ page: pagination.page - 1 })}
                disabled={pagination.page <= 1}
                className="p-2.5 rounded-xl border border-[#e7e2d7] bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 transition shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {[...Array(pagination.pages)].map((_, i) => {
                  const p = i + 1;
                  const isCurrent = p === pagination.page;
                  return (
                    <button
                      key={p}
                      onClick={() => updateFilters({ page: p })}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                        isCurrent
                          ? 'bg-amber-700 text-white shadow-sm'
                          : 'bg-white border border-[#e7e2d7] text-stone-700 hover:bg-[#faf8f5]'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => updateFilters({ page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.pages}
                className="p-2.5 rounded-xl border border-[#e7e2d7] bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 transition shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
