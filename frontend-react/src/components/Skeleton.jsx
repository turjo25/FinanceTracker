import React from 'react';

// Base shimmer block
export const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded-lg ${className}`} />
);

// ─── Dashboard Skeleton ────────────────────────────────────────────────────────
export const DashboardSkeleton = () => (
  <div className="space-y-6 animate-fade-in">
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <SkeletonBlock className="h-8 w-48" />
      <SkeletonBlock className="h-9 w-32 rounded-xl" />
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-background border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-7 w-24 rounded-md" />
          </div>
          <SkeletonBlock className="h-9 w-36" />
          <SkeletonBlock className="h-4 w-44" />
        </div>
      ))}
    </div>

    {/* Bottom grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <SkeletonBlock className="h-6 w-28" />
            <SkeletonBlock className="h-7 w-24 rounded-md" />
          </div>
          <SkeletonBlock className="h-72 w-full rounded-xl" />
        </div>
        {/* Savings */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <SkeletonBlock className="h-6 w-36" />
            <SkeletonBlock className="h-8 w-28 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonBlock className="h-5 w-32" />
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-5 w-20" />
                <SkeletonBlock className="h-3 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <SkeletonBlock className="h-6 w-32" />
          <SkeletonBlock className="h-8 w-24 rounded-full" />
        </div>
        <SkeletonBlock className="h-4 w-36" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="space-y-1.5">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-3 w-16" />
              </div>
            </div>
            <SkeletonBlock className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Wallet Skeleton ───────────────────────────────────────────────────────────
export const WalletSkeleton = () => (
  <div className="space-y-6 animate-fade-in">
    {/* Header */}
    <div className="mb-8 space-y-2">
      <SkeletonBlock className="h-8 w-40" />
      <SkeletonBlock className="h-4 w-56" />
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-background border border-border rounded-2xl p-5 shadow-sm flex items-start gap-4">
          <SkeletonBlock className="w-12 h-12 rounded-xl flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-6 w-28" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>

    {/* Middle row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm lg:col-span-1 space-y-4">
        <SkeletonBlock className="h-6 w-40" />
        <SkeletonBlock className="h-52 w-full rounded-xl" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-4">
        <SkeletonBlock className="h-6 w-48" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-4 w-20" />
              </div>
              <SkeletonBlock className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-4">
        <SkeletonBlock className="h-6 w-44" />
        <SkeletonBlock className="h-64 w-full rounded-xl" />
      </div>
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <SkeletonBlock className="h-6 w-36" />
        {[...Array(4)].map((_, i) => (
          <SkeletonBlock key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

// ─── Savings Goals Skeleton ────────────────────────────────────────────────────
export const SavingsGoalsSkeleton = () => (
  <div className="space-y-6 animate-fade-in">
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-48" />
        <SkeletonBlock className="h-4 w-40" />
      </div>
      <SkeletonBlock className="h-9 w-32 rounded-xl" />
    </div>

    {/* Overview Card */}
    <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
      <SkeletonBlock className="h-6 w-36 mb-4" />
      <div className="flex flex-col md:flex-row items-center gap-6">
        <SkeletonBlock className="w-32 h-32 rounded-full flex-shrink-0" />
        <div className="flex-1 w-full space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <SkeletonBlock className="h-20 rounded-xl" />
            <SkeletonBlock className="h-20 rounded-xl" />
          </div>
        </div>
      </div>
    </div>

    {/* Goals Grid */}
    <SkeletonBlock className="h-6 w-28" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <SkeletonBlock className="w-12 h-12 rounded-xl" />
          <SkeletonBlock className="h-5 w-32" />
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <SkeletonBlock className="h-7 w-24" />
              <SkeletonBlock className="h-3 w-28" />
            </div>
            <SkeletonBlock className="h-8 w-12 rounded-lg" />
          </div>
          <SkeletonBlock className="h-3 w-full rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

// ─── Transactions Skeleton ─────────────────────────────────────────────────────
export const TransactionsSkeleton = () => (
  <div className="space-y-6 animate-fade-in">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-40" />
        <SkeletonBlock className="h-4 w-56" />
      </div>
      <SkeletonBlock className="h-9 w-36 rounded-xl" />
    </div>

    {/* List */}
    <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-3">
      <div className="flex justify-between items-center mb-5">
        <SkeletonBlock className="h-6 w-40" />
      </div>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex justify-between items-center p-4 bg-surface rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="space-y-1.5">
              <SkeletonBlock className="h-4 w-36" />
              <SkeletonBlock className="h-3 w-48" />
            </div>
          </div>
          <SkeletonBlock className="h-4 w-20" />
        </div>
      ))}
    </div>
  </div>
);

// ─── Chatbot Typing Skeleton ───────────────────────────────────────────────────
export const ChatTypingBubble = () => (
  <div className="flex gap-4">
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v10z" />
      </svg>
    </div>
    <div className="bg-surface rounded-2xl rounded-tl-none px-5 py-4 border border-border shadow-sm flex items-center gap-1.5">
      <span className="typing-dot" style={{ animationDelay: '0ms' }} />
      <span className="typing-dot" style={{ animationDelay: '160ms' }} />
      <span className="typing-dot" style={{ animationDelay: '320ms' }} />
    </div>
  </div>
);
