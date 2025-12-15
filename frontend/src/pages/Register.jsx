import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const PwRule = ({ ok, text, show }) => {
  if (!show) return null;
  return (
    <div className={`flex items-center gap-2 ${ok ? 'text-green-600' : 'text-gray-500'}`}>
      <span className={`inline-block w-2 h-2 rounded-full ${ok ? 'bg-green-600' : 'bg-gray-400'}`} />
      <span>{text}</span>
    </div>
  );
};

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pwTouched, setPwTouched] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isStrong = checks.length && checks.upper && checks.lower && checks.number && checks.special;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isStrong) {
      setPwTouched(true);
      setError('Use at least 8 characters with uppercase, lowercase, number, and special character.');
      return;
    }
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="text-center mb-6 md:mb-8">
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-sm md:text-base text-gray-500">Join Udaan for seamless travel</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2.5 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPwTouched(true)}
            />
            <div className="mt-2 space-y-1 text-sm">
              <PwRule ok={checks.length} text="At least 8 characters" show={pwTouched} />
              <PwRule ok={checks.upper} text="Contains an uppercase letter" show={pwTouched} />
              <PwRule ok={checks.lower} text="Contains a lowercase letter" show={pwTouched} />
              <PwRule ok={checks.number} text="Contains a number" show={pwTouched} />
              <PwRule ok={checks.special} text="Contains a special character" show={pwTouched} />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-base"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}