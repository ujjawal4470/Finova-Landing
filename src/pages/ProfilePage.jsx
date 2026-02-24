import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  
  // Profile Info State
  const [name, setName] = useState(user.username || '');
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || '');
  const [isSaved, setIsSaved] = useState(false);

  // Security / Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMessage, setPassMessage] = useState({ type: '', text: '' }); // type: 'error' or 'success'

  const displayAvatar = photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=1E3A8A&color=fff&size=150`;

  const samplePhotos = [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
  ];

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({ name, photoUrl });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPassMessage({ type: '', text: '' }); // Reset messages

    if (newPassword.length < 6) {
      return setPassMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
    }
    if (newPassword !== confirmPassword) {
      return setPassMessage({ type: 'error', text: 'New passwords do not match.' });
    }

    try {
      changePassword(currentPassword, newPassword);
      setPassMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setPassMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setPassMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      <header className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-2">Manage your profile information and account security.</p>
      </header>

      {/* ---------------- SECTION 1: PROFILE INFO ---------------- */}
      <div className="bg-white rounded-2xl shadow-xl shadow-primary/5 border border-white p-8">
        <h2 className="text-xl font-bold text-primary mb-6 border-b pb-2">Public Profile</h2>
        <div className="flex flex-col md:flex-row gap-10 items-start">
          
          <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
            <div className="relative">
              <img 
                src={displayAvatar} 
                alt="Profile" 
                className="w-40 h-40 rounded-full object-cover border-4 border-primary-light shadow-lg"
                onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=1E3A8A&color=fff`}
              />
              <span className="absolute bottom-2 right-2 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                {user.role}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium text-center">{user.email}</p>
          </div>

          <div className="w-full md:w-2/3">
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo URL (Optional)</label>
                <input type="url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Paste an image link here..." />
                
                <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Or pick a stock photo:</p>
                  <div className="flex gap-3">
                    {samplePhotos.map((url, index) => (
                      <img key={index} src={url} alt={`Stock ${index}`} onClick={() => setPhotoUrl(url)} className="w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-secondary transition-all object-cover shadow-sm" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                {isSaved ? <span className="text-secondary font-bold flex items-center gap-2">✓ Profile Updated!</span> : <span />}
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-95">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 2: SECURITY & PASSWORD ---------------- */}
      <div className="bg-white rounded-2xl shadow-xl shadow-primary/5 border border-white p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          Security Settings
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
          
          {passMessage.text && (
            <div className={`p-4 rounded-lg text-sm font-medium border ${passMessage.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
              {passMessage.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input 
              type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" 
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input 
                type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" 
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-gray-900 hover:bg-black text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
              Update Password
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}