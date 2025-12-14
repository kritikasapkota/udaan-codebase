import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, MapPin, Clock, Plane, X, AlertCircle } from 'lucide-react';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Bookings() {
  const { user, setUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [cancelModal, setCancelModal] = useState({ show: false, booking: null });
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pnr) => {
    setDownloading(pnr);
    try {
      const blob = await bookingService.downloadTicket(pnr);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Ticket-${pnr}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download ticket. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  const openCancelModal = (booking) => {
    setCancelModal({ show: true, booking });
  };

  const closeCancelModal = () => {
    setCancelModal({ show: false, booking: null });
  };

  const handleCancelBooking = async () => {
    if (!cancelModal.booking) return;
    
    setCancelling(true);
    try {
      const response = await bookingService.cancelBooking(cancelModal.booking.pnr);
      
      // Update wallet balance in context and localStorage
      const newBalance = response.data.newWalletBalance;
      const updatedUser = { ...user, walletBalance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert(`Booking cancelled successfully! Refund: ₹${response.data.refundAmount} (₹${response.data.deductionAmount} cancellation fee deducted)`);
      fetchBookings(); // Refresh bookings
      closeCancelModal();
    } catch (error) {
      console.error("Cancellation failed", error);
      alert(error.response?.data?.message || "Failed to cancel booking. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading your trips...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
            <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900">No bookings found</h3>
            <p className="text-gray-500 mt-2">You haven't booked any flights yet.</p>
            <a href="/" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
              Search Flights
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <motion.div 
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left: Flight Info */}
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                          booking.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {booking.status.toUpperCase()}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">{booking.flight.airline}</h3>
                        <p className="text-sm text-gray-500">PNR: {booking.pnr}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">₹{booking.totalAmount}</p>
                        <p className="text-xs text-gray-400">{booking.passengers.length} Passengers</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800">{booking.flight.source}</p>
                        <p className="text-xs text-gray-500">{new Date(booking.flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <div className="flex-1 px-4 flex flex-col items-center">
                        <p className="text-xs text-gray-400 mb-1">{booking.flight.duration}h</p>
                        <div className="w-full h-px bg-gray-300 relative">
                          <Plane className="w-4 h-4 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800">{booking.flight.destination}</p>
                        <p className="text-xs text-gray-500">{new Date(booking.flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.flight.departureTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.flight.flightId}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="bg-gray-50 p-6 flex flex-col justify-center items-center gap-3 border-t md:border-t-0 md:border-l border-gray-100 md:w-48">
                    {booking.status === 'Confirmed' && (
                      <>
                        <button 
                          onClick={() => handleDownload(booking.pnr)}
                          disabled={downloading === booking.pnr}
                          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-xl font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50"
                        >
                          {downloading === booking.pnr ? (
                            <span className="animate-pulse">Generating...</span>
                          ) : (
                            <>
                              <Download className="w-4 h-4" /> Ticket
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => openCancelModal(booking)}
                          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-red-500 text-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-50 transition-colors"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'Cancelled' && (
                      <div className="text-center">
                        <p className="text-sm text-gray-500">This booking has been cancelled</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Cancellation Warning Modal */}
      {cancelModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 md:p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Cancel Booking?</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="text-sm md:text-base text-gray-600">
                Are you sure you want to cancel this booking?
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 md:p-4 rounded">
                <p className="text-xs md:text-sm font-semibold text-yellow-800 mb-2">⚠️ Cancellation Policy</p>
                <p className="text-xs md:text-sm text-yellow-700">
                  A cancellation fee of <strong>20%</strong> will be deducted from your booking amount.
                </p>
                <div className="mt-3 pt-3 border-t border-yellow-200 space-y-1">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-yellow-700">Booking Amount:</span>
                    <span className="font-semibold text-yellow-800">₹{cancelModal.booking?.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-yellow-700">Cancellation Fee (20%):</span>
                    <span className="font-semibold text-red-600">-₹{Math.round(cancelModal.booking?.totalAmount * 0.2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm pt-2 border-t border-yellow-200">
                    <span className="font-semibold text-yellow-800">Refund Amount:</span>
                    <span className="font-bold text-green-600">₹{Math.round(cancelModal.booking?.totalAmount * 0.8).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs md:text-sm text-gray-500">
                PNR: <strong>{cancelModal.booking?.pnr}</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeCancelModal}
                disabled={cancelling}
                className="flex-1 px-4 py-2.5 md:py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm md:text-base"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="flex-1 px-4 py-2.5 md:py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 text-sm md:text-base"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}