import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface VideoPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  promptText: string;
}

const VideoPromptModal: React.FC<VideoPromptModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  promptText
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (promptText && !isLoading) {
      navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col relative transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">VEO Video Prompt</h3>
          <button 
            onClick={onClose}
            className="p-1.5 bg-gray-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-2 min-h-[200px] flex flex-col justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-6 py-8">
              <div className="w-16 h-16 rounded-full border-4 border-neon/20 border-t-neon animate-spin"></div>
              <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Generating prompt...</p>
            </div>
          ) : (
            <div className="relative">
              <textarea 
                readOnly
                value={promptText}
                className="w-full h-48 p-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-neon font-mono"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-6 pt-2">
            <button
              onClick={handleCopy}
              disabled={isLoading || !promptText}
              className={`px-6 py-2.5 rounded-lg font-bold text-white text-sm transition-all shadow-md ${
                 isLoading || !promptText
                 ? 'bg-gray-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
                 : copied 
                    ? 'bg-green-500 shadow-green-500/20' 
                    : 'bg-neon hover:bg-neon-hover shadow-neon/20'
              }`}
            >
               {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPromptModal;