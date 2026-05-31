import React from 'react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-6 px-4 sm:px-8 relative z-20">
      <Link to="/">
        <Logo />
      </Link>
      
      {/* Main Navigation - Hidden on mobile */}
      <div className="hidden md:flex items-center bg-surface/80 backdrop-blur-md rounded-full px-8 py-3 shadow-sm border border-border gap-8 text-sm font-medium">
        <a href="#how-it-works" className="hover:text-primary transition-colors text-textMuted">HOW IT WORKS</a>
        <a href="#features" className="hover:text-primary transition-colors text-textMuted">FEATURES</a>
        <a href="#ai-insights" className="hover:text-primary transition-colors text-textMuted">AI INSIGHTS</a>
        <a href="#resources" className="hover:text-primary transition-colors text-textMuted">RESOURCES</a>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <Link 
          to="/login" 
          className="px-3 sm:px-6 py-1.5 sm:py-2 rounded-full border border-border text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 sm:gap-2 shrink-0"
        >
          <span className="hidden sm:inline">GET STARTED</span>
          <span className="sm:hidden">START</span>
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
