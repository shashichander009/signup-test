import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useState, useEffect } from 'react';

// Simple Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-md shadow-lg z-50`}>
      {message}
    </div>
  );
};

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 px-4 text-sm font-medium ${
      active 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
    } transition-colors`}
  >
    {children}
  </button>
);

const LoginForm = ({ onToggle, showToast }) => {
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState('email');
  const [formData, setFormData] = useState({
    email_or_phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data);
        showToast(data.non_field_errors?.[0] || "Please check your credentials", "error");
      } else {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        showToast("Login successful!", "success");
        document.body.innerHTML = '<div class="flex items-center justify-center min-h-screen"><h1 class="text-2xl font-bold">Login Successful!</h1></div>';
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      
      <div className="flex rounded-md overflow-hidden mb-6">
        <TabButton
          active={authMethod === 'email'}
          onClick={() => setAuthMethod('email')}
        >
          Email
        </TabButton>
        <TabButton
          active={authMethod === 'phone'}
          onClick={() => setAuthMethod('phone')}
        >
          Phone No.
        </TabButton>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type={authMethod === 'email' ? 'email' : 'tel'}
            name="email_or_phone"
            placeholder={authMethod === 'email' ? 'Email address' : 'Phone number'}
            value={formData.email_or_phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          {errors.email_or_phone && (
            <p className="text-red-500 text-sm mt-1">{errors.email_or_phone}</p>
          )}
        </div>
        
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-end">
          <a href="#" className="text-sm text-gray-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {errors.non_field_errors && (
          <p className="text-red-500 text-sm text-center">{errors.non_field_errors[0]}</p>
        )}

        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{' '}
          <button 
            onClick={onToggle} 
            className="text-gray-800 hover:underline"
            type="button"
          >
            Sign Up Now
          </button>
        </p>
      </form>
    </div>
  );
};

const SignUpForm = ({ onToggle, showToast }) => {
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    phone_number: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const endpoint = authMethod === 'email' 
      ? 'http://127.0.0.1:8000/api/auth/signup/email/'
      : 'http://127.0.0.1:8000/api/auth/signup/phone/';

    const payload = authMethod === 'email'
      ? { email: formData.email, password: formData.password }
      : { phone_number: formData.phone_number, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data);
        const errorMessage = data.email?.[0] || data.phone_number?.[0] || "Signup failed";
        showToast(errorMessage, "error");
      } else {
        showToast("Signup successful! Please login.", "success");
        onToggle();
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
      
      <div className="flex rounded-md overflow-hidden mb-6">
        <TabButton
          active={authMethod === 'email'}
          onClick={() => setAuthMethod('email')}
        >
          Email
        </TabButton>
        <TabButton
          active={authMethod === 'phone'}
          onClick={() => setAuthMethod('phone')}
        >
          Phone No.
        </TabButton>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {authMethod === 'email' ? (
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        ) : (
          <div>
            <input
              type="tel"
              name="phone_number"
              placeholder="Phone number (10 digits)"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
            )}
          </div>
        )}
        
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{' '}
          <button 
            onClick={onToggle} 
            className="text-gray-800 hover:underline"
            type="button"
          >
            Log In Now
          </button>
        </p>
      </form>
    </div>
  );
};

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      {isLogin ? (
        <LoginForm onToggle={toggleAuth} showToast={showToast} />
      ) : (
        <SignUpForm onToggle={toggleAuth} showToast={showToast} />
      )}
    </div>
  );
};

export default AuthContainer;