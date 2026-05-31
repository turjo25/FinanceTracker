import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import api from '../services/api';

const Feedback = () => {
  const [email, setEmail] = useState('mdshardulrahmanturjoofficial@gmail.com');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('submitting');
    try {
      await api.post('/feedbacks/', {
        email: email,
        message: message,
      });
      setStatus('success');
      setMessage('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Feedback submission error:', error);
      setStatus('error');
      setErrorMessage(error.response?.data?.detail || 'Failed to submit feedback. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
        <h1 className="text-2xl font-bold text-textMain flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          Feedback & Suggestions
        </h1>
        <p className="text-textMuted mt-2">
          We value your feedback. Let us know how we can improve your experience or report any issues.
        </p>
      </div>

      {/* Form */}
      <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-textMain flex items-center gap-2">
              <Mail className="w-4 h-4 text-textMuted" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-textMuted cursor-not-allowed focus:outline-none focus:border-border transition-all opacity-80"
              placeholder="your@email.com"
            />
            <p className="text-xs text-textMuted">We'll use this to follow up with you if needed.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-textMain flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-textMuted" />
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="6"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-textMain focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              placeholder="What's on your mind?"
            ></textarea>
          </div>

          {status === 'error' && (
            <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
              {errorMessage}
            </div>
          )}

          {status === 'success' && (
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Thank you! Your feedback has been sent successfully.
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'submitting' || !message.trim()}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Feedback
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Feedback;
