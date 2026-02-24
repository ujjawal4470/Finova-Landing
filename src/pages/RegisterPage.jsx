import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('borrower');
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    try {
      register(email, password, name, role);
      navigate(`/${role}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-md border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Create Account</h2>
        <p className="text-gray-500 mt-2">Join Finova Landing today</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" required value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="Min. 6 characters"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Your Role</label>
          <select 
            value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white cursor-pointer"
          >
            <option value="borrower">Borrower (Apply & Pay)</option>
            <option value="lender">Lender (Issue & Manage)</option>
            <option value="analyst">Financial Analyst (Assess & Report)</option>
            <option value="admin">System Admin (Oversee Operations)</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-primary hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm">
          Sign Up
        </button>
      </form>
      
      <p className="text-center mt-6 text-sm text-gray-600">
        Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in here</Link>
      </p>
    </div>
  );
}