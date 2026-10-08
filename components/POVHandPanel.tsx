import React, { useRef, useState } from 'react';
import { X, Hand, Sparkles, FileText, Camera } from 'lucide-react';
import { AspectRatio, UploadedImage } from '../types';
import { analyzeProductDescription } from '../services/geminiService';

interface POVHandPanelProps {
  image: UploadedImage | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  description: string;
  setDescription: (val: string) => void;
  prompt: string;
  setPrompt: (val: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const POVHandPanel: React.FC<POVHandPanelProps> = ({
  image,
  onUpload,
  onRemove,
  description,
  setDescription,
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  onGenerate,
  isGenerating,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const handleAutoDescribe = async () => {
      if (!image) return;
      setIsAnalyzing(true);
      try {
          const desc = await analyzeProductDescription(image);
          setDescription(desc);
      } catch (error) {
          console.error(error);
          setDescription("Gagal menganalisa produk. Silahkan ketik manual.");
      } finally {
          setIsAnalyzing(false);
      }
  };

  const ratios = [
    { value: AspectRatio.SQUARE, label: 'Square (1:1)', icon: 'w-6 h-6 border-2 border-current rounded-sm' },
    { value: AspectRatio.WIDE, label: 'Wide (16:9)', icon: 'w-8 h-5 border-2 border-current rounded-sm' },
    { value: AspectRatio.PORTRAIT, label: 'Portrait (9:16)', icon: 'w-5 h-8 border-2 border-current rounded-sm' },
  ];

  return (
    <div className="flex-1 h-full bg-white dark:bg-slate-900 flex flex-col min-w-0 border-r border-gray-200 dark:border-slate-800 transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">POV Tangan</h2>
        <span className="ml-3 text-xs bg-neon-light text-neon px-2 py-1 rounded-full font-bold border border-purple-200/50 dark:bg-purple-950/60 dark:border-purple-800">VIRAL</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        
        {/* Hidden Input */}
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
        />

        {/* Section 1: Upload */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Hand size={16} className="text-neon" />
            1. Upload Produk
          </label>
          <div className="w-full">
            {image ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 h-48 flex items-center justify-center">
                <img src={image.previewUrl} alt="product upload" className="h-full w-full object-contain p-2" />
                <button 
                  onClick={onRemove}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-neon transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button 
                onClick={triggerUpload}
                className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50 dark:bg-slate-800"
              >
                <div className="p-3 bg-white dark:bg-slate-700 rounded-full mb-3 shadow-sm">
                   <Hand size={24} />
                </div>
                <span className="font-medium text-sm">Pilih Foto Produk</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 2: Description */}
        <div className="space-y-3">
           <div className="flex justify-between items-center">
             <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
               <FileText size={16} /> 2. Deskripsi Produk
             </label>
             <button 
                onClick={handleAutoDescribe}
                disabled={!image || isAnalyzing}
                className={`text-[10px] px-2 py-1 rounded-md border flex items-center gap-1 transition-colors ${
                    !image 
                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 border-gray-200 dark:border-slate-700' 
                    : 'bg-neon-light dark:bg-purple-950/40 border-neon text-neon hover:bg-rose-100 dark:hover:bg-rose-900/50'
                }`}
             >
                 {isAnalyzing ? (
                     <span className="animate-pulse">Menganalisa...</span>
                 ) : (
                     <>
                        <Sparkles size={10} />
                        Bantuan AI
                     </>
                 )}
             </button>
           </div>
           <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan detail produk (warna, bentuk, bahan). Klik 'Bantuan AI' untuk otomatis."
              className="w-full h-24 p-3 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-neon resize-none bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
           />
        </div>

        {/* Section 3: Prompt */}
        <div className="space-y-3">
           <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
               <Camera size={16} /> 3. Instruksi Scene (POV)
           </label>
           <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Tangan wanita memegang produk ini di latar belakang cafe aesthetic yang blur..."
              className="w-full h-24 p-3 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-neon resize-none bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
           />
        </div>

         {/* Section 4: Ratio */}
         <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">4. Aspek Rasio</label>
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
          disabled={isGenerating || !image || !description}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-lg shadow-neon/20 ${
            isGenerating || !image || !description
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
              <Hand size={20} />
              <span>Generate POV</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default POVHandPanel;