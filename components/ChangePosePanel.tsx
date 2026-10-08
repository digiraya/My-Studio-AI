import React, { useRef, useState } from 'react';
import { Upload, X, UserCog, Sparkles, User, Move, Smile, Armchair } from 'lucide-react';
import { AspectRatio, UploadedImage } from '../types';

interface ChangePosePanelProps {
  image: UploadedImage | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  poseType: string;
  setPoseType: (val: string) => void;
  customPose: string;
  setCustomPose: (val: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (val: AspectRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const POSE_OPTIONS = [
  { id: 'Berdiri', label: 'Berdiri', icon: <User size={18} /> },
  { id: 'Duduk', label: 'Duduk', icon: <Armchair size={18} /> },
  { id: 'Berjalan', label: 'Berjalan', icon: <Move size={18} /> },
  { id: 'Tertawa', label: 'Tertawa', icon: <Smile size={18} /> },
  { id: 'Custom', label: 'Custom', icon: <UserCog size={18} /> },
];

const ChangePosePanel: React.FC<ChangePosePanelProps> = ({
  image,
  onUpload,
  onRemove,
  poseType,
  setPoseType,
  customPose,
  setCustomPose,
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
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Ubah Pose Model</h2>
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

        {/* Section 1: Upload */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <UserCog size={16} className="text-neon" />
            1. Upload Foto Model
          </label>
          <div className="w-full">
            {image ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 h-48 flex items-center justify-center">
                <img src={image.previewUrl} alt="model upload" className="h-full w-full object-contain p-2" />
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
                   <User size={24} />
                </div>
                <span className="font-medium text-sm">Pilih Foto Model</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 2: Choose Pose */}
        <div className="space-y-3">
           <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">2. Pilih Pose Baru</label>
           <div className="grid grid-cols-2 gap-3">
             {POSE_OPTIONS.map((option) => (
               <button
                 key={option.id}
                 onClick={() => setPoseType(option.id)}
                 className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                   poseType === option.id 
                   ? 'border-neon bg-neon-light dark:bg-purple-950/40 text-neon font-medium' 
                   : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                 }`}
               >
                 {option.icon}
                 <span className="text-sm">{option.label}</span>
               </button>
             ))}
           </div>

           {/* Custom Input */}
           {poseType === 'Custom' && (
             <div className="animate-in fade-in slide-in-from-top-2">
                <textarea
                  value={customPose}
                  onChange={(e) => setCustomPose(e.target.value)}
                  placeholder="Deskripsikan pose yang diinginkan secara detail. Contoh: Melompat kegirangan sambil mengangkat tangan..."
                  className="w-full h-24 p-3 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-neon resize-none bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mt-2"
                />
             </div>
           )}
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
          disabled={isGenerating || !image || (poseType === 'Custom' && !customPose)}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-lg shadow-neon/20 ${
            isGenerating || !image || (poseType === 'Custom' && !customPose)
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
              <span>Generate Pose</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChangePosePanel;