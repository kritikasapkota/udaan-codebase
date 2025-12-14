import React, { useState, useEffect } from 'react';
import { User, Mail, Edit2, Save, X } from 'lucide-react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || ''
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      alert('Name and email are required');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.updateProfile(formData);
      console.log('Update response:', response.data);
      
      // Update local storage and context with full user object
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Update form data to reflect saved values
      setFormData({
        name: updatedUser.name,
        email: updatedUser.email
      });
      
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed', error);
      console.error('Error details:', error.response);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-6 md:mb-8 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500">Traveler</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Wallet Balance
              </label>
              <div className="text-3xl font-bold text-green-600">
                ₹{user?.walletBalance?.toLocaleString() || '0'}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Available for bookings
              </p>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
