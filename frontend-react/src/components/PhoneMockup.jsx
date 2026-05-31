import React from 'react';

const PhoneMockup = () => {
  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-200 bg-gray-800 border-[8px] rounded-[2.5rem] h-[500px] w-[250px] shadow-2xl flex-shrink-0 transform rotate-[-2deg] transition-transform hover:rotate-0 duration-500 overflow-hidden">
      {/* Notch */}
      <div className="w-[100px] h-[20px] bg-gray-800 absolute top-0 left-1/2 transform -translate-x-1/2 rounded-b-[1rem] z-20"></div>
      
      {/* Phone Screen */}
      <div className="bg-surface w-full h-full rounded-[2rem] overflow-hidden relative flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 pt-6 border-b border-border">
          <svg className="w-5 h-5 text-textMain" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span className="font-semibold text-sm">My Spending</span>
          <svg className="w-5 h-5 text-textMain" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
        </div>

        {/* Chart Area */}
        <div className="p-4 flex-1">
          <div className="flex justify-between items-end h-32 relative">
            {/* Chart lines */}
            <div className="absolute top-4 left-0 text-[10px] text-textMuted">50k</div>
            <div className="absolute top-1/2 left-0 text-[10px] text-textMuted border-b border-dashed border-border w-full z-0 transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-4 text-[10px] text-textMuted transform -translate-y-full">20k</div>
            <div className="absolute bottom-4 left-0 text-[10px] text-textMuted">10k</div>
            
            {/* Smooth SVG line */}
            <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,80 Q10,70 20,80 T40,60 T60,20 T80,60 T100,50" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            </svg>
            
            {/* Highlight point */}
            <div className="absolute top-[20%] left-[60%] w-2 h-2 bg-textMain rounded-full z-20 border-2 border-surface transform -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Highlight tooltip */}
            <div className="absolute top-[5%] left-[60%] bg-textMain text-surface text-[10px] px-2 py-1 rounded shadow-lg z-30 transform -translate-x-1/2 -translate-y-1/2">
              $24,751
            </div>

            {/* Highlight bar */}
             <div className="absolute bottom-0 left-[60%] w-4 h-[80%] bg-secondary/10 z-0 transform -translate-x-1/2"></div>
          </div>
          
          <div className="flex justify-between mt-2 text-[10px] text-textMuted px-2">
            <span>Jan</span>
            <span>Feb</span>
            <span className="text-textMain font-bold">Mar</span>
            <span>Apr</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-textMain text-surface rounded-t-[1.5rem] p-4 flex-1 mt-auto">
           <div className="flex justify-between text-xs mb-4">
              <span className="text-surface/70">Budget for October</span>
              <span className="font-bold text-lg">$2,478</span>
           </div>
           <div className="w-full bg-surface/20 rounded-full h-1 mb-4">
             <div className="bg-secondary h-1 rounded-full" style={{ width: '65%' }}></div>
           </div>
           
           <div className="bg-surface text-textMain rounded-xl p-3 shadow-sm mb-2 flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">🛒</div>
                <div>
                  <div className="text-xs font-bold">Shopping</div>
                  <div className="text-[9px] text-textMuted">10 Jan 2022</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold">$544</div>
                <div className="text-[9px] text-textMuted">In Cash</div>
              </div>
           </div>

           <div className="bg-surface text-textMain rounded-xl p-3 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">☕</div>
                <div>
                  <div className="text-xs font-bold">Restaurant</div>
                  <div className="text-[9px] text-textMuted">11 Jan 2022</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold">$54.80</div>
                <div className="text-[9px] text-textMuted">Card</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
