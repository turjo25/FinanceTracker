import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed. Please check your credentials.');
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
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-sm font-medium mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            System operational
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">Master your money with intelligent insights.</h1>
          <p className="text-xl text-textMuted leading-relaxed">
            Join thousands of users who are taking control of their financial future using our AI-powered platform.
          </p>
          
          <div className="mt-12 flex gap-4">
             {/* Mock avatars */}
             <div className="flex -space-x-4">
                <img className="w-12 h-12 rounded-full border-4 border-surface" src="https://i.pravatar.cc/100?img=33" alt="User" />
                <img className="w-12 h-12 rounded-full border-4 border-surface" src="https://i.pravatar.cc/100?img=47" alt="User" />
                <img className="w-12 h-12 rounded-full border-4 border-surface" src="https://i.pravatar.cc/100?img=12" alt="User" />
             </div>
             <div className="flex flex-col justify-center">
                <div className="flex text-yellow-400 text-sm">
                   ★★★★★
                </div>
                <span className="text-sm font-medium mt-1 text-textMuted">Trusted by many</span>
             </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-md">
          
          <div className="mb-10">
            <Link to="/" className="inline-block mb-8">
              <Logo />
            </Link>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
            <p className="text-textMuted">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-textMain block ml-1">Username or Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-textMuted w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-textMain focus:border-transparent transition-all shadow-sm"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between ml-1">
                 <label className="text-sm font-medium text-textMain block">Password</label>
                 <a href="#" className="text-sm font-medium text-textMuted hover:text-textMain transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-textMuted w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-12 text-textMain placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-textMain focus:border-transparent transition-all shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-textMuted hover:text-textMain transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-textMain text-surface hover:opacity-90 font-semibold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* <div className="mt-8 flex items-center gap-4 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border text-textMuted text-sm">
            or continue with
          </div>

          {/* <div className="mt-8 grid grid-cols-1 gap-4">
             <button type="button" className="flex items-center justify-center gap-2 bg-surface border border-border hover:bg-background transition-colors py-2.5 rounded-xl text-sm font-medium shadow-sm">
               <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
               Google
             </button>
             <button type="button" className="flex items-center justify-center gap-2 bg-surface border border-border hover:bg-background transition-colors py-2.5 rounded-xl text-sm font-medium shadow-sm">
               <svg className="w-5 h-5 text-textMain" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
               GitHub
             </button> 
          </div> */}

          <p className="mt-6 text-center text-sm text-textMuted">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-textMain hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
