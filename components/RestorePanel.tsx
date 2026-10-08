import React, { useRef } from 'react';
import { Upload, X, ImagePlus, Sparkles, History } from 'lucide-react';
import { AspectRatio, UploadedImage } from '../types';

interface RestorePanelProps {
  image: UploadedImage | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const RestorePanel: React.FC<RestorePanelProps> = ({
  image,
  onUpload,
  onRemove,
  aspectRatio,
  setAspectRatio,
  onGenerate,
  isGenerating,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const ratios = [
    { value: AspectRatio.SQUARE, label: 'Square (1:1)', icon: 'w-6 h-6 border-2 border-current rounded-sm' },
    { value: AspectRatio.WIDE, label: 'Wide (16:9)', icon: 'w-8 h-5 border-2 border-current rounded-sm' },
    { value: AspectRatio.PORTRAIT, label: 'Portrait (9:16)', icon: 'w-5 h-8 border-2 border-current rounded-sm' },
  ];

  return (
    <div className="flex-1 h-full bg-white dark:bg-slate-900 flex flex-col min-w-0 border-r border-gray-200 dark:border-slate-800 transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Restorasi Foto</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        
        {/* Section 1: Upload */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upload Foto Jadul</label>
          
          <div className="w-full">
            {image ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                <img src={image.previewUrl} alt="upload" className="w-full h-auto max-h-[300px] object-contain" />
                <button 
                  onClick={onRemove}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-neon transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={triggerUpload}
                className="w-full h-48 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50 dark:bg-slate-800"
              >
                <div className="p-3 bg-white dark:bg-slate-700 rounded-full mb-3 shadow-sm">
                   <History size={32} />
                </div>
                <span className="font-medium">Pilih Foto</span>
                <span className="text-xs mt-1 text-slate-400">JPG, PNG</span>
              </button>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {/* Section 2: Info */}
        <div className="p-4 bg-neon-light dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-900/40 rounded-xl">
           <h3 className="text-sm font-semibold text-neon mb-1">Fitur Restorasi</h3>
           <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc list-inside space-y-1">
             <li>Memperbaiki goresan dan noda</li>
             <li>Menjernihkan foto buram</li>
             <li>Mewarnai foto hitam putih</li>
             <li>Meningkatkan resolusi</li>
           </ul>
        </div>

        {/* Section 3: Ratio */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Aspek Rasio Output</label>
          <div className="grid grid-cols-3 gap-3">
            {ratios.map((r) => (
              <button
                key={r.value}
                onClick={() => setAspectRatio(r.value)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                  aspectRatio === r.value 
                    ? 'border-neon bg-neon-light dark:bg-purple-950/40 text-neon' 
                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                <div className={r.icon}></div>
                <span className="text-xs mt-2 font-medium">{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky bottom-0 z-10">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !image}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-lg shadow-neon/20 ${
            isGenerating || !image
              ? 'bg-gray-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
              : 'bg-neon hover:bg-neon-hover'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Sedang Merestorasi...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Restorasi Foto</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RestorePanel;