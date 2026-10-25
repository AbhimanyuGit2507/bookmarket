import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tag } from 'lucide-react';

const conditionStyles = {
  'Brand New': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Like New': 'bg-blue-50 text-blue-700 border-blue-200',
  'Gently Used': 'bg-amber-50 text-amber-700 border-amber-200',
  'Heavily Read': 'bg-stone-100 text-stone-600 border-stone-200',
};

const statusBadges = {
  available: { label: 'Available', style: 'bg-emerald-600 text-white' },
  reserved: { label: 'Reserved', style: 'bg-amber-500 text-white' },
  sold: { label: 'Sold', style: 'bg-stone-500 text-white' },
};

export default function BookCard({ book }) {
  const discountPercent =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : null;

  return (
    <Link
      to={`/book/${book._id}`}
      className="group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-400 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <img
          src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
          alt={book.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Status Badge */}
        {book.status && (
          <div className="absolute top-3 left-3">
            <span
              className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm ${
                statusBadges[book.status]?.style || 'bg-stone-800 text-white'
              }`}
            >
              {statusBadges[book.status]?.label || book.status}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent && discountPercent > 0 && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-sm">
              -{discountPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Book Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Genre & Condition */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
            {book.genre}
          </span>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
              conditionStyles[book.condition] || 'bg-stone-100 text-stone-600'
            }`}
          >
            {book.condition}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-stone-900 group-hover:text-amber-700 transition line-clamp-2 leading-snug mb-1">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-xs text-stone-600 mb-3 line-clamp-1">by {book.author}</p>

        {/* Pricing & Location footer */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-stone-900">${book.price}</span>
              {book.originalPrice > book.price && (
                <span className="text-xs text-stone-600 line-through">
                  ${book.originalPrice}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-stone-600">
            <MapPin className="w-3.5 h-3.5 text-stone-600" />
            <span className="truncate max-w-[100px]">{book.city}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
