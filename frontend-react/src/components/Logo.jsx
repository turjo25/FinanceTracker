import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-textMain dark:bg-white rounded-full flex items-center justify-center">
        {/* Abstract leaf/drop shape */}
        <div className="w-4 h-4 bg-surface rounded-tl-full rounded-br-full rounded-tr-md rounded-bl-md transform rotate-45"></div>
      </div>
      <span className="font-bold text-xl tracking-tight text-textMain">finance<span className="font-light">tracker</span></span>
    </div>
  );
};

export default Logo;
