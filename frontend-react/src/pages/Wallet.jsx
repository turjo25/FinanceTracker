import React, { useEffect, useState, useCallback } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Label,
} from 'recharts';
import {
  Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  LayoutList, Layers, Zap, Award,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { WalletSkeleton } from '../components/Skeleton';

// ─── Palette for category slices ────────────────────────────────────────────
const SLICE_COLORS = [
  '#3B82F6', '#F59E0B', '#10B981', '#EF4444',
  '#8B5CF6', '#06B6D4', '#F97316', '#EC4899',
];

// ─── Custom centre label for Donut ──────────────────────────────────────────
const renderDonutCenter = (total) => ({ viewBox: { cx, cy } }) => (
  <>
    <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--color-text-main)" fontSize={20} fontWeight={700}>
      ${total >= 1000 ? (total / 1000).toFixed(1) + 'K' : total.toFixed(0)}
    </text>
    <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--color-text-muted)" fontSize={11}>
      total spent
    </text>
  </>
);

// ─── Stat card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, iconBg, label, value, sub, subColor }) => (
  <div className="bg-background border border-border rounded-2xl p-5 shadow-sm flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-textMuted font-medium mb-1">{label}</p>
      <p className="text-xl font-bold text-textMain truncate">{value}</p>
      {sub && <p className={`text-xs mt-0.5 ${subColor || 'text-textMuted'}`}>{sub}</p>}
    </div>
  </div>
);

