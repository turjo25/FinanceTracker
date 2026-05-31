import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Activity, 
  ChevronDown,
  ChevronRight,
  MessageSquare,
  FileText,
  Settings,
  MessageCircle,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Download,
  Loader2,
  CheckCircle2,
  Target,
  Code,
  Briefcase,
  Mail
} from 'lucide-react';
import Logo from './Logo';
import api from '../services/api';

const SidebarItem = ({ icon: Icon, label, to, badge, hasDot, isActive }) => (
  <NavLink
    to={to}
    className={({ isActive: navIsActive }) =>
      `flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
        isActive || navIsActive 
          ? 'bg-primary text-white shadow-md shadow-primary/20' 
          : 'text-textMuted hover:bg-surface hover:text-textMain'
      }`
    }
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-textMuted group-hover:text-textMain'}`} />
      <span className="font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {hasDot && (
        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
      )}
      {badge && (
        <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  </NavLink>
);

// ─── Report Popover ──────────────────────────────────────────────────────────
const ReportItem = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | done
  const popoverRef = useRef(null);
  const navigate = useNavigate();

  // Close popover when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleDownload = async () => {
    setStatus('loading');
    try {
      const response = await api.get('/transactions/');
      const transactions = response.data;

      if (!transactions || transactions.length === 0) {
        alert('No transactions to export.');
        setStatus('idle');
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

      setStatus('done');
      setTimeout(() => {
        setStatus('idle');
        setOpen(false);
      }, 1800);
    } catch (error) {
      if (error.response?.status === 401) navigate('/login');
      else alert('Failed to export report. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
          open
            ? 'bg-primary text-white shadow-md shadow-primary/20'
            : 'text-textMuted hover:bg-surface hover:text-textMain'
        }`}
      >
        <div className="flex items-center gap-3">
          <FileText className={`w-5 h-5 ${open ? 'text-white' : 'text-textMuted group-hover:text-textMain'}`} />
          <span className="font-medium">Report</span>
        </div>
        {open
          ? <ChevronDown className="w-4 h-4" />
          : <ChevronRight className="w-4 h-4" />
        }
      </button>

      {open && (
        <div className="mt-1 mx-1 bg-background border border-border rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 pt-3 pb-2 border-b border-border">
            <p className="text-xs font-semibold text-textMain">Download Report</p>
            <p className="text-[10px] text-textMuted mt-0.5">Export your transactions as a CSV file</p>
          </div>

          {/* Option row */}
          <div className="p-2">
            <button
              onClick={handleDownload}
              disabled={status === 'loading' || status === 'done'}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface transition-all group/btn disabled:opacity-70"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                status === 'done'
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-primary/10 group-hover/btn:bg-primary/20'
              }`}>
                {status === 'loading' && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                {status === 'done'    && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {status === 'idle'    && <Download className="w-4 h-4 text-primary" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-textMain">
                  {status === 'loading' ? 'Preparing…' : status === 'done' ? 'Downloaded!' : 'Overall Report'}
                </p>
                <p className="text-[10px] text-textMuted">All transactions · CSV format</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const Sidebar = ({ handleLogout }) => {
  const [activityExpanded, setActivityExpanded] = useState(true);
  const [helpExpanded, setHelpExpanded] = useState(false);
  const location = useLocation();
  
  const isDark = document.documentElement.classList.contains('dark');
  
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    window.dispatchEvent(new Event('theme-change'));
  };

  return (
    <aside className="w-64 h-screen bg-background border-r border-border flex flex-col hidden lg:flex sticky top-0 transition-colors duration-300">
      <div className="p-6">
        <Logo />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        <div className="mb-8">
          <p className="px-4 text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Menu</p>
          <div className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Overview" to="/dashboard" isActive={location.pathname === '/dashboard'} />
            <SidebarItem icon={Wallet} label="My Wallet" to="/wallet" />
            <SidebarItem icon={Target} label="Savings Goals" to="/savings-goals" />
            
            {/* Activity accordion */}
            <div>
              <button 
                onClick={() => setActivityExpanded(!activityExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-textMuted hover:bg-surface hover:text-textMain transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-textMuted group-hover:text-textMain" />
                  <span className="font-medium">Activity</span>
                </div>
                {activityExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {activityExpanded && (
                <div className="ml-12 mt-1 space-y-1 relative before:absolute before:left-[-1.25rem] before:top-0 before:bottom-0 before:w-px before:bg-border">
                  <NavLink to="/transactions?type=expense" className="block py-2 text-sm text-textMuted hover:text-textMain relative before:absolute before:left-[-1.25rem] before:top-1/2 before:w-3 before:h-px before:bg-border">Expenses</NavLink>
                  <NavLink to="/transactions?type=income" className="block py-2 text-sm text-textMuted hover:text-textMain relative before:absolute before:left-[-1.25rem] before:top-1/2 before:w-3 before:h-px before:bg-border">Income</NavLink>
                </div>
              )}
            </div>

            <SidebarItem icon={MessageSquare} label="Messages" to="/messages" hasDot={true} />
            <ReportItem />
          </div>
        </div>

        <div>
          <p className="px-4 text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Help & Settings</p>
          <div className="space-y-1">
            <SidebarItem icon={Settings} label="Settings" to="/settings" />
            <SidebarItem icon={MessageCircle} label="Feedback" to="/feedback" />
            
            {/* Help & Center accordion */}
            <div>
              <button 
                onClick={() => setHelpExpanded(!helpExpanded)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                  helpExpanded 
                    ? 'text-textMain' 
                    : 'text-textMuted hover:bg-surface hover:text-textMain'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className={`w-5 h-5 ${helpExpanded ? 'text-textMain' : 'text-textMuted group-hover:text-textMain'}`} />
                  <span className="font-medium">Help & Center</span>
                </div>
                {helpExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {helpExpanded && (
                <div className="ml-12 mt-1 space-y-1 relative before:absolute before:left-[-1.25rem] before:top-0 before:bottom-0 before:w-px before:bg-border pb-2">
                  <a href="https://linkedin.com/in/srturjo25" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 text-sm text-textMuted hover:text-[#0A66C2] dark:hover:text-[#60A5FA] relative before:absolute before:left-[-1.25rem] before:top-1/2 before:w-3 before:h-px before:bg-border transition-colors">
                    <Briefcase className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <a href="https://github.com/turjo25" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 text-sm text-textMuted hover:text-black dark:hover:text-white relative before:absolute before:left-[-1.25rem] before:top-1/2 before:w-3 before:h-px before:bg-border transition-colors">
                    <Code className="w-4 h-4" />
                    GitHub
                  </a>
                  <a href="mailto:mdshardulrahmanturjoofficial@gmail.com" className="flex items-center gap-2 py-2 text-sm text-textMuted hover:text-[#EA4335] dark:hover:text-[#F87171] relative before:absolute before:left-[-1.25rem] before:top-1/2 before:w-3 before:h-px before:bg-border transition-colors">
                    <Mail className="w-4 h-4" />
                    Gmail
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-textMuted hover:bg-surface hover:text-textMain transition-all"
        >
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-primary' : 'bg-gray-300'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </div>
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/10 transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
