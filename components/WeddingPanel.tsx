import React, { useRef, useState } from 'react';
import { Upload, X, Heart, User, Image as ImageIcon, Camera, MapPin, Palette, Sparkles, Type } from 'lucide-react';
import { AspectRatio, UploadedImage } from '../types';

interface WeddingPanelProps {
  groomImage: UploadedImage | null;
  brideImage: UploadedImage | null;
  refImage: UploadedImage | null;
  onUpload: (type: 'groom' | 'bride' | 'ref', file: File) => void;
  onRemove: (type: 'groom' | 'bride' | 'ref') => void;
  eventType: string;
  setEventType: (val: string) => void;
  shotType: string;
  setShotType: (val: string) => void;
  style: string;
  setStyle: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  watermark: string;
  setWatermark: (val: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const WeddingPanel: React.FC<WeddingPanelProps> = ({
  groomImage,
  brideImage,
  refImage,
  onUpload,
  onRemove,
  eventType,
  setEventType,
  shotType,
  setShotType,
  style,
  setStyle,
  location,
  setLocation,
  watermark,
  setWatermark,
  aspectRatio,
  setAspectRatio,
  onGenerate,
  isGenerating,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadType, setActiveUploadType] = useState<'groom' | 'bride' | 'ref'>('groom');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(activeUploadType, e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerUpload = (type: 'groom' | 'bride' | 'ref') => {
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
    <div className="flex-1 h-full bg-white dark:bg-slate-900 flex flex-col min-w-0 border-r border-gray-200 dark:border-slate-800 transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Wedding AI</h2>
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

        {/* Section 1: Couple Upload */}
        <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <User size={16} className="text-neon" />
                1. Upload Foto Pasangan
            </label>
            <div className="p-3 bg-neon-light dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-900/60 rounded-lg text-xs text-slate-600 dark:text-slate-400 mb-2">
                Tips: Gunakan foto close-up, pencahayaan terang, dan wajah terlihat jelas (tidak blur) untuk hasil maksimal.
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Groom */}
                <div className="w-full">
                    {groomImage ? (
                    <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 h-32 flex items-center justify-center">
                        <img src={groomImage.previewUrl} alt="groom" className="h-full w-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 text-center">Pria</div>
                        <button 
                        onClick={() => onRemove('groom')}
                        className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-neon transition-colors"
                        >
                        <X size={12} />
                        </button>
                    </div>
                    ) : (
                    <button 
                        onClick={() => triggerUpload('groom')}
                        className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50 dark:bg-slate-800"
                    >
                        <User size={20} />
                        <span className="font-medium text-xs mt-1">Foto Pria</span>
                    </button>
                    )}
                </div>

                {/* Bride */}
                <div className="w-full">
                    {brideImage ? (
                    <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 h-32 flex items-center justify-center">
                        <img src={brideImage.previewUrl} alt="bride" className="h-full w-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 text-center">Wanita</div>
                        <button 
                        onClick={() => onRemove('bride')}
                        className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-neon transition-colors"
                        >
                        <X size={12} />
                        </button>
                    </div>
                    ) : (
                    <button 
                        onClick={() => triggerUpload('bride')}
                        className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50 dark:bg-slate-800"
                    >
                        <User size={20} />
                        <span className="font-medium text-xs mt-1">Foto Wanita</span>
                    </button>
                    )}
                </div>
            </div>
        </div>

        {/* Section 2: Event Details */}
        <div className="space-y-4 border-t border-gray-100 dark:border-slate-800 pt-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Detail Acara & Kamera</h3>
            
            {/* Event Type */}
            <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Tipe Acara</label>
                <div className="flex gap-2">
                    {['Pre Wedding', 'Wedding'].map((type) => (
                         <button
                            key={type}
                            onClick={() => setEventType(type)}
                            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                                eventType === type
                                ? 'bg-neon-light dark:bg-purple-950/40 border-neon text-neon'
                                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Shot Type */}
            <div>
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                    <Camera size={12} /> Setting Kamera (Shot)
                 </label>
                 <select 
                    value={shotType}
                    onChange={(e) => setShotType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-neon"
                 >
                    <option value="Medium Shot">Medium Shot (Standar)</option>
                    <option value="Extreme Close Up">Extreme Close Up (Detail Wajah)</option>
                    <option value="Close Up">Close Up (Wajah & Bahu)</option>
                    <option value="Medium Close Up">Medium Close Up (Dada ke Atas)</option>
                    <option value="Medium Long Shot">Medium Long Shot (Lutut ke Atas)</option>
                    <option value="Wide Shot">Wide Shot (Full Body + Background)</option>
                    <option value="Extreme Wide Shot">Extreme Wide Shot (Pemandangan Luas)</option>
                 </select>
            </div>
        </div>

        {/* Section 3: Style & Location */}
        <div className="space-y-4 border-t border-gray-100 dark:border-slate-800 pt-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Gaya & Lokasi</h3>

            {/* Style */}
             <div>
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                    <Palette size={12} /> Gaya Photo
                 </label>
                 <div className="grid grid-cols-2 gap-2">
                    {['Klasik B&W', 'Bohemian', 'Urban', 'Fantasy'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStyle(s)}
                            className={`py-2 px-2 rounded-lg text-xs font-medium border text-left transition-all ${
                                style === s
                                ? 'bg-neon-light dark:bg-purple-950/40 border-neon text-neon'
                                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                 </div>
            </div>

            {/* Location */}
            <div>
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                    <MapPin size={12} /> Lokasi
                 </label>
                 <div className="grid grid-cols-4 gap-2">
                    {['Pantai', 'Gunung', 'Kota', 'Hutan'].map((l) => (
                        <button
                            key={l}
                            onClick={() => setLocation(l)}
                            className={`py-2 px-1 rounded-lg text-[10px] font-medium border transition-all ${
                                location === l
                                ? 'bg-neon-light dark:bg-purple-950/40 border-neon text-neon'
                                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                            }`}
                        >
                            {l}
                        </button>
                    ))}
                 </div>
            </div>
        </div>

        {/* Section 4: Optional Inputs */}
        <div className="space-y-4 border-t border-gray-100 dark:border-slate-800 pt-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Opsional</h3>
            
            {/* Reference Image */}
            <div className="flex items-center gap-3">
                <div className="w-16 h-16 shrink-0">
                    {refImage ? (
                         <div className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 h-full w-full">
                            <img src={refImage.previewUrl} alt="ref" className="h-full w-full object-cover" />
                            <button 
                                onClick={() => onRemove('ref')}
                                className="absolute top-0.5 right-0.5 p-0.5 bg-black/50 text-white rounded-full hover:bg-neon transition-colors"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => triggerUpload('ref')}
                            className="w-full h-full rounded-lg border border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50 dark:bg-slate-800"
                        >
                            <ImageIcon size={16} />
                            <span className="text-[8px] mt-1">Ref Gaya</span>
                        </button>
                    )}
                </div>
                <div className="flex-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block flex items-center gap-1">
                        <Type size={12} /> Watermark
                    </label>
                    <input 
                        type="text" 
                        value={watermark}
                        onChange={(e) => setWatermark(e.target.value)}
                        placeholder="Contoh: Andi & Budi Wedding"
                        className="w-full p-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-neon outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    />
                </div>
            </div>
        </div>

         {/* Section 5: Ratio */}
         <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">5. Aspek Rasio</label>
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

      <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !groomImage || !brideImage}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-lg shadow-neon/20 ${
            isGenerating || !groomImage || !brideImage
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
              <Heart size={20} />
              <span>Generate Wedding</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WeddingPanel;