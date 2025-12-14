import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, User, LogOut, Wallet, History, UserCircle, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Udaan
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <Link 
                  to="/wallet" 
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/wallet') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Wallet className="h-4 w-4" />
                  <span>₹{user.walletBalance?.toLocaleString()}</span>
                </Link>
                
                <Link 
                  to="/bookings" 
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/bookings') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <History className="h-4 w-4" />
                  <span className="hidden xl:inline">My Bookings</span>
                  <span className="xl:hidden">Bookings</span>
                </Link>

                <Link 
                  to="/profile" 
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <UserCircle className="h-4 w-4" />
                  <span className="hidden xl:inline">Profile</span>
                </Link>

                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-sm font-medium text-gray-900 hidden xl:inline">{user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Link 
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
            {user ? (
              <>
                <Link 
                  to="/wallet" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive('/wallet') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Wallet className="h-5 w-5" />
                  <span>Wallet: ₹{user.walletBalance?.toLocaleString()}</span>
                </Link>
                
                <Link 
                  to="/bookings"
                  onClick={() => setMobileMenuOpen(false)} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive('/bookings') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <History className="h-5 w-5" />
                  My Bookings
                </Link>

                <Link 
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <UserCircle className="h-5 w-5" />
                  Profile
                </Link>

                <div className="border-t border-gray-200 pt-3 mt-3 px-4">
                  <p className="text-sm font-medium text-gray-900 mb-3">{user.name}</p>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 px-4">
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:shadow-lg transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}