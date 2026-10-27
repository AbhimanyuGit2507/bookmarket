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
  Sparkles,
  ChevronRight,
  HelpCircle,
  Share2,
  Check,
  Handshake,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import BuyInquiryModal from '../components/BuyInquiryModal';

const conditionStyles = {
  'Brand New': 'bg-emerald-50 text-emerald-800 border-emerald-300',
  'Like New': 'bg-sky-50 text-sky-800 border-sky-300',
  'Gently Used': 'bg-amber-50 text-amber-800 border-amber-300',
  'Heavily Read': 'bg-stone-100 text-stone-700 border-stone-300',
};

const statusBanner = {
  available: null,
  reserved: {
    bg: 'bg-amber-50 border-amber-300 text-amber-900',
    text: 'This book is currently reserved by a prospective buyer. You can still message the seller in case the transaction falls through.',
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
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/books/${id}`);
        if (res.data.success) {
          const currentBook = res.data.data;
          setBook(currentBook);

          // Fetch related books from same genre
          if (currentBook.genre) {
            try {
              const relatedRes = await api.get(`/books?genre=${encodeURIComponent(currentBook.genre)}&limit=4`);
              if (relatedRes.data.success) {
                setRelatedBooks(relatedRes.data.data.filter((b) => b._id !== currentBook._id));
              }
            } catch (rErr) {
              console.error('Failed to fetch related books:', rErr);
            }
          }
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Book not found');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="h-6 w-36 bg-stone-200 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 aspect-[3/4] bg-stone-200 rounded-3xl" />
          <div className="lg:col-span-7 space-y-4">
            <div className="h-8 w-3/4 bg-stone-200 rounded" />
            <div className="h-5 w-1/2 bg-stone-200 rounded" />
            <div className="h-16 w-full bg-stone-200 rounded-2xl" />
            <div className="h-32 bg-stone-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-stone-900 mb-2">Book Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">
          The listing you are looking for may have been deleted by the owner or the link is invalid.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-full transition shadow-sm"
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

  const dollarSavings =
    book.originalPrice && book.originalPrice > book.price
      ? (book.originalPrice - book.price).toFixed(2)
      : null;

  const sellerPhone = book.seller?.phoneOrWhatsApp?.replace(/[^0-9]/g, '') || '';
  const sellerName = book.seller?.name || 'Seller';
  const isOwner = user && book.seller && user._id === book.seller._id;

  const whatsappMessage = encodeURIComponent(
    `Hi ${sellerName}, I am interested in buying your book "${book.title}" listed on The BookMarket for $${book.price}. Is it still available?`
  );

  const whatsappUrl = `https://wa.me/${sellerPhone}?text=${whatsappMessage}`;

  const emailSubject = encodeURIComponent(`Inquiry regarding "${book.title}" on The BookMarket`);
  const emailBody = encodeURIComponent(
    `Hi ${sellerName},\n\nI saw your listing for "${book.title}" ($${book.price}) on The BookMarket and would love to arrange payment and collection.\n\nThanks!`
  );
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    book.seller?.email || ''
  )}&su=${emailSubject}&body=${emailBody}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-stone-900 transition">Marketplace</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link
          to={`/?genre=${encodeURIComponent(book.genre)}`}
          className="hover:text-stone-900 transition"
        >
          {book.genre}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate max-w-[200px] sm:max-w-xs">
          {book.title}
        </span>

        <button
          onClick={handleCopyShare}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#e7e2d7] rounded-full text-[11px] font-semibold text-stone-700 hover:bg-[#faf8f5] transition shadow-2xs"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-stone-500" />
              <span>Share Listing</span>
            </>
          )}
        </button>
      </nav>

      {/* Status Warning Banner (if reserved or sold) */}
      {statusBanner[book.status] && (
        <div
          className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold ${
            statusBanner[book.status].bg
          }`}
        >
          <Clock className="w-5 h-5 shrink-0" />
          <span>{statusBanner[book.status].text}</span>
        </div>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl border border-[#e7e2d7] p-6 sm:p-10 shadow-book mb-14">
        {/* Left Column: Book Cover Image with Spine Simulation */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden shadow-book border border-[#e7e2d7] bg-stone-100 book-spine-effect">
            <img
              src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
              alt={book.title}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {discountPercent && discountPercent > 0 && (
              <div className="absolute top-4 right-4 z-10">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-600 text-white shadow-md">
                  Save {discountPercent}%
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Calendar className="w-4 h-4 text-amber-700" />
            <span>Listed {new Date(book.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Right Column: Book Specs & Seller Actions */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Genre & Condition tags */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-[#f3efe6] text-stone-800 border border-[#e7e2d7]">
              {book.genre}
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border ${
                conditionStyles[book.condition] || 'bg-stone-100 text-stone-600'
              }`}
            >
              {book.condition}
            </span>
          </div>

          {/* Book Title */}
          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-stone-900 tracking-tight leading-snug mb-2">
            {book.title}
          </h1>

          {/* Author */}
          <p className="text-sm sm:text-base font-medium text-stone-600 mb-6">
            Written by <span className="text-stone-900 font-bold">{book.author}</span>
          </p>

          {/* Pricing Highlight Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#faf8f5] border border-[#e7e2d7] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Peer Marketplace Price
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-stone-900">
                  ${book.price}
                </span>
                {book.originalPrice > book.price && (
                  <span className="text-sm text-stone-400 line-through">
                    Retail: ${book.originalPrice}
                  </span>
                )}
              </div>
              {dollarSavings && (
                <p className="text-xs font-bold text-emerald-700 mt-1">
                  🎉 You save ${dollarSavings} compared to retail price!
                </p>
              )}
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Inventory Status
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  book.status === 'available'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : book.status === 'reserved'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${book.status === 'available' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                {book.status}
              </span>
            </div>
          </div>

          {/* Book Description */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Condition Notes & Description
            </h3>
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line bg-[#faf8f5]/60 p-4 rounded-xl border border-[#e7e2d7]/70 font-light">
              {book.description}
            </p>
          </div>

          {/* Book Meta specs: ISBN & City */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d7] flex items-center gap-3">
              <Barcode className="w-5 h-5 text-amber-700 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">ISBN Code</span>
                <span className="text-xs font-mono font-bold text-stone-900">
                  {book.isbn || 'N/A (Unlisted)'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d7] flex items-center gap-3">
              <MapPin className="w-5 h-5 text-amber-700 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">City Pickup</span>
                <span className="text-xs font-bold text-stone-900">
                  {book.city || book.seller?.city || 'Local Area'}
                </span>
              </div>
            </div>
          </div>

          {/* Seller Card & Actions */}
          <div className="mt-auto pt-6 border-t border-[#e7e2d7]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-base border border-amber-300">
                  {sellerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">{sellerName}</h4>
                  <p className="text-xs text-stone-500">{book.seller?.city || 'Verified Community Seller'}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Peer</span>
              </div>
            </div>

            {/* If the current logged-in user is the owner */}
            {isOwner ? (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-center">
                <p className="text-xs font-bold text-amber-900 mb-2">
                  You are the owner of this book listing.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-block px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-full transition shadow-xs"
                >
                  Manage Status & Buyer Inquiries in Dashboard
                </Link>
              </div>
            ) : (
              /* Contact & Direct Buy CTAs */
              <div className="space-y-3">
                {/* Primary Direct Buy Button */}
                <button
                  onClick={() => {
                    if (!user) {
                      navigate(`/login?redirect=/book/${book._id}`);
                    } else {
                      setBuyModalOpen(true);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-amber-700 hover:bg-amber-800 active:scale-98 text-white transition shadow-sm shadow-amber-900/25"
                >
                  <Handshake className="w-5 h-5 text-amber-200" />
                  <span>
                    {user ? 'I Want to Buy This (Direct Peer Connect)' : 'Sign In to Connect & Buy'}
                  </span>
                </button>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#25D366] hover:bg-[#20ba59] text-white transition shadow-sm shadow-[#25D366]/30 active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Quick WhatsApp</span>
                  </a>

                  <a
                    href={gmailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#faf8f5] hover:bg-[#f3efe6] text-stone-800 border border-[#e7e2d7] transition shadow-2xs hover:shadow-sm"
                    title="Open Email Inquiry in Gmail (new tab)"
                  >
                    <Mail className="w-4 h-4 text-stone-500" />
                    <span>Email Inquiry</span>
                  </a>
                </div>

                {/* Safety note */}
                <p className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1 pt-1">
                  <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
                  <span>Peer-to-peer purchase: Pay directly via Cash or UPI upon book handover.</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buy Inquiry Modal */}
      <BuyInquiryModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        book={book}
      />

      {/* Related Books in Same Category */}
      {relatedBooks.length > 0 && (
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#e7e2d7]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
                More in {book.genre}
              </h2>
              <p className="text-xs text-stone-500">Other pre-loved listings you might enjoy</p>
            </div>
            <Link
              to={`/?genre=${encodeURIComponent(book.genre)}`}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 transition flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook._id} book={relBook} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
