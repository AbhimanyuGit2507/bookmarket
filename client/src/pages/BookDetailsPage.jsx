import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Barcode,
  Tag,
  MessageCircle,
  Mail,
  ShieldCheck,
  User,
  AlertCircle,
  Clock,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const conditionStyles = {
  'Brand New': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Like New': 'bg-blue-50 text-blue-700 border-blue-200',
  'Gently Used': 'bg-amber-50 text-amber-700 border-amber-200',
  'Heavily Read': 'bg-stone-100 text-stone-600 border-stone-200',
};

const statusBanner = {
  available: null,
  reserved: {
    bg: 'bg-amber-50 border-amber-200 text-amber-800',
    text: 'This book is currently reserved by a prospective buyer. You can still message the seller in case the deal falls through.',
  },
  sold: {
    bg: 'bg-stone-100 border-stone-300 text-stone-700',
    text: 'This book has been marked as sold. The seller is no longer accepting offers.',
  },
};

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/books/${id}`);
        if (res.data.success) {
          setBook(res.data.data);
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Book not found');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-6 w-32 bg-stone-200 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-[3/4] bg-stone-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-stone-200 rounded" />
            <div className="h-5 w-1/2 bg-stone-200 rounded" />
            <div className="h-10 w-1/3 bg-stone-200 rounded" />
            <div className="h-32 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-stone-900 mb-2">Book Not Found</h2>
        <p className="text-xs text-stone-600 mb-6">
          The listing you are looking for may have been deleted by the owner or the link is invalid.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-full transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const discountPercent =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : null;

  const sellerPhone = book.seller?.phoneOrWhatsApp?.replace(/[^0-9]/g, '') || '';
  const sellerName = book.seller?.name || 'Seller';
  const isOwner = user && book.seller && user._id === book.seller._id;

  const whatsappMessage = encodeURIComponent(
    `Hi ${sellerName}, I am interested in buying your book "${book.title}" listed on The BookMarket for $${book.price}. Is it still available?`
  );

  const whatsappUrl = `https://wa.me/${sellerPhone}?text=${whatsappMessage}`;

  const mailtoUrl = `mailto:${book.seller?.email || ''}?subject=${encodeURIComponent(
    `Inquiry regarding "${book.title}" on The BookMarket`
  )}&body=${encodeURIComponent(
    `Hi ${sellerName},\n\nI saw your listing for "${book.title}" ($${book.price}) on The BookMarket and would love to arrange payment and collection.\n\nThanks!`
  )}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all books</span>
        </Link>
      </div>

      {/* Status Warning Banner (if reserved or sold) */}
      {statusBanner[book.status] && (
        <div
          className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 text-xs font-medium ${
            statusBanner[book.status].bg
          }`}
        >
          <Clock className="w-5 h-5 shrink-0" />
          <span>{statusBanner[book.status].text}</span>
        </div>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm">
        {/* Left Column: Book Cover Image */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-stone-100">
            <img
              src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
              alt={book.title}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent && discountPercent > 0 && (
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-600 text-white shadow-md">
                  Save {discountPercent}%
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-stone-600">
            <Calendar className="w-4 h-4 text-stone-600" />
            <span>Listed on {new Date(book.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Right Column: Book Specs & Seller Actions */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Genre & Condition tags */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              {book.genre}
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${
                conditionStyles[book.condition] || 'bg-stone-100 text-stone-600'
              }`}
            >
              {book.condition}
            </span>
          </div>

          {/* Book Title */}
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight leading-snug mb-2">
            {book.title}
          </h1>

          {/* Author */}
          <p className="text-sm font-medium text-stone-600 mb-6">
            Written by <span className="text-stone-900 font-semibold">{book.author}</span>
          </p>

          {/* Pricing Highlight */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 mb-6 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-stone-600 block mb-0.5">Offered At</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-stone-900">
                  ${book.price}
                </span>
                {book.originalPrice > book.price && (
                  <span className="text-sm text-stone-600 line-through">
                    Original: ${book.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-600 block mb-0.5">Availability</span>
              <span
                className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  book.status === 'available'
                    ? 'bg-emerald-100 text-emerald-800'
                    : book.status === 'reserved'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {book.status}
              </span>
            </div>
          </div>

          {/* Book Description */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              Seller's Notes & Condition
            </h3>
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line bg-stone-50/50 p-4 rounded-xl border border-stone-100">
              {book.description}
            </p>
          </div>

          {/* Book Meta specs: ISBN & City */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center gap-2.5">
              <Barcode className="w-4 h-4 text-stone-600 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] uppercase font-semibold text-stone-600 block">ISBN</span>
                <span className="text-xs font-mono font-medium text-stone-800">
                  {book.isbn || 'Not specified'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-stone-600 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] uppercase font-semibold text-stone-600 block">Location</span>
                <span className="text-xs font-medium text-stone-800">
                  {book.city || book.seller?.city || 'Local meetup'}
                </span>
              </div>
            </div>
          </div>

          {/* Seller Card & Actions */}
          <div className="mt-auto pt-6 border-t border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                  {sellerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">{sellerName}</h4>
                  <p className="text-xs text-stone-600">{book.seller?.city || 'Verified Seller'}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Peer</span>
              </div>
            </div>

            {/* If the current logged-in user is the owner */}
            {isOwner ? (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                <p className="text-xs font-semibold text-amber-900 mb-2">
                  You are the owner of this book listing.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-block px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition"
                >
                  Manage Status & Details in Dashboard
                </Link>
              </div>
            ) : (
              /* Contact CTAs */
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm shadow-emerald-600/30 active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Seller on WhatsApp</span>
                </a>

                <a
                  href={mailtoUrl}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition"
                >
                  <Mail className="w-4 h-4 text-stone-600" />
                  <span>Email Fallback</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
