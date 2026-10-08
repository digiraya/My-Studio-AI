import React, { useRef, useState } from 'react';
import { 
  Upload, X, Camera, Sparkles, User, Box, 
  ArrowRightCircle, UserCircle, Image as ImageIcon,
  UserCog, Shirt, Footprints, Hand as HandIcon
} from 'lucide-react';
import { AspectRatio, UploadedImage, GeneratedImage } from '../types';
import ResultPanel from './ResultPanel';

type UGCTab = 'model' | 'try-on' | 'pose' | 'custom';

interface UGCPanelProps {
  activeTab: UGCTab;
  setActiveTab: (tab: UGCTab) => void;
  modelImage: UploadedImage | null;
  onUploadModelImage: (file: File) => void;
  onRemoveModelImage: () => void;
  modelPrompt: string;
  setModelPrompt: (val: string) => void;
  modelRatio: AspectRatio;
  setModelRatio: (val: AspectRatio) => void;
  tryOnProductImage: UploadedImage | null;
  onUploadTryOnProduct: (file: File) => void;
  onRemoveTryOnProduct: () => void;
  tryOnModelImage: UploadedImage | null;
  onUploadTryOnModel: (file: File) => void;
  onRemoveTryOnModel: () => void;
  tryOnDescription: string;
  setTryOnDescription: (val: string) => void;
  tryOnMode: 'wear' | 'use' | 'hold';
  setTryOnMode: (val: 'wear' | 'use' | 'hold') => void;
  onAnalyzeProduct: () => void;
  isAnalyzingProduct: boolean;
  poseSourceImage: UploadedImage | null;
  onUploadPoseSource: (file: File) => void; 
  onRemovePoseSource: () => void; 
  poseType: 'fashion' | 'non-fashion';
  setPoseType: (val: 'fashion' | 'non-fashion') => void;
  poseCategory: 'head' | 'body' | 'hand' | 'legs';
  setPoseCategory: (val: 'head' | 'body' | 'hand' | 'legs') => void;
  bgType: 'default' | 'custom';
  setBgType: (val: 'default' | 'custom') => void;
  customBgPrompt: string;
  setCustomBgPrompt: (val: string) => void;
  customBgImage: UploadedImage | null;
  onUploadBgImage: (file: File) => void;
  onRemoveBgImage: () => void;
  customImage: UploadedImage | null;
  onUploadCustomImage: (file: File) => void;
  onRemoveCustomImage: () => void;
  customPrompt: string;
  setCustomPrompt: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  results: GeneratedImage[];
  onUseInPose: (img: GeneratedImage) => void;
  onGenerateVideoPrompt?: (img: GeneratedImage) => void; 
}

const UGCPanel: React.FC<UGCPanelProps> = ({
  activeTab,
  setActiveTab,
  modelImage,
  onUploadModelImage,
  onRemoveModelImage,
  modelPrompt,
  setModelPrompt,
  modelRatio,
  setModelRatio,
  tryOnProductImage,
  onUploadTryOnProduct,
  onRemoveTryOnProduct,
  tryOnModelImage,
  onUploadTryOnModel,
  onRemoveTryOnModel,
  tryOnDescription,
  setTryOnDescription,
  tryOnMode,
  setTryOnMode,
  onAnalyzeProduct,
  isAnalyzingProduct,
  poseSourceImage,
  onUploadPoseSource,
  onRemovePoseSource,
  poseType,
  setPoseType,
  poseCategory,
  setPoseCategory,
  bgType,
  setBgType,
  customBgPrompt,
  setCustomBgPrompt,
  customBgImage,
  onUploadBgImage,
  onRemoveBgImage,
  customImage,
  onUploadCustomImage,
  onRemoveCustomImage,
  customPrompt,
  setCustomPrompt,
  onGenerate,
  isGenerating,
  results,
  onUseInPose,
  onGenerateVideoPrompt
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const poseInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const tryOnProductRef = useRef<HTMLInputElement>(null);
  const tryOnModelRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) onUploadModelImage(e.target.files[0]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const handlePoseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) onUploadPoseSource(e.target.files[0]);
    if (poseInputRef.current) poseInputRef.current.value = '';
  };
  const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) onUploadBgImage(e.target.files[0]);
    if (bgInputRef.current) bgInputRef.current.value = '';
  };
  const handleCustomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) onUploadCustomImage(e.target.files[0]);
    if (customInputRef.current) customInputRef.current.value = '';
  };
  const handleTryOnProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) onUploadTryOnProduct(e.target.files[0]);
    if (tryOnProductRef.current) tryOnProductRef.current.value = '';
  };
  const handleTryOnModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) onUploadTryOnModel(e.target.files[0]);
    if (tryOnModelRef.current) tryOnModelRef.current.value = '';
  };

  const triggerUpload = () => fileInputRef.current?.click();
  const triggerPoseUpload = () => poseInputRef.current?.click();
  const triggerBgUpload = () => bgInputRef.current?.click();
  const triggerCustomUpload = () => customInputRef.current?.click();
  const triggerTryOnProductUpload = () => tryOnProductRef.current?.click();
  const triggerTryOnModelUpload = () => tryOnModelRef.current?.click();

  const ratios = [
    { value: AspectRatio.SQUARE, label: 'Square (1:1)', icon: 'w-6 h-6 border-2 border-current rounded-sm' },
    { value: AspectRatio.WIDE, label: 'Wide (16:9)', icon: 'w-8 h-5 border-2 border-current rounded-sm' },
    { value: AspectRatio.PORTRAIT, label: 'Portrait (9:16)', icon: 'w-5 h-8 border-2 border-current rounded-sm' },
  ];

  const tabs = [
    { id: 'model', label: 'Model', icon: <User size={16} /> },
    { id: 'try-on', label: 'Try On', icon: <Shirt size={16} /> },
    { id: 'pose', label: 'Pose', icon: <Camera size={16} /> },
    { id: 'custom', label: 'Custom', icon: <Box size={16} /> },
  ];

  const CategoryButton = ({ id, label, icon }: { id: string, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => setPoseCategory(id as any)}
      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
        poseCategory === id 
        ? 'border-neon bg-neon-light dark:bg-purple-950/40 text-neon' 
        : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600'
      }`}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  const renderInputContent = () => {
    switch (activeTab) {
      case 'model': return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
           <div className="space-y-3">
             <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">1. Prompt / Instruksi</label>
             <textarea value={modelPrompt} onChange={(e) => setModelPrompt(e.target.value)} placeholder="Contoh: Seorang wanita muda sedang duduk di cafe sambil memegang botol minum ini..." className="w-full h-32 p-4 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-neon resize-none bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
           </div>
           <div className="space-y-3">
             <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">2. Upload Produk</label>
             <div className="w-full">
               {modelImage ? (
                 <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 h-40 flex items-center justify-center">
                   <img src={modelImage.previewUrl} alt="product" className="h-full w-full object-contain p-2" />
                   <button onClick={onRemoveModelImage} className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-neon transition-colors"><X size={14} /></button>
                 </div>
               ) : (
                 <button onClick={triggerUpload} className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50 dark:bg-slate-800"><div className="p-3 bg-white dark:bg-slate-700 rounded-full mb-3 shadow-sm"><Upload size={24} /></div><span className="font-medium text-sm">Pilih Foto Produk</span></button>
               )}
               <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
             </div>
           </div>
           <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">3. Aspek Rasio</label>
              <div className="grid grid-cols-3 gap-3">{ratios.map((r) => (<button key={r.value} onClick={() => setModelRatio(r.value)} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${modelRatio === r.value ? 'border-neon bg-neon-light dark:bg-purple-950/40 text-neon' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:border-gray-300 dark:hover:border-slate-600'}`}><div className={`${r.icon} scale-75`}></div><span className="text-[10px] mt-1 font-medium">{r.label}</span></button>))}</div>
            </div>
        </div>
      );
      case 'try-on': return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
           <div className="space-y-3">
             <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">1. Upload Produk (Non-Fashion)</label>
             <div className="w-full">
               {tryOnProductImage ? (<div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 h-40 flex items-center justify-center"><img src={tryOnProductImage.previewUrl} alt="product" className="h-full w-full object-contain p-2" /><button onClick={onRemoveTryOnProduct} className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-neon transition-colors"><X size={14} /></button></div>) : (<button onClick={triggerTryOnProductUpload} className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50 dark:bg-slate-800"><div className="p-3 bg-white dark:bg-slate-700 rounded-full mb-3 shadow-sm"><Box size={24} /></div><span className="font-medium text-sm">Pilih Produk</span></button>)}
               <input type="file" ref={tryOnProductRef} onChange={handleTryOnProductChange} className="hidden" accept="image/*" />
             </div>
             {tryOnProductImage && (<button onClick={onAnalyzeProduct} disabled={isAnalyzingProduct} className="w-full py-2 bg-neon-light dark:bg-purple-950/40 text-neon font-bold text-xs rounded-lg border border-neon/20 hover:bg-neon hover:text-white transition-colors flex items-center justify-center gap-2">{isAnalyzingProduct ? (<><div className="animate-spin h-3 w-3 border-b-2 border-current rounded-full"></div>Menganalisa...</>) : (<><Sparkles size={14} />Generate Description (Analisa AI)</>)}</button>)}
           </div>
           <div className="space-y-3">
             <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">2. Deskripsi Produk</label>
             <textarea value={tryOnDescription} onChange={(e) => setTryOnDescription(e.target.value)} placeholder="Deskripsi produk akan muncul di sini..." className="w-full h-24 p-3 rounded-xl border border-gray-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-neon resize-none bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
           </div>
           <div className="space-y-3">
             <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">3. Upload Model</label>
             <div className="w-full">{tryOnModelImage ? (<div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 h-40 flex items-center justify-center"><img src={tryOnModelImage.previewUrl} alt="model" className="h-full w-full object-contain p-2" /><button onClick={onRemoveTryOnModel} className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-neon transition-colors"><X size={14} /></button></div>) : (<button onClick={triggerTryOnModelUpload} className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50 dark:bg-slate-800"><div className="p-3 bg-white dark:bg-slate-700 rounded-full mb-3 shadow-sm"><User size={24} /></div><span className="font-medium text-sm">Pilih Foto Model</span></button>)}<input type="file" ref={tryOnModelRef} onChange={handleTryOnModelChange} className="hidden" accept="image/*" /></div>
           </div>
           <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">4. Interaksi Model</label>
              <select value={tryOnMode} onChange={(e) => setTryOnMode(e.target.value as any)} className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-neon bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"><option value="wear">Mengenakan (Wear)</option><option value="use">Menggunakan (Use)</option><option value="hold">Memegang (Hold)</option></select>
           </div>
        </div>
      );
      case 'pose': return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
           <div className="space-y-3">
             <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">1. Input Model</label>
              {poseSourceImage ? (<div className="relative group flex items-center gap-4 p-3 border border-neon/30 bg-neon/5 dark:bg-purple-950/30 rounded-xl"><img src={poseSourceImage.previewUrl} alt="Source" className="w-16 h-16 rounded-lg object-cover bg-white" /><div className="flex-1"><p className="text-xs font-bold text-slate-700 dark:text-slate-200">Sumber Terpilih</p><p className="text-[10px] text-slate-500 dark:text-slate-400">Wajah/identitas ini akan digunakan.</p></div><button onClick={onRemovePoseSource} className="p-2 bg-white dark:bg-slate-800 text-slate-400 rounded-full hover:text-red-500 border border-gray-200 dark:border-slate-700"><X size={16} /></button></div>) : (<div className="p-6 text-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 flex flex-col items-center justify-center"><p className="text-sm text-slate-500 mb-3">Belum ada input.</p><div className="flex gap-2 w-full"><button onClick={() => setActiveTab('model')} className="flex-1 py-2 text-xs border border-gray-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:text-neon">Buat di tab Model</button><button onClick={triggerPoseUpload} className="flex-1 py-2 text-xs bg-white dark:bg-slate-700 border border-dashed border-neon text-neon rounded-lg font-medium">+ Upload Manual</button></div></div>)}
             <input type="file" ref={poseInputRef} onChange={handlePoseFileChange} className="hidden" accept="image/*" />
           </div>
           <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">2. Jenis Pose</label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl"><button onClick={() => setPoseType('fashion')} className={`py-2 text-xs font-bold rounded-lg transition-all ${poseType === 'fashion' ? 'bg-white dark:bg-slate-700 shadow-sm text-neon' : 'text-slate-500 dark:text-slate-400'}`}>Fashion</button><button onClick={() => setPoseType('non-fashion')} className={`py-2 text-xs font-bold rounded-lg transition-all ${poseType === 'non-fashion' ? 'bg-white dark:bg-slate-700 shadow-sm text-neon' : 'text-slate-500 dark:text-slate-400'}`}>Non Fashion</button></div>
           </div>
           {poseType === 'fashion' ? (
              <div className="space-y-3">
                 <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">3. Kategori Fashion</label>
                 <div className="grid grid-cols-2 gap-3"><CategoryButton id="head" label="Kepala / Wajah" icon={<UserCircle size={24} />} /><CategoryButton id="body" label="Badan (Full)" icon={<User size={24} />} /><CategoryButton id="hand" label="Tangan / Detail" icon={<HandIcon size={24} />} /><CategoryButton id="legs" label="Kaki / Sepatu" icon={<Footprints size={24} />} /></div>
                 <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg"><p className="text-[10px] text-blue-600 dark:text-blue-300"><b>Note:</b> Kami akan menghasilkan 4 variasi pose otomatis (seperti Close-up, Side Profile, Walking, dll) berdasarkan kategori yang dipilih.</p></div>
              </div>
           ) : (<div className="space-y-3"><label className="text-sm font-semibold text-slate-700 dark:text-slate-300">3. Deskripsi Pose</label><textarea value={customBgPrompt} onChange={(e) => setCustomBgPrompt(e.target.value)} placeholder="Jelaskan pose yang diinginkan..." className="w-full h-24 p-3 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-neon resize-none bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200" /></div>)}
           <div className="space-y-3 border-t border-gray-100 dark:border-slate-800 pt-4"><label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Settingan Background</label><div className="flex gap-4"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="bgType" checked={bgType === 'default'} onChange={() => setBgType('default')} className="accent-neon"/><span className="text-sm text-slate-700 dark:text-slate-300">Bawaan</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="bgType" checked={bgType === 'custom'} onChange={() => setBgType('custom')} className="accent-neon"/><span className="text-sm text-slate-700 dark:text-slate-300">Custom</span></label></div>
           {bgType === 'custom' && (<div className="mt-3 space-y-3 animate-in slide-in-from-top-2"><textarea value={customBgPrompt} onChange={(e) => setCustomBgPrompt(e.target.value)} placeholder="Deskripsikan background..." className="w-full h-20 p-3 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-neon resize-none bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200" /><div className="text-center"><span className="text-xs text-slate-400 block mb-2">- ATAU -</span>{customBgImage ? (<div className="relative h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 w-full group"><img src={customBgImage.previewUrl} alt="bg" className="w-full h-full object-cover" /><button onClick={onRemoveBgImage} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-neon"><X size={12} /></button></div>) : (<button onClick={triggerBgUpload} className="w-full py-2 border border-dashed border-gray-300 dark:border-slate-700 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-neon hover:border-neon flex items-center justify-center gap-2"><ImageIcon size={14} /> Upload Referensi Background</button>)}<input type="file" ref={bgInputRef} onChange={handleBgFileChange} className="hidden" accept="image/*" /></div></div>)}</div>
        </div>
      );
      case 'custom': return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
           <div className="space-y-3">
             <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">1. Upload Foto Model</label>
             <div className="w-full">{customImage ? (<div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 h-40 flex items-center justify-center"><img src={customImage.previewUrl} alt="custom upload" className="h-full w-full object-contain p-2" /><button onClick={onRemoveCustomImage} className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-neon transition-colors"><X size={14} /></button></div>) : (<button onClick={triggerCustomUpload} className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-neon hover:text-neon transition-colors bg-gray-50 dark:bg-slate-800"><div className="p-3 bg-white dark:bg-slate-700 rounded-full mb-3 shadow-sm"><UserCog size={24} /></div><span className="font-medium text-sm">Upload Foto Model</span></button>)}<input type="file" ref={customInputRef} onChange={handleCustomFileChange} className="hidden" accept="image/*" /></div>
           </div>
           <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">2. Deskripsi Pose Baru</label>
              <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="Deskripsikan pose..." className="w-full h-32 p-4 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-neon resize-none bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
           </div>
        </div>
      );
      default: return null;
    }
  };

  const getGenerateLabel = () => {
      if (isGenerating) return "Memproses...";
      switch (activeTab) {
          case 'model': return "Generate UGC";
          case 'try-on': return "Generate Try On";
          case 'pose': return "Generate Pose";
          case 'custom': return "Generate Custom Pose";
          default: return "Generate";
      }
  };

  const isGenerateDisabled = isGenerating || (activeTab === 'model' && (!modelImage || !modelPrompt)) || (activeTab === 'try-on' && (!tryOnProductImage || !tryOnModelImage || !tryOnDescription)) || (activeTab === 'pose' && !poseSourceImage) || (activeTab === 'custom' && (!customImage || !customPrompt));

  return (
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden">
      {/* LEFT: Input Panel - Responsive Scroll */}
      <div className="w-full lg:w-[480px] bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col h-auto lg:h-full z-10 transition-colors overflow-y-auto no-scrollbar shrink-0">
        <div className="h-16 flex items-center px-2 border-b border-gray-100 dark:border-slate-800 shrink-0 sticky top-0 bg-white dark:bg-slate-900 z-20">
           {tabs.map(tab => (
             <button key={tab.id} onClick={() => setActiveTab(tab.id as UGCTab)} className={`flex items-center gap-2 px-4 py-2 mx-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-neon text-white shadow-lg shadow-neon/30' : 'bg-gray-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}>{tab.icon}{tab.label}</button>
           ))}
        </div>
        <div className="flex-1 p-6">
           {renderInputContent()}
        </div>
        <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky bottom-0 z-10">
            <button onClick={onGenerate} disabled={isGenerateDisabled} className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-lg shadow-neon/20 ${isGenerateDisabled ? 'bg-gray-300 dark:bg-slate-700 cursor-not-allowed shadow-none' : 'bg-neon hover:bg-neon-hover'}`}>
                {isGenerating ? (<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>) : (<Sparkles size={20} />)}
                <span>{getGenerateLabel()}</span>
            </button>
        </div>
      </div>
      {/* RIGHT: Result Panel - Stacks below on mobile */}
      <div className="flex-1 min-w-0 bg-gray-50 dark:bg-slate-950 h-auto lg:h-full transition-colors">
         <ResultPanel results={results} isGenerating={isGenerating} onCustomAction={activeTab === 'model' || activeTab === 'try-on' ? onUseInPose : undefined} customActionLabel="Gunakan di Pose" customActionIcon={<ArrowRightCircle size={18} />} onGenerateVideoPrompt={onGenerateVideoPrompt} />
      </div>
    </div>
  );
};

export default UGCPanel;