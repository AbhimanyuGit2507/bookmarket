import React from 'react';
import { Filter, RotateCcw, X, DollarSign } from 'lucide-react';

const GENRES = [
  'All',
  'Engineering & CS',
  'Fiction & Sci-Fi',
  'Non-Fiction',
  'Comics & Manga',
  'Exam Prep',
];

const CONDITIONS = [
  'All',
  'Brand New',
  'Like New',
  'Gently Used',
  'Heavily Read',
];

export default function FilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  isOpen,
  onClose,
}) {
  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2 text-stone-900 font-semibold">
          <Filter className="w-4 h-4 text-amber-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-stone-600 hover:text-amber-700 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Genre Pills */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2.5">
          Genre
        </label>
        <div className="flex flex-wrap gap-1.5">
          {GENRES.map((g) => {
            const isSelected = (filters.genre || 'All') === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => onFilterChange('genre', g === 'All' ? '' : g)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition Selector */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2.5">
          Condition
        </label>
        <div className="space-y-1.5">
          {CONDITIONS.map((c) => {
            const isSelected = (filters.condition || 'All') === c;
            return (
              <label
                key={c}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-stone-100/70 cursor-pointer transition text-xs font-medium text-stone-700"
              >
                <input
                  type="radio"
                  name="condition"
                  checked={isSelected}
                  onChange={() => onFilterChange('condition', c === 'All' ? '' : c)}
                  className="w-3.5 h-3.5 text-amber-600 focus:ring-amber-500 border-stone-300"
                />
                <span>{c}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2.5">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-600 text-xs">$</span>
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-full pl-6 pr-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-600 text-xs">$</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full pl-6 pr-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>
      </div>

      {/* Sort Option */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 text-stone-700"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm h-fit sticky top-24">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white p-6 shadow-2xl z-50 flex flex-col overflow-y-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={onClose}
                className="p-1 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
