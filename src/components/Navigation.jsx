import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
          Finova Landing
        </Link>

        {/* Desktop Menu */}
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {!user ? (
            <>
              <Link to="/" className="hover:text-secondary transition-colors font-medium">Home</Link>
              <Link to="/login" className="hover:text-secondary transition-colors font-medium">Login</Link>
              <Link to="/register" className="bg-secondary hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* Added Home Link for logged-in users */}
              <Link to="/" className="hover:text-secondary transition-colors font-medium">
                Home
              </Link>
              
              <Link to={`/${user.role}`} className="hover:text-secondary transition-colors font-medium">
                Dashboard
              </Link>
              
             {/* Clickable Profile Badge */}
              <Link to="/profile" className="flex items-center gap-3 border-l border-blue-400 pl-6 ml-2 hover:opacity-80 transition-opacity">
                <img 
                  src={user.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=FF9874&color=fff`} 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-full object-cover border-2 border-primary-light"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-bold text-white capitalize">{user.username}</span>
                  <span className="text-xs text-blue-200 capitalize">{user.role}</span>
                </div>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-colors text-sm ml-2"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}