import React from 'react';
import { Link } from 'react-router-dom';
import { BookX, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <BookX className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold font-serif text-stone-900 mb-2">404</h1>
        <h2 className="text-lg font-semibold text-stone-700 mb-3">Page Not Found</h2>
        <p className="text-xs text-stone-600 mb-6">
          The page you requested might have been moved, renamed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-full transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
