import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Mail, DollarSign, Calendar, Edit2 } from 'lucide-react';

const ProfileSummaryModal = ({ profile, onClose }) => {
  const navigate = useNavigate();

  if (!profile) return null;

  const handleEditClick = () => {
    onClose();
    navigate('/settings');
  };

  const joinedDate = profile.date_joined 
    ? new Date(profile.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="bg-background border border-border w-full max-w-md rounded-2xl shadow-xl z-10 overflow-hidden animate-fade-in">
        {/* Header with gradient */}
        <div className="bg-primary/10 px-6 py-8 flex flex-col items-center justify-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface/50 text-textMuted hover:bg-surface hover:text-textMain transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4 border-4 border-background">
            {profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="text-xl font-bold text-textMain text-center">
            {profile.first_name || profile.last_name 
              ? `${profile.first_name} ${profile.last_name}` 
              : profile.username}
          </h2>
          <p className="text-sm text-textMuted mt-1">@{profile.username}</p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 p-3 bg-surface rounded-xl border border-border/50">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-textMuted font-medium mb-0.5">Email Address</p>
              <p className="text-sm font-semibold truncate">{profile.email || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-surface rounded-xl border border-border/50">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-textMuted font-medium mb-0.5">Preferred Currency</p>
              <p className="text-sm font-semibold">{profile.preferred_currency}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-surface rounded-xl border border-border/50">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-textMuted font-medium mb-0.5">Member Since</p>
              <p className="text-sm font-semibold">{joinedDate}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-2 pb-6 flex justify-center">
          <button
            onClick={handleEditClick}
            className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>
      <style>{`
        .animate-fade-in {
          animation: modalFadeIn 0.3s ease-out forwards;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProfileSummaryModal;
