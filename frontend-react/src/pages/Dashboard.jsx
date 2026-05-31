import React, { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Download, Plus, Info, X, Loader2 } from 'lucide-react';
import { DashboardSkeleton } from '../components/Skeleton';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SavingsGoalModal from '../components/SavingsGoalModal';
import { useCurrency } from '../context/CurrencyContext';




// ─── Add Transaction Modal ──────────────────────────────────────────────────
const AddTransactionModal = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { symbol } = useCurrency();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/transactions/', {
        amount,
        transaction_type: type,
        category,
        description,
        date,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to add transaction. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Close on backdrop click
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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-bold">Add Transaction</h2>
            <p className="text-xs text-textMuted mt-0.5">Log a new expense or income entry</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface text-textMuted hover:text-textMain transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2 p-1 bg-surface rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-textMuted hover:text-textMain'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                type === 'income'
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-textMuted hover:text-textMain'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-medium text-textMuted mb-1 block">Amount *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted font-bold">{symbol}</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl py-3 pl-8 pr-4 text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>
          </div>

          {/* Date & Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-textMuted mb-1 block">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-textMain focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-textMuted mb-1 block">Category</label>
              <input
                type="text"
                placeholder="Auto (AI)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-textMuted mb-1 block">Description *</label>
            <input
              type="text"
              placeholder="e.g., Uber ride to work"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
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
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                type === 'income'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-primary hover:bg-blue-600 text-white'
              } disabled:opacity-60`}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              ) : (
                <><Plus className="w-4 h-4" /> Add Transaction</>
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


// ─── Export helper ───────────────────────────────────────────────────────────
const exportTransactionsToCSV = async (navigate) => {
  try {
    const response = await api.get('/transactions/');
    const transactions = response.data;

    if (!transactions || transactions.length === 0) {
      alert('No transactions to export.');
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount'];
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      t.transaction_type,
      t.category || '',
      `"${(t.description || '').replace(/"/g, '""')}"`,
      parseFloat(t.amount).toFixed(2),
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `finance_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    if (error.response?.status === 401) navigate('/login');
    else alert('Failed to export report. Please try again.');
  }
};

// ─── Constants ───────────────────────────────────────────────────────────────
const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

// ─── Dashboard ───────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const { formatCurrency } = useCurrency();
  
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const navigate = useNavigate();

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await api.get(`/dashboard/?month=${selectedMonth}&year=${selectedYear}`);
      setData(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  }, [navigate, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (!data) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">

      {/* Add Transaction Modal */}
      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchDashboard}
        />
      )}

      {/* Add Savings Goal Modal */}
      {showGoalModal && (
        <SavingsGoalModal
          onClose={() => setShowGoalModal(false)}
          onSuccess={fetchDashboard}
        />
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Welcome Back!<span className="text-2xl">👋</span>
          </h1>
        </div>
        <button
          onClick={() => exportTransactionsToCSV(navigate)}
          className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Balance Card */}
        <div className="bg-background border border-border rounded-2xl p-5 shadow-sm card-hover">
           <div className="flex justify-between items-center mb-2">
             <span className="text-textMuted text-sm font-medium flex items-center gap-1">My Balance <Info className="w-3 h-3"/></span>
             <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-surface text-textMain text-xs border border-border rounded-md px-2 py-1 outline-none">
               {MONTHS.map(m => (
                 <option key={m.value} value={m.value}>{m.label}</option>
               ))}
             </select>
           </div>
           <h2 className="text-3xl font-bold mb-4">{formatCurrency(data.balance)}</h2>
           <div className="flex items-center gap-2 text-xs text-textMuted">
             <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-0.5 rounded-full font-medium">
               <ArrowUpRight className="w-3 h-3" /> 27.3%
             </span>
             Compared with last month
           </div>
        </div>

        {/* Spent Card */}
        <div className="bg-background border border-border rounded-2xl p-5 shadow-sm card-hover">
           <div className="flex justify-between items-center mb-2">
             <span className="text-textMuted text-sm font-medium flex items-center gap-1">Monthly Spent <Info className="w-3 h-3"/></span>
             <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-surface text-textMain text-xs border border-border rounded-md px-2 py-1 outline-none">
               {MONTHS.map(m => (
                 <option key={m.value} value={m.value}>{m.label}</option>
               ))}
             </select>
           </div>
           <h2 className="text-3xl font-bold mb-4">{formatCurrency(data.month_expense)}</h2>
           <div className="flex items-center gap-2 text-xs text-textMuted">
             <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-0.5 rounded-full font-medium">
               <ArrowUpRight className="w-3 h-3" /> 08.3%
             </span>
             Compared with last month
           </div>
        </div>

        {/* Income Card */}
        <div className="bg-background border border-border rounded-2xl p-5 shadow-sm card-hover">
           <div className="flex justify-between items-center mb-2">
             <span className="text-textMuted text-sm font-medium flex items-center gap-1">Monthly Income <Info className="w-3 h-3"/></span>
             <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-surface text-textMain text-xs border border-border rounded-md px-2 py-1 outline-none">
               {MONTHS.map(m => (
                 <option key={m.value} value={m.value}>{m.label}</option>
               ))}
             </select>
           </div>
           <h2 className="text-3xl font-bold mb-4">{formatCurrency(data.month_income)}</h2>
           <div className="flex items-center gap-2 text-xs text-textMuted">
             <span className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 px-2 py-0.5 rounded-full font-medium">
               <ArrowDownRight className="w-3 h-3" /> 02.3%
             </span>
             Compared with last month
           </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Left (Chart & Savings) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart Section */}
          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-6">
                  <h3 className="font-bold text-lg">Cash flow</h3>
                  <div className="flex gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Expense</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> Income</span>
                  </div>
                 </div>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="bg-surface text-textMain text-xs border border-border rounded-md px-3 py-1.5 outline-none font-medium">
                  {MONTHS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
             </div>
             
             <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthly_trend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} 
                      tickFormatter={(value) => `${value >= 1000 ? (value/1000) + 'K' : value}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-main)' }}
                      cursor={{ stroke: 'var(--color-border)', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />
                    <Line type="monotone" dataKey="income" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="expense" stroke="#FBBF24" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Savings Section */}
          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg">Savings Goals</h3>
                    <div className="flex items-end gap-3 mt-1">
                      <span className="text-2xl font-bold">
                        {formatCurrency(data.savings_goals?.reduce((acc, goal) => acc + parseFloat(goal.current_amount), 0) || 0)}
                      </span>
                      <span className="text-xs text-textMuted mb-1">Total Saved</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="text-xs font-medium border border-border px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  <Plus className="w-3 h-3" /> Create Goal
                </button>
             </div>

             {data.savings_goals && data.savings_goals.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {data.savings_goals.map(goal => {
                   const progress = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
                   // Map color_theme to Tailwind classes
                   let borderColor = 'border-primary';
                   let bgColor = 'bg-primary';
                   switch(goal.color_theme) {
                     case 'yellow': borderColor = 'border-yellow-400'; bgColor = 'bg-yellow-400'; break;
                     case 'red': borderColor = 'border-red-400'; bgColor = 'bg-red-400'; break;
                     case 'green': borderColor = 'border-green-400'; bgColor = 'bg-green-400'; break;
                     case 'purple': borderColor = 'border-purple-400'; bgColor = 'bg-purple-400'; break;
                     case 'pink': borderColor = 'border-pink-400'; bgColor = 'bg-pink-400'; break;
                   }

                   return (
                     <div key={goal.id} className={`border-l-4 ${borderColor} pl-4`}>
                       <h4 className="font-bold text-sm">{goal.name}</h4>
                       <p className="text-xs text-textMuted mb-4">Target: {formatCurrency(goal.target_amount)}</p>
                       <p className="text-sm font-bold mb-2">{formatCurrency(goal.current_amount)}</p>
                       <div className="w-full bg-surface rounded-full h-3">
                         <div className={`${bgColor} h-3 rounded-full flex items-center`} style={{ width: `${Math.max(10, progress)}%` }}>
                           {progress >= 15 && <span className="text-[10px] text-white font-bold ml-2">{progress}%</span>}
                         </div>
                       </div>
                     </div>
                   );
                 })}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-6 text-center">
                 <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-3">
                   <Info className="w-5 h-5 text-textMuted" />
                 </div>
                 <p className="text-sm font-semibold text-textMain">No savings goals yet</p>
                 <p className="text-xs text-textMuted mt-1">Create a goal to start tracking your savings progress.</p>
               </div>
             )}
          </div>
        </div>

        {/* Right Sidebar - Recent Activity */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full card-hover">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg">Recent Activity</h3>
             <button
               onClick={() => setShowModal(true)}
               className="text-xs font-medium border border-border px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-primary hover:text-white hover:border-primary transition-all"
             >
               <Plus className="w-3 h-3" /> Add new
             </button>
           </div>

           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {data.recent_activity && data.recent_activity.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-xs text-textMuted font-medium mb-4 uppercase tracking-wider">Latest Transactions</p>
                  {data.recent_activity.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                          ${tx.transaction_type === 'income' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}
                        `}>
                          {tx.category ? tx.category.charAt(0).toUpperCase() : (tx.transaction_type === 'income' ? '+' : '-')}
                        </div>
                        <div>
                          <p className="text-sm font-bold group-hover:text-primary transition-colors">{tx.category || (tx.transaction_type === 'income' ? 'Income' : 'Expense')}</p>
                          <p className="text-[10px] text-textMuted">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-bold ${tx.transaction_type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.transaction_type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 gap-3">
                  <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center">
                    <Plus className="w-6 h-6 text-textMuted" />
                  </div>
                  <p className="text-sm font-semibold text-textMain">No transactions yet</p>
                  <p className="text-xs text-textMuted leading-relaxed">Hit <span className="font-semibold text-primary">+ Add new</span> to log your first expense or income.</p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
