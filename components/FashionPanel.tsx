import React, { useRef, useState } from 'react';
import { Upload, X, Shirt, Image as ImageIcon, Sparkles } from 'lucide-react';
import { AspectRatio, UploadedImage, FashionModelType, FashionGender, FashionEnvironment, FashionAgeGroup, FashionStyle } from '../types';

interface FashionPanelProps {
  productImage: UploadedImage | null;
  logoImage: UploadedImage | null;
  onUpload: (type: 'product' | 'logo', file: File) => void;
  onRemove: (type: 'product' | 'logo') => void;
  modelType: FashionModelType;
  setModelType: (val: FashionModelType) => void;
  genderContext: FashionGender | FashionEnvironment;
  setGenderContext: (val: any) => void;
  ageGroup: FashionAgeGroup;
  setAgeGroup: (val: FashionAgeGroup) => void;
  customAge: string;
  setCustomAge: (val: string) => void;
  visualStyle: FashionStyle;
  setVisualStyle: (val: FashionStyle) => void;
  customStyle: string;
  setCustomStyle: (val: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  prompt: string;
  setPrompt: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const FashionPanel: React.FC<FashionPanelProps> = ({
  productImage,
  logoImage,
  onUpload,
  onRemove,
  modelType,
  setModelType,
  genderContext,
  setGenderContext,
  ageGroup,
  setAgeGroup,
  customAge,
  setCustomAge,
  visualStyle,
  setVisualStyle,
  customStyle,
  setCustomStyle,
  aspectRatio,
  setAspectRatio,
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadType, setActiveUploadType] = useState<'product' | 'logo'>('product');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(activeUploadType, e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerUpload = (type: 'product' | 'logo') => {
    setActiveUploadType(type);
    setTimeout(() => {
        fileInputRef.current?.click();
    }, 0);
  };

  // Logic to handle model switch and default values
  const handleModelTypeChange = (type: FashionModelType) => {
    setModelType(type);
    if (type === 'no_model') {
      setGenderContext('indoor'); // Default to indoor for no model
    } else {
      setGenderContext('female'); // Default to female for models
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
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Fashion AI</h2>
        <span className="ml-3 text-xs bg-neon-light text-neon px-2 py-1 rounded-full font-bold border border-purple-200/50 dark:bg-purple-950/60 dark:border-purple-800">HOT</span>
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

        {/* Section 1: Upload Product */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Shirt size={16} className="text-neon" />
            1. Upload Produk Fashion
          </label>
          <div className="w-full">
            {productImage ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 h-40 flex items-center justify-center">
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
                className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50 dark:bg-slate-800"
              >
                <div className="p-3 bg-white dark:bg-slate-700 rounded-full mb-3 shadow-sm">
                   <Shirt size={24} />
                </div>
                <span className="font-medium text-sm">Pilih Baju/Aksesoris</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 2: Logo Upload (Optional) */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <ImageIcon size={16} className="text-slate-500 dark:text-slate-400" />
            2. Upload Logo Brand (Opsional)
          </label>
          <div className="w-full">
            {logoImage ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 h-24 flex items-center justify-center">
                <img src={logoImage.previewUrl} alt="logo upload" className="h-full w-full object-contain p-2" />
                <button 
                  onClick={() => onRemove('logo')}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-neon transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => triggerUpload('logo')}
                className="w-full h-24 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 flex items-center justify-center gap-3 text-slate-400 hover:border-slate-500 hover:text-slate-500 transition-colors bg-gray-50 dark:bg-slate-800"
              >
                <ImageIcon size={20} />
                <span className="font-medium text-xs">Pilih Logo (PNG)</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 3: Model Configuration */}
        <div className="space-y-4 border-t border-gray-100 dark:border-slate-800 py-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Konfigurasi Model</h3>
            
            {/* 3.1 Model Type */}
            <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Tipe Model</label>
                <div className="flex gap-2">
                    {['human', 'mannequin', 'no_model'].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleModelTypeChange(type as FashionModelType)}
                            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium border transition-all capitalize ${
                                modelType === type
                                ? 'bg-neon-light dark:bg-purple-950/40 border-neon text-neon'
                                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                            }`}
                        >
                            {type === 'no_model' ? 'Tanpa Model' : type}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3.2 Gender / Context */}
            <div>
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">
                    {modelType === 'no_model' ? 'Lingkungan' : 'Jenis Kelamin Model'}
                 </label>
                 <div className="flex gap-2">
                    {modelType === 'no_model' ? (
                        <>
                            <button onClick={() => setGenderContext('indoor')} className={`flex-1 py-2 rounded-lg text-xs border ${genderContext === 'indoor' ? 'bg-neon-light dark:bg-purple-950/40 border-neon text-neon' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>Indoor</button>
                            <button onClick={() => setGenderContext('outdoor')} className={`flex-1 py-2 rounded-lg text-xs border ${genderContext === 'outdoor' ? 'bg-neon-light dark:bg-purple-950/40 border-neon text-neon' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>Outdoor</button>
                        </>
                    ) : (
                        <>
                           <button onClick={() => setGenderContext('male')} className={`flex-1 py-2 rounded-lg text-xs border ${genderContext === 'male' ? 'bg-neon-light dark:bg-purple-950/40 border-neon text-neon' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>Laki-Laki</button>
                           <button onClick={() => setGenderContext('female')} className={`flex-1 py-2 rounded-lg text-xs border ${genderContext === 'female' ? 'bg-neon-light dark:bg-purple-950/40 border-neon text-neon' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>Perempuan</button>
                        </>
                    )}
                 </div>
            </div>

            {/* 3.3 Age Group (Only if Model) */}
            {modelType !== 'no_model' && (
                <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Usia Model</label>
                    <div className="flex gap-2 mb-2">
                        {['child', 'adult', 'custom'].map((age) => (
                             <button
                                key={age}
                                onClick={() => setAgeGroup(age as FashionAgeGroup)}
                                className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium border transition-all capitalize ${
                                    ageGroup === age
                                    ? 'bg-neon-light dark:bg-purple-950/40 border-neon text-neon'
                                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                {age === 'child' ? 'Anak' : age === 'adult' ? 'Dewasa' : 'Custom'}
                            </button>
                        ))}
                    </div>
                    {ageGroup === 'custom' && (
                         <input 
                            type="text" 
                            value={customAge}
                            onChange={(e) => setCustomAge(e.target.value)}
                            placeholder="Contoh: Remaja 20 tahunan, Lansia..."
                            className="w-full p-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-neon outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                         />
                    )}
                </div>
            )}
        </div>

        {/* Section 4: Visual Style */}
        <div className="space-y-3">
             <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">4. Gaya Visual</label>
             <div className="grid grid-cols-3 gap-2">
                 {['minimalist', 'natural', 'sunset', 'urban', 'elegant', 'custom'].map((style) => (
                     <button
                        key={style}
                        onClick={() => setVisualStyle(style as FashionStyle)}
                        className={`py-2 px-1 rounded-lg text-[10px] font-medium border transition-all capitalize ${
                            visualStyle === style
                            ? 'bg-neon-light dark:bg-purple-950/40 border-neon text-neon'
                            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                     >
                         {style}
                     </button>
                 ))}
             </div>
             {visualStyle === 'custom' && (
                  <input 
                    type="text" 
                    value={customStyle}
                    onChange={(e) => setCustomStyle(e.target.value)}
                    placeholder="Contoh: Cyberpunk, Vintage 90s, Pastel..."
                    className="w-full p-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-neon outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    />
             )}
        </div>

        {/* Section 5: Prompt */}
        <div className="space-y-3">
           <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">5. Prompt (Opsional)</label>
           <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Detail spesifik..."
            className="w-full h-20 p-3 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-neon resize-none bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          />
        </div>

         {/* Section 6: Ratio */}
         <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">6. Aspek Rasio</label>
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
          disabled={isGenerating || !productImage}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-lg shadow-neon/20 ${
            isGenerating || !productImage
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
              <span>Generate Fashion</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FashionPanel;