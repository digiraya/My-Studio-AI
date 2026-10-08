import React, { useState, useRef } from 'react';
import { ImagePlus, Sparkles, ZoomIn, Trash2 } from 'lucide-react';
import { AspectRatio, UploadedImage } from '../types';

interface FillPanelProps {
  onGenerate: (canvasBase64: string) => void;
  isGenerating: boolean;
}

const FillPanel: React.FC<FillPanelProps> = ({ onGenerate, isGenerating }) => {
  // Image State
  const [image, setImage] = useState<UploadedImage | null>(null);
  
  // Canvas Configuration State
  const [ratio, setRatio] = useState<AspectRatio>(AspectRatio.WIDE);
  const [canvasSize, setCanvasSize] = useState({ w: 1280, h: 720 });
  
  // Manipulation State
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants for ratios
  const PRESET_SIZES: Record<string, { w: number; h: number }> = {
    [AspectRatio.WIDE]: { w: 1280, h: 720 },
    [AspectRatio.SQUARE]: { w: 1024, h: 1024 },
    [AspectRatio.PORTRAIT]: { w: 720, h: 1280 },
    [AspectRatio.LANDSCAPE_4_3]: { w: 1024, h: 768 },
    [AspectRatio.PORTRAIT_3_4]: { w: 768, h: 1024 },
  };

  const handleRatioChange = (r: AspectRatio) => {
    setRatio(r);
    if (r !== AspectRatio.CUSTOM) {
      setCanvasSize(PRESET_SIZES[r]);
    }
    setPosition({ x: 0, y: 0 });
  };

  const handleDimensionChange = (key: 'w' | 'h', value: string) => {
    const num = parseInt(value) || 0;
    setCanvasSize(prev => ({ ...prev, [key]: num }));
    setRatio(AspectRatio.CUSTOM);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage({
        id: '1',
        file,
        previewUrl: URL.createObjectURL(file)
      });
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  // Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!image) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch Logic for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!image) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const prepareGeneration = () => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    canvas.width = canvasSize.w;
    canvas.height = canvasSize.h;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imgEl = new Image();
    imgEl.src = image.previewUrl;
    imgEl.onload = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      const drawWidth = imgEl.width * scale;
      const drawHeight = imgEl.height * scale;
      
      const x = centerX + position.x - (drawWidth / 2);
      const y = centerY + position.y - (drawHeight / 2);

      ctx.drawImage(imgEl, x, y, drawWidth, drawHeight);
      
      const dataUrl = canvas.toDataURL('image/png');
      onGenerate(dataUrl);
    };
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-white dark:bg-slate-900 transition-colors">
      
      {/* Workspace */}
      <div className="flex-1 bg-gray-100 dark:bg-slate-950 relative flex items-center justify-center p-4 md:p-8 select-none overflow-hidden"
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUp}
           onMouseLeave={handleMouseUp}
           onTouchMove={handleTouchMove}
           onTouchEnd={handleMouseUp}
      >
        {!image ? (
          <div className="text-center p-8 md:p-12 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-3xl bg-white/50 dark:bg-slate-900/50 max-w-md w-full animate-in fade-in zoom-in-95">
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-4 text-slate-500 dark:text-slate-400 hover:text-neon transition-colors w-full"
              >
                <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                  <ImagePlus size={48} />
                </div>
                <span className="font-semibold text-lg">Upload Foto untuk Diperluas</span>
                <span className="text-xs opacity-70">Atur posisi & zoom foto setelah upload</span>
              </button>
          </div>
        ) : (
          <div 
            style={{ 
              width: canvasSize.w, 
              height: canvasSize.h,
              maxWidth: '100%',
              maxHeight: '100%',
              aspectRatio: `${canvasSize.w}/${canvasSize.h}`,
            }}
            className="bg-white dark:bg-slate-800 shadow-2xl relative overflow-hidden border border-gray-300 dark:border-slate-700 transition-all duration-300"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#888 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            <div 
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                cursor: isDragging ? 'grabbing' : 'grab',
                transformOrigin: 'center center',
              }}
              className="absolute inset-0 flex items-center justify-center w-full h-full touch-none"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <div className="relative group inline-block">
                <img 
                  src={image.previewUrl} 
                  alt="workspace" 
                  className="max-w-none shadow-lg pointer-events-none"
                  draggable={false}
                />
                <div className="absolute inset-0 border-2 border-neon opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="w-full md:w-[320px] lg:w-[360px] bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-l border-gray-200 dark:border-slate-800 flex flex-col h-full shrink-0 z-10 transition-colors">
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
          <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Generative Fill</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
           <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Ukuran Canvas</label>
            <select 
              value={ratio}
              onChange={(e) => handleRatioChange(e.target.value as AspectRatio)}
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-neon outline-none"
            >
              <option value={AspectRatio.WIDE}>Landscape (16:9)</option>
              <option value={AspectRatio.SQUARE}>Square (1:1)</option>
              <option value={AspectRatio.PORTRAIT}>Portrait (9:16)</option>
              <option value={AspectRatio.LANDSCAPE_4_3}>Landscape (4:3)</option>
              <option value={AspectRatio.PORTRAIT_3_4}>Portrait (3:4)</option>
              <option value={AspectRatio.CUSTOM}>Custom Dimensions</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 mb-1 block uppercase font-bold">Lebar (px)</span>
                <input 
                  type="number" 
                  value={canvasSize.w} 
                  onChange={(e) => handleDimensionChange('w', e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 mb-1 block uppercase font-bold">Tinggi (px)</span>
                <input 
                  type="number" 
                  value={canvasSize.h} 
                  onChange={(e) => handleDimensionChange('h', e.target.value)}
                  className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {image && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
               <div className="flex justify-between items-center">
                 <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                   <ZoomIn size={16} /> Zoom Gambar
                 </label>
                 <span className="text-xs text-neon font-mono font-bold">{(scale * 100).toFixed(0)}%</span>
               </div>
               <input 
                type="range" 
                min="0.2" 
                max="3" 
                step="0.1" 
                value={scale} 
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon"
               />
               <p className="text-[10px] text-slate-400 italic">
                 *Gunakan mouse/sentuhan untuk menggeser posisi gambar di canvas.
               </p>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept="image/*" 
          />
          
          {image && (
            <button 
              onClick={() => setImage(null)}
              className="w-full py-3 rounded-xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2 font-medium transition-colors text-sm"
            >
              <Trash2 size={16} />
              Ganti Foto
            </button>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky bottom-0 z-10">
          <button
            onClick={prepareGeneration}
            disabled={isGenerating || !image}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition-all shadow-lg shadow-neon/20 ${
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
                <span>Generate Fill</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FillPanel;