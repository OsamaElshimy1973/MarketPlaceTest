import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { formatPhoneNumber, isValidPhoneNumber } from '../utils/phoneNumber';

const AuthPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError(null);
  };

  const handleRegister = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number (including country code)');
      return;
    }

    // In a real app, this would verify the phone number
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      phoneNumber,
      role: 'customer',
    });
    navigate('/role-selection');
  };

  useEffect(() => {
    // Simulate phone number detection
    const detectPhoneNumber = async () => {
      try {
        // In a real app, this would use the WebOTP API or similar
        await new Promise(resolve => setTimeout(resolve, 1500));
        setPhoneNumber('+44 123 456 7890'); // Updated example with international format
      } catch (err) {
        console.error('Failed to detect phone number:', err);
      } finally {
        setIsDetecting(false);
      }
    };

    detectPhoneNumber();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex items-center justify-center mb-6">
          <Phone className="w-12 h-12 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Welcome</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+44 123 456 7890"
            disabled={isDetecting}
          />
          {error && (
            <div className="flex items-center mt-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>{error}</span>
            </div>
          )}
          {isDetecting && (
            <div className="mt-2 text-sm text-gray-600">
              Detecting phone number...
            </div>
          )}
        </div>
        <button
          onClick={handleRegister}
          disabled={isDetecting || !phoneNumber}
          className={`w-full bg-blue-500 text-white py-3 rounded-md transition-colors ${
            isDetecting || !phoneNumber
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-600'
          }`}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default AuthPage;