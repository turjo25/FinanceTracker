import React, { useState, useEffect } from 'react';
import { User, Lock, Save, Loader2, CheckCircle2, RefreshCw, TrendingUp, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { currency: activeCurrency, setCurrency, rateDisplay, ratesLoading, refreshRates, rates } = useCurrency();

  // Profile Form State
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    preferred_currency: 'USD'
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  // Security Form State
  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityMessage, setSecurityMessage] = useState(null);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile/');
      setProfile({
        first_name: res.data.first_name || '',
        last_name: res.data.last_name || '',
        email: res.data.email || '',
        preferred_currency: res.data.preferred_currency || 'USD'
      });
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage(null);
    try {
      await api.put('/profile/', profile);
      // Update the global currency context — no page reload needed!
      setCurrency(profile.preferred_currency);
      setProfileMessage({ type: 'success', text: 'Profile updated! Currency switched instantly.' });
    } catch (error) {
      console.error(error);
      setProfileMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSecurityUpdate = async (e) => {
    e.preventDefault();
    setSecurityLoading(true);
    setSecurityMessage(null);

    if (passwords.new_password !== passwords.confirm_password) {
      setSecurityMessage({ type: 'error', text: 'New passwords do not match.' });
      setSecurityLoading(false);
      return;
    }

    try {
      await api.post('/change-password/', {
        old_password: passwords.old_password,
        new_password: passwords.new_password
      });
      setSecurityMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      console.error(error);
      setSecurityMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to change password. Please check your old password.' 
      });
    } finally {
      setSecurityLoading(false);
    }
  };

  // Compute a live rate preview for the currently-selected (not-yet-saved) currency
  const selectedCurrencyRate = rates[profile.preferred_currency];
  const liveRatePreview = profile.preferred_currency === 'USD'
    ? '1 USD = 1.00 USD (Base Currency)'
    : selectedCurrencyRate
      ? `1 USD = ${selectedCurrencyRate.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${profile.preferred_currency}`
      : null;

  const selectedMeta = CURRENCIES.find(c => c.code === profile.preferred_currency);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Settings
        </h1>
        <p className="text-sm text-textMuted mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-primary text-white shadow-sm'
                : 'text-textMuted hover:bg-surface hover:text-textMain'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="font-medium text-sm">Account Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'security'
                ? 'bg-primary text-white shadow-sm'
                : 'text-textMuted hover:bg-surface hover:text-textMain'
            }`}
          >
            <Lock className="w-5 h-5" />
            <span className="font-medium text-sm">Security & Password</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-background border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold mb-6">Profile Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-medium text-textMuted mb-1.5 block">First Name</label>
                    <input
                      type="text"
                      value={profile.first_name}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-sm text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-textMuted mb-1.5 block">Last Name</label>
                    <input
                      type="text"
                      value={profile.last_name}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-sm text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-textMuted mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-sm text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                {/* ── Currency Selector ─────────────────────────────────── */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-textMuted">Preferred Currency</label>
                    <button
                      type="button"
                      onClick={refreshRates}
                      disabled={ratesLoading}
                      className="flex items-center gap-1 text-xs text-primary hover:text-blue-600 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${ratesLoading ? 'animate-spin' : ''}`} />
                      Refresh Rates
                    </button>
                  </div>

                  <select
                    value={profile.preferred_currency}
                    onChange={(e) => setProfile({ ...profile, preferred_currency: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.symbol} {c.code} — {c.name}
                      </option>
                    ))}
                  </select>

                  {/* Live rate preview */}
                  {liveRatePreview && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg">
                      <TrendingUp className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <p className="text-xs text-primary font-medium">{liveRatePreview}</p>
                      {ratesLoading && (
                        <Loader2 className="w-3 h-3 animate-spin text-primary ml-auto" />
                      )}
                    </div>
                  )}

                  {/* Currently active currency badge */}
                  {activeCurrency !== profile.preferred_currency && (
                    <p className="text-[11px] text-textMuted mt-1.5">
                      Currently active: <span className="font-semibold text-textMain">{activeCurrency}</span>
                      {' '}· Save to switch the app to{' '}
                      <span className="font-semibold text-primary">{profile.preferred_currency}</span>
                    </p>
                  )}
                </div>

                {profileMessage && (
                  <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                    profileMessage.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {profileMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : null}
                    {profileMessage.text}
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                  >
                    {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold mb-6">Change Password</h2>
              <form onSubmit={handleSecurityUpdate} className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-textMuted mb-1.5 block">Current Password *</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={passwords.old_password}
                      onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })}
                      className="w-full bg-surface border border-border rounded-xl py-3 pl-4 pr-12 text-sm text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-textMuted hover:text-textMain transition-colors"
                    >
                      {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-textMuted mb-1.5 block">New Password *</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwords.new_password}
                      onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                      className="w-full bg-surface border border-border rounded-xl py-3 pl-4 pr-12 text-sm text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-textMuted hover:text-textMain transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-textMuted mb-1.5 block">Confirm New Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwords.confirm_password}
                      onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                      className="w-full bg-surface border border-border rounded-xl py-3 pl-4 pr-12 text-sm text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-textMuted hover:text-textMain transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {securityMessage && (
                  <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                    securityMessage.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {securityMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : null}
                    {securityMessage.text}
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={securityLoading}
                    className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                  >
                    {securityLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Settings;
