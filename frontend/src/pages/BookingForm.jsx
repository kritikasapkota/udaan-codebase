import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  User,
  CreditCard,
  Plane,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { flightService, bookingService, walletService } from '../services/api';

export default function BookingForm() {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: 'Male' }
  ]);

  const [walletBalance, setWalletBalance] = useState(0);

  const [pricePerSeat, setPricePerSeat] = useState(0);
  const [surgeApplied, setSurgeApplied] = useState(false);

  const [bookingStatus, setBookingStatus] = useState('idle'); // idle | processing | success | error
  const [errorMessage, setErrorMessage] = useState('');

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flightRes, walletRes] = await Promise.all([
          flightService.getById(flightId),
          walletService.getBalance()
        ]);

        setFlight(flightRes.data);
        setPricePerSeat(flightRes.data.basePrice || flightRes.data.currentPrice);
        setWalletBalance(walletRes.data.balance);
      } catch {
        setErrorMessage('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [flightId]);

  /* ---------------- PASSENGERS ---------------- */
  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const addPassenger = () => {
    setPassengers([...passengers, { name: '', age: '', gender: 'Male' }]);
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const totalAmount = pricePerSeat * passengers.length;

  /* ---------------- BOOKING ---------------- */
  const handleBooking = async () => {
    setBookingStatus('processing');
    setErrorMessage('');

    try {
      const res = await bookingService.create({
        flightId,
        passengers
      });

      // backend-controlled dynamic pricing
      setPricePerSeat(res.data.pricePerSeat);
      setSurgeApplied(res.data.surgeApplied);

      // Update wallet balance in context and localStorage
      const newBalance = walletBalance - totalAmount;
      const updatedUser = { ...user, walletBalance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setWalletBalance(newBalance);

      setBookingStatus('success');
      setTimeout(() => navigate('/bookings'), 2000);

    } catch (err) {
      setBookingStatus('error');
      setErrorMessage(err.response?.data?.message || 'Booking failed.');
    }
  };

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!flight) {
    return <div className="text-center p-10">Flight not found</div>;
  }

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 md:p-6 text-white">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">{flight.airline}</h2>
                <p className="text-sm md:text-base text-blue-100 flex items-center gap-2 mt-1">
                  <Plane className="w-4 h-4" /> {flight.flightId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl md:text-3xl font-bold">₹{pricePerSeat}</p>
                <p className="text-xs md:text-sm text-blue-100">per passenger</p>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-4 md:p-8">
            {/* SURGE WARNING */}
            {surgeApplied && (
              <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
                ⚠️ High demand detected. Price increased by 10%.
              </div>
            )}

            {/* PASSENGERS */}
            <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Passenger Details
            </h3>

            <div className="space-y-4">
              {passengers.map((p, i) => (
                <div key={i} className="p-3 md:p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between mb-3">
                    <h4 className="text-sm md:text-base font-medium">Passenger {i + 1}</h4>
                    {passengers.length > 1 && (
                      <button
                        onClick={() => removePassenger(i)}
                        className="text-red-500 text-xs md:text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    <input
                      placeholder="Name"
                      className="p-2 md:p-2.5 border rounded text-sm md:text-base"
                      value={p.name}
                      onChange={(e) =>
                        handlePassengerChange(i, 'name', e.target.value)
                      }
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      className="p-2 md:p-2.5 border rounded text-sm md:text-base"
                      value={p.age}
                      onChange={(e) =>
                        handlePassengerChange(i, 'age', e.target.value)
                      }
                    />
                    <select
                      className="p-2 md:p-2.5 border rounded text-sm md:text-base"
                      value={p.gender}
                      onChange={(e) =>
                        handlePassengerChange(i, 'gender', e.target.value)
                      }
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addPassenger}
              className="mt-4 text-blue-600 font-medium text-sm md:text-base"
            >
              + Add Passenger
            </button>

            {/* PAYMENT */}
            <div className="mt-8 md:mt-10 border-t pt-6 md:pt-8">
              <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Summary
              </h3>

              <div className="bg-gray-50 p-3 md:p-4 rounded-xl space-y-2 text-sm md:text-base">
                <div className="flex justify-between">
                  <span>Tickets ({passengers.length}x)</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between font-bold text-base md:text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <div className="mt-4 p-3 md:p-4 bg-blue-50 rounded-xl flex justify-between text-sm md:text-base">
                <span>Wallet Balance</span>
                <span className="font-bold">₹{walletBalance}</span>
              </div>

              {/* ERROR */}
              {errorMessage && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded flex gap-2 text-sm md:text-base">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    {errorMessage}
                    {errorMessage.includes('Insufficient') && (
                      <Link to="/wallet" className="block underline mt-1 text-xs md:text-sm">
                        Add funds to wallet
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* SUCCESS */}
              {bookingStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded flex gap-2 text-sm md:text-base">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  Booking confirmed! Redirecting…
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={bookingStatus === 'processing'}
                className={`mt-6 w-full py-3 md:py-4 rounded-xl font-bold text-base md:text-lg ${
                  bookingStatus === 'processing'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                }`}
              >
                {bookingStatus === 'processing'
                  ? 'Processing...'
                  : `Pay ₹${totalAmount} & Book`}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
