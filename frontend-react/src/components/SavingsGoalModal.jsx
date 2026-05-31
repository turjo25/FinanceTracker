import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus, Save } from 'lucide-react';
import api from '../services/api';

const SavingsGoalModal = ({ onClose, onSuccess, initialData = null }) => {
  const isEditing = !!initialData;
  const [name, setName] = useState(initialData?.name || '');
  const [targetAmount, setTargetAmount] = useState(initialData?.target_amount || '');
  const [currentAmount, setCurrentAmount] = useState(initialData?.current_amount || '');
  const [colorTheme, setColorTheme] = useState(initialData?.color_theme || 'primary');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const colors = [
    { value: 'primary', label: 'Blue', class: 'bg-primary' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-400' },
    { value: 'red', label: 'Red', class: 'bg-red-400' },
    { value: 'green', label: 'Green', class: 'bg-green-400' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-400' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-400' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        name,
        target_amount: targetAmount,
        current_amount: currentAmount || 0,
        color_theme: colorTheme,
      };

      if (isEditing) {
        await api.put(`/savings-goals/${initialData.id}/`, payload);
      } else {
        await api.post('/savings-goals/', payload);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} goal. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={handleBackdrop}
    >
      <div
        className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md animate-modal-in"
        style={{ animation: 'modalIn 0.2s ease-out' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-bold">{isEditing ? 'Edit Savings Goal' : 'Add Savings Goal'}</h2>
            <p className="text-xs text-textMuted mt-0.5">{isEditing ? 'Update your target' : 'Set a new target to save towards'}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface text-textMuted hover:text-textMain transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-textMuted mb-1 block">Goal Name *</label>
            <input
              type="text"
              placeholder="e.g., Vacation Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-textMuted mb-1 block">Target Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="1000.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl py-3 pl-8 pr-4 text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-textMuted mb-1 block">Current Saved</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl py-3 pl-8 pr-4 text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-textMuted mb-1 block">Theme Color</label>
            <div className="flex gap-2">
              {colors.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColorTheme(c.value)}
                  className={`w-8 h-8 rounded-full ${c.class} ${colorTheme === c.value ? 'ring-2 ring-offset-2 ring-offset-background ring-textMain' : 'opacity-70 hover:opacity-100'} transition-all`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-border text-textMuted hover:bg-surface font-medium text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              ) : isEditing ? (
                <><Save className="w-4 h-4" /> Save Changes</>
              ) : (
                <><Plus className="w-4 h-4" /> Create Goal</>
              )}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(-8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
      `}</style>
    </div>
  );
};

export default SavingsGoalModal;
