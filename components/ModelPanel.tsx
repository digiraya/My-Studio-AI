import React from 'react';
import { Smile, LayoutTemplate, Image as ImageIcon, Sparkles, User } from 'lucide-react';
import { AspectRatio } from '../types';

interface ModelPanelProps {
  backgroundType: 'flat' | 'environment';
  setBackgroundType: (val: 'flat' | 'environment') => void;
  description: string;
  setDescription: (val: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ModelPanel: React.FC<ModelPanelProps> = ({
  backgroundType,
  setBackgroundType,
  description,
  setDescription,
  aspectRatio,
  setAspectRatio,
  onGenerate,
  isGenerating,
}) => {
  
  const ratios = [
    { value: AspectRatio.SQUARE, label: 'Square (1:1)', icon: 'w-6 h-6 border-2 border-current rounded-sm' },
    { value: AspectRatio.WIDE, label: 'Wide (16:9)', icon: 'w-8 h-5 border-2 border-current rounded-sm' },
    { value: AspectRatio.PORTRAIT, label: 'Portrait (9:16)', icon: 'w-5 h-8 border-2 border-current rounded-sm' },
  ];

  return (
    <div className="flex-1 h-full bg-white dark:bg-slate-900 flex flex-col min-w-0 border-r border-gray-200 dark:border-slate-800 transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Model Generator</h2>
        <span className="ml-3 text-xs bg-neon-light text-neon px-2 py-1 rounded-full font-bold border border-purple-200/50 dark:bg-purple-950/60 dark:border-purple-800">NEW</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        
        {/* Section 1: Background Type */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <LayoutTemplate size={16} className="text-neon" />
            1. Tipe Background
          </label>
          <div className="grid grid-cols-2 gap-4">
             <button
               onClick={() => setBackgroundType('flat')}
               className={`relative p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${
                 backgroundType === 'flat'
                 ? 'border-neon bg-neon-light dark:bg-purple-950/40'
                 : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-rose-200 dark:hover:border-slate-600'
               }`}
             >
                <div className={`p-2 rounded-full w-fit ${backgroundType === 'flat' ? 'bg-neon text-white' : 'bg-gray-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    <User size={20} />
                </div>
                <div>
                    <h3 className={`font-semibold text-sm ${backgroundType === 'flat' ? 'text-neon' : 'text-slate-700 dark:text-slate-200'}`}>Background Flat</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Studio foto polos, warna solid/netral.</p>
                </div>
             </button>

             <button
               onClick={() => setBackgroundType('environment')}
               className={`relative p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${
                 backgroundType === 'environment'
                 ? 'border-neon bg-neon-light dark:bg-purple-950/40'
                 : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-rose-200 dark:hover:border-slate-600'
               }`}
             >
                <div className={`p-2 rounded-full w-fit ${backgroundType === 'environment' ? 'bg-neon text-white' : 'bg-gray-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    <ImageIcon size={20} />
                </div>
                <div>
                    <h3 className={`font-semibold text-sm ${backgroundType === 'environment' ? 'text-neon' : 'text-slate-700 dark:text-slate-200'}`}>Background Real</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Pemandangan, lokasi, atau suasana outdoor.</p>
                </div>
             </button>
          </div>
        </div>

        {/* Section 2: Description */}
        <div className="space-y-3">
           <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
               <Smile size={16} className="text-neon" /> 2. Deskripsi Model
           </label>
           <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Seorang pria Indonesia usia 25 tahun, rambut klimis rapi, memakai kemeja putih, tersenyum ramah ke kamera..."
              className="w-full h-40 p-4 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-neon resize-none bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed transition-colors"
           />
           <p className="text-xs text-slate-400">
               Semakin detail deskripsi fisik (usia, ras, pakaian, ekspresi), semakin akurat hasilnya.
           </p>
        </div>

         {/* Section 3: Ratio */}
         <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">3. Aspek Rasio</label>
          <div className="grid grid-cols-3 gap-3">
            {ratios.map((r) => (
              <button
                key={r.value}
                onClick={() => setAspectRatio(r.value)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  aspectRatio === r.value 
                    ? 'border-neon bg-neon-light dark:bg-purple-950/40 text-neon' 
                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                <div className={`${r.icon} scale-75`}></div>
                <span className="text-[10px] mt-1 font-medium">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky bottom-0 z-10">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !description.trim()}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-lg shadow-neon/20 ${
            isGenerating || !description.trim()
              ? 'bg-gray-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
              : 'bg-neon hover:bg-neon-hover'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Sedang Memproses...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Generate Model</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ModelPanel;