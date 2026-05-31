import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCcw } from 'lucide-react';
import api from '../services/api';
import { ChatTypingBubble } from '../components/Skeleton';

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'ai',
    content: "Hello! I'm your **AI Financial Assistant**.\n\nI can help you with:\n- Summarizing your financial condition\n- Analyzing your expenses and income\n- Answering questions about your finances\n\nHow can I help you today?",
  },
];

// ─── Inline renderer (bold + code) ───────────────────────────────────────────
const renderInline = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (/^`[^`]+`$/.test(part)) {
      return (
        <code
          key={i}
          className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

// ─── Formatted AI Message ─────────────────────────────────────────────────────
const FormattedAIMessage = ({ content }) => {
  const blocks = content.split(/\n{2,}/);

  return (
    <div className="space-y-2.5">
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter((l) => l.trim() !== '');
        if (lines.length === 0) return null;

        // Detect list block
        const isList = lines.every((l) =>
          /^(\s*[-•*]|\s*\d+[.)]\s)/.test(l.trim())
        );
        if (isList) {
          return (
            <ul key={bi} className="space-y-1.5 pl-1">
              {lines.map((line, li) => {
                const cleaned = line
                  .replace(/^(\s*[-•*]|\s*\d+[.)]\s)\s*/, '')
                  .trim();
                return (
                  <li key={li} className="flex items-start gap-2 text-sm leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                    <span>{renderInline(cleaned)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Single heading line like **Title**
        if (
          lines.length === 1 &&
          /^\*\*[^*]+\*\*:?\s*$/.test(lines[0].trim())
        ) {
          const text = lines[0].replace(/\*\*/g, '').replace(/:?\s*$/, '');
          return (
            <p key={bi} className="text-sm font-bold text-textMain">
              {text}
            </p>
          );
        }

        // Regular paragraph(s)
        return (
          <div key={bi} className="space-y-1">
            {lines.map((line, li) => (
              <p key={li} className="text-sm leading-relaxed">
                {renderInline(line)}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
};

// ─── Message Bubble ───────────────────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === 'user';

  return (
    <div
      className={`flex gap-3 items-end chat-msg-enter ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5 ${
          isUser
            ? 'bg-primary text-white'
            : msg.isError
            ? 'bg-danger/10 text-danger'
            : 'bg-primary/10 text-primary'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[78%] rounded-2xl px-5 py-3.5 ${
          isUser
            ? 'bg-primary text-white rounded-br-sm'
            : msg.isError
            ? 'bg-danger/10 text-danger border border-danger/20 rounded-bl-sm'
            : 'bg-surface text-textMain border border-border rounded-bl-sm shadow-sm'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{msg.content}</p>
        ) : (
          <FormattedAIMessage content={msg.content} isError={msg.isError} />
        )}
      </div>
    </div>
  );
};

// ─── Chatbot Page ─────────────────────────────────────────────────────────────
const Chatbot = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setInput('');
  };

  const handleSend = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { id: Date.now(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/chat/', { message: text });
      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: response.data.reply,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage =
        error.response?.data?.error ||
        'Sorry, I encountered an error connecting to the AI service. Please make sure your OpenRouter API key is configured correctly in the backend.';
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'ai', content: errorMessage, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-surface px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-textMain truncate">AI Financial Assistant</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              <p className="text-[11px] sm:text-xs text-textMuted truncate">
                Online<span className="hidden sm:inline"> · Powered by OpenAI</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-textMuted hover:text-textMain hover:bg-background rounded-lg transition-all"
            title="Reset Chat"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              handleSend('Please summarize my overall financial condition.')
            }
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all"
            title="Summarize Finances"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Summarize Finances</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar scroll-smooth">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {loading && <ChatTypingBubble />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface border-t border-border flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your finances..."
            className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-primary hover:bg-primary/90 active:scale-95 text-white px-5 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
