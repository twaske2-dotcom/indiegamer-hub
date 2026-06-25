import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import GameDetailPage from './pages/GameDetailPage';
import SubmitGamePage from './pages/SubmitGamePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './styles/global.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="bg-video-wrap">
          <video autoPlay muted loop playsInline>
            <source src="/bg-video.mp4" type="video/mp4" />
          </video>
        </div>
        <Navbar />
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/browse"      element={<BrowsePage />} />
          <Route path="/game/:id"    element={<GameDetailPage />} />
          <Route path="/submit-game" element={<SubmitGamePage />} />
          <Route path="/admin"       element={<AdminPage />} />
          <Route path="/login"       element={<LoginPage />} />
          <Route path="/register"    element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}