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
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CreateListingModal from '../components/CreateListingModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    totalActive: 0,
    totalSold: 0,
    estimatedRevenue: 0,
  });
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

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/books/my/listings');
      if (res.data.success) {
        setBooks(res.data.data);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      console.error('Error fetching seller listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyListings();
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
        fetchMyListings();
        showNotification(`Status updated to "${newStatus}"`);
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status');
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
        fetchMyListings();
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Seller Dashboard
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Active Seller
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Welcome, <span className="font-semibold text-stone-800">{user?.name}</span>. Manage your peer-to-peer inventory, listing statuses, and completed sales.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 transition shadow-sm shadow-amber-800/25 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Listing</span>
        </button>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
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
                ● Live in catalog
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

        {/* Realized Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-[#e7e2d7] shadow-book flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Realized Peer Revenue
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

      {/* Listings Management Table/Cards */}
      <div className="bg-white rounded-3xl border border-[#e7e2d7] shadow-book overflow-hidden">
        {/* Table Top Header with Search Filter */}
        <div className="p-6 border-b border-[#e7e2d7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#faf8f5]/40">
          <div>
            <h2 className="text-lg font-bold font-serif text-stone-900">
              Your Book Listings ({books.length})
            </h2>
            <p className="text-xs text-stone-500">
              Instant status switching: Available ↔ Reserved ↔ Sold
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Filter your listings..."
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
          fetchMyListings();
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
