import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Sparkles, ChevronDown, User, Settings as SettingsIcon, LogOut, Menu } from 'lucide-react';
import api from '../services/api';
import ProfileSummaryModal from './ProfileSummaryModal';
import { useCurrency } from '../context/CurrencyContext';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const { setCurrency } = useCurrency();
  // We need to re-render sidebar when theme changes to update the toggle switch
  const [, setDummy] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState(null);
  
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleThemeChange = () => setDummy(d => d + 1);
    window.addEventListener('theme-change', handleThemeChange);
    
    // Fetch user profile and sync currency context
    api.get('/profile/')
      .then(res => {
        setProfile(res.data);
        // Sync the active currency from the user's saved preference
        if (res.data.preferred_currency) {
          setCurrency(res.data.preferred_currency);
        }
      })
      .catch(err => console.error("Failed to load profile", err));

    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/transactions?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-surface md:bg-background flex text-textMain font-sans transition-colors duration-300">
      <Sidebar handleLogout={handleLogout} isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-border bg-background px-4 md:px-8 flex items-center sticky top-0 z-20">
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2.5 rounded-xl border border-border bg-surface text-textMuted hover:text-textMain lg:hidden mr-4 flex items-center justify-center transition-colors"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search transactions (Press Enter)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-surface border border-border rounded-full py-2.5 pl-10 pr-4 text-sm text-textMain placeholder-textMuted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            {/* Glowing AI Assistant Quick-Access Button */}
            <button 
              onClick={() => navigate('/messages')}
              title="Chat with AI Financial Assistant"
              className="relative p-2.5 rounded-full bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 hover:from-emerald-500/20 hover:to-blue-500/20 text-[#10B981] hover:text-[#059669] dark:text-emerald-400 dark:hover:text-emerald-300 transition-all duration-300 shadow-sm border border-emerald-500/20 hover:border-emerald-500/40 group flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            </button>
            
            <div className="relative" ref={profileDropdownRef}>
              <div 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 pl-6 border-l border-border cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-sm">
                  {profile?.username ? profile.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-textMain group-hover:text-primary transition-colors">
                    {profile?.username || 'My Account'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-textMuted ml-1 group-hover:text-textMain transition-colors" />
              </div>

              {/* Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-background border border-border rounded-xl shadow-lg py-2 z-50 animate-fade-in">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-textMain hover:bg-surface flex items-center gap-3 transition-colors"
                  >
                    <User className="w-4 h-4 text-textMuted" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-textMain hover:bg-surface flex items-center gap-3 transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4 text-textMuted" />
                    Account Settings
                  </button>

                  {/* Divider */}
                  <div className="my-1.5 border-t border-border" />

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors rounded-b-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>

            {profileModalOpen && (
              <ProfileSummaryModal 
                profile={profile} 
                onClose={() => setProfileModalOpen(false)} 
              />
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8 custom-scrollbar scroll-smooth-container">
           <div className="max-w-[1600px] mx-auto bg-surface rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-sm border border-border page-enter">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
