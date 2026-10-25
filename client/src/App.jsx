import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookDetailsPage from './pages/BookDetailsPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import CreateListingModal from './components/CreateListingModal';

export default function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [globalSellModalOpen, setGlobalSellModalOpen] = useState(false);

  const handleOpenSellModal = () => {
    if (!user) {
      navigate('/login?redirect=dashboard');
      return;
    }
    setGlobalSellModalOpen(true);
  };

  const handleBookCreated = (newBook) => {
    navigate(`/book/${newBook._id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenSellModal={handleOpenSellModal} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onOpenSellModal={handleOpenSellModal} />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />

      <CreateListingModal
        isOpen={globalSellModalOpen}
        onClose={() => setGlobalSellModalOpen(false)}
        onCreated={handleBookCreated}
      />
    </div>
  );
}
