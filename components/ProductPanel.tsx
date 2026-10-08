import React, { useRef } from 'react';
import { Upload, X, ShoppingBag, Sparkles, Sun, Moon, Armchair, Users } from 'lucide-react';
import { AspectRatio, UploadedImage } from '../types';

export type LightingType = 'light' | 'dark';
export type AmbienceType = 'clean' | 'crowd';
export type CrowdType = 'indoor' | 'outdoor';

interface ProductPanelProps {
  image: UploadedImage | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  lighting: LightingType;
  setLighting: (val: LightingType) => void;
  ambience: AmbienceType;
  setAmbience: (val: AmbienceType) => void;
  crowdType: CrowdType;
  setCrowdType: (val: CrowdType) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  prompt: string;
  setPrompt: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ProductPanel: React.FC<ProductPanelProps> = ({
  image,
  onUpload,
  onRemove,
  lighting,
  setLighting,
  ambience,
  setAmbience,
  crowdType,
  setCrowdType,
  aspectRatio,
  setAspectRatio,
  prompt,
  setPrompt,
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
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Photo Produk AI</h2>
        <span className="ml-3 text-xs bg-neon-light text-neon px-2 py-1 rounded-full font-bold border border-purple-200/50 dark:bg-purple-950/60 dark:border-purple-800">NEW</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        
        {/* Section 1: Upload */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">1. Upload Produk</label>
          <div className="w-full">
            {image ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
                <img src={image.previewUrl} alt="upload" className="w-full h-auto max-h-[250px] object-contain bg-gray-50 dark:bg-slate-800" />
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
                className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50 dark:bg-slate-800"
              >
                <div className="p-3 bg-white dark:bg-slate-700 rounded-full mb-3 shadow-sm">
                   <ShoppingBag size={28} />
                </div>
                <span className="font-medium">Pilih Foto Produk</span>
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

        {/* Section 2: Lighting */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">2. Pencahayaan</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLighting('light')}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                lighting === 'light' 
                ? 'border-neon bg-neon-light dark:bg-purple-950/40 text-neon font-medium' 
                : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Sun size={20} />
              <span>Light / Terang</span>
            </button>
            <button
              onClick={() => setLighting('dark')}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                lighting === 'dark' 
                ? 'border-neon bg-neon-light dark:bg-purple-950/40 text-neon font-medium' 
                : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Moon size={20} />
              <span>Dark / Gelap</span>
            </button>
          </div>
        </div>

        {/* Section 3: Ambience */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">3. Suasana Background</label>
          <div className="grid grid-cols-2 gap-3">
             <button
              onClick={() => setAmbience('clean')}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                ambience === 'clean' 
                ? 'border-neon bg-neon-light dark:bg-purple-950/40 text-neon font-medium' 
                : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Armchair size={20} />
              <span>Clean / Studio</span>
            </button>
             <button
              onClick={() => setAmbience('crowd')}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                ambience === 'crowd' 
                ? 'border-neon bg-neon-light dark:bg-purple-950/40 text-neon font-medium' 
                : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Users size={20} />
              <span>Crowd / Lifestyle</span>
            </button>
          </div>

          {/* Sub Option for Crowd */}
          {ambience === 'crowd' && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
               <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Lokasi Lifestyle</label>
               <div className="flex gap-2">
                 {['indoor', 'outdoor'].map((type) => (
                   <button
                    key={type}
                    onClick={() => setCrowdType(type as CrowdType)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm border transition-all capitalize ${
                      crowdType === type
                      ? 'bg-white dark:bg-slate-700 border-neon text-neon shadow-sm font-medium'
                      : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:border-gray-300'
                    }`}
                   >
                     {type}
                   </button>
                 ))}
               </div>
            </div>
          )}
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

        {/* Section 5: Optional Prompt */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">5. Detail Tambahan (Opsional)</label>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Misal: Letakkan di atas meja kayu, ada secangkir kopi disebelahnya..."
            className="w-full h-24 p-3 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-neon focus:border-transparent resize-none bg-gray-50 dark:bg-slate-800 dark:text-slate-200"
          />
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
              <span>Sedang Memproses...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Buat Photo Produk</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductPanel;