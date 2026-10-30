import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Send, Bot, User as UserIcon } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  timestamp: string;
}

export const AIConciergeModal: React.FC = () => {
  const { isConciergeOpen, setIsConciergeOpen, products } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'concierge',
      text: 'Greetings. I am your DODO IMPEX 1689 Digital Concierge. How may I assist you today with product curation, technical specifications, Indian delivery timelines, or our partner program?',
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isConciergeOpen) return null;

  const quickPrompts = [
    'Recommend an executive gift under ₹5,000',
    'What are the specs of the 1689 Heritage Watch?',
    'What is your delivery timeframe to Bengaluru?',
    'How does the 10% Partner commission work?'
  ];

  const handleSendMessage = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'concierge',
        text: data.reply || 'Thank you for your inquiry. Our team is available at care@dodoimpex.in.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'concierge',
        text: 'All orders above ₹999 enjoy free Pan-India tracked dispatch with 7-day replacement. You can reach our executive team at care@dodoimpex.in.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full h-[620px] flex flex-col border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-stone-950 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm tracking-wide text-white">
                DODO Digital Concierge
              </div>
              <div className="text-[11px] text-stone-400">
                AI-Powered E-Commerce Assistant · Connected
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsConciergeOpen(false)}
            className="p-1 text-stone-400 hover:text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close concierge"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'concierge' && (
                <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3 rounded-lg leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-stone-900 text-white rounded-br-none'
                    : 'bg-white text-stone-800 border border-stone-200/80 shadow-xs rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div className={`text-[9px] mt-1 text-right ${m.sender === 'user' ? 'text-stone-400' : 'text-stone-400'}`}>
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-stone-500 p-2">
              <Bot className="w-4 h-4 text-amber-700 animate-spin" />
              <span>Consulting DODO IMPEX catalog & logistics database...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-white border-t border-stone-200 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qp)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, materials, shipping..."
              className="flex-1 bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
