import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, BookOpen, Sparkles, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const GENRES = [
  'Engineering & CS',
  'Fiction & Sci-Fi',
  'Non-Fiction',
  'Comics & Manga',
  'Exam Prep',
];

const CONDITIONS = [
  'Brand New',
  'Like New',
  'Gently Used',
  'Heavily Read',
];

const GENRE_PRESET_COVERS = {
  'Engineering & CS': [
    { label: 'Coding / CS Book', url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80' },
    { label: 'Technical Manual', url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80' },
  ],
  'Fiction & Sci-Fi': [
    { label: 'Hardcover Novel', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Sci-Fi Classic', url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80' },
  ],
  'Non-Fiction': [
    { label: 'Psychology / Bio', url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80' },
    { label: 'Philosophy / Econ', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80' },
  ],
  'Comics & Manga': [
    { label: 'Graphic Novel', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Art / Manga', url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80' },
  ],
  'Exam Prep': [
    { label: 'Test Guide / GRE', url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80' },
    { label: 'Interview Handbook', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80' },
  ],
};

export default function CreateListingModal({ isOpen, onClose, onCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: 'Engineering & CS',
    condition: 'Like New',
    price: '',
    originalPrice: '',
    description: '',
    coverImage: GENRE_PRESET_COVERS['Engineering & CS'][0].url,
    city: user?.city || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-update preset cover recommendation when genre changes
      if (name === 'genre' && GENRE_PRESET_COVERS[value]) {
        updated.coverImage = GENRE_PRESET_COVERS[value][0].url;
      }
      return updated;
    });
  };

  const discountPreview =
    formData.price &&
    formData.originalPrice &&
    Number(formData.originalPrice) > Number(formData.price)
      ? Math.round(
          ((Number(formData.originalPrice) - Number(formData.price)) /
            Number(formData.originalPrice)) *
            100
        )
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.author || !formData.price || !formData.description) {
      setError('Please fill in all required fields (title, author, price, description).');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : 0,
        city: formData.city || user?.city || 'Local meetup',
      };

      const res = await api.post('/books', payload);
      if (res.data.success) {
        if (onCreated) {
          onCreated(res.data.data);
        }
        onClose();
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const availablePresets = GENRE_PRESET_COVERS[formData.genre] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-50 border border-[#e7e2d7] p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#e7e2d7]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              List a Book for Peer Sale
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Connect directly with students and readers nearby. Zero platform take-rate.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-[#faf8f5] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Book Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Designing Data-Intensive Applications"
                className="w-full px-4 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 transition shadow-2xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Author <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                placeholder="e.g. Martin Kleppmann"
                className="w-full px-4 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 transition shadow-2xs text-stone-900"
              />
            </div>
          </div>

          {/* Genre, Condition & ISBN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Genre <span className="text-rose-500">*</span>
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 font-semibold text-stone-800 shadow-2xs"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Condition <span className="text-rose-500">*</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 font-semibold text-stone-800 shadow-2xs"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                ISBN (Optional)
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="9781449373320"
                className="w-full px-4 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 shadow-2xs text-stone-900 font-mono"
              />
            </div>
          </div>

          {/* Pricing & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider flex items-center justify-between">
                <span>Selling Price ($) <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="any"
                value={formData.price}
                onChange={handleChange}
                placeholder="25"
                className="w-full px-4 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 shadow-2xs text-stone-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider flex items-center justify-between">
                <span>Original Retail ($)</span>
                {discountPreview && (
                  <span className="text-rose-600 font-bold text-[11px]">
                    -{discountPreview}% OFF
                  </span>
                )}
              </label>
              <input
                type="number"
                name="originalPrice"
                min="0"
                step="any"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-4 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 shadow-2xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Pickup City / Campus
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="San Francisco, CA"
                className="w-full px-4 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 shadow-2xs text-stone-900"
              />
            </div>
          </div>

          {/* Cover Image URL & Genre Presets */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Cover Image URL
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 text-xs bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 shadow-2xs text-stone-800"
            />
            {availablePresets.length > 0 && (
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Presets for {formData.genre}:
                </span>
                {availablePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, coverImage: preset.url }))}
                    className={`text-[11px] px-3 py-1 rounded-lg border transition font-semibold ${
                      formData.coverImage === preset.url
                        ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-2xs'
                        : 'bg-white border-[#e7e2d7] text-stone-600 hover:bg-[#faf8f5]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Condition Details & Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Mention markings, spine condition, edition year, and preferred meetup location..."
              className="w-full px-4 py-2.5 text-sm bg-white border border-[#e7e2d7] rounded-xl focus:outline-none focus:border-amber-600 shadow-2xs text-stone-900"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#e7e2d7] flex items-center justify-end gap-3">
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
              className="px-6 py-2.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 disabled:opacity-50 rounded-full transition shadow-sm shadow-amber-800/30 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Listing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish to Marketplace</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
