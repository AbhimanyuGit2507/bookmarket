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
        // Refresh stats
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

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-48 bg-stone-200 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-stone-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
            Seller Dashboard
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Manage your peer-to-peer book listings, availability, and sales performance.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition shadow-sm shadow-amber-600/25 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Listing</span>
        </button>
      </div>

      {/* Stats Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {/* Active Listings */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <BookCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
              Active Listings
            </span>
            <span className="text-2xl font-extrabold text-stone-900">
              {stats.totalActive}
            </span>
          </div>
        </div>

        {/* Total Sold */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
              Books Sold
            </span>
            <span className="text-2xl font-extrabold text-stone-900">
              {stats.totalSold}
            </span>
          </div>
        </div>

        {/* Estimated Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
              Completed Revenue
            </span>
            <span className="text-2xl font-extrabold text-stone-900">
              ${stats.estimatedRevenue}
            </span>
          </div>
        </div>
      </div>

      {/* Listings Management Table/Cards */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-base font-bold font-serif text-stone-900">
            Your Inventory ({books.length})
          </h2>
          <span className="text-xs text-stone-600">
            Toggle status between Available, Reserved, or Sold
          </span>
        </div>

        {books.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-stone-600 text-xs mb-4">
              You haven't listed any books for sale yet.
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-full transition"
            >
              List your first book now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Book</th>
                  <th className="py-3.5 px-4">Genre</th>
                  <th className="py-3.5 px-4">Condition</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {books.map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50/60 transition">
                    {/* Book Cover + Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                          alt={b.title}
                          className="w-10 h-14 object-cover rounded-md border border-stone-200 shadow-xs shrink-0"
                        />
                        <div className="max-w-xs">
                          <Link
                            to={`/book/${b._id}`}
                            className="font-semibold text-stone-900 hover:text-amber-700 line-clamp-1"
                          >
                            {b.title}
                          </Link>
                          <span className="text-stone-600 text-[11px] block truncate">
                            {b.author}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Genre */}
                    <td className="py-4 px-4 text-stone-700 font-medium">
                      {b.genre}
                    </td>

                    {/* Condition */}
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium text-[11px]">
                        {b.condition}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-bold text-stone-900">
                      ${b.price}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4">
                      <select
                        value={b.status}
                        disabled={actionLoadingId === b._id}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        className={`text-xs font-semibold py-1.5 px-2.5 rounded-lg border focus:outline-none transition ${
                          b.status === 'available'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : b.status === 'reserved'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/book/${b._id}`}
                          title="View public page"
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition"
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
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition"
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