// ─── Custom Tooltip for charts ───────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-xl px-4 py-3 shadow-lg text-sm">
      {label && <p className="font-semibold text-textMain mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: ${Number(p.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      ))}
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────
const WalletPage = () => {
  const [dash, setDash] = useState(null);
  const [txns, setTxns] = useState([]);
  const navigate = useNavigate();
  const { formatCurrency, symbol, rate } = useCurrency();

  const fetchAll = useCallback(async () => {
    try {
      const [dashRes, txnRes] = await Promise.all([
        api.get('/dashboard/'),
        api.get('/transactions/'),
      ]);
      setDash(dashRes.data);
      setTxns(txnRes.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    }
  }, [navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (!dash) return <WalletSkeleton />;

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalTxns   = txns.length;
  const expenseTxns = txns.filter(t => t.transaction_type === 'expense');
  const incomeTxns  = txns.filter(t => t.transaction_type === 'income');

  const avgExpense = expenseTxns.length
    ? expenseTxns.reduce((s, t) => s + parseFloat(t.amount), 0) / expenseTxns.length
    : 0;

  const biggestExpense = expenseTxns.length
    ? expenseTxns.reduce((max, t) => parseFloat(t.amount) > parseFloat(max.amount) ? t : max, expenseTxns[0])
    : null;

  // Category totals for donut — sorted desc
  const categoryMap = {};
  expenseTxns.forEach(t => {
    const cat = t.category || 'Uncategorized';
    categoryMap[cat] = (categoryMap[cat] || 0) + parseFloat(t.amount);
  });
  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const totalExpended = categoryData.reduce((s, c) => s + c.value, 0);

  // Savings rate
  const savingsRate = dash.total_income > 0
    ? Math.max(0, ((dash.total_income - dash.total_expense) / dash.total_income) * 100)
    : 0;

  const fmt = formatCurrency;

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="w-6 h-6 text-primary" /> My Wallet
        </h1>
        <p className="text-sm text-textMuted mt-1">Your full financial health at a glance</p>
      </div>

      {/* ── Top stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Wallet}
          iconBg="bg-primary/10 text-primary"
          label="Net Balance"
          value={fmt(dash.balance)}
          sub={dash.balance >= 0 ? '▲ Positive balance' : '▼ In the red'}
          subColor={dash.balance >= 0 ? 'text-green-500' : 'text-red-500'}
        />
        <StatCard
          icon={TrendingUp}
          iconBg="bg-green-100 text-green-600 dark:bg-green-900/30"
          label="Total Income"
          value={fmt(dash.total_income)}
          sub={`${incomeTxns.length} income transaction${incomeTxns.length !== 1 ? 's' : ''}`}
        />
        <StatCard
          icon={TrendingDown}
          iconBg="bg-red-100 text-red-600 dark:bg-red-900/30"
          label="Total Expenses"
          value={fmt(dash.total_expense)}
          sub={`${expenseTxns.length} expense transaction${expenseTxns.length !== 1 ? 's' : ''}`}
        />
        <StatCard
          icon={Zap}
          iconBg="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30"
          label="Savings Rate"
          value={savingsRate.toFixed(1) + '%'}
          sub={savingsRate >= 20 ? '🎉 Great discipline!' : savingsRate > 0 ? 'Keep it up!' : 'No savings yet'}
          subColor={savingsRate >= 20 ? 'text-green-500' : 'text-textMuted'}
        />
      </div>

      {/* ── Middle row: Donut + Category list ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Donut Chart */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg">Spending Breakdown</h3>
              <p className="text-xs text-textMuted mt-0.5">By category, all time</p>
            </div>
            <Layers className="w-5 h-5 text-textMuted" />
          </div>

          {categoryData.length > 0 ? (
            <>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
                      ))}
                      <Label content={renderDonutCenter(totalExpended, symbol, rate)} position="center" />
                    </Pie>
                    <Tooltip content={<ChartTooltip formatCurrency={formatCurrency} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="mt-4 space-y-2">
                {categoryData.slice(0, 5).map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: SLICE_COLORS[i % SLICE_COLORS.length] }} />
                      <span className="text-textMuted truncate max-w-[120px]">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-textMain">{fmt(cat.value)}</span>
                  </div>
                ))}
                {categoryData.length > 5 && (
                  <p className="text-xs text-textMuted text-center pt-1">+ {categoryData.length - 5} more categories</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
              <Layers className="w-10 h-10 text-textMuted opacity-30" />
              <p className="text-sm text-textMuted">No expense data yet</p>
            </div>
          )}
        </div>

        {/* Top Categories ranked list */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg">Top Spending Categories</h3>
              <p className="text-xs text-textMuted mt-0.5">Ranked by total amount</p>
            </div>
            <Award className="w-5 h-5 text-textMuted" />
          </div>

          {categoryData.length > 0 ? (
            <div className="space-y-4">
              {categoryData.map((cat, i) => {
                const pct = totalExpended > 0 ? (cat.value / totalExpended) * 100 : 0;
                const color = SLICE_COLORS[i % SLICE_COLORS.length];
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: color }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-textMain">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-textMain">{fmt(cat.value)}</span>
                        <span className="text-xs text-textMuted ml-2">{pct.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
              <LayoutList className="w-10 h-10 text-textMuted opacity-30" />
              <p className="text-sm text-textMuted">No expense data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row: Monthly bar chart + Transaction stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Monthly Bar Chart */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg">Monthly Breakdown</h3>
              <p className="text-xs text-textMuted mt-0.5">Income vs expenses over the last 6 months</p>
            </div>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary" /> Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-yellow-400" /> Expense
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dash.monthly_trend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barGap={4}>
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
                  tickFormatter={(v) => `${v >= 1000 ? (v / 1000) + 'K' : v}`}
                />
                <Tooltip content={<ChartTooltip formatCurrency={formatCurrency} />} cursor={{ fill: 'var(--color-surface)', radius: 6 }} />
                <Bar dataKey="income" name="Income" fill="var(--color-primary)" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expense" name="Expense" fill="#FBBF24" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Stats */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg">Transaction Stats</h3>
              <p className="text-xs text-textMuted mt-0.5">All-time figures</p>
            </div>
            <LayoutList className="w-5 h-5 text-textMuted" />
          </div>

          <div className="space-y-5">
            {/* Total transactions */}
            <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <LayoutList className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-textMuted">Total Transactions</p>
                  <p className="text-sm font-bold text-textMain">{totalTxns}</p>
                </div>
              </div>
            </div>

            {/* Average expense */}
            <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-textMuted">Avg. Expense</p>
                  <p className="text-sm font-bold text-textMain">{fmt(avgExpense)}</p>
                </div>
              </div>
            </div>

            {/* Biggest single expense */}
            <div className="p-4 bg-surface rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-textMuted">Biggest Expense</p>
                  <p className="text-sm font-bold text-red-500">
                    {biggestExpense ? fmt(biggestExpense.amount) : '—'}
                  </p>
                </div>
              </div>
              {biggestExpense && (
                <div className="ml-12 space-y-0.5">
                  <p className="text-xs font-semibold text-textMain">{biggestExpense.description}</p>
                  <p className="text-[10px] text-textMuted">
                    {biggestExpense.category || 'Uncategorized'} · {new Date(biggestExpense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              )}
            </div>

            {/* Income vs Expense ratio */}
            <div className="p-4 bg-surface rounded-xl">
              <p className="text-xs text-textMuted mb-3">Income vs Expense ratio</p>
              <div className="flex gap-1 h-2.5 rounded-full overflow-hidden">
                {dash.total_income > 0 && (
                  <div
                    className="bg-green-500 h-full rounded-l-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (dash.total_income / (dash.total_income + dash.total_expense)) * 100)}%` }}
                  />
                )}
                {dash.total_expense > 0 && (
                  <div
                    className="bg-red-500 h-full flex-1 rounded-r-full transition-all duration-700"
                  />
                )}
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-semibold">
                <span className="text-green-500">
                  Income {dash.total_income + dash.total_expense > 0
                    ? ((dash.total_income / (dash.total_income + dash.total_expense)) * 100).toFixed(0)
                    : 0}%
                </span>
                <span className="text-red-500">
                  Expense {dash.total_income + dash.total_expense > 0
                    ? ((dash.total_expense / (dash.total_income + dash.total_expense)) * 100).toFixed(0)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WalletPage;
