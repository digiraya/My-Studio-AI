import React, { useRef, useState } from 'react';
import { Upload, X, UserCheck, Sparkles, User, ShoppingBag } from 'lucide-react';
import { AspectRatio, UploadedImage } from '../types';

interface ProductModelPanelProps {
  modelImage: UploadedImage | null;
  productImage: UploadedImage | null;
  onUpload: (type: 'model' | 'product', file: File) => void;
  onRemove: (type: 'model' | 'product') => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  prompt: string;
  setPrompt: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ProductModelPanel: React.FC<ProductModelPanelProps> = ({
  modelImage,
  productImage,
  onUpload,
  onRemove,
  aspectRatio,
  setAspectRatio,
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadType, setActiveUploadType] = useState<'model' | 'product'>('model');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(activeUploadType, e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerUpload = (type: 'model' | 'product') => {
    setActiveUploadType(type);
    setTimeout(() => {
        fileInputRef.current?.click();
    }, 0);
  };

  const ratios = [
    { value: AspectRatio.SQUARE, label: 'Square (1:1)', icon: 'w-6 h-6 border-2 border-current rounded-sm' },
    { value: AspectRatio.WIDE, label: 'Wide (16:9)', icon: 'w-8 h-5 border-2 border-current rounded-sm' },
    { value: AspectRatio.PORTRAIT, label: 'Portrait (9:16)', icon: 'w-5 h-8 border-2 border-current rounded-sm' },
  ];

  return (
    <div className="flex-1 h-full bg-white flex flex-col min-w-0 border-r border-gray-200">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
        <h2 className="font-semibold text-lg text-slate-800">Produk + Model</h2>
        <span className="ml-3 text-xs bg-neon-light text-neon px-2 py-1 rounded-full font-bold border border-purple-200/50">NEW</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Hidden Input */}
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
        />

        {/* Section 1: Model Upload */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <User size={16} className="text-neon" />
            1. Upload Foto Model
          </label>
          <div className="w-full">
            {modelImage ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-40 flex items-center justify-center">
                <img src={modelImage.previewUrl} alt="model upload" className="h-full w-full object-contain" />
                <button 
                  onClick={() => onRemove('model')}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-neon transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => triggerUpload('model')}
                className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50"
              >
                <div className="p-3 bg-white rounded-full mb-3 shadow-sm">
                   <User size={24} />
                </div>
                <span className="font-medium text-sm">Pilih Model</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 2: Product Upload */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <ShoppingBag size={16} className="text-neon" />
            2. Upload Foto Produk
          </label>
          <div className="w-full">
            {productImage ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-40 flex items-center justify-center">
                <img src={productImage.previewUrl} alt="product upload" className="h-full w-full object-contain" />
                <button 
                  onClick={() => onRemove('product')}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-neon transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => triggerUpload('product')}
                className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50"
              >
                <div className="p-3 bg-white rounded-full mb-3 shadow-sm">
                   <ShoppingBag size={24} />
                </div>
                <span className="font-medium text-sm">Pilih Produk</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 3: Ratio */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">3. Aspek Rasio</label>
          <div className="grid grid-cols-3 gap-3">
            {ratios.map((r) => (
              <button
                key={r.value}
                onClick={() => setAspectRatio(r.value)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  aspectRatio === r.value 
                    ? 'border-neon bg-neon-light text-neon' 
                    : 'border-gray-200 bg-white text-slate-400 hover:border-gray-300'
                }`}
              >
                <div className={`${r.icon} scale-75`}></div>
                <span className="text-[10px] mt-1 font-medium">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Optional Prompt */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">4. Instruksi Tambahan (Opsional)</label>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Contoh: Model tersenyum lebar sambil melihat ke arah kamera..."
            className="w-full h-24 p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-neon focus:border-transparent resize-none bg-gray-50"
          />
        </div>

      </div>

      <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !modelImage || !productImage}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-lg shadow-neon/20 ${
            isGenerating || !modelImage || !productImage
              ? 'bg-gray-300 cursor-not-allowed shadow-none'
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
              <UserCheck size={20} />
              <span>Generate Promosi</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductModelPanel;