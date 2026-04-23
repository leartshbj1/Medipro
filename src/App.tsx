import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { Sidebar } from './components/Sidebar';
import { CertificateForm } from './pages/CertificateForm';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { Admin } from './pages/Admin';
import { Clients } from './pages/Clients';
import { Updates } from './pages/Updates';
import { Tutorial } from './components/Tutorial';
import { UserInfoForm } from './components/UserInfoForm';
import { Toaster } from 'sonner';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('certificate');
  const [editData, setEditData] = useState<any>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (!userDoc.exists() || !userDoc.data().hasSeenTutorialV2) {
            setShowTutorial(true);
          } else if (!userDoc.data().hasFilledInfoV2) {
            setShowUserInfoForm(true);
          }
        } catch (error) {
          console.error("Error checking tutorial status:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleTutorialComplete = async () => {
    setShowTutorial(false);
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          hasSeenTutorialV2: true,
          role: user.email === 'leartshabija@gmail.com' ? 'admin' : 'client'
        }, { merge: true });
        
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists() || !userDoc.data().hasFilledInfoV2) {
          setShowUserInfoForm(true);
        }
      } catch (error) {
        console.error("Error saving tutorial state:", error);
      }
    }
  };

  const handleUserInfoComplete = () => {
    setShowUserInfoForm(false);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 text-center border border-gray-100"
        >
          <div className="w-16 h-16 bg-gray-900 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg">
            <span className="text-white text-2xl font-bold">M</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">MediDesk Pro</h1>
          <p className="text-gray-500 mb-8 font-medium">Connectez-vous pour accéder à votre espace médical sécurisé.</p>
          <button
            onClick={handleLogin}
            className="w-full bg-gray-900 text-white py-3.5 px-4 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 shadow-md shadow-gray-900/20 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>
        </motion.div>
      </div>
    );
  }

  const isAdmin = user.email === 'leartshabija@gmail.com';

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
      <SpeedInsights />
      <Toaster position="top-right" theme={theme} />
      {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}
      {!showTutorial && showUserInfoForm && <UserInfoForm user={user} onComplete={handleUserInfoComplete} />}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userPhoto={user?.photoURL}
        userName={user?.displayName}
        isAdmin={isAdmin}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="flex-1 overflow-y-auto pb-20 pt-16 md:pb-0 md:pt-0">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeTab === 'certificate' && <CertificateForm user={user} editData={editData} onClearEdit={() => setEditData(null)} />}
              {activeTab === 'history' && <History user={user} onEdit={(data) => { setEditData(data); setActiveTab('certificate'); }} />}
              {activeTab === 'updates' && <Updates />}
              {activeTab === 'settings' && <Settings user={user} />}
              {activeTab === 'clients' && isAdmin && <Clients user={user} />}
              {activeTab === 'admin' && isAdmin && <Admin user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
