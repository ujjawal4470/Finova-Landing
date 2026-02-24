import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usersDb, setUsersDb] = useLocalStorage('finova_users_db', []);
  const [currentUser, setCurrentUser] = useLocalStorage('finova_current_user', null);
  const [systemLogs, setSystemLogs] = useLocalStorage('finova_system_logs', []);

  const addLog = async (action, status, username) => {
    let ipAddress = '127.0.0.1';
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      ipAddress = data.ip;
    } catch (error) {
      console.warn("Could not fetch IP, using fallback.");
    }
    const newLog = {
      id: Date.now().toString(), action: `${action} (${username})`, ip: ipAddress, status, time: new Date().toLocaleString()
    };
    setSystemLogs(prevLogs => [newLog, ...(prevLogs || [])].slice(0, 50));
  };

  const register = (email, password, name, role) => {
    if (usersDb.some(u => u.email === email)) {
      addLog('Failed Registration', 'Blocked', name || 'Unknown');
      throw new Error("An account with this email already exists.");
    }
    const newUser = { id: Date.now().toString(), email, password, name, role, photoUrl: '' };
    setUsersDb([...usersDb, newUser]);
    setCurrentUser({ username: name, role: role, email: email, photoUrl: '' });
    
    addLog('New User Registration', 'Success', name);
    return newUser;
  };

  const login = (email, password) => {
    const user = usersDb.find(u => u.email === email && u.password === password);
    if (!user) {
      addLog('Failed Login Attempt', 'Blocked', email);
      throw new Error("Invalid email or password.");
    }
    setCurrentUser({ username: user.name, role: user.role, email: user.email, photoUrl: user.photoUrl || '' });
    
    addLog('User Login', 'Success', user.name);
    return user;
  };

  const logout = () => {
    if (currentUser) addLog('User Logout', 'Completed', currentUser.username);
    setCurrentUser(null);
  };

  const updateProfile = (updatedData) => {
    const updatedDb = usersDb.map(u => 
      u.email === currentUser.email ? { ...u, ...updatedData } : u
    );
    setUsersDb(updatedDb);
    setCurrentUser({ ...currentUser, username: updatedData.name, photoUrl: updatedData.photoUrl });
    addLog('Profile Updated', 'Success', updatedData.name);
  };

  // ✨ NEW: Secure Password Change Function
  const changePassword = (currentPassword, newPassword) => {
    const user = usersDb.find(u => u.email === currentUser.email);
    
    // Verify current password
    if (!user || user.password !== currentPassword) {
      addLog('Failed Password Change', 'Blocked', currentUser.username);
      throw new Error("Current password is incorrect.");
    }
    
    // Save new password
    const updatedDb = usersDb.map(u => 
      u.email === currentUser.email ? { ...u, password: newPassword } : u
    );
    setUsersDb(updatedDb);
    addLog('Password Changed', 'Success', currentUser.username);
  };

  return (
    <AuthContext.Provider value={{ 
      user: currentUser, login, register, logout, updateProfile, changePassword, systemLogs 
    }}>
      {children}
    </AuthContext.Provider>
  );
};