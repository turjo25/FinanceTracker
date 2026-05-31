import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Target, Trash2, Edit2, Loader2, Info } from 'lucide-react';
import api from '../services/api';
import SavingsGoalModal from '../components/SavingsGoalModal';
import { useCurrency } from '../context/CurrencyContext';
import { SavingsGoalsSkeleton } from '../components/Skeleton';

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const { formatCurrency } = useCurrency();

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/savings-goals/');
      setGoals(response.data);
    } catch (error) {
      console.error('Failed to fetch savings goals', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the goal "${name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/savings-goals/${id}/`);
        fetchGoals();
      } catch (error) {
        console.error('Failed to delete goal', error);
        alert('Failed to delete goal. Please try again.');
      }
    }
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingGoal(null);
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    fetchGoals();
    setShowModal(false);
  };

  if (loading && goals.length === 0) {
    return <SavingsGoalsSkeleton />;
  }

  const totalSaved = goals.reduce((acc, goal) => acc + parseFloat(goal.current_amount), 0);
  const totalTarget = goals.reduce((acc, goal) => acc + parseFloat(goal.target_amount), 0);
  const overallProgress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Modal */}
      {showModal && (
        <SavingsGoalModal
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
          initialData={editingGoal}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Savings Goals <Target className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-sm text-textMuted mt-1">Track and manage your targets</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Goal
        </button>
      </div>

      {/* Overview Card */}
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="font-bold text-lg mb-4">Overall Progress</h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-surface stroke-current"
                strokeWidth="10"
                cx="50" cy="50" r="40" fill="transparent"
              ></circle>
              <circle
                className="text-primary stroke-current"
                strokeWidth="10"
                strokeLinecap="round"
                cx="50" cy="50" r="40" fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * overallProgress) / 100}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              ></circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold">{overallProgress}%</span>
            </div>
          </div>
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface p-4 rounded-xl">
                <p className="text-xs text-textMuted mb-1 font-medium">Total Saved</p>
                <p className="text-xl font-bold text-green-500">{formatCurrency(totalSaved)}</p>
              </div>
              <div className="bg-surface p-4 rounded-xl">
                <p className="text-xs text-textMuted mb-1 font-medium">Total Target</p>
                <p className="text-xl font-bold">{formatCurrency(totalTarget)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <h3 className="font-bold text-lg mb-4">Your Targets</h3>
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => {
            const progress = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
            
            // Map color theme
            let borderColor = 'border-primary';
            let bgColor = 'bg-primary';
            let textColor = 'text-primary';
            let bgLight = 'bg-primary/10';
            
            switch(goal.color_theme) {
              case 'yellow': borderColor = 'border-yellow-400'; bgColor = 'bg-yellow-400'; textColor = 'text-yellow-600 dark:text-yellow-400'; bgLight = 'bg-yellow-400/10'; break;
              case 'red': borderColor = 'border-red-400'; bgColor = 'bg-red-400'; textColor = 'text-red-500 dark:text-red-400'; bgLight = 'bg-red-400/10'; break;
              case 'green': borderColor = 'border-green-400'; bgColor = 'bg-green-400'; textColor = 'text-green-500 dark:text-green-400'; bgLight = 'bg-green-400/10'; break;
              case 'purple': borderColor = 'border-purple-400'; bgColor = 'bg-purple-400'; textColor = 'text-purple-500 dark:text-purple-400'; bgLight = 'bg-purple-400/10'; break;
              case 'pink': borderColor = 'border-pink-400'; bgColor = 'bg-pink-400'; textColor = 'text-pink-500 dark:text-pink-400'; bgLight = 'bg-pink-400/10'; break;
            }

            return (
              <div key={goal.id} className="bg-background border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                {/* Actions Dropdown / Hover Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal(goal)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-surface text-textMuted hover:text-primary transition-colors"
                    title="Edit Goal"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(goal.id, goal.name)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-surface text-textMuted hover:text-red-500 transition-colors"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bgLight} ${textColor}`}>
                  <Target className="w-6 h-6" />
                </div>
                
                <h4 className="font-bold text-lg mb-1">{goal.name}</h4>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(goal.current_amount)}</p>
                    <p className="text-xs text-textMuted">of {formatCurrency(goal.target_amount)}</p>
                  </div>
                  <span className={`text-sm font-bold px-2 py-1 rounded-lg ${bgLight} ${textColor}`}>
                    {progress}%
                  </span>
                </div>
                
                <div className="w-full bg-surface rounded-full h-3">
                  <div className={`${bgColor} h-3 rounded-full transition-all duration-1000`} style={{ width: `${Math.max(5, progress)}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-background border border-border rounded-2xl shadow-sm">
          <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-textMuted" />
          </div>
          <h4 className="text-lg font-bold text-textMain">No savings goals yet</h4>
          <p className="text-sm text-textMuted mt-1 max-w-sm mb-6">Create your first goal to start tracking your savings progress and achieving your targets.</p>
          <button
            onClick={openCreateModal}
            className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Your First Goal
          </button>
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;
