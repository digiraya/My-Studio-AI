import React, { useState, useRef, useEffect } from 'react';
import { ImagePlus, Sparkles, Download, Eraser, RotateCcw, PenTool } from 'lucide-react';
import { generateEditedImage } from '../services/geminiService';

const EditPanel: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(30);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImageSrc(url);
    }
  };

  const clearMask = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const resetImage = () => {
    setImageSrc(null);
    setPrompt('');
    clearMask();
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const canvas = canvasRef.current;
    
    if (canvas) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }
  };

  // Drawing Logic
  const getMousePos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    const { x, y } = getMousePos(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(255, 0, 50, 0.5)'; // Red transparent visual mask
      ctx.lineWidth = brushSize * (canvas!.width / canvas!.clientWidth); // Scale brush size relative to image
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    // Prevent default scrolling on mobile when drawing
    if ('touches' in e) {
        // e.preventDefault(); // Note: React passive events might block this
    }
    const { x, y } = getMousePos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const handleGenerate = async () => {
    if (!imageSrc || !prompt.trim() || !canvasRef.current) return;
    
    setIsProcessing(true);
    setErrorMessage(null);
    
    try {
      let imgBase64 = imageSrc;
      if (!imageSrc.startsWith('data:')) {
        const imgResponse = await fetch(imageSrc);
        const imgBlob = await imgResponse.blob();
        imgBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imgBlob);
        });
      }

      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = canvasRef.current.width;
      maskCanvas.height = canvasRef.current.height;
      const maskCtx = maskCanvas.getContext('2d');
      
      if (maskCtx) {
        maskCtx.fillStyle = 'black';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskCtx.drawImage(canvasRef.current, 0, 0);
        
        const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) { // If alpha > 0
             data[i] = 255;     // R
             data[i + 1] = 255; // G
             data[i + 2] = 255; // B
             data[i + 3] = 255; // Alpha
          }
        }
        maskCtx.putImageData(imageData, 0, 0);
      }
      
      const maskBase64 = maskCanvas.toDataURL('image/png');
      const resultBase64 = await generateEditedImage(imgBase64, maskBase64, prompt);
      
      setImageSrc(resultBase64);
      clearMask();
      setPrompt('');
      
    } catch (error) {
      setErrorMessage("Gagal mengedit gambar. Silahkan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!imageSrc) return;
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `magic-edit-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="flex-1 h-full bg-white dark:bg-slate-900 flex flex-col md:flex-row min-w-0 transition-colors">
      
      {/* LEFT: Canvas Workspace */}
      <div className="flex-1 md:flex-[2] bg-gray-100 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center p-4 md:p-8 select-none min-h-[50vh] md:min-h-0">
        
        {!imageSrc ? (
          <div className="text-center p-10 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-3xl bg-white/50 dark:bg-slate-900/50">
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-4 text-slate-500 dark:text-slate-400 hover:text-neon transition-colors"
              >
                <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                  <ImagePlus size={48} />
                </div>
                <span className="font-semibold text-lg">Upload Foto untuk Magic Edit</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleUpload} 
                className="hidden" 
                accept="image/*" 
              />
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="relative shadow-2xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 inline-block max-w-full max-h-full"
            style={{ fontSize: 0 }} // Remove extra spacing
          >
            {/* Base Image */}
            <img 
              src={imageSrc} 
              alt="Workspace" 
              onLoad={onImageLoad}
              className="max-w-full max-h-[80vh] w-auto h-auto block pointer-events-none select-none"
            />
            
            {/* Drawing Canvas Overlay */}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            />
          </div>
        )}
      </div>

      {/* RIGHT: Control Panel */}
      <div className="w-full md:w-[320px] bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-l border-gray-200 dark:border-slate-800 flex flex-col shrink-0 z-10 h-[50vh] md:h-auto">
        <div className="h-14 md:h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
          <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Magic Edit</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
           
           {imageSrc && (
             <>
               <div className="space-y-3">
                 <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                   <PenTool size={16} /> Ukuran Brush
                 </label>
                 <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] text-slate-500 dark:text-slate-400">S</div>
                   <input 
                     type="range" 
                     min="5" 
                     max="100" 
                     value={brushSize} 
                     onChange={(e) => setBrushSize(parseInt(e.target.value))}
                     className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon"
                   />
                   <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">XL</div>
                 </div>
                 {/* Brush Preview */}
                 <div className="flex justify-center mt-2 h-8 items-center">
                    <div 
                      className="bg-neon/50 rounded-full" 
                      style={{ width: brushSize / 2, height: brushSize / 2 }} // Scaled down for UI preview
                    ></div>
                 </div>
               </div>

               <div className="space-y-3">
                 <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Prompt Edit</label>
                 <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Tandai area lalu ketik apa yang ingin diubah..."
                    className="w-full h-24 p-3 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-neon focus:border-transparent resize-none bg-gray-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
               </div>
               
               <div className="flex gap-2">
                 <button 
                   onClick={clearMask}
                   className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 text-xs md:text-sm font-medium flex items-center justify-center gap-2"
                 >
                   <Eraser size={16} /> Reset Mask
                 </button>
                 <button 
                   onClick={resetImage}
                   className="flex-1 py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs md:text-sm font-medium flex items-center justify-center gap-2"
                 >
                   <RotateCcw size={16} /> Ganti Foto
                 </button>
               </div>
             </>
           )}

           {!imageSrc && (
             <p className="text-sm text-slate-400 text-center mt-10">
               Silahkan upload foto terlebih dahulu untuk mulai mengedit.
             </p>
           )}
        </div>

        <div className="p-4 md:p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-3">
          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-xs text-center">
              {errorMessage}
            </div>
          )}
          <button
            onClick={handleGenerate}
            disabled={isProcessing || !imageSrc || !prompt.trim()}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all shadow-lg shadow-neon/20 ${
              isProcessing || !imageSrc || !prompt.trim()
                ? 'bg-gray-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
                : 'bg-neon hover:bg-neon-hover'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Sedang Mengedit...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate Edit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPanel;