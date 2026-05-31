import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Filter, X } from 'lucide-react';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { TransactionsSkeleton } from '../components/Skeleton';

const TYPE_LABELS = { expense: 'Expenses', income: 'Income', '': 'All Transactions' };

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const { formatCurrency, symbol } = useCurrency();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read the ?type= filter and ?search= from the URL
  const filterType = searchParams.get('type') || '';
  const searchQuery = searchParams.get('search') || '';

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions/');
      setTransactions(response.data);
    } catch (error) {
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Apply client-side filter
  const filtered = transactions.filter((t) => {
    const matchesType = filterType ? t.transaction_type === filterType : true;
    const matchesSearch = searchQuery
      ? t.description?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.category?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesType && matchesSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions/', {
        amount,
        transaction_type: type,
        category,
        description,
        date,
      });
      setAmount('');
      setCategory('');
      setDescription('');
      setShowForm(false);
      fetchTransactions();
    } catch (error) {
      console.error(error);
      alert('Failed to add transaction.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}/`);
      fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  const clearFilter = () => setSearchParams({});

  if (loading && transactions.length === 0) return <TransactionsSkeleton />;

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-textMuted mt-1">
            {searchQuery 
              ? `Search results for "${searchQuery}"`
              : filterType
                ? `Showing ${TYPE_LABELS[filterType] || filterType} only`
                : 'All your financial activity in one place'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(filterType || searchQuery) && (
            <button
              onClick={clearFilter}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-border text-textMuted hover:bg-surface transition-all"
            >
              <X className="w-3.5 h-3.5" />
              Clear filter
            </button>
          )}
          <button
            onClick={() => setShowForm((v) => !v)}
            className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Add Transaction'}
          </button>
        </div>
      </div>

      {/* Active Filter Badge */}
      {(filterType || searchQuery) && (
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Filtered by: {searchQuery ? `"${searchQuery}"` : TYPE_LABELS[filterType]}
          </span>
        </div>
      )}

      {/* Add Transaction Form */}
      {showForm && (
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-5">New Transaction</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="text"
              placeholder="Category (Leave blank for AI auto-categorize)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Description (e.g., 'Uber ride to work')"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full md:col-span-2 bg-surface border border-border rounded-xl py-3 px-4 text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              className="md:col-span-2 bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all flex justify-center items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add Transaction
            </button>
          </form>
        </div>
      )}

      {/* Transactions List */}
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">
            {searchQuery ? 'Search Results' : (TYPE_LABELS[filterType] || 'All Transactions')}
            <span className="ml-2 text-sm font-normal text-textMuted">({filtered.length})</span>
          </h3>
        </div>
        <div className="space-y-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="flex justify-between items-center p-4 bg-surface rounded-xl border border-border hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    t.transaction_type === 'income'
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/30'
                  }`}
                >
                  {t.category ? t.category.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">{t.description}</p>
                  <div className="flex gap-2 text-xs mt-0.5">
                    <span className="text-textMuted">{t.date}</span>
                    {t.category && (
                      <>
                        <span className="text-textMuted">•</span>
                        <span className="text-primary bg-primary/10 px-2 rounded-full">{t.category}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`font-bold text-sm ${
                    t.transaction_type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {t.transaction_type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-textMuted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-textMuted text-sm">
                {searchQuery
                  ? `No transactions found matching "${searchQuery}".`
                  : filterType
                    ? `No ${TYPE_LABELS[filterType]?.toLowerCase()} found.`
                    : 'No transactions found. Add your first one above!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
