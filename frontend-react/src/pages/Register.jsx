import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Lock, Mail, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/register/', { username, email, password });
      
      // Auto login after registration
      const response = await api.post('/auth/login/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      navigate('/dashboard');
    } catch (error) {
      alert('Registration failed. Username may already exist.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-textMain transition-colors duration-300">
      
      {/* Top right Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Left side - Decorative Visual (Hidden on smaller screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface border-r border-border overflow-hidden items-center justify-center p-12">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-background to-background opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-sm font-medium mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
            Setup takes 2 minutes
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">Start your journey to financial freedom.</h1>
          <p className="text-xl text-textMuted leading-relaxed mb-8">
            Create a free account to automatically track your expenses, manage budgets, and uncover actionable insights.
          </p>
          
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-textMuted">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              No credit card required for standard features
            </li>
            <li className="flex items-center gap-3 text-textMuted">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Bank-level 256-bit encryption
            </li>
            <li className="flex items-center gap-3 text-textMuted">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Cancel your account at any time
            </li>
          </ul>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-md">
          
          <div className="mb-8">
            <Link to="/" className="inline-block mb-8">
              <Logo />
            </Link>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Create an account</h2>
            <p className="text-textMuted">Join us and start managing your finances today.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-textMain block ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-textMuted w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-textMain focus:border-transparent transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-textMain block ml-1">Email <span className="text-textMuted font-normal">(Optional)</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-textMuted w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-textMain focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-textMain block ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-textMuted w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-12 text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-textMain focus:border-transparent transition-all shadow-sm"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-textMuted hover:text-textMain transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-textMuted ml-1 mt-1">Must be at least 6 characters long.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-textMain text-surface hover:opacity-90 font-semibold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-textMuted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-textMain hover:underline">
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
