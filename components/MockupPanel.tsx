import React, { useRef } from 'react';
import { Upload, X, Presentation, Sparkles, Box, FileText, Stamp, Monitor } from 'lucide-react';
import { AspectRatio, UploadedImage, MockupCategory } from '../types';

interface MockupPanelProps {
  designImage: UploadedImage | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  category: MockupCategory;
  setCategory: (val: MockupCategory) => void;
  item: string;
  setItem: (val: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const CATEGORIES: { id: MockupCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'product', label: 'Produk', icon: <Monitor size={16} /> },
  { id: 'packaging', label: 'Kemasan', icon: <Box size={16} /> },
  { id: 'print', label: 'Cetak', icon: <FileText size={16} /> },
  { id: 'branding', label: 'Branding', icon: <Stamp size={16} /> },
];

const ITEMS: Record<MockupCategory, string[]> = {
  product: [
    'T-Shirt (Kaos)',
    'Hoodie',
    'Topi Baseball',
    'Smartphone Screen',
    'Laptop Screen',
  ],
  packaging: [
    'Product Box',
    'Pouch Coffee',
    'Botol Minuman',
    'Kaleng Soda',
    'Paper Cup',
  ],
  print: [
    'Poster di Dinding',
    'Brosur / Flyer',
    'Kartu Nama',
  ],
  branding: [
    'Mug Keramik',
    'Tote Bag',
    'Stempel di Kertas',
    'Logo di Dinding Kantor',
  ],
};

const MockupPanel: React.FC<MockupPanelProps> = ({
  designImage,
  onUpload,
  onRemove,
  category,
  setCategory,
  item,
  setItem,
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

  const handleCategoryChange = (newCat: MockupCategory) => {
    setCategory(newCat);
    setItem(ITEMS[newCat][0]); // Select first item by default
  };

  const ratios = [
    { value: AspectRatio.SQUARE, label: 'Square (1:1)', icon: 'w-6 h-6 border-2 border-current rounded-sm' },
    { value: AspectRatio.WIDE, label: 'Wide (16:9)', icon: 'w-8 h-5 border-2 border-current rounded-sm' },
    { value: AspectRatio.PORTRAIT, label: 'Portrait (9:16)', icon: 'w-5 h-8 border-2 border-current rounded-sm' },
  ];

  return (
    <div className="flex-1 h-full bg-white dark:bg-slate-900 flex flex-col min-w-0 border-r border-gray-200 dark:border-slate-800 transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Mockup Generator</h2>
        <span className="ml-3 text-xs bg-neon-light text-neon px-2 py-1 rounded-full font-bold border border-purple-200/50 dark:bg-purple-950/60 dark:border-purple-800">NEW</span>
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

        {/* Section 1: Upload Design */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Presentation size={16} className="text-neon" />
            1. Upload Desain / Logo
          </label>
          <div className="w-full">
            {designImage ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 h-40 flex items-center justify-center">
                <img src={designImage.previewUrl} alt="design upload" className="h-full w-full object-contain p-4" />
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
                   <Presentation size={24} />
                </div>
                <span className="font-medium text-sm">Pilih File Desain</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 2: Category Selection */}
        <div className="space-y-3">
           <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">2. Pilih Kategori</label>
           <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
             {CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all gap-1 ${
                        category === cat.id
                        ? 'bg-white dark:bg-slate-700 text-neon shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                    {cat.icon}
                    {cat.label}
                </button>
             ))}
           </div>
        </div>

        {/* Section 3: Item Selection */}
        <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">3. Pilih Objek Mockup</label>
            <div className="grid grid-cols-2 gap-2">
                {ITEMS[category].map((itemName) => (
                    <button
                        key={itemName}
                        onClick={() => setItem(itemName)}
                        className={`py-3 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                            item === itemName
                            ? 'bg-neon-light dark:bg-purple-950/40 border-neon text-neon'
                            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600'
                        }`}
                    >
                        {itemName}
                    </button>
                ))}
            </div>
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
          disabled={isGenerating || !designImage}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-lg shadow-neon/20 ${
            isGenerating || !designImage
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
              <Presentation size={20} />
              <span>Generate Mockup</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MockupPanel;