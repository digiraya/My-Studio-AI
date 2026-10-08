import React, { useRef } from 'react';
import { X, Scissors, Image as ImageIcon } from 'lucide-react';
import { UploadedImage } from '../types';

interface RemoveBgPanelProps {
  image: UploadedImage | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const RemoveBgPanel: React.FC<RemoveBgPanelProps> = ({
  image,
  onUpload,
  onRemove,
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

  return (
    <div className="flex-1 h-full bg-white dark:bg-slate-900 flex flex-col min-w-0 border-r border-gray-200 dark:border-slate-800 transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Hapus Background</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        
        {/* Section 1: Upload */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upload Foto</label>
          
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
                   <ImageIcon size={32} />
                </div>
                <span className="font-medium">Pilih Foto</span>
                <span className="text-xs mt-1 text-slate-400">Pastikan subjek utama terlihat jelas</span>
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
           <h3 className="text-sm font-semibold text-neon mb-1">Cara Kerja</h3>
           <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
             AI akan mendeteksi subjek utama dalam foto Anda dan menghapus latar belakangnya secara otomatis. Hasilnya akan berupa file PNG transparan.
           </p>
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
              <Scissors size={20} />
              <span>Hapus Background</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RemoveBgPanel;