import React from 'react';
import { FileText, Search, Image as ImageIcon, ScanText, LogOut, Clock, Settings as SettingsIcon, Shield, Rocket, Users, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userPhoto: string | null;
  userName: string | null;
  isAdmin?: boolean;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onLogout, userPhoto, userName, isAdmin, theme, toggleTheme }: SidebarProps) {
  const navItems = [
    { id: 'certificate', label: 'Certificats', icon: FileText },
    { id: 'history', label: 'Historique', icon: Clock },
    { id: 'updates', label: 'Mise à jour', icon: Rocket },
    { id: 'settings', label: 'Paramètres', icon: SettingsIcon },
    ...(isAdmin ? [
      { id: 'clients', label: 'Clients', icon: Users },
      { id: 'admin', label: 'Administration', icon: Shield }
    ] : []),
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 flex-col h-screen sticky top-0 transition-colors duration-300">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">MediDesk Pro</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Cabinet Médical</p>
          </div>
          {toggleTheme && (
            <button 
              onClick={toggleTheme} 
              className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md shadow-gray-900/10 dark:shadow-white/10" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-white dark:text-gray-900" : "text-gray-400 dark:text-gray-500")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            {userPhoto ? (
              <img src={userPhoto} alt="User" className="w-8 h-8 rounded-full ring-2 ring-gray-100 dark:ring-gray-800" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ring-2 ring-gray-50 dark:ring-gray-900">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{userName?.charAt(0) || 'U'}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userName || 'Utilisateur'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 z-50 flex items-center justify-between px-4 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white dark:text-gray-900 text-sm font-bold">M</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">MediDesk Pro</h1>
        </div>
        <div className="flex items-center gap-1">
          {toggleTheme && (
            <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          <button onClick={onLogout} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 z-50 flex items-center justify-around px-2 pb-safe transition-colors duration-300">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 relative",
                isActive ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-full transition-all duration-200 z-10",
                isActive ? "bg-gray-100 dark:bg-gray-800 scale-110" : "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium z-10">{item.label}</span>
              {isActive && (
                <motion.div layoutId="mobile-nav-indicator" className="absolute top-1 w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full -z-0" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
