import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Sparkles } from 'lucide-react';

const conditionStyles = {
  'Brand New': 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  'Like New': 'bg-sky-50 text-sky-800 border-sky-200/80',
  'Gently Used': 'bg-amber-50 text-amber-800 border-amber-200/80',
  'Heavily Read': 'bg-stone-100 text-stone-700 border-stone-200',
};

const statusBadges = {
  available: { label: 'Available', dot: 'bg-emerald-500' },
  reserved: { label: 'Reserved', dot: 'bg-amber-500' },
  sold: { label: 'Sold', dot: 'bg-stone-400' },
};

export default function BookCard({ book }) {
  const [isSaved, setIsSaved] = useState(false);

  const discountPercent =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : null;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <Link
      to={`/book/${book._id}`}
      className="group flex flex-col bg-white rounded-2xl border border-[#e7e2d7] overflow-hidden hover:border-amber-400/80 hover:shadow-book-hover transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Book Cover Container with Spine Effect */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 book-spine-effect">
        <img
          src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
          alt={book.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Favorite Icon Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Save book"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-stone-500 hover:text-rose-600 transition"
        >
          <Heart className={`w-4 h-4 transition ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Status Dot Pill */}
        {book.status && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-stone-800 shadow-sm border border-stone-200/60">
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadges[book.status]?.dot || 'bg-stone-500'}`} />
              {statusBadges[book.status]?.label || book.status}
            </span>
          </div>
        )}

        {/* Discount Ribbon */}
        {discountPercent && discountPercent > 0 && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-rose-600/95 text-white shadow-sm backdrop-blur-xs">
              Save {discountPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Book Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Genre & Condition tags */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#f3efe6] text-stone-700 border border-[#e7e2d7]">
            {book.genre}
          </span>
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${
              conditionStyles[book.condition] || 'bg-stone-100 text-stone-600'
            }`}
          >
            {book.condition}
          </span>
        </div>

        {/* Title in Serif */}
        <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 group-hover:text-amber-800 transition line-clamp-2 leading-snug mb-1">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-xs text-stone-500 mb-4 line-clamp-1">by {book.author}</p>

        {/* Pricing & Location */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-stone-900">${book.price}</span>
              {book.originalPrice > book.price && (
                <span className="text-xs text-stone-400 line-through">
                  ${book.originalPrice}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="truncate max-w-[110px]">{book.city}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
