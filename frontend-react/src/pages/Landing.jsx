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

        <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 pb-20 pt-10 relative z-10">
          
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
             <div className="absolute top-10 left-0 bg-[#E8E1D9] dark:bg-amber-900/40 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-lg z-30 max-w-[200px] border border-black/5 dark:border-white/10 float-card" style={{animationDelay:'0.2s'}}>
                <h3 className="text-3xl font-bold mb-2">🏅</h3>
                <p className="text-sm opacity-80 mb-4">FinanceTracker is trusted by many users.</p>
                <div className="flex -space-x-2">
                   <img className="w-8 h-8 rounded-full border-2 border-[#E8E1D9] dark:border-amber-900" src="https://i.pravatar.cc/100?img=11" alt="user" />
                   <img className="w-8 h-8 rounded-full border-2 border-[#E8E1D9] dark:border-amber-900" src="https://i.pravatar.cc/100?img=12" alt="user" />
                   <div className="w-8 h-8 rounded-full border-2 border-[#E8E1D9] dark:border-amber-900 bg-textMain text-surface flex items-center justify-center text-xs font-bold">+</div>
                </div>
             </div>

             {/* Rating Badge */}
             <div className="absolute top-1/4 -left-10 bg-surface px-4 py-2 rounded-full shadow-md z-30 border border-border flex items-center gap-2 float-card" style={{animationDelay:'0.6s'}}>
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span className="font-bold text-sm">4.8</span>
             </div>

             {/* Phone Mockup */}
             <div className="relative z-20">
               <PhoneMockup />
             </div>

             {/* Save Smarter Label */}
             <div className="absolute right-0 top-1/3 max-w-[120px] z-30">
                <div className="w-10 h-10 rounded-full bg-surface shadow-md flex items-center justify-center mb-4 border border-border">
                  <svg className="w-5 h-5 text-textMain" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                </div>
                <p className="font-semibold text-sm">Save smarter with custom AI budgets</p>
             </div>

             {/* Safe & Secure Badge */}
             <div className="absolute bottom-1/4 -left-12 bg-[#F3F4A5] dark:bg-yellow-900 text-gray-900 dark:text-yellow-100 px-6 py-3 rounded-full shadow-lg z-30 border border-black/5 dark:border-white/10 flex items-center gap-3 float-card" style={{animationDelay:'1s'}}>
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
         <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-4xl font-bold mb-6">Everything you need to succeed financially.</h2>
               <p className="text-textMuted mb-8 leading-relaxed">We've built a comprehensive suite of tools designed to give you total clarity and control over your money, without the stress.</p>
               
               <ul className="space-y-6">
                 <li className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                   </div>
                   <div>
                     <h4 className="font-bold mb-1">Dynamic Budgeting</h4>
                     <p className="text-sm text-textMuted">Create flexible budgets that adapt to your lifestyle. Get real-time alerts before you overspend.</p>
                   </div>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                   </div>
                   <div>
                     <h4 className="font-bold mb-1">Necessary Security</h4>
                     <p className="text-sm text-textMuted">Your data is encrypted. We never sell your data to third parties.</p>
                   </div>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center shrink-0">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                   </div>
                   <div>
                     <h4 className="font-bold mb-1">Custom Reports</h4>
                     <p className="text-sm text-textMuted">Export your financial data or view beautifully crafted reports to prepare for tax season.</p>
                   </div>
                 </li>
               </ul>
            </div>
            <div className="bg-surface rounded-3xl p-8 border border-border shadow-md">
               {/* Decorative placeholder for features graphic */}
               <div className="aspect-square bg-background rounded-2xl border border-border flex items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute w-full h-full opacity-20 dark:opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary to-transparent"></div>
                  <div className="w-full space-y-4 relative z-10">
                    <div className="h-12 bg-surface rounded-xl border border-border shadow-sm flex items-center px-4 gap-4">
                      <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30"></div>
                      <div className="flex-1 h-2 bg-background rounded-full"></div>
                      <div className="w-12 h-2 bg-textMuted/30 rounded-full"></div>
                    </div>
                    <div className="h-12 bg-surface rounded-xl border border-border shadow-sm flex items-center px-4 gap-4">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30"></div>
                      <div className="flex-1 h-2 bg-background rounded-full"></div>
                      <div className="w-12 h-2 bg-textMuted/30 rounded-full"></div>
                    </div>
                    <div className="h-12 bg-surface rounded-xl border border-border shadow-sm flex items-center px-4 gap-4">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30"></div>
                      <div className="flex-1 h-2 bg-background rounded-full"></div>
                      <div className="w-12 h-2 bg-textMuted/30 rounded-full"></div>
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
            {/* <button className="mt-6 md:mt-0 px-6 py-2 rounded-full bg-textMain text-surface font-medium hover:opacity-90 transition-opacity">
               View All Resources
            </button> */}
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{t:'Help Center',d:'Step-by-step guides on connecting accounts and using features.'},{t:'Community Forum',d:'Connect with other users to share budgeting tips and strategies.'},{t:'Personal Finance 101',d:'Learn the basics of budgeting, investing, and debt management.'},{t:'API Documentation',d:'For developers looking to integrate with our platform.'}].map((r,i) => (
              <a key={i} href="#" className="group p-6 rounded-2xl bg-surface border border-border landing-card" style={{animationDelay:`${i*0.1}s`}}>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </div>
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">{r.t}</h3>
                <p className="text-sm text-textMuted">{r.d}</p>
              </a>
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
