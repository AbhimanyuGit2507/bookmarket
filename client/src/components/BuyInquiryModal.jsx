import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Handshake,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  User,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function BuyInquiryModal({ isOpen, onClose, book, onInquirySent }) {
  const { user } = useAuth();
  const [preferredMeetup, setPreferredMeetup] = useState(user?.city ? `In ${user.city}` : '');
  const [message, setMessage] = useState(
    `Hi ${book?.seller?.name || 'Seller'}, I am interested in buying your copy of "${book?.title}" for $${book?.price}. Can we coordinate a meetup?`
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  if (!isOpen || !book) return null;

  const sellerPhone = book.seller?.phoneOrWhatsApp?.replace(/[^0-9]/g, '') || '';
  const sellerName = book.seller?.name || 'Seller';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await api.post(`/books/${book._id}/inquire`, {
        message,
        preferredMeetup,
      });

      if (res.data.success) {
        setSuccessData(res.data);
        if (onInquirySent) {
          onInquirySent(res.data);
        }

        // Generate prefilled WhatsApp message with buyer details
        const waText = encodeURIComponent(
          `Hi ${sellerName}, I am ${user?.name} from The BookMarket. I just sent a direct purchase request for "${book.title}" ($${book.price}). Proposed meetup: ${preferredMeetup || 'Flexible'}. Is it still available?`
        );
        const waUrl = `https://wa.me/${sellerPhone}?text=${waText}`;

        // Open WhatsApp in new tab
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || 'Failed to submit buy inquiry'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-50 border border-[#e7e2d7] p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e7e2d7]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900">
                Direct Peer Purchase
              </h2>
              <p className="text-xs text-stone-500">
                Connect directly with the seller. No payment gateway cut.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-[#faf8f5] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {successData ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-stone-900">
                Purchase Inquiry Sent!
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 leading-relaxed">
                Your direct contact details have been shared with <span className="font-semibold text-stone-900">{sellerName}</span>. A WhatsApp window was opened so you can chat directly.
              </p>
            </div>

            <div className="p-4 bg-[#faf8f5] rounded-2xl border border-[#e7e2d7] max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Seller Phone/WhatsApp:</span>
                <span className="font-mono font-bold text-stone-900">{book.seller?.phoneOrWhatsApp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Seller Email:</span>
                {book.seller?.email ? (
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(book.seller.email)}&su=${encodeURIComponent(`Inquiry regarding "${book.title}" on The BookMarket`)}&body=${encodeURIComponent(`Hi ${sellerName},\n\nI just submitted a purchase inquiry for "${book.title}" ($${book.price}) on The BookMarket.\n\nThanks!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-amber-800 hover:text-amber-900 underline decoration-dotted inline-flex items-center gap-1"
                    title="Open Gmail compose in new tab"
                  >
                    <span>{book.seller.email}</span>
                    <Mail className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="font-semibold text-stone-900">N/A</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Agreed Price:</span>
                <span className="font-bold text-stone-900">${book.price} (Pay in Cash/UPI)</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 transition"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <div className="mt-5 space-y-5">
            {/* Book Info Summary Pill */}
            <div className="p-3.5 bg-[#faf8f5] rounded-2xl border border-[#e7e2d7] flex items-center gap-3.5">
              <img
                src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                alt={book.title}
                className="w-12 h-16 object-cover rounded-lg border border-[#e7e2d7] shadow-2xs shrink-0 book-spine-effect"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                  {book.title}
                </h4>
                <p className="text-xs text-stone-500 truncate">by {book.author}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-extrabold text-stone-900">${book.price}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-stone-200/60 text-stone-700">
                    {book.condition}
                  </span>
                  <span className="text-xs text-stone-500">📍 {book.city}</span>
                </div>
              </div>
            </div>

            {/* How peer purchase works alert */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-2.5 text-emerald-900 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-bold">Zero Platform Fees:</span> When you submit this buy request, your contact details are shared directly with the seller so both of you can coordinate payment (Cash on delivery, UPI, or Handover) and pickup.
              </p>
            </div>

            {/* Buyer contact verification badge */}
            <div className="p-3 bg-[#f3efe6]/60 rounded-2xl border border-[#e7e2d7] space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Your Contact Details Shared With Seller:
              </span>
              <div className="grid grid-cols-2 gap-2 text-stone-800 font-semibold pt-1">
                <div className="flex items-center gap-1.5 truncate">
                  <User className="w-3.5 h-3.5 text-amber-700" />
                  <span className="truncate">{user?.name}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="truncate">{user?.phoneOrWhatsApp}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-rose-800 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                  Proposed Meetup Location / Campus Spot
                </label>
                <input
                  type="text"
                  required
                  value={preferredMeetup}
                  onChange={(e) => setPreferredMeetup(e.target.value)}
                  placeholder="e.g. University Main Library or Local Coffee Shop"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 shadow-2xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                  Message to Seller
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mention availability, times you can meet, or book questions..."
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 shadow-2xs text-stone-900"
                />
              </div>

              <div className="pt-3 border-t border-[#e7e2d7] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition shadow-sm shadow-emerald-700/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>Connect on WhatsApp & Send Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
