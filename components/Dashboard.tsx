import React, { useState, useMemo } from 'react';
import { 
  Search, Wand2, Layers, Expand, Scissors, ShoppingBag, 
  Presentation, Megaphone, Heart, Star, Hand, UserCheck, Shirt, 
  History, Smile, Palette, LayoutGrid, Home, AlertCircle, UserCog,
  Camera
} from 'lucide-react';
import { AppMode } from '../types';

interface DashboardProps {
  onSelectMode: (mode: AppMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectMode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const QUICK_LINKS = [
    { mode: AppMode.UGC, label: "UGC Studio", icon: <Camera size={24} />, color: "bg-teal-500" },
    { mode: AppMode.REMOVE_BG, label: "Hapus BG", icon: <Scissors size={24} />, color: "bg-rose-500" },
    { mode: AppMode.PRODUCT, label: "Produk", icon: <ShoppingBag size={24} />, color: "bg-orange-500" },
    { mode: AppMode.EDIT, label: "Magic Edit", icon: <Wand2 size={24} />, color: "bg-purple-500" },
    { mode: AppMode.WEDDING, label: "Wedding", icon: <Heart size={24} />, color: "bg-pink-500" },
    { mode: AppMode.MOCKUP, label: "Mockup", icon: <Presentation size={24} />, color: "bg-blue-500" },
    { mode: AppMode.FASHION, label: "Fashion", icon: <Shirt size={24} />, color: "bg-emerald-500" },
  ];

  const ALL_SECTIONS = [
    {
      title: "Essential Tools",
      items: [
        { mode: AppMode.REMOVE_BG, label: "Hapus Background", desc: "Hapus latar belakang instan secara otomatis", icon: <Scissors className="text-rose-500" />, bg: "bg-rose-50 dark:bg-purple-950/40" },
        { mode: AppMode.EDIT, label: "Magic Edit", desc: "Ubah objek foto dengan instruksi teks cerdas", icon: <Wand2 className="text-purple-500" />, bg: "bg-purple-50 dark:bg-purple-950/30" },
        { mode: AppMode.EXPAND, label: "Perluas Foto", desc: "Perluas area foto dengan AI Generative Fill", icon: <Expand className="text-blue-500" />, bg: "bg-blue-50 dark:bg-blue-950/30" },
        { mode: AppMode.MERGE, label: "Penggabungan", desc: "Gabungkan beberapa foto menjadi satu scene epik", icon: <Layers className="text-indigo-500" />, bg: "bg-indigo-50 dark:bg-indigo-950/30" },
        { mode: AppMode.RESTORE, label: "Restorasi Foto", desc: "Perbaiki foto lama, buram, dan rusak", icon: <History className="text-indigo-500" />, bg: "bg-indigo-50 dark:bg-indigo-950/30" },
      ]
    },
    {
      title: "Business Suite",
      items: [
        { mode: AppMode.UGC, label: "UGC Studio", desc: "Buat konten lifestyle viral dengan produk Anda", icon: <Camera className="text-teal-500" />, bg: "bg-teal-50 dark:bg-teal-950/30" },
        { mode: AppMode.PRODUCT, label: "Photo Produk", desc: "Buat foto produk katalog profesional instan", icon: <ShoppingBag className="text-orange-500" />, bg: "bg-orange-50 dark:bg-orange-950/30" },
        { mode: AppMode.BANNER, label: "Buat Banner", desc: "Buat desain iklan menarik dari produk Anda", icon: <Megaphone className="text-red-500" />, bg: "bg-red-50 dark:bg-red-950/30" },
        { mode: AppMode.MOCKUP, label: "Mockup Generator", desc: "Tempel desain logo ke objek 3D secara realistis", icon: <Presentation className="text-blue-500" />, bg: "bg-blue-50 dark:bg-blue-950/30" },
        { mode: AppMode.PRODUCT_MODEL, label: "Produk + Model", desc: "Generate model manusia memegang produk Anda", icon: <UserCheck className="text-emerald-500" />, bg: "bg-emerald-50 dark:bg-emerald-950/30" },
        { mode: AppMode.FASHION, label: "Fashion AI", desc: "Ubah model pakaian menjadi foto editorial mewah", icon: <Shirt className="text-emerald-500" />, bg: "bg-emerald-50 dark:bg-emerald-950/30" },
      ]
    },
    {
      title: "Creative Lab",
      items: [
        { mode: AppMode.WEDDING, label: "Wedding AI", desc: "Ubah foto biasa jadi photo wedding mewah", icon: <Heart className="text-pink-500" />, bg: "bg-pink-50 dark:bg-pink-950/30" },
        { mode: AppMode.POV_HAND, label: "POV Tangan", desc: "Tampilkan produk di genggaman tangan estetik", icon: <Hand className="text-amber-500" />, bg: "bg-amber-50 dark:bg-amber-950/30" },
        { mode: AppMode.IDOL, label: "Photo Bareng Idola", desc: "Wujudkan mimpi foto bareng artis idola", icon: <Star className="text-yellow-500" />, bg: "bg-yellow-50 dark:bg-yellow-950/30" },
        { mode: AppMode.REALISTIC_MODEL, label: "Model Generator", desc: "Ciptakan model manusia baru untuk promosi", icon: <Smile className="text-teal-500" />, bg: "bg-teal-50 dark:bg-teal-950/30" },
        { mode: AppMode.CHANGE_POSE, label: "Ubah Pose Model", desc: "Ubah posisi tubuh model secara realistis", icon: <UserCog className="text-blue-400" />, bg: "bg-blue-50 dark:bg-blue-950/30" },
      ]
    }
  ];

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return ALL_SECTIONS;
    const query = searchQuery.toLowerCase();
    return ALL_SECTIONS.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.label.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query)
      )
    })).filter(section => section.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 scroll-smooth transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative pt-12 pb-16 px-6 lg:px-12 text-center overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950 -z-10 rounded-[100%] blur-3xl opacity-50"></div>
        
        <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8">
          Apa yang ingin Anda <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon via-purple-500 to-blue-500">ciptakan</span> hari ini?
        </h1>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative mb-12">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={22} strokeWidth={2.5} />
          </div>
          <input 
            type="text" 
            placeholder="Cari fitur (misal: hapus background, foto produk...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 pl-14 pr-6 rounded-2xl border-2 border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none focus:ring-4 focus:ring-neon/10 focus:border-neon outline-none transition-all text-slate-800 dark:text-slate-100 text-lg font-medium placeholder:text-slate-400"
          />
          {searchQuery && (
            <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
            >
                <AlertCircle size={20} className="rotate-45" />
            </button>
          )}
        </div>

        {/* Quick Link Icons */}
        {!searchQuery && (
          <div className="flex items-center justify-start lg:justify-center gap-6 lg:gap-10 overflow-x-auto pb-4 lg:pb-0 no-scrollbar px-4">
            {QUICK_LINKS.map((link) => (
              <button 
                key={link.mode}
                onClick={() => onSelectMode(link.mode)}
                className="flex flex-col items-center group shrink-0"
              >
                  <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full ${link.color} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-active:scale-95 mb-2`}>
                    {link.icon}
                  </div>
                  <span className="text-[11px] lg:text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{link.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Feature Sections */}
      <div className="px-6 lg:px-12 pb-20 space-y-12 min-h-[400px]">
        {filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <div key={section.title} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                {!searchQuery && <button className="text-neon text-sm font-bold hover:underline">Lihat Semua</button>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.items.map((item) => (
                  <button 
                    key={item.mode}
                    onClick={() => onSelectMode(item.mode)}
                    className="group flex flex-col p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl dark:hover:bg-slate-800 hover:-translate-y-1 transition-all text-left"
                  >
                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24 })}
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{item.label}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-300">
             <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 mb-4">
                <Search size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-800 dark:text-white">Fitur tidak ditemukan</h3>
             <p className="text-slate-500 dark:text-slate-400 mt-2">Coba kata kunci lain, seperti "Edit" atau "Banner".</p>
             <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 text-neon font-bold hover:underline"
             >
                Hapus pencarian
             </button>
          </div>
        )}
      </div>
      
      {/* Footer / Info */}
      <div className="bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 py-12 px-6 text-center transition-colors">
         <p className="text-slate-400 dark:text-slate-500 text-sm">© 2026 My Studio AI. Ditenagai oleh Google Gemini.</p>
      </div>
    </div>
  );
};

export default Dashboard;