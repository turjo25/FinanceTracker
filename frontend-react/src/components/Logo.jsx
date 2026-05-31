import React from 'react';

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Dynamic SVG Vector Logo */}
      <svg className="w-8 h-8 drop-shadow-sm select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoEmeraldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <linearGradient id="logoBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        
        {/* Tech Ribbon - representing flow, automation and database tracking */}
        <path 
          d="M25 80C25 50 40 30 75 30C85 30 90 40 80 48C70 56 55 50 45 68C35 86 25 80 25 80Z" 
          fill="url(#logoBlueGrad)" 
        />
        
        {/* Wealth Ribbon - representing green financial growth intersecting with technology */}
        <path 
          d="M35 80C42 65 52 55 75 55C90 55 95 35 75 35C55 35 42 55 35 80Z" 
          fill="url(#logoEmeraldGrad)" 
          opacity="0.9"
        />
        
        {/* Dynamic Spark - representing active intelligence and predictive insights */}
        <path 
          d="M75 35L77 40L82 42L77 44L75 49L73 44L68 42L73 40Z" 
          fill="#F59E0B" 
        />
      </svg>
      
      {/* Premium Gradient Typography */}
      <span className="font-extrabold text-2xl tracking-tight text-textMain dark:text-white flex items-center">
        finance
        <span className="bg-gradient-to-r from-[#10B981] to-[#34D399] bg-clip-text text-transparent font-light pl-0.5">
          tracker
        </span>
      </span>
    </div>
  );
};

export default Logo;
