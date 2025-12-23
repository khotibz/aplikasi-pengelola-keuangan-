import { useState, useEffect } from 'react';
import { LoginPage } from './components/v2/LoginPage';
import { MainLayout } from './components/v2/MainLayout';
import { getUser, saveUser, removeUser, getDarkMode, saveDarkMode, clearAllData } from './utils/localStorage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [darkMode, setDarkMode] = useState(() => getDarkMode());

  useEffect(() => {
    // Check if user is already logged in
    const user = getUser();
    if (user) {
      setUserName(user.name);
      setIsLoggedIn(true);
    }

    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleLogin = (email: string, password: string, name: string) => {
    const user = {
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    saveUser(user);
    setUserName(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Option 1: Keep data but logout user
    removeUser();
    
    // Option 2: Clear all data (uncomment if you want to clear everything on logout)
    // clearAllData();
    
    setIsLoggedIn(false);
    setUserName('');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    saveDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark' : ''}`}>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <MainLayout 
          userName={userName} 
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
    </div>
  );
}