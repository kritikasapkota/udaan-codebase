import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookings from './pages/Bookings';
import Wallet from './pages/Wallet';
import BookingForm from './pages/BookingForm';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/bookings" 
          element={
            <PrivateRoute>
              <Bookings />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/wallet" 
          element={
            <PrivateRoute>
              <Wallet />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/book/:flightId" 
          element={
            <PrivateRoute>
              <BookingForm />
            </PrivateRoute>
          } 
        />
      </Routes>
    </div>
  );
}