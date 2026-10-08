import React, { useRef } from 'react';
import { Upload, X, UserRound, Sparkles, Star, User } from 'lucide-react';
import { AspectRatio, UploadedImage } from '../types';

interface IdolPanelProps {
  userImage: UploadedImage | null;
  onUploadUser: (file: File) => void;
  onRemoveUser: () => void;
  idolImage: UploadedImage | null;
  onUploadIdol: (file: File) => void;
  onRemoveIdol: () => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const IdolPanel: React.FC<IdolPanelProps> = ({
  userImage,
  onUploadUser,
  onRemoveUser,
  idolImage,
  onUploadIdol,
  onRemoveIdol,
  aspectRatio,
  setAspectRatio,
  onGenerate,
  isGenerating,
}) => {
  const userFileInputRef = useRef<HTMLInputElement>(null);
  const idolFileInputRef = useRef<HTMLInputElement>(null);

  const handleUserFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadUser(e.target.files[0]);
    }
    if (userFileInputRef.current) userFileInputRef.current.value = '';
  };

  const handleIdolFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadIdol(e.target.files[0]);
    }
    if (idolFileInputRef.current) idolFileInputRef.current.value = '';
  };

  const triggerUserUpload = () => userFileInputRef.current?.click();
  const triggerIdolUpload = () => idolFileInputRef.current?.click();

  const ratios = [
    { value: AspectRatio.SQUARE, label: 'Square (1:1)', icon: 'w-6 h-6 border-2 border-current rounded-sm' },
    { value: AspectRatio.WIDE, label: 'Wide (16:9)', icon: 'w-8 h-5 border-2 border-current rounded-sm' },
    { value: AspectRatio.PORTRAIT, label: 'Portrait (9:16)', icon: 'w-5 h-8 border-2 border-current rounded-sm' },
  ];

  return (
    <div className="flex-1 h-full bg-white dark:bg-slate-900 flex flex-col min-w-0 border-r border-gray-200 dark:border-slate-800 transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Photo Bareng Idola</h2>
        <span className="ml-3 text-xs bg-neon-light text-neon px-2 py-1 rounded-full font-bold border border-purple-200/50 dark:bg-purple-950/60 dark:border-purple-800">BETA</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        
        {/* Section 1: Upload User */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <UserRound size={16} className="text-neon" />
            1. Upload Foto Kamu
          </label>
          
          <div className="w-full">
            {userImage ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
                <img src={userImage.previewUrl} alt="upload" className="w-full h-auto max-h-[300px] object-contain bg-gray-50 dark:bg-slate-800" />
                <button 
                  onClick={onRemoveUser}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-neon transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={triggerUserUpload}
                className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50 dark:bg-slate-800"
              >
                <div className="p-3 bg-white dark:bg-slate-700 rounded-full mb-3 shadow-sm">
                   <UserRound size={32} />
                </div>
                <span className="font-medium">Pilih Foto Diri</span>
                <span className="text-xs mt-1 text-slate-400">Pastikan wajah terlihat jelas</span>
              </button>
            )}
          </div>
          <input 
            type="file" 
            ref={userFileInputRef} 
            onChange={handleUserFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {/* Section 2: Upload Idol */}
        <div className="space-y-3">
           <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Star size={16} className="text-neon" />
            2. Upload Foto Idola / Artis
           </label>
           
           <div className="w-full">
            {idolImage ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
                <img src={idolImage.previewUrl} alt="upload" className="w-full h-auto max-h-[300px] object-contain bg-gray-50 dark:bg-slate-800" />
                <button 
                  onClick={onRemoveIdol}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-neon transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={triggerIdolUpload}
                className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50 dark:bg-slate-800"
              >
                <div className="p-3 bg-white dark:bg-slate-700 rounded-full mb-3 shadow-sm">
                   <Star size={32} />
                </div>
                <span className="font-medium">Pilih Foto Artis</span>
                <span className="text-xs mt-1 text-slate-400">Upload foto artis yang ingin diajak foto</span>
              </button>
            )}
          </div>
          <input 
            type="file" 
            ref={idolFileInputRef} 
            onChange={handleIdolFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {/* Section 3: Ratio */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">3. Aspek Rasio</label>
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
          disabled={isGenerating || !userImage || !idolImage}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-lg shadow-neon/20 ${
            isGenerating || !userImage || !idolImage
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
              <span>Generate Photo Bareng</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default IdolPanel;