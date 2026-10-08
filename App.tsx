import React, { useState, useEffect } from 'react';
import { Menu, Infinity } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import FillPanel from './components/FillPanel';
import EditPanel from './components/EditPanel';
import RestorePanel from './components/RestorePanel';
import IdolPanel from './components/IdolPanel';
import RemoveBgPanel from './components/RemoveBgPanel';
import ProductPanel from './components/ProductPanel';
import ProductModelPanel from './components/ProductModelPanel';
import FashionPanel from './components/FashionPanel';
import MockupPanel from './components/MockupPanel';
import BannerPanel from './components/BannerPanel';
import POVHandPanel from './components/POVHandPanel';
import WeddingPanel from './components/WeddingPanel';
import ModelPanel from './components/ModelPanel';
import ChangePosePanel from './components/ChangePosePanel';
import UGCPanel from './components/UGCPanel';
import ChatPanel from './components/ChatPanel';
import VideoPromptModal from './components/VideoPromptModal';
import { AppMode, AspectRatio, GeneratedImage, UploadedImage } from './types';
import { 
  generateTryOnImage, 
  analyzeProductFeatures, 
  generateUGCModel, 
  generateUGCPose, 
  generateCustomUGCPose,
  generateImageToVideoPrompt,
  generateExpandedImage,
  generateMergedImage,
  generateRestoredImage,
  generateProductImage,
  generateProductModelImage,
  generateFashionImage,
  generateMockupImage,
  generateBannerImage,
  generateModelImage,
  generatePoseImage,
  generatePOVHandImage,
  generateWeddingImage,
  generateIdolImage,
  generateRemoveBgImage
} from './services/geminiService';

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'input' | 'result'>('input');
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'error' | 'success' } | null>(null);

  const showToast = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Auto focus result tab on mobile when generation starts
  useEffect(() => {
    if (isGenerating) {
      setMobileTab('result');
    }
  }, [isGenerating]);

  // Video Prompt Modal State
  const [videoPromptModalOpen, setVideoPromptModalOpen] = useState(false);
  const [videoPromptLoading, setVideoPromptLoading] = useState(false);
  const [videoPromptText, setVideoPromptText] = useState('');

  // Fusion State
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);

  // Restore State
  const [restoreImage, setRestoreImage] = useState<UploadedImage | null>(null);

  // Idol State
  const [idolImage, setIdolImage] = useState<UploadedImage | null>(null); // Foto User
  const [idolTargetImage, setIdolTargetImage] = useState<UploadedImage | null>(null); // Foto Artis

  // RemoveBg State
  const [removeBgImage, setRemoveBgImage] = useState<UploadedImage | null>(null);

  // Product State
  const [productImage, setProductImage] = useState<UploadedImage | null>(null);
  const [lighting, setLighting] = useState<any>('light');
  const [ambience, setAmbience] = useState<any>('clean');
  const [crowdType, setCrowdType] = useState<any>('indoor');

  // Product Model State
  const [pmModelImage, setPmModelImage] = useState<UploadedImage | null>(null);
  const [pmProductImage, setPmProductImage] = useState<UploadedImage | null>(null);

  // Fashion State
  const [fashionProduct, setFashionProduct] = useState<UploadedImage | null>(null);
  const [fashionLogo, setFashionLogo] = useState<UploadedImage | null>(null);
  const [modelType, setModelType] = useState<any>('human');
  const [genderContext, setGenderContext] = useState<any>('female');
  const [ageGroup, setAgeGroup] = useState<any>('adult');
  const [customAge, setCustomAge] = useState('');
  const [visualStyle, setVisualStyle] = useState<any>('minimalist');
  const [customStyle, setCustomStyle] = useState('');

  // Mockup State
  const [mockupDesign, setMockupDesign] = useState<UploadedImage | null>(null);
  const [mockupCategory, setMockupCategory] = useState<any>('product');
  const [mockupItem, setMockupItem] = useState('');

  // Banner State
  const [bannerImage, setBannerImage] = useState<UploadedImage | null>(null);
  const [bannerText, setBannerText] = useState('');
  const [bannerStyle, setBannerStyle] = useState('');

  // POV Hand State
  const [povImage, setPovImage] = useState<UploadedImage | null>(null);
  const [povDescription, setPovDescription] = useState('');

  // Wedding State
  const [groomImage, setGroomImage] = useState<UploadedImage | null>(null);
  const [brideImage, setBrideImage] = useState<UploadedImage | null>(null);
  const [weddingRef, setWeddingRef] = useState<UploadedImage | null>(null);
  const [eventType, setEventType] = useState('Wedding');
  const [shotType, setShotType] = useState('Medium Shot');
  const [weddingStyle, setWeddingStyle] = useState('Klasik B&W');
  const [location, setLocation] = useState('Pantai');
  const [watermark, setWatermark] = useState('');

  // Realistic Model State
  const [bgType, setBgType] = useState<any>('flat');
  const [modelDesc, setModelDesc] = useState('');

  // Change Pose State
  const [poseImage, setPoseImage] = useState<UploadedImage | null>(null);
  const [poseType, setPoseType] = useState('Berdiri');
  const [customPose, setCustomPose] = useState('');

  // UGC State
  const [ugcActiveTab, setUgcActiveTab] = useState<any>('model');
  const [ugcModelImage, setUgcModelImage] = useState<UploadedImage | null>(null);
  const [ugcModelPrompt, setUgcModelPrompt] = useState('');
  const [ugcModelRatio, setUgcModelRatio] = useState<AspectRatio>(AspectRatio.PORTRAIT);
  
  const [ugcTryOnProductImage, setUgcTryOnProductImage] = useState<UploadedImage | null>(null);
  const [ugcTryOnModelImage, setUgcTryOnModelImage] = useState<UploadedImage | null>(null);
  const [ugcTryOnDescription, setUgcTryOnDescription] = useState('');
  const [ugcTryOnMode, setUgcTryOnMode] = useState<any>('wear');
  const [isAnalyzingProduct, setIsAnalyzingProduct] = useState(false);
  const [ugcResults, setUgcResults] = useState<GeneratedImage[]>([]);

  const [ugcPoseSource, setUgcPoseSource] = useState<UploadedImage | null>(null);
  const [ugcPoseType, setUgcPoseType] = useState<any>('fashion');
  const [ugcPoseTypeCategory, setUgcPoseCategory] = useState<any>('body');
  const [ugcBgType, setUgcBgType] = useState<any>('default');
  const [ugcCustomBgPrompt, setUgcCustomBgPrompt] = useState('');
  const [ugcCustomBgImage, setUgcCustomBgImage] = useState<UploadedImage | null>(null);

  const [ugcCustomImage, setUgcCustomImage] = useState<UploadedImage | null>(null);
  const [ugcCustomPrompt, setUgcCustomPrompt] = useState('');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleUpload = (files: File[], setter: React.Dispatch<React.SetStateAction<UploadedImage[]>>) => {
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setter(prev => [...prev, ...newImages]);
  };

  const handleSingleUpload = (file: File, setter: React.Dispatch<React.SetStateAction<UploadedImage | null>>) => {
    setter({
      id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl: URL.createObjectURL(file)
    });
  };

  const handleAnalyzeTryOnProduct = async () => {
    if (!ugcTryOnProductImage) return;
    setIsAnalyzingProduct(true);
    try {
        const description = await analyzeProductFeatures(ugcTryOnProductImage);
        setUgcTryOnDescription(description);
        showToast("Produk berhasil dianalisa!", "success");
    } catch (e) {
        console.error(e);
        showToast("Gagal menganalisa produk.", "error");
    } finally {
        setIsAnalyzingProduct(false);
    }
  };

  const handleExpandGenerate = async (canvasBase64: string) => {
    setIsGenerating(true);
    setResults([]);
    try {
      const base64Images = await generateExpandedImage(canvasBase64);
      const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
      setResults(newResults);
    } catch (e) {
      showToast("Gagal memperluas foto.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResults([]);
    
    // Mode Penggabungan (Merge)
    if (currentMode === AppMode.MERGE) {
      if (uploadedImages.length === 0 || !prompt.trim()) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateMergedImage(uploadedImages, prompt, aspectRatio);
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
      } catch (e) {
        showToast("Gagal menggabungkan foto.", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Restorasi Foto
    if (currentMode === AppMode.RESTORE) {
      if (!restoreImage) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateRestoredImage(restoreImage, aspectRatio);
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
      } catch (e) {
        showToast("Gagal merestorasi foto.", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Hapus Background
    if (currentMode === AppMode.REMOVE_BG) {
      if (!removeBgImage) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateRemoveBgImage(removeBgImage);
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
      } catch (e) {
        showToast("Gagal menghapus background.", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Photo Produk
    if (currentMode === AppMode.PRODUCT) {
      if (!productImage) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateProductImage(
          productImage,
          lighting,
          ambience,
          crowdType,
          aspectRatio,
          prompt
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
      } catch (e) {
        showToast("Gagal membuat foto produk.", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Produk + Model
    if (currentMode === AppMode.PRODUCT_MODEL) {
      if (!pmModelImage || !pmProductImage) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateProductModelImage(
          pmModelImage,
          pmProductImage,
          aspectRatio,
          prompt
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
      } catch (e) {
        showToast("Gagal membuat foto produk + model.", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Fashion AI
    if (currentMode === AppMode.FASHION) {
      if (!fashionProduct) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateFashionImage(
          fashionProduct,
          fashionLogo,
          modelType,
          genderContext,
          ageGroup,
          customAge,
          visualStyle,
          customStyle,
          aspectRatio,
          prompt
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
      } catch (e) {
        showToast("Gagal membuat foto fashion.", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Mockup Generator
    if (currentMode === AppMode.MOCKUP) {
      if (!mockupDesign) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateMockupImage(
          mockupDesign,
          mockupCategory,
          mockupItem,
          aspectRatio
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
      } catch (e) {
        showToast("Gagal membuat mockup.", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Buat Banner
    if (currentMode === AppMode.BANNER) {
      if (!bannerImage || !bannerText) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateBannerImage(
          bannerImage,
          bannerText,
          bannerStyle,
          aspectRatio
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
      } catch (e) {
        showToast("Gagal membuat banner.", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Model Generator
    if (currentMode === AppMode.REALISTIC_MODEL) {
      if (!modelDesc.trim()) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateModelImage(
          modelDesc,
          bgType,
          aspectRatio
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
      } catch (e) {
        showToast("Gagal membuat model.", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Ubah Pose Model
    if (currentMode === AppMode.CHANGE_POSE) {
      if (!poseImage) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generatePoseImage(
          poseImage,
          poseType,
          customPose,
          aspectRatio
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
      } catch (e) {
        showToast("Gagal mengubah pose.", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode POV Tangan
    if (currentMode === AppMode.POV_HAND) {
      if (!povImage || !povDescription) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generatePOVHandImage(
          povImage,
          povDescription,
          prompt,
          aspectRatio
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
      } catch (e) {
        showToast("Gagal membuat POV Tangan.", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Wedding AI
    if (currentMode === AppMode.WEDDING) {
      if (!groomImage || !brideImage) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateWeddingImage(
          groomImage,
          brideImage,
          weddingRef,
          eventType,
          shotType,
          weddingStyle,
          location,
          watermark,
          aspectRatio
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
      } catch (e) {
        showToast("Gagal membuat foto wedding.", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Photo Bareng Idola
    if (currentMode === AppMode.IDOL) {
      if (!idolImage || !idolTargetImage) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateIdolImage(
          idolImage,
          idolTargetImage,
          aspectRatio
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
      } catch (e) {
        showToast("Gagal membuat foto bersama idola.", "error");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    if (currentMode === AppMode.UGC) {
        setUgcResults([]);
        if (ugcActiveTab === 'try-on') {
            if (!ugcTryOnProductImage || !ugcTryOnModelImage || !ugcTryOnDescription) { setIsGenerating(false); return; }
            try {
                const base64Images = await generateTryOnImage(
                    ugcTryOnProductImage, 
                    ugcTryOnModelImage, 
                    ugcTryOnDescription,
                    ugcTryOnMode,
                    AspectRatio.PORTRAIT
                );
                const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
                setUgcResults(newResults);
                setResults(newResults);
            } catch (e) { showToast("Gagal membuat Try On.", "error"); } finally { setIsGenerating(false); }
        } else if (ugcActiveTab === 'model') {
            if (!ugcModelImage || !ugcModelPrompt) { setIsGenerating(false); return; }
            try {
                const base64Images = await generateUGCModel(ugcModelImage, ugcModelPrompt, ugcModelRatio);
                const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
                setUgcResults(newResults);
                setResults(newResults);
            } catch (e) { showToast("Gagal membuat Model UGC.", "error"); } finally { setIsGenerating(false); }
        } else if (ugcActiveTab === 'pose') {
            if (!ugcPoseSource) { setIsGenerating(false); return; }
            try {
                const base64Images = await generateUGCPose(ugcPoseSource, ugcPoseType, ugcPoseTypeCategory, ugcBgType, ugcCustomBgPrompt, ugcCustomBgImage);
                const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
                setUgcResults(newResults);
                setResults(newResults);
            } catch (e) { showToast("Gagal membuat Pose UGC.", "error"); } finally { setIsGenerating(false); }
        } else if (ugcActiveTab === 'custom') {
            if (!ugcCustomImage || !ugcCustomPrompt) { setIsGenerating(false); return; }
            try {
                const base64Images = await generateCustomUGCPose(ugcCustomImage, ugcCustomPrompt);
                const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
                setUgcResults(newResults);
                setResults(newResults);
            } catch (e) { showToast("Gagal membuat Custom Pose.", "error"); } finally { setIsGenerating(false); }
        }
        return;
    }

    // Default placeholder for other modes
    setTimeout(() => {
        setIsGenerating(false);
    }, 2000);
  };

  const handleUseInPose = async (img: GeneratedImage) => {
    try {
      let file: File;
      if (img.url.startsWith('data:')) {
        const parts = img.url.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        file = new File([u8arr], "ugc_result.png", { type: mime });
      } else {
        const res = await fetch(img.url);
        const blob = await res.blob();
        file = new File([blob], "ugc_result.png", { type: blob.type || "image/png" });
      }

      const uploadedImg: UploadedImage = {
        id: img.id,
        file: file,
        previewUrl: img.url
      };
      setUgcPoseSource(uploadedImg);
      setUgcActiveTab('pose');
      showToast("Foto berhasil dimuat ke tab Pose!", "success");
    } catch (e) {
      console.error(e);
      showToast("Gagal memuat gambar ke pose.", "error");
    }
  };

  const handleVideoPromptGeneration = async (img: GeneratedImage) => {
     setVideoPromptModalOpen(true);
     setVideoPromptLoading(true);
     setVideoPromptText('');
     try {
         const prompt = await generateImageToVideoPrompt(img.url);
         setVideoPromptText(prompt);
     } catch (e) { 
         setVideoPromptText("Maaf, gagal membuat prompt video. Silahkan coba lagi atau ganti gambar."); 
     } finally {
         setVideoPromptLoading(false);
     }
  };

  const handleSwitchMode = (mode: AppMode) => {
    setCurrentMode(mode);
    setIsSidebarOpen(false); // Auto close on mobile after selection
    setMobileTab('input'); // Reset to input tab when switching tools
  };

  const renderPanel = () => {
    switch (currentMode) {
      case AppMode.DASHBOARD: return <Dashboard onSelectMode={handleSwitchMode} />;
      case AppMode.MERGE: return <InputPanel uploadedImages={uploadedImages} onUpload={(files) => handleUpload(files, setUploadedImages)} onRemoveImage={(id) => setUploadedImages(prev => prev.filter(img => img.id !== id))} prompt={prompt} setPrompt={setPrompt} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.EXPAND: return <FillPanel onGenerate={handleExpandGenerate} isGenerating={isGenerating} />;
      case AppMode.EDIT: return <EditPanel />;
      case AppMode.RESTORE: return <RestorePanel image={restoreImage} onUpload={(f) => handleSingleUpload(f, setRestoreImage)} onRemove={() => setRestoreImage(null)} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.IDOL: return <IdolPanel userImage={idolImage} onUploadUser={(f) => handleSingleUpload(f, setIdolImage)} onRemoveUser={() => setIdolImage(null)} idolImage={idolTargetImage} onUploadIdol={(f) => handleSingleUpload(f, setIdolTargetImage)} onRemoveIdol={() => setIdolTargetImage(null)} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.REMOVE_BG: return <RemoveBgPanel image={removeBgImage} onUpload={(f) => handleSingleUpload(f, setRemoveBgImage)} onRemove={() => setRemoveBgImage(null)} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.PRODUCT: return <ProductPanel image={productImage} onUpload={(f) => handleSingleUpload(f, setProductImage)} onRemove={() => setProductImage(null)} lighting={lighting} setLighting={setLighting} ambience={ambience} setAmbience={setAmbience} crowdType={crowdType} setCrowdType={setCrowdType} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.PRODUCT_MODEL: return <ProductModelPanel modelImage={pmModelImage} productImage={pmProductImage} onUpload={(t, f) => t === 'model' ? handleSingleUpload(f, setPmModelImage) : handleSingleUpload(f, setPmProductImage)} onRemove={(t) => t === 'model' ? setPmModelImage(null) : setPmProductImage(null)} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.FASHION: return <FashionPanel productImage={fashionProduct} logoImage={fashionLogo} onUpload={(t, f) => t === 'product' ? handleSingleUpload(f, setFashionProduct) : handleSingleUpload(f, setFashionLogo)} onRemove={(t) => t === 'product' ? setFashionProduct(null) : setFashionLogo(null)} modelType={modelType} setModelType={setModelType} genderContext={genderContext} setGenderContext={setGenderContext} ageGroup={ageGroup} setAgeGroup={setAgeGroup} customAge={customAge} setCustomAge={setCustomAge} visualStyle={visualStyle} setVisualStyle={setVisualStyle} customStyle={customStyle} setCustomStyle={setCustomStyle} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.MOCKUP: return <MockupPanel designImage={mockupDesign} onUpload={(f) => handleSingleUpload(f, setMockupDesign)} onRemove={() => setMockupDesign(null)} category={mockupCategory} setCategory={setMockupCategory} item={mockupItem} setItem={setMockupItem} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.BANNER: return <BannerPanel image={bannerImage} onUpload={(f) => handleSingleUpload(f, setBannerImage)} onRemove={() => setBannerImage(null)} text={bannerText} setText={setBannerText} style={bannerStyle} setStyle={setBannerStyle} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.POV_HAND: return <POVHandPanel image={povImage} onUpload={(f) => handleSingleUpload(f, setPovImage)} onRemove={() => setPovImage(null)} description={povDescription} setDescription={setPovDescription} prompt={prompt} setPrompt={setPrompt} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.WEDDING: return <WeddingPanel groomImage={groomImage} brideImage={brideImage} refImage={weddingRef} onUpload={(t, f) => t === 'groom' ? handleSingleUpload(f, setGroomImage) : t === 'bride' ? handleSingleUpload(f, setBrideImage) : handleSingleUpload(f, setWeddingRef)} onRemove={(t) => t === 'groom' ? setGroomImage(null) : t === 'bride' ? setBrideImage(null) : setWeddingRef(null)} eventType={eventType} setEventType={setEventType} shotType={shotType} setShotType={setShotType} style={weddingStyle} setStyle={setWeddingStyle} location={location} setLocation={setLocation} watermark={watermark} setWatermark={setWatermark} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.REALISTIC_MODEL: return <ModelPanel backgroundType={bgType} setBackgroundType={setBgType} description={modelDesc} setDescription={setModelDesc} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.CHANGE_POSE: return <ChangePosePanel image={poseImage} onUpload={(f) => handleSingleUpload(f, setPoseImage)} onRemove={() => setPoseImage(null)} poseType={poseType} setPoseType={setPoseType} customPose={customPose} setCustomPose={setCustomPose} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.CHAT: return <ChatPanel />; // Add ChatPanel here
      // Corrected state variables for UGC custom image
      case AppMode.UGC: return <UGCPanel activeTab={ugcActiveTab} setActiveTab={setUgcActiveTab} modelImage={ugcModelImage} onUploadModelImage={(f) => handleSingleUpload(f, setUgcModelImage)} onRemoveModelImage={() => setUgcModelImage(null)} modelPrompt={ugcModelPrompt} setModelPrompt={setUgcModelPrompt} modelRatio={ugcModelRatio} setModelRatio={setUgcModelRatio} tryOnProductImage={ugcTryOnProductImage} onUploadTryOnProduct={(f) => handleSingleUpload(f, setUgcTryOnProductImage)} onRemoveTryOnProduct={() => setUgcTryOnProductImage(null)} tryOnModelImage={ugcTryOnModelImage} onUploadTryOnModel={(f) => handleSingleUpload(f, setUgcTryOnModelImage)} onRemoveTryOnModel={() => setUgcTryOnModelImage(null)} tryOnDescription={ugcTryOnDescription} setTryOnDescription={setUgcTryOnDescription} tryOnMode={ugcTryOnMode} setTryOnMode={setUgcTryOnMode} onAnalyzeProduct={handleAnalyzeTryOnProduct} isAnalyzingProduct={isAnalyzingProduct} poseSourceImage={ugcPoseSource} onUploadPoseSource={(f) => handleSingleUpload(f, setUgcPoseSource)} onRemovePoseSource={() => setUgcPoseSource(null)} poseType={ugcPoseType} setPoseType={setUgcPoseType} poseCategory={ugcPoseTypeCategory} setPoseCategory={setUgcPoseCategory} bgType={ugcBgType} setBgType={setUgcBgType} customBgPrompt={ugcCustomBgPrompt} setCustomBgPrompt={setUgcCustomBgPrompt} customBgImage={ugcCustomBgImage} onUploadBgImage={(f) => handleSingleUpload(f, setUgcCustomBgImage)} onRemoveBgImage={() => setUgcCustomBgImage(null)} customImage={ugcCustomImage} onUploadCustomImage={(f) => handleSingleUpload(f, setUgcCustomImage)} onRemoveCustomImage={() => setUgcCustomImage(null)} customPrompt={ugcCustomPrompt} setCustomPrompt={setUgcCustomPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} results={ugcResults} onUseInPose={handleUseInPose} onGenerateVideoPrompt={handleVideoPromptGeneration} />;
      default: return <div>Mode not found</div>;
    }
  };

  const showSharedResultPanel = currentMode !== AppMode.UGC && currentMode !== AppMode.DASHBOARD && currentMode !== AppMode.EDIT && currentMode !== AppMode.CHAT; // Hide ResultPanel for Chat

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      <Sidebar 
        currentMode={currentMode} 
        onSwitchMode={handleSwitchMode} 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Top Header */}
        <header className="lg:hidden h-14 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 z-30">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-neon transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-1.5">
               <div className="w-7 h-7 bg-neon rounded-lg flex items-center justify-center text-white">
                <Infinity size={18} strokeWidth={2.5} />
               </div>
               <span className="font-bold text-sm tracking-tight">My Studio AI</span>
            </div>
          </div>
        </header>

        {/* Premium Mobile Tab Switch Bar for Tools */}
        {showSharedResultPanel && (
          <div className="lg:hidden px-4 py-2 bg-gray-50 dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800/80 shrink-0 z-20">
            <div className="w-full h-10 bg-slate-100 dark:bg-slate-900 rounded-xl p-1 flex gap-1 shadow-sm">
              <button
                onClick={() => setMobileTab('input')}
                className={`flex-1 h-full rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  mobileTab === 'input'
                    ? 'bg-white dark:bg-slate-800 text-neon shadow-sm border-b border-neon/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <span> Form Input</span>
              </button>
              <button
                onClick={() => setMobileTab('result')}
                className={`flex-1 h-full rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 relative ${
                  mobileTab === 'result'
                    ? 'bg-white dark:bg-slate-800 text-neon shadow-sm border-b border-neon/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <span> Hasil Desain</span>
                {results.length > 0 && (
                  <span className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse" />
                )}
                {isGenerating && (
                  <span className="w-1.5 h-1.5 bg-neon rounded-full animate-ping" />
                )}
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 h-full overflow-y-auto no-scrollbar bg-white dark:bg-slate-900">
             <div className="flex flex-col min-h-full">
                {/* Inputs block: hidden on mobile if Result Tab is checked */}
                <div className={`flex-1 shrink-0 ${showSharedResultPanel && mobileTab !== 'input' ? 'hidden lg:block' : ''}`}>
                  {renderPanel()}
                </div>
                
                {/* Result Panel (Mobile Only - Visible when Result Tab is checked) */}
                {showSharedResultPanel && mobileTab === 'result' && (
                  <div className="lg:hidden w-full flex-1 bg-gray-50 dark:bg-slate-950">
                    <ResultPanel results={results} isGenerating={isGenerating} currentMode={currentMode} aspectRatio={aspectRatio} />
                  </div>
                )}
             </div>
          </div>

          {/* Result Panel Sidebar (Desktop Only) */}
          {showSharedResultPanel && (
              <div className="hidden lg:block w-[400px] xl:w-[450px] border-l border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 h-full overflow-hidden shrink-0">
                <ResultPanel results={results} isGenerating={isGenerating} currentMode={currentMode} aspectRatio={aspectRatio} />
              </div>
          )}
        </div>
      </div>

      <VideoPromptModal isOpen={videoPromptModalOpen} onClose={() => setVideoPromptModalOpen(false)} isLoading={videoPromptLoading} promptText={videoPromptText} />

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 transition-all text-sm font-medium border backdrop-blur-md ${
          toast.type === 'error'
            ? 'bg-rose-600/95 text-white border-rose-500 shadow-rose-950/20'
            : toast.type === 'success'
            ? 'bg-emerald-600/95 text-white border-emerald-500 shadow-emerald-950/20'
            : 'bg-slate-900/95 text-white border-slate-700 shadow-black/20'
        }`}>
          <span>{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors ml-1 text-base leading-none"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default App;