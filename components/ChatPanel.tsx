import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, AlertTriangle, Sparkles } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
}

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const validHistory = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const reply = await sendChatMessage(validHistory, userText);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'error',
        content: err?.message || 'Gagal memproses jawaban dari AI. Silahkan coba lagi.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 h-full bg-white dark:bg-slate-900 flex flex-col min-w-0 border-r border-gray-200 dark:border-slate-800 transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white flex items-center gap-2">
          <Bot size={20} className="text-neon" />
          AI Studio Assistant
        </h2>
        <span className="ml-auto text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
          <Sparkles size={12} />
          ONLINE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-gray-50/50 dark:bg-slate-900/50">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Bot size={32} />
            </div>
            <p className="text-sm font-medium">Start a conversation...</p>
            <p className="text-xs text-slate-500 mt-1">AI Assistant is ready.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] lg:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-neon text-white rounded-tr-none' 
                : msg.role === 'error'
                  ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-tl-none flex items-start gap-3'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-tl-none'
            }`}>
              {msg.role === 'error' && <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
              <div>
                  {msg.role === 'error' && <p className="font-bold mb-1">Error</p>}
                  {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none flex gap-1.5 shadow-sm">
               <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
               <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan anda..."
            className="flex-1 p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-neon transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-3.5 bg-neon text-white rounded-xl hover:bg-neon-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-neon/20 active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;