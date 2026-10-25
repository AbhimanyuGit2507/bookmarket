import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
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

const PRESET_COVERS = [
  { label: 'Classic Book', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
  { label: 'CS & Tech', url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Paperback', url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80' },
  { label: 'Graphic / Art', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80' },
];

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
    coverImage: PRESET_COVERS[0].url,
    city: user?.city || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        city: formData.city || user?.city || 'Local',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-50 border border-stone-200 p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-xl font-bold font-serif text-stone-900">List a Book for Sale</h2>
            <p className="text-xs text-stone-600">Connect with nearby readers looking for pre-loved books.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Book Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Designing Data-Intensive Applications"
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Author <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                placeholder="e.g. Martin Kleppmann"
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Genre, Condition & ISBN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Genre <span className="text-rose-500">*</span>
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Condition <span className="text-rose-500">*</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ISBN (Optional)
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="e.g. 9781449373320"
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Pricing & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Selling Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="any"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 25"
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Original Price ($)
              </label>
              <input
                type="number"
                name="originalPrice"
                min="0"
                step="any"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="e.g. 45"
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                City / Location
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA"
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Cover Image URL & Presets */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white"
            />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-stone-600">Quick presets:</span>
              {PRESET_COVERS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, coverImage: preset.url }))}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                    formData.coverImage === preset.url
                      ? 'bg-amber-100 border-amber-300 text-amber-800 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Book Condition & Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Mention highlighting, spine condition, edition, or pickup details..."
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-full transition shadow-md shadow-amber-600/25 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
