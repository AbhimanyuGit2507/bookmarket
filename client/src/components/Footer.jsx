import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, RefreshCw, Truck, MessageCircle, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 mt-24 border-t border-stone-800">
      {/* Value props banner */}
      <div className="border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1 font-serif">Direct Peer Exchange</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Connect directly with nearby readers and students. Zero platform cut or hidden escrow markups.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1 font-serif">Circular Reading Economy</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Give textbooks, exam prep manuals, and fiction novels a second life at up to 70% off retail prices.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1 font-serif">One-Click WhatsApp Connect</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Coordinate fast meetups on campus or doorstep shipping with pre-filled WhatsApp inquiry links.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-white">The BookMarket</span>
            <p className="text-[11px] text-stone-500">Peer-to-Peer Second-Hand Book Marketplace SaaS</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400 font-medium">
          <Link to="/?genre=Engineering%20%26%20CS" className="hover:text-amber-400 transition">
            Engineering & CS
          </Link>
          <Link to="/?genre=Fiction%20%26%20Sci-Fi" className="hover:text-amber-400 transition">
            Fiction & Sci-Fi
          </Link>
          <Link to="/?genre=Non-Fiction" className="hover:text-amber-400 transition">
            Non-Fiction
          </Link>
          <Link to="/?genre=Comics%20%26%20Manga" className="hover:text-amber-400 transition">
            Comics & Manga
          </Link>
          <Link to="/?genre=Exam%20Prep" className="hover:text-amber-400 transition">
            Exam Prep
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800/60 py-6 text-center text-xs text-stone-500">
        <p className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} The BookMarket. Production-grade MERN architecture deployable on Render and Vercel.
        </p>
      </div>
    </footer>
  );
}
