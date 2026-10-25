import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, BookOpenCheck, Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import BookSkeleton from '../components/BookSkeleton';
import FilterSidebar from '../components/FilterSidebar';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-8 sm:p-12 mb-10 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-4 backdrop-blur-sm border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Pre-Loved Books at Up to 70% Off</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight leading-tight mb-4">
            Buy & Sell Books Directly Between Readers
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6">
            Connecting students, developers, and avid book lovers. Skip middleman fees, talk directly with sellers on WhatsApp, and find your next favorite title locally.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenSellModal}
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-amber-600 hover:bg-amber-500 text-white transition shadow-md shadow-amber-600/30"
            >
              List Your Book in 60s
            </button>
            <a
              href="#catalog"
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 text-stone-200 transition backdrop-blur-sm"
            >
              Explore Available Titles
            </a>
          </div>
        </div>

        {/* Ambient background blur elements */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900">
                {filters.genre ? `${filters.genre} Books` : 'All Available Listings'}
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Showing {books.length} of {pagination.total} book{pagination.total === 1 ? '' : 's'}
                {filters.search && ` matching "${filters.search}"`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white border border-stone-200 rounded-xl shadow-sm hover:bg-stone-50 text-stone-700"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>

              {/* Quick sort toggle */}
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="bg-white border border-stone-200 rounded-lg py-1.5 px-2.5 text-xs text-stone-800 font-medium focus:outline-none focus:border-amber-600 shadow-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-2.5 bg-stone-100/70 rounded-xl">
              <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider ml-1">
                Active Filters:
              </span>

              {filters.search && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-white border border-stone-200 px-2.5 py-1 rounded-full text-stone-700 shadow-xs">
                  Keyword: "{filters.search}"
                  <button onClick={() => handleFilterChange('search', '')} className="hover:text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.genre && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-white border border-stone-200 px-2.5 py-1 rounded-full text-stone-700 shadow-xs">
                  Genre: {filters.genre}
                  <button onClick={() => handleFilterChange('genre', '')} className="hover:text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.condition && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-white border border-stone-200 px-2.5 py-1 rounded-full text-stone-700 shadow-xs">
                  Condition: {filters.condition}
                  <button onClick={() => handleFilterChange('condition', '')} className="hover:text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-white border border-stone-200 px-2.5 py-1 rounded-full text-stone-700 shadow-xs">
                  Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                  <button
                    onClick={() => updateFilters({ minPrice: '', maxPrice: '', page: 1 })}
                    className="hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold ml-auto mr-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Book Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <BookSkeleton key={i} />
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            /* Clean Empty State */
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto my-8 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <BookOpenCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold font-serif text-stone-900 mb-2">
                No matching books found
              </h3>
              <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                We couldn't find any books matching your current filters or search keywords. Try adjusting your search query, price range, or category.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-full transition"
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
                className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(pagination.pages)].map((_, i) => {
                  const p = i + 1;
                  const isCurrent = p === pagination.page;
                  return (
                    <button
                      key={p}
                      onClick={() => updateFilters({ page: p })}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                        isCurrent
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
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
                className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 transition"
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
