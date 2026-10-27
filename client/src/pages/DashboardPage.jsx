import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  PlusCircle,
  BookCheck,
  DollarSign,
  PackageCheck,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Eye,
  Search,
  Sparkles,
  Layers,
  ArrowUpRight,
  Handshake,
  ShoppingBag,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  UserCheck,
  ChevronRight,
  Tag,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CreateListingModal from '../components/CreateListingModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tabs: 'selling' or 'buying'
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'selling');

  // Seller Data
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    totalActive: 0,
    totalSold: 0,
    estimatedRevenue: 0,
    totalInquiries: 0,
  });

  // Buyer Data
  const [myInquiries, setMyInquiries] = useState([]);

  const [inventorySearch, setInventorySearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(searchParams.get('new') === 'true');
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    bookId: null,
    title: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=dashboard');
    }
  }, [authLoading, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [listingsRes, inquiriesRes] = await Promise.all([
        api.get('/books/my/listings'),
        api.get('/books/my/inquiries'),
      ]);

      if (listingsRes.data.success) {
        setBooks(listingsRes.data.data);
        if (listingsRes.data.stats) {
          setStats(listingsRes.data.stats);
        }
      }

      if (inquiriesRes.data.success) {
        setMyInquiries(inquiriesRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleStatusChange = async (bookId, newStatus) => {
    try {
      setActionLoadingId(bookId);
      const res = await api.patch(`/books/${bookId}/status`, { status: newStatus });
      if (res.data.success) {
        setBooks((prev) =>
          prev.map((b) => (b._id === bookId ? { ...b, status: newStatus } : b))
        );
        fetchDashboardData();
        showNotification(`Status updated to "${newStatus}"`);
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleInquiryStatusChange = async (bookId, inquiryId, newStatus) => {
    try {
      setActionLoadingId(inquiryId);
      const res = await api.patch(`/books/${bookId}/inquiries/${inquiryId}`, {
        status: newStatus,
      });
      if (res.data.success) {
        fetchDashboardData();
        showNotification(`Buyer inquiry marked as "${newStatus}"`);
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update inquiry status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteListing = async () => {
    if (!deleteModalState.bookId) return;
    try {
      setActionLoadingId(deleteModalState.bookId);
      const res = await api.delete(`/books/${deleteModalState.bookId}`);
      if (res.data.success) {
        setBooks((prev) => prev.filter((b) => b._id !== deleteModalState.bookId));
        setDeleteModalState({ isOpen: false, bookId: null, title: '' });
        fetchDashboardData();
        showNotification('Listing removed successfully');
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete listing');
    } finally {
      setActionLoadingId(null);
    }
  };

  const showNotification = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Extract all incoming inquiries on books listed by this user
  const incomingInquiries = [];
  books.forEach((b) => {
    if (b.inquiries && b.inquiries.length > 0) {
      b.inquiries.forEach((inq) => {
        incomingInquiries.push({
          ...inq,
          bookId: b._id,
          bookTitle: b.title,
          bookPrice: b.price,
          bookStatus: b.status,
          bookCover: b.coverImage,
        });
      });
    }
  });

  const filteredBooks = books.filter((b) => {
    if (!inventorySearch.trim()) return true;
    const term = inventorySearch.toLowerCase();
    return (
      b.title.toLowerCase().includes(term) ||
      b.author.toLowerCase().includes(term) ||
      b.genre.toLowerCase().includes(term)
    );
  });

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-48 bg-stone-200 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-stone-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-elevated flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 border border-stone-700">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Community Hub & Dashboard
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              Buyer & Seller
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Signed in as <span className="font-semibold text-stone-800">{user?.name}</span> ({user?.city}). Seamlessly sell your pre-loved books and contact local sellers.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 transition shadow-sm shadow-amber-800/25 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Book for Sale</span>
        </button>
      </div>

      {/* Tab Switcher: Seller Mode vs Buyer Mode */}
      <div className="flex items-center gap-2 p-1 bg-[#f3efe6] rounded-2xl max-w-md mb-8 border border-[#e7e2d7]">
        <button
          onClick={() => setActiveTab('selling')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === 'selling'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-700" />
          <span>Seller Hub ({books.length})</span>
          {incomingInquiries.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
              {incomingInquiries.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('buying')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === 'buying'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-700" />
          <span>My Buy Requests ({myInquiries.length})</span>
        </button>
      </div>

      {/* TAB 1: SELLER HUB */}
      {activeTab === 'selling' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          {/* Seller Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Active Listings */}
            <div className="bg-white p-6 rounded-3xl border border-[#e7e2d7] shadow-book flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Active Listings
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-stone-900">
                    {stats.totalActive}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    ● In Catalog
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                <BookCheck className="w-6 h-6" />
              </div>
            </div>

            {/* Total Sold */}
            <div className="bg-white p-6 rounded-3xl border border-[#e7e2d7] shadow-book flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Completed Sales
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-stone-900">
                    {stats.totalSold}
                  </span>
                  <span className="text-xs font-semibold text-sky-700">
                    books handed off
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
                <PackageCheck className="w-6 h-6" />
              </div>
            </div>

            {/* Realized Peer Revenue */}
            <div className="bg-white p-6 rounded-3xl border border-[#e7e2d7] shadow-book flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Completed Revenue
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-stone-900">
                    ${stats.estimatedRevenue}
                  </span>
                  <span className="text-xs font-semibold text-amber-700">
                    100% kept by you
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* INCOMING BUYER INQUIRIES SECTION */}
          {incomingInquiries.length > 0 && (
            <div className="bg-white rounded-3xl border-2 border-amber-400/80 shadow-book overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-amber-50 to-stone-50 border-b border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                    <Handshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900">
                      Incoming Buyer Inquiries ({incomingInquiries.length})
                    </h3>
                    <p className="text-xs text-stone-600">
                      Buyers waiting to meet and purchase your books directly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[#e7e2d7]">
                {incomingInquiries.map((inq) => {
                  const buyerPhoneClean = inq.buyerPhone?.replace(/[^0-9]/g, '') || '';
                  const buyerWhatsAppUrl = `https://wa.me/${buyerPhoneClean}?text=${encodeURIComponent(
                    `Hi ${inq.buyerName}, this is ${user.name} regarding your request to buy "${inq.bookTitle}" ($${inq.bookPrice}) on The BookMarket!`
                  )}`;

                  return (
                    <div key={inq._id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-[#faf8f5]/60 transition">
                      {/* Left: Book item info + Buyer credentials */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-stone-900">
                            "{inq.bookTitle}"
                          </span>
                          <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                            ${inq.bookPrice}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                            inq.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : inq.status === 'completed' ? 'bg-sky-100 text-sky-800' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {inq.status}
                          </span>
                        </div>

                        {/* Buyer Info Strip */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-700 font-medium">
                          <span className="font-bold text-stone-900">Buyer: {inq.buyerName}</span>
                          <span className="text-stone-500">📍 {inq.buyerCity || 'Local'}</span>
                          <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            📞 {inq.buyerPhone}
                          </span>
                          {inq.buyerEmail ? (
                            <a
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(inq.buyerEmail)}&su=${encodeURIComponent(`Regarding your request for "${inq.bookTitle}" on The BookMarket`)}&body=${encodeURIComponent(`Hi ${inq.buyerName},\n\nRegarding your purchase request for "${inq.bookTitle}" ($${inq.bookPrice}) on The BookMarket...\n\nThanks,\n${user.name}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-stone-600 hover:text-amber-800 transition"
                              title="Email Buyer via Gmail (new tab)"
                            >
                              ✉️ {inq.buyerEmail}
                            </a>
                          ) : (
                            <span className="text-stone-500">✉️ No email</span>
                          )}
                        </div>

                        {/* Note & Meetup */}
                        <div className="p-3 bg-[#f3efe6]/70 rounded-xl border border-[#e7e2d7] text-xs space-y-1">
                          {inq.preferredMeetup && (
                            <p className="font-semibold text-stone-800">
                              Proposed Meetup: <span className="font-normal text-stone-700">{inq.preferredMeetup}</span>
                            </p>
                          )}
                          <p className="text-stone-600 italic font-light">"{inq.message}"</p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                        {/* 1-Click WhatsApp Buyer */}
                        <a
                          href={buyerWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-white transition shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Buyer</span>
                        </a>

                        {/* Accept / Reserve Action */}
                        {inq.status === 'pending' && (
                          <button
                            onClick={() => handleInquiryStatusChange(inq.bookId, inq._id, 'accepted')}
                            disabled={actionLoadingId === inq._id}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white transition shadow-xs"
                          >
                            Accept & Reserve Book
                          </button>
                        )}

                        {/* Mark Completed Action */}
                        {inq.status === 'accepted' && (
                          <button
                            onClick={() => handleInquiryStatusChange(inq.bookId, inq._id, 'completed')}
                            disabled={actionLoadingId === inq._id}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-xs"
                          >
                            Mark Completed (Sold)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Listings Management Table/Cards */}
          <div className="bg-white rounded-3xl border border-[#e7e2d7] shadow-book overflow-hidden">
            <div className="p-6 border-b border-[#e7e2d7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#faf8f5]/40">
              <div>
                <h2 className="text-lg font-bold font-serif text-stone-900">
                  Your Inventory ({books.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Direct status control: Available ↔ Reserved ↔ Sold
                </p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter your inventory..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 shadow-2xs text-stone-900"
                />
              </div>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="p-14 text-center">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
                  <Layers className="w-6 h-6" />
                </div>
                <p className="text-stone-600 text-xs font-medium mb-4">
                  {inventorySearch ? 'No books match your inventory search.' : "You haven't posted any book listings yet."}
                </p>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="px-5 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-full transition"
                >
                  Post your first book now
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf8f5] border-b border-[#e7e2d7] text-stone-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">Book Item</th>
                      <th className="py-3.5 px-4">Genre</th>
                      <th className="py-3.5 px-4">Condition</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Status Selector</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7e2d7]/60">
                    {filteredBooks.map((b) => (
                      <tr key={b._id} className="hover:bg-[#faf8f5]/60 transition">
                        {/* Book Cover + Title */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={b.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                              alt={b.title}
                              className="w-11 h-14 object-cover rounded-lg border border-[#e7e2d7] shadow-2xs shrink-0 book-spine-effect"
                            />
                            <div className="max-w-xs">
                              <Link
                                to={`/book/${b._id}`}
                                className="font-bold text-stone-900 hover:text-amber-800 line-clamp-1 text-sm font-serif"
                              >
                                {b.title}
                              </Link>
                              <span className="text-stone-500 text-[11px] block truncate">
                                {b.author}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Genre */}
                        <td className="py-4 px-4 text-stone-700 font-semibold">
                          {b.genre}
                        </td>

                        {/* Condition */}
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-md bg-[#f3efe6] border border-[#e7e2d7] text-stone-800 font-bold text-[10px] uppercase tracking-wider">
                            {b.condition}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4 font-extrabold text-stone-900 text-sm">
                          ${b.price}
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-4 px-4">
                          <select
                            value={b.status}
                            disabled={actionLoadingId === b._id}
                            onChange={(e) => handleStatusChange(b._id, e.target.value)}
                            className={`text-xs font-bold py-1.5 px-3 rounded-xl border focus:outline-none transition shadow-2xs ${
                              b.status === 'available'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : b.status === 'reserved'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-stone-100 text-stone-700 border-stone-300'
                            }`}
                          >
                            <option value="available">● Available</option>
                            <option value="reserved">● Reserved</option>
                            <option value="sold">● Sold</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/book/${b._id}`}
                              title="View public page"
                              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-[#f3efe6] rounded-xl transition"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() =>
                                setDeleteModalState({
                                  isOpen: true,
                                  bookId: b._id,
                                  title: b.title,
                                })
                              }
                              title="Delete listing"
                              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BUYER REQUESTS & CONTACTED BOOKS */}
      {activeTab === 'buying' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#e7e2d7] shadow-book overflow-hidden">
            <div className="p-6 border-b border-[#e7e2d7] bg-[#faf8f5]/40 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-serif text-stone-900">
                  Books You Requested to Buy ({myInquiries.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Direct seller contact information and WhatsApp chats for books you want to purchase.
                </p>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 transition"
              >
                <span>Browse More Books</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {myInquiries.length === 0 ? (
              <div className="p-14 text-center">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-stone-600 text-xs font-medium mb-4">
                  You haven't requested to buy any books yet.
                </p>
                <Link
                  to="/"
                  className="px-5 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-full transition"
                >
                  Explore Marketplace Catalog
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#e7e2d7]">
                {myInquiries.map((item, idx) => {
                  const b = item.book;
                  const inq = item.inquiry;
                  const sellerPhoneClean = b.seller?.phoneOrWhatsApp?.replace(/[^0-9]/g, '') || '';
                  const waUrl = `https://wa.me/${sellerPhoneClean}?text=${encodeURIComponent(
                    `Hi ${b.seller?.name}, this is ${user.name} following up on my request for "${b.title}" ($${b.price})!`
                  )}`;
                  const emailSubject = encodeURIComponent(`Following up on "${b.title}" on The BookMarket`);
                  const emailBody = encodeURIComponent(
                    `Hi ${b.seller?.name || 'Seller'},\n\nThis is ${user.name} following up on my request for "${b.title}" ($${b.price}) on The BookMarket.\n\nThanks!`
                  );
                  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    b.seller?.email || ''
                  )}&su=${emailSubject}&body=${emailBody}`;

                  return (
                    <div key={idx} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-[#faf8f5]/50 transition">
                      {/* Book Thumbnail & Specs */}
                      <div className="flex items-start gap-4">
                        <img
                          src={b.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                          alt={b.title}
                          className="w-16 h-20 object-cover rounded-xl border border-[#e7e2d7] shadow-2xs shrink-0 book-spine-effect"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#f3efe6] text-stone-800">
                              {b.genre}
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                              {b.condition}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              inq.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : inq.status === 'completed' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              Inquiry: {inq.status}
                            </span>
                          </div>

                          <Link
                            to={`/book/${b._id}`}
                            className="font-serif font-bold text-base text-stone-900 hover:text-amber-800 block"
                          >
                            {b.title}
                          </Link>
                          <p className="text-xs text-stone-500">by {b.author}</p>
                          <p className="text-sm font-extrabold text-stone-900 pt-1">
                            ${b.price} <span className="text-xs font-normal text-stone-500">(Pay in Cash/UPI)</span>
                          </p>
                        </div>
                      </div>

                      {/* Seller Direct Contact Box */}
                      <div className="p-4 bg-[#faf8f5] rounded-2xl border border-[#e7e2d7] space-y-2 min-w-[280px]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">Seller: {b.seller?.name}</span>
                          <span className="text-[11px] text-stone-500">📍 {b.seller?.city || b.city}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-white transition shadow-2xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Seller</span>
                          </a>
                          <a
                            href={gmailUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 bg-white border border-[#e7e2d7] hover:bg-[#faf8f5] transition shadow-2xs"
                            title="Email Seller via Gmail (new tab)"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateListingModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          if (searchParams.get('new')) {
            searchParams.delete('new');
            setSearchParams(searchParams);
          }
        }}
        onCreated={(newBook) => {
          fetchDashboardData();
          showNotification(`"${newBook.title}" listed successfully!`);
        }}
      />

      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.title}
        loading={actionLoadingId === deleteModalState.bookId}
        onClose={() => setDeleteModalState({ isOpen: false, bookId: null, title: '' })}
        onConfirm={handleDeleteListing}
      />
    </div>
  );
}
