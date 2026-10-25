import React from 'react';
import { Filter, RotateCcw, X, DollarSign, BookOpen, Layers, Check } from 'lucide-react';

const GENRES = [
  { name: 'All', icon: '✨' },
  { name: 'Engineering & CS', icon: '💻' },
  { name: 'Fiction & Sci-Fi', icon: '🚀' },
  { name: 'Non-Fiction', icon: '📚' },
  { name: 'Comics & Manga', icon: '🎨' },
  { name: 'Exam Prep', icon: '📝' },
];

const CONDITIONS = [
  { label: 'All', color: 'bg-stone-400' },
  { label: 'Brand New', color: 'bg-emerald-500' },
  { label: 'Like New', color: 'bg-sky-500' },
  { label: 'Gently Used', color: 'bg-amber-500' },
  { label: 'Heavily Read', color: 'bg-stone-500' },
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
      <div className="flex items-center justify-between pb-3.5 border-b border-[#e7e2d7]">
        <div className="flex items-center gap-2 text-stone-900 font-bold font-serif text-base">
          <Filter className="w-4 h-4 text-amber-700" />
          <span>Refine Catalog</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-stone-500 hover:text-amber-800 flex items-center gap-1 transition font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Genre Categories */}
      <div>
        <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2.5">
          Categories & Genres
        </label>
        <div className="space-y-1">
          {GENRES.map((g) => {
            const isSelected = (filters.genre || 'All') === g.name;
            return (
              <button
                key={g.name}
                type="button"
                onClick={() => onFilterChange('genre', g.name === 'All' ? '' : g.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-[#f3efe6]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{g.icon}</span>
                  <span>{g.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition Selector */}
      <div className="pt-2 border-t border-[#e7e2d7]/70">
        <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2.5">
          Book Condition
        </label>
        <div className="space-y-1.5">
          {CONDITIONS.map((c) => {
            const isSelected = (filters.condition || 'All') === c.label;
            return (
              <label
                key={c.label}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition text-xs font-semibold border ${
                  isSelected
                    ? 'bg-white border-amber-600/60 shadow-xs text-stone-900'
                    : 'bg-[#faf8f5]/60 border-transparent text-stone-600 hover:bg-[#f3efe6]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${c.color}`} />
                  <span>{c.label}</span>
                </div>
                <input
                  type="radio"
                  name="condition"
                  checked={isSelected}
                  onChange={() => onFilterChange('condition', c.label === 'All' ? '' : c.label)}
                  className="sr-only"
                />
                {isSelected && <div className="w-2 h-2 rounded-full bg-amber-700" />}
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-2 border-t border-[#e7e2d7]/70">
        <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2.5">
          Price Range ($ USD)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">$</span>
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-full pl-6 pr-2 py-2 text-xs bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 shadow-xs"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">$</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full pl-6 pr-2 py-2 text-xs bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Sort Option */}
      <div className="pt-2 border-t border-[#e7e2d7]/70">
        <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
          Sort Order
        </label>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full py-2.5 px-3 text-xs bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 text-stone-800 font-semibold shadow-xs"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Lowest First</option>
          <option value="price_desc">Price: Highest First</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white p-6 rounded-3xl border border-[#e7e2d7] shadow-book h-fit sticky top-28">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white p-6 shadow-2xl z-50 flex flex-col overflow-y-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100"
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
