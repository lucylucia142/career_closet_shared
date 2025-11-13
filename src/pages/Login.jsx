import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign Up');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Changed setUser/setIsAuthenticated to destructure 'login' from context
  const { login } = useContext(ShopContext); 
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (currentState === 'Sign Up') {
        // Registration
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        if (formData.password.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }

        const response = await fetch('http://localhost:3000/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: formData.name, 
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to sign up');
        }

        setSuccess('Account created successfully! Please log in.');
        setCurrentState('Login');
        setFormData({ name: '', email: formData.email, password: '', confirmPassword: '' });
      } else {
        // Login
        const response = await fetch('http://localhost:3000/checkpassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();
        if (!response.ok || !data.valid) {
          throw new Error(data.message || 'Invalid login credentials');
        }

        // ✅ Call the context's login function to set state and local storage
        login({
          email: formData.email,
          userId: data.userId,
          userName: data.userName,
          avatar: data.avatar,
          // Assuming address and phone are not returned here, context handles nulls
        });

        setSuccess('Login successful!');

        // Redirect to home page after short delay
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of the component JSX remains unchanged)
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:w-full max-w-md m-auto mt-20 gap-5 
                 bg-white shadow-xl rounded-2xl p-8 border border-gray-200"
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <p className="prata-regular text-3xl font-semibold text-gray-900">{currentState}</p>
        <hr className="h-[2px] w-12 bg-gray-900 rounded-full border-none" />
      </div>

      {/* Success Message */}
      {success && (
        <div className="w-full p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm text-center">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm text-center">
          {error}
        </div>
      )}

      {/* Inputs */}
      {currentState === 'Login' ? null : (
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                     focus:ring-black focus:outline-none transition"
          placeholder="Name"
          required
        />
      )}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                   focus:ring-black focus:outline-none transition"
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                   focus:ring-black focus:outline-none transition"
        placeholder="Password"
        required
      />

      {/* Confirm Password (Sign Up only) */}
      {currentState === 'Sign Up' && (
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                     focus:ring-black focus:outline-none transition"
          placeholder="Confirm Password"
          required
        />
      )}

      {/* Links */}
      <div className="w-full flex justify-between text-sm text-gray-600 mt-[-4px]">
        <p className="cursor-pointer hover:underline">Forgot your password?</p>
        {currentState === 'Login' ? (
          <p
            onClick={() => setCurrentState('Sign Up')}
            className="cursor-pointer text-black font-medium hover:underline"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState('Login')}
            className="cursor-pointer text-black font-medium hover:underline"
          >
            Login Here
          </p>
        )}
      </div>

      {/* Button */}
      <button
        className="bg-black text-white font-medium px-8 py-3 mt-6 rounded-xl shadow-md 
                   hover:bg-gray-900 transition-all"
        disabled={loading}
      >
        {loading ? 'Processing...' : currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;