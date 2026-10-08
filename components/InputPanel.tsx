import React, { useRef } from 'react';
import { X, ImagePlus, Sparkles } from 'lucide-react';
import { AspectRatio, UploadedImage } from '../types';

interface InputPanelProps {
  uploadedImages: UploadedImage[];
  onUpload: (files: File[]) => void;
  onRemoveImage: (id: string) => void;
  prompt: string;
  setPrompt: (val: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({
  uploadedImages,
  onUpload,
  onRemoveImage,
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  onGenerate,
  isGenerating,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const ratios = [
    { value: AspectRatio.SQUARE, label: 'Square (1:1)', icon: 'w-6 h-6 border-2 border-current rounded-sm' },
    { value: AspectRatio.WIDE, label: 'Wide (16:9)', icon: 'w-8 h-5 border-2 border-current rounded-sm' },
    { value: AspectRatio.PORTRAIT, label: 'Portrait (9:16)', icon: 'w-5 h-8 border-2 border-current rounded-sm' },
  ];

  const isButtonDisabled = isGenerating || uploadedImages.length === 0 || !prompt.trim();

  return (
    <div className="flex flex-col w-full bg-white dark:bg-slate-900 transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-800 shrink-0 sticky top-0 bg-white dark:bg-slate-900 z-10">
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Konfigurasi Penggabungan</h2>
      </div>

      {/* Area Input yang bisa di-scroll secara keseluruhan */}
      <div className="p-6 space-y-8">
        
        {/* Section 1: Upload */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upload Foto</label>
            <span className="text-xs text-slate-400">{uploadedImages.length}/5 Foto</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {uploadedImages.map((img) => (
              <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm">
                <img src={img.previewUrl} alt="upload" className="w-full h-full object-cover" />
                <button 
                  onClick={() => onRemoveImage(img.id)}
                  className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {uploadedImages.length < 5 && (
              <button 
                onClick={triggerUpload}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-all bg-gray-50 dark:bg-slate-800/50 hover:bg-neon-light dark:hover:bg-neon/5"
              >
                <ImagePlus size={24} />
                <span className="text-xs mt-2 font-medium">Tambah</span>
              </button>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
            multiple
          />
        </div>

        {/* Section 2: Prompt */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Prompt / Instruksi</label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Gabungkan produk sepatu ini dengan latar belakang pegunungan bersalju yang epik, pencahayaan dramatis..."
              className="w-full h-32 p-4 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-neon focus:border-transparent resize-none bg-gray-50 dark:bg-slate-800/50 dark:text-slate-200 transition-colors"
            />
            <div className="absolute bottom-3 right-3 text-slate-400">
              <Sparkles size={16} />
            </div>
          </div>
        </div>

        {/* Section 3: Ratio */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Aspek Rasio</label>
          <div className="grid grid-cols-3 gap-3">
            {ratios.map((r) => (
              <button
                key={r.value}
                onClick={() => setAspectRatio(r.value)}
                className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-all ${
                  aspectRatio === r.value 
                    ? 'border-neon bg-neon-light dark:bg-purple-950/40 text-neon shadow-sm' 
                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:border-gray-300 dark:hover:border-slate-600 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <div className={r.icon}></div>
                <span className="text-[11px] mt-2 font-bold whitespace-nowrap">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Generate Button (Sekarang di dalam scroll area) */}
        <div className="pt-4 pb-12">
          <button
            onClick={onGenerate}
            disabled={isButtonDisabled}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition-all shadow-lg shadow-neon/20 active:scale-[0.98] ${
              isButtonDisabled
                ? 'bg-gray-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none border border-transparent'
                : 'bg-neon hover:bg-neon-hover border border-neon hover:border-neon-hover'
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
                <span>Generate Fusion</span>
              </>
            )}
          </button>
          
          {uploadedImages.length === 0 && (
            <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
              *Upload minimal 1 foto untuk mulai menggabungkan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputPanel;