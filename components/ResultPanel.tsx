import React, { useState } from 'react';
import { Download, Eye, Maximize2, X, Video, Film, Sparkles } from 'lucide-react';
import { GeneratedImage, AppMode, AspectRatio } from '../types';
import { startIdolVideoGeneration, pollIdolVideoStatus, downloadVideoFile } from '../services/geminiService';

interface ResultPanelProps {
  results: GeneratedImage[];
  isGenerating: boolean;
  onCustomAction?: (img: GeneratedImage) => void;
  customActionLabel?: string;
  customActionIcon?: React.ReactNode;
  onGenerateVideoPrompt?: (img: GeneratedImage) => void;
  currentMode?: AppMode;
  aspectRatio?: AspectRatio;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ 
  results, 
  isGenerating,
  onCustomAction,
  customActionLabel,
  customActionIcon,
  onGenerateVideoPrompt,
  currentMode,
  aspectRatio
}) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  // Local Video Generation State
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoStatusMessage, setVideoStatusMessage] = useState('');
  const [videoErrorMessage, setVideoErrorMessage] = useState<string | null>(null);

  const loadingSubMessages = [
    "Menghubungi Veo Video Generator...",
    "Menganalisa komposisi foto...",
    "Mengidentifikasi wajah subjek & idola...",
    "Membuat gerakan mata dan senyuman alami...",
    "Menyempurnakan pencahayaan & aliran udara lambat...",
    "Merender video (proses ini biasanya memakan waktu 1-2 menit)...",
    "Menyelaraskan bingkai transisi...",
    "Hampir siap, menyusun file hasil video...",
    "Mengunduh video animasi..."
  ];

  const handleCreateIdolVideo = async (img: GeneratedImage) => {
    setIsVideoGenerating(true);
    setVideoUrl(null);
    setVideoErrorMessage(null);
    setVideoStatusMessage(loadingSubMessages[0]);

    // Timer to cycle sub-messages
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingSubMessages.length;
      setVideoStatusMessage(loadingSubMessages[messageIndex]);
    }, 6000);

    try {
      // 1. Start generation
      const opName = await startIdolVideoGeneration(img.url, aspectRatio || AspectRatio.PORTRAIT);
      
      // 2. Start polling
      let isDone = false;
      let attempts = 0;
      const maxAttempts = 36; // 36 * 5 seconds = 3 minutes

      while (!isDone && attempts < maxAttempts) {
        attempts++;
        // Wait 5 seconds before checking
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const pollResult = await pollIdolVideoStatus(opName);
        if (pollResult.done) {
          isDone = true;
          if (pollResult.error) {
            throw new Error(pollResult.error);
          }
          if (pollResult.videoUri) {
            setVideoStatusMessage("Menyimpan & mengunduh video...");
            const downloadedUrl = await downloadVideoFile(pollResult.videoUri);
            setVideoUrl(downloadedUrl);
          }
        }
      }

      if (!isDone) {
        throw new Error("Proses video terlalu lama. Silahkan coba lagi.");
      }
    } catch (error: any) {
      console.error(error);
      setVideoErrorMessage(error.message || "Gagal membuat video animasi.");
    } finally {
      clearInterval(messageInterval);
      setIsVideoGenerating(false);
    }
  };

  const handleDownload = (e: React.MouseEvent, img: GeneratedImage) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = img.url;
    link.download = `mystudio-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadVideo = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = url;
    link.download = `idol-video-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const checkerboardStyle = {
    backgroundImage: `
      linear-gradient(45deg, #e5e7eb 25%, transparent 25%), 
      linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), 
      linear-gradient(45deg, transparent 75%, #e5e7eb 75%), 
      linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
  };

  const darkCheckerboardStyle = {
    backgroundImage: `
      linear-gradient(45deg, #1e293b 25%, transparent 25%), 
      linear-gradient(-45deg, #1e293b 25%, transparent 25%), 
      linear-gradient(45deg, transparent 75%, #1e293b 75%), 
      linear-gradient(-45deg, transparent 75%, #1e293b 75%)
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
  };

  return (
    <div className="flex-1 h-full bg-gray-50 dark:bg-slate-950 flex flex-col relative transition-colors">
      <div className="h-14 lg:h-16 flex items-center px-4 lg:px-6 border-b border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shrink-0 lg:static">
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Hasil Preview</h2>
      </div>

      <div className="flex-1 p-4 lg:p-6 no-scrollbar lg:overflow-y-auto w-full font-sans">
        {results.length === 0 && !isGenerating ? (
          <div className="py-12 lg:h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
            <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100 dark:border-slate-800">
              <Eye size={32} className="text-gray-300 dark:text-slate-700" />
            </div>
            <p className="text-lg font-medium">Belum ada hasil</p>
            <p className="text-sm mt-2 max-w-xs text-center">
              Lengkapi form dan klik tombol Generate untuk melihat hasil.
            </p>
          </div>
        ) : isGenerating ? (
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
             {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-2xl bg-white dark:bg-slate-900 animate-pulse flex items-center justify-center border border-gray-200 dark:border-slate-800">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 border-4 border-neon/30 border-t-neon rounded-full animate-spin"></div>
                </div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:gap-4 pb-8">
            {results.map((img) => (
              <div 
                key={img.id} 
                className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-200"
                style={document.documentElement.classList.contains('dark') ? darkCheckerboardStyle : checkerboardStyle}
                onClick={() => { setSelectedImage(img); setVideoUrl(null); }}
              >
                <img 
                  src={img.url} 
                  alt="Generated result" 
                  className="w-full h-full object-contain" 
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 lg:group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  <div className="hidden lg:flex items-center gap-3">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(img); setVideoUrl(null); }}
                        className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-800 dark:text-white hover:text-neon transition-colors transform hover:scale-105"
                    >
                        <Maximize2 size={18} />
                    </button>
                    <button 
                        onClick={(e) => handleDownload(e, img)}
                        className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-800 dark:text-white hover:text-neon transition-colors transform hover:scale-105"
                    >
                        <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative max-w-4xl w-full max-h-[95vh] flex flex-col items-center py-6">
            <button 
              onClick={() => { setSelectedImage(null); setVideoUrl(null); }}
              className="absolute top-2 right-2 lg:-top-12 lg:right-0 p-2 text-white/80 hover:text-white transition-colors bg-black/40 rounded-full lg:bg-transparent"
            >
              <X size={32} />
            </button>
            
            <div className="rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-slate-900 w-auto h-auto max-w-full border border-gray-100 dark:border-slate-800" 
                 style={document.documentElement.classList.contains('dark') ? darkCheckerboardStyle : checkerboardStyle}>
              {videoUrl ? (
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay 
                  loop 
                  className="max-w-full max-h-[60vh] lg:max-h-[70vh] object-contain block mx-auto rounded-2xl" 
                />
              ) : (
                <img 
                  src={selectedImage.url} 
                  alt="Full view" 
                  className="max-w-full max-h-[60vh] lg:max-h-[70vh] object-contain block mx-auto rounded-2xl" 
                />
              )}
            </div>
            
            <div className="mt-6 flex flex-col items-center w-full px-4">
              {videoErrorMessage && (
                <div className="w-full max-w-md p-3 mb-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs text-center">
                  {videoErrorMessage}
                </div>
              )}
              {isVideoGenerating ? (
                <div className="flex flex-col items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl max-w-md w-full animate-pulse">
                  <div className="w-8 h-8 border-4 border-neon border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">Menghidupkan Foto...</p>
                    <p className="text-purple-200 text-xs mt-1 font-mono transition-all duration-300">{videoStatusMessage}</p>
                  </div>
                </div>
              ) : videoUrl ? (
                <div className="flex flex-wrap justify-center gap-3">
                  <button 
                    onClick={(e) => handleDownloadVideo(e, videoUrl)}
                    className="px-6 py-3.5 bg-neon text-white rounded-full font-bold hover:bg-neon-hover transition-all flex items-center gap-2.5 shadow-lg shadow-neon/30 active:scale-95 text-sm"
                  >
                    <Download size={18} />
                    Download Video MP4
                  </button>
                  <button 
                    onClick={() => setVideoUrl(null)}
                    className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-semibold transition-all flex items-center gap-2 text-sm"
                  >
                    Tampilkan Foto Asli
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-3">
                  {currentMode === AppMode.IDOL && (
                    <button
                      onClick={() => handleCreateIdolVideo(selectedImage)}
                      className="px-6 py-3.5 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-600 text-white rounded-full font-bold hover:opacity-95 transition-opacity flex items-center gap-2.5 shadow-lg shadow-purple-500/30 active:scale-95 text-sm group"
                      title="Animasikan gambar menggunakan Veo 3.1"
                    >
                      <Film size={18} className="group-hover:rotate-12 transition-transform" />
                      <span>Buat Foto Hidup (Video AI)</span>
                      <Sparkles size={14} className="text-yellow-200 animate-bounce" />
                    </button>
                  )}
                  <button 
                    onClick={(e) => handleDownload(e, selectedImage)}
                    className="px-6 py-3.5 bg-neon text-white rounded-full font-bold hover:bg-neon-hover transition-all flex items-center gap-2.5 shadow-lg shadow-neon/30 active:scale-95 text-sm"
                  >
                    <Download size={18} />
                    Download Foto HD
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPanel;
