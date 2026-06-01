import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import PhoneMockup from '../components/PhoneMockup';

// Hook: fade-up reveal on scroll
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};

const Landing = () => {
  // Observe all .landing-card elements and add 'revealed' when in view
  useEffect(() => {
    const cards = document.querySelectorAll('.landing-card');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    cards.forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col font-sans text-textMain transition-colors duration-300">
      <div className="flex-1 bg-surface rounded-[2rem] md:rounded-[3rem] shadow-sm overflow-hidden relative flex flex-col border border-border transition-colors duration-300">
        
        {/* Background decorative blob */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gray-100/50 dark:bg-gray-800/20 rounded-bl-[10rem] pointer-events-none -z-0"></div>

        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 sm:px-8 pb-20 pt-10 relative z-10">
          
          {/* Left Column - Copy */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface text-sm font-medium mb-8 hero-badge">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" /></svg>
              </span>
              <span>Try our AI insights for free</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold leading-[1.1] tracking-tight mb-10 text-textMain hero-title">
              Smarter<br />money management,<br />powered by AI.
            </h1>

            <div className="flex items-center gap-4 border-t border-border pt-8 mt-12">
               <div className="text-4xl text-textMuted">
                 {/* Abstract starburst icon */}
                 <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.536-7.071l-2.829 2.828m-8.485 8.486l-2.829 2.828m14.142 0l-2.829-2.828m-8.485-8.486L4.464 4.929" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                 </svg>
               </div>
               <div>
                 <p className="font-semibold text-textMain text-lg">Personal finance web app</p>
                 <p className="text-textMuted flex items-center gap-2 text-sm mt-1">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                   FinanceTracker trusted by many users
                 </p>
               </div>
            </div>
          </div>

          {/* Right Column - Mockup & Floating Elements */}
          <div className="relative flex justify-center items-center">
             
             {/* Floating Stats Card */}
             <div className="hidden sm:block absolute top-10 left-0 bg-[#E8E1D9] dark:bg-amber-900/40 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-lg z-30 max-w-[200px] border border-black/5 dark:border-white/10 float-card" style={{animationDelay:'0.2s'}}>
                <h3 className="text-3xl font-bold mb-2">🏅</h3>
                <p className="text-sm opacity-80 mb-4">FinanceTracker is trusted by many users.</p>
                <div className="flex -space-x-2">
                   <img className="w-8 h-8 rounded-full border-2 border-[#E8E1D9] dark:border-amber-900" src="https://i.pravatar.cc/100?img=11" alt="user" />
                   <img className="w-8 h-8 rounded-full border-2 border-[#E8E1D9] dark:border-amber-900" src="https://i.pravatar.cc/100?img=12" alt="user" />
                   <div className="w-8 h-8 rounded-full border-2 border-[#E8E1D9] dark:border-amber-900 bg-textMain text-surface flex items-center justify-center text-xs font-bold">+</div>
                </div>
             </div>

             {/* Rating Badge */}
             <div className="hidden md:flex absolute top-1/4 -left-10 bg-surface px-4 py-2 rounded-full shadow-md z-30 border border-border items-center gap-2 float-card" style={{animationDelay:'0.6s'}}>
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span className="font-bold text-sm">4.8</span>
             </div>

             {/* Phone Mockup */}
             <div className="relative z-20">
               <PhoneMockup />
             </div>

             {/* Save Smarter Label */}
             <div className="hidden sm:block absolute right-0 top-1/3 max-w-[120px] z-30">
                <div className="w-10 h-10 rounded-full bg-surface shadow-md flex items-center justify-center mb-4 border border-border">
                  <svg className="w-5 h-5 text-textMain" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                </div>
                <p className="font-semibold text-sm">Save smarter with custom AI budgets</p>
             </div>

             {/* Safe & Secure Badge */}
             <div className="hidden md:flex absolute bottom-1/4 -left-12 bg-[#F3F4A5] dark:bg-yellow-900 text-gray-900 dark:text-yellow-100 px-6 py-3 rounded-full shadow-lg z-30 border border-black/5 dark:border-white/10 items-center gap-3 float-card" style={{animationDelay:'1s'}}>
                <div className="bg-textMain text-surface rounded-full p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="font-bold">Safe & Secure</span>
             </div>

          </div>
        </main>
      </div>

      {/* How it works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto w-full py-20 px-4 md:px-8 text-textMain mt-12 bg-surface rounded-[2rem] md:rounded-[3rem] border border-border shadow-sm scroll-mt-24">
         <div className="text-center mb-16">
           <h2 className="text-4xl font-bold mb-4">How to Get Started</h2>
           <p className="text-textMuted max-w-2xl mx-auto">Master your finances in three simple steps using our intuitive platform.</p>
         </div>

         <div className="grid md:grid-cols-3 gap-8">
            {[{n:'1',t:'Connect Accounts',d:'Securely link your bank accounts, credit cards, and investments to automatically import transactions in real-time. No more manual entry.'},{n:'2',t:'Review & Categorize',d:'Let our intelligent system organize your spending into clean, understandable categories so you can instantly see where your money goes.'},{n:'3',t:'Track & Save',d:'Monitor your custom budgets, track your net worth over time, and use actionable insights to reach your financial goals faster.'}].map((s,i) => (
              <div key={i} className="p-6 rounded-2xl bg-background/50 border border-border landing-card" style={{animationDelay: `${i*0.15}s`}}>
                <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-sm">{s.n}</div>
                <h3 className="text-xl font-bold mb-3">{s.t}</h3>
                <p className="text-textMuted text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto w-full py-20 px-4 md:px-8 text-textMain mt-12 scroll-mt-24">
         <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
               <h2 className="text-4xl font-bold mb-6">Everything you need to succeed financially.</h2>
               <p className="text-textMuted mb-8 leading-relaxed">We've built a comprehensive suite of tools designed to give you total clarity and control over your money, without the stress. Experience the most exclusive, state-of-the-art features tailored to your financial habits.</p>
               
               <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                 <li className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                   </div>
                   <div>
                     <h4 className="font-bold mb-1">AI Financial Chatbot</h4>
                     <p className="text-sm text-textMuted">Conversational assistant powered by Llama 3.1 via OpenRouter. Summarize your overall financial condition and analyze expenses instantly.</p>
                   </div>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h0a2 2 0 01-2 2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                   </div>
                   <div>
                     <h4 className="font-bold mb-1">Smart ML Predictions</h4>
                     <p className="text-sm text-textMuted">A dedicated FastAPI microservice leveraging Scikit-Learn Naive Bayes. Auto-categorizes transactions and forecasts monthly velocity.</p>
                   </div>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center shrink-0">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   </div>
                   <div>
                     <h4 className="font-bold mb-1">Live Multi-Currency Sync</h4>
                     <p className="text-sm text-textMuted">Dynamic exchange rates powered by the Frankfurter API and React Context. Convert and manage all assets flawlessly across global currencies.</p>
                   </div>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center shrink-0">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                   </div>
                   <div>
                     <h4 className="font-bold mb-1">Interactive Analytics</h4>
                     <p className="text-sm text-textMuted">High-fidelity data visualizations with responsive Recharts. Track your cash flow trends, category breakdown ratios, and balance velocity.</p>
                   </div>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 flex items-center justify-center shrink-0">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                   </div>
                   <div>
                     <h4 className="font-bold mb-1">Custom Savings Targets</h4>
                     <p className="text-sm text-textMuted">Establish goals, set specific deadlines, and track milestones with real-time feedback and glassmorphic progress trackers.</p>
                   </div>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 flex items-center justify-center shrink-0">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                   </div>
                   <div>
                     <h4 className="font-bold mb-1">Secure OAuth & JWT Auth</h4>
                     <p className="text-sm text-textMuted">Secure Google Cloud integration alongside traditional email/password credentials with secure JWT access tokens.</p>
                   </div>
                 </li>
               </ul>
            </div>
            <div className="lg:col-span-5 bg-surface rounded-3xl p-6 border border-border shadow-md relative overflow-hidden">
               {/* Decorative background gradients */}
               <div className="absolute w-full h-full top-0 left-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary to-transparent pointer-events-none"></div>
               
               <h3 className="text-xs font-bold text-textMain mb-4 uppercase tracking-wider flex items-center gap-2">
                 <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" /> Platform Exclusive Features
               </h3>
               
               <div className="space-y-4 relative z-10">
                 {/* AI Prompt Mockup */}
                 <div className="bg-background/80 backdrop-blur-md rounded-2xl p-4 border border-border shadow-sm transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">🤖</div>
                      <span className="text-xs font-bold text-textMain">AI Financial Assistant</span>
                      <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium ml-auto">Llama 3.1</span>
                    </div>
                    <p className="text-xs text-textMain leading-relaxed">
                      "I've categorized your transaction history. You've spent 12% less on Dining compared to last month. Setting a savings target of $200 is recommended."
                    </p>
                 </div>
                 
                 {/* Live Currency Sync */}
                 <div className="bg-background/80 backdrop-blur-md rounded-2xl p-4 border border-border shadow-sm transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-textMain">Live Multi-Currency Conversion</span>
                      </div>
                      <span className="text-[8px] text-textMuted uppercase font-medium">Frankfurter API</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-surface rounded-lg p-2 border border-border">
                        <span className="text-[10px] text-textMuted block">USD</span>
                        <span className="font-bold text-textMain">$1.00</span>
                      </div>
                      <div className="bg-surface rounded-lg p-2 border border-border">
                        <span className="text-[10px] text-textMuted block">EUR</span>
                        <span className="font-bold text-textMain">€0.92</span>
                      </div>
                      <div className="bg-surface rounded-lg p-2 border border-border">
                        <span className="text-[10px] text-textMuted block">BDT</span>
                        <span className="font-bold text-textMain">৳117.5</span>
                      </div>
                    </div>
                 </div>

                 {/* Savings Goal Card */}
                 <div className="bg-background/80 backdrop-blur-md rounded-2xl p-4 border border-border shadow-sm transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-textMain">🎯 Europe Trip savings</span>
                      <span className="text-xs font-bold text-green-500">72.5%</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2 mb-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: '72.5%' }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-textMuted">
                      <span>Saved: $1,450</span>
                      <span>Target: $2,000</span>
                    </div>
                 </div>
               </div>
            </div>
         </div>
      </section>

      {/* AI Insights Section */}
      <section id="ai-insights" className="max-w-7xl mx-auto w-full py-20 px-4 md:px-8 text-textMain mt-12 bg-surface rounded-[2rem] md:rounded-[3rem] border border-border shadow-sm scroll-mt-24">
         <div className="text-center mb-16 max-w-3xl mx-auto">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:border-orange-800/50 text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" /></svg>
              Powered by Advanced Machine Learning
           </div>
           <h2 className="text-4xl font-bold mb-4">Your personal financial advisor.</h2>
           <p className="text-textMuted">Go beyond basic tracking. Our AI analyzes your transaction history to provide deep, actionable insights tailored specifically to your financial habits.</p>
         </div>

         <div className="grid md:grid-cols-3 gap-6">
            {[{e:'🎯',t:'Predictive Spending',d:'Forecast your month-end balance based on your historical spending velocity and upcoming bills.'},{e:'⚠️',t:'Anomaly Detection',d:'Get instant alerts for duplicate charges, unusually high bills, or subscription price increases.'},{e:'💡',t:'Smart Savings',d:'Receive personalized recommendations on where you can painlessly cut back to save more money.'}].map((c,i) => (
              <div key={i} className="p-8 rounded-2xl bg-background border border-border text-center landing-card" style={{animationDelay:`${i*0.15}s`}}>
                <div className="w-14 h-14 mx-auto bg-surface rounded-xl border border-border flex items-center justify-center text-2xl mb-4 shadow-sm ai-icon">{c.e}</div>
                <h3 className="text-lg font-bold mb-2">{c.t}</h3>
                <p className="text-sm text-textMuted">{c.d}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="max-w-7xl mx-auto w-full py-20 px-4 md:px-8 text-textMain mt-12 scroll-mt-24">
         <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-border pb-8">
            <div>
               <h2 className="text-4xl font-bold mb-4">Resources to help you grow.</h2>
               <p className="text-textMuted max-w-xl">Learn how to make the most of your money with our curated guides and support center.</p>
            </div>
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{t:'Help Center',d:'Step-by-step guides on connecting accounts and using features.'},{t:'Community Forum',d:'Connect with other users to share budgeting tips and strategies.'},{t:'Personal Finance 101',d:'Learn the basics of budgeting, investing, and debt management.'},{t:'API Documentation',d:'For developers looking to integrate with our platform.'}].map((r,i) => (
              <div key={i} className="p-6 rounded-2xl bg-surface border border-border landing-card" style={{animationDelay:`${i*0.1}s`}}>
                <h3 className="font-bold mb-2 text-textMain">{r.t}</h3>
                <p className="text-sm text-textMuted">{r.d}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 py-14 text-textMuted text-sm border-t border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
          {/* Brand */}
          <div className="text-center">
            <p className="text-base font-bold text-textMain mb-1">Finance Tracker</p>
            <p className="text-xs">Smarter money management, powered by AI.</p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="https://github.com/turjo25" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl border border-border bg-surface flex items-center justify-center text-textMuted hover:text-white hover:bg-gray-900 hover:border-gray-900 dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
              title="GitHub">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            </a>
            <a href="https://linkedin.com/in/srturjo25" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl border border-border bg-surface flex items-center justify-center text-textMuted hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
              title="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="mailto:mdshardulrahmanturjoofficial@gmail.com"
              className="w-10 h-10 rounded-xl border border-border bg-surface flex items-center justify-center text-textMuted hover:text-white hover:bg-[#EA4335] hover:border-[#EA4335] transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
              title="Gmail">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
            </a>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-textMain transition-colors">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-border"/>
            <a href="#" className="hover:text-textMain transition-colors">Terms of Service</a>
            <span className="w-1 h-1 rounded-full bg-border"/>
            <a href="#" className="hover:text-textMain transition-colors">Contact Support</a>
          </div>

          <p className="text-xs">&copy; {new Date().getFullYear()} Finance Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
