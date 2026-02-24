import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    try {
      const loggedInUser = login(email, password);
      navigate(`/${loggedInUser.role}`); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-md border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Welcome Back</h2>
        <p className="text-gray-500 mt-2">Sign in to your account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="w-full bg-primary hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm">
          Sign In
        </button>
      </form>
      
      <p className="text-center mt-6 text-sm text-gray-600">
        Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register here</Link>
      </p>
    </div>
  );
}