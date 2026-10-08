import React, { useState } from 'react';
import { 
  Layers, Expand, Wand2, History, Star, Scissors, ShoppingBag, 
  UserCheck, Shirt, Presentation, Megaphone, Hand, Heart, Smile, 
  UserCog, ChevronDown, ChevronRight, Infinity, Briefcase, Palette, LayoutGrid, X, Home, Sun, Moon,
  Camera, MessageSquare
} from 'lucide-react';
import { AppMode } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  onSwitchMode: (mode: AppMode) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

// Group Definition
interface MenuGroup {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

interface MenuItem {
  mode: AppMode;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentMode, 
  onSwitchMode, 
  isOpen = false, 
  onClose, 
  isDarkMode, 
  onToggleTheme 
}) => {
  const [openGroups, setOpenGroups] = useState<string[]>(['Essential Tools', 'Business Suite', 'Creative Lab']);

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const MENU_GROUPS: MenuGroup[] = [
    {
      title: "Essential Tools",
      icon: <LayoutGrid size={18} />,
      items: [
        { mode: AppMode.CHAT, label: "AI Chat Assistant", icon: <MessageSquare size={18} />, badge: "LOCKED" },
        { mode: AppMode.REMOVE_BG, label: "Hapus Background", icon: <Scissors size={18} />, badge: "BETA" },
        { mode: AppMode.EDIT, label: "Magic Edit", icon: <Wand2 size={18} /> },
        { mode: AppMode.EXPAND, label: "Perluas Foto", icon: <Expand size={18} /> },
        { mode: AppMode.MERGE, label: "Penggabungan", icon: <Layers size={18} /> },
        { mode: AppMode.RESTORE, label: "Restorasi Foto", icon: <History size={18} /> },
      ]
    },
    {
      title: "Business Suite",
      icon: <Briefcase size={18} />,
      items: [
        { mode: AppMode.UGC, label: "UGC Studio", icon: <Camera size={18} />, badge: "NEW" },
        { mode: AppMode.PRODUCT, label: "Photo Produk", icon: <ShoppingBag size={18} /> },
        { mode: AppMode.PRODUCT_MODEL, label: "Produk + Model", icon: <UserCheck size={18} /> },
        { mode: AppMode.FASHION, label: "Fashion AI", icon: <Shirt size={18} />, badge: "HOT" },
        { mode: AppMode.MOCKUP, label: "Mockup Generator", icon: <Presentation size={18} /> },
        { mode: AppMode.BANNER, label: "Buat Banner", icon: <Megaphone size={18} /> },
      ]
    },
    {
      title: "Creative Lab",
      icon: <Palette size={18} />,
      items: [
        { mode: AppMode.REALISTIC_MODEL, label: "Model Generator", icon: <Smile size={18} /> },
        { mode: AppMode.CHANGE_POSE, label: "Ubah Pose Model", icon: <UserCog size={18} />, badge: "NEW" },
        { mode: AppMode.POV_HAND, label: "POV Tangan", icon: <Hand size={18} />, badge: "VIRAL" },
        { mode: AppMode.WEDDING, label: "Wedding AI", icon: <Heart size={18} /> },
        { mode: AppMode.IDOL, label: "Photo Bareng Idola", icon: <Star size={18} />, badge: "BETA" },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 transform
        lg:translate-x-0 lg:static lg:h-full lg:shadow-none
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center">
                <div className="w-9 h-9 bg-neon rounded-xl flex items-center justify-center text-white shadow-lg shadow-neon/30 transform transition-transform hover:scale-105">
                <Infinity size={22} strokeWidth={2.5} />
                </div>
                <div className="ml-3 flex flex-col justify-center">
                <span className="font-bold text-lg leading-none text-slate-900 dark:text-white tracking-tight">My Studio AI</span>
                <span className="text-[10px] font-bold text-neon tracking-[0.2em] mt-1 uppercase">Creative Studio</span>
                </div>
            </div>
            {/* Close Button Mobile */}
            <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-red-500">
                <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-1">
            
            {/* Home Link */}
            <div className="px-3 mb-4">
              <button 
                onClick={() => onSwitchMode(AppMode.DASHBOARD)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all
                  ${currentMode === AppMode.DASHBOARD 
                    ? 'bg-neon text-white shadow-lg shadow-neon/30' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                <Home size={20} />
                <span className="text-sm">Beranda</span>
              </button>
            </div>

            {MENU_GROUPS.map((group) => {
              const isOpen = openGroups.includes(group.title);
              const hasActiveItem = group.items.some(item => item.mode === currentMode);

              return (
                <div key={group.title} className="px-3 mb-1">
                  <button 
                    onClick={() => toggleGroup(group.title)}
                    className={`
                      w-full flex items-center justify-between p-2 rounded-lg mb-1 transition-colors duration-200
                      ${hasActiveItem ? 'text-neon' : 'text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="opacity-70">{group.icon}</div>
                      <span className="text-xs font-bold uppercase tracking-wider">{group.title}</span>
                    </div>
                    
                    <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown size={14} />
                    </div>
                  </button>

                  <div className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                    `}>
                    <div className="flex flex-col gap-1 pb-2 pl-2">
                      {group.items.map((item) => {
                        const isActive = currentMode === item.mode;
                        return (
                          <button 
                            key={item.mode}
                            onClick={() => onSwitchMode(item.mode)}
                            className={`
                              relative flex items-center gap-3 p-2.5 rounded-xl font-medium transition-all w-full text-left group
                              ${isActive 
                                ? 'bg-neon/10 text-neon border border-neon/20' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-transparent'
                              }
                            `}
                          >
                            <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                              {React.cloneElement(item.icon as React.ReactElement<any>, { 
                                size: 18,
                                strokeWidth: isActive ? 2.5 : 2
                              })}
                            </div>
                            
                            <span className="text-sm truncate">{item.label}</span>
                            
                            {item.badge && (
                              <span className={`
                                absolute right-2 text-[9px] px-1.5 py-0.5 rounded-md font-bold leading-none flex
                                ${isActive 
                                  ? 'bg-neon text-white' 
                                  : 'bg-neon-light dark:bg-purple-900/60 text-neon dark:text-purple-200 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:shadow-sm'
                                }
                              `}>
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Theme Toggle Button (Sidebar Bottom) */}
          <div className="p-4 border-t border-gray-100 dark:border-slate-800 shrink-0">
             <button 
               onClick={onToggleTheme}
               className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
             >
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  {isDarkMode ? <Moon size={18} className="text-neon" /> : <Sun size={18} className="text-amber-500" />}
                  <span className="text-sm font-semibold">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-neon' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-1'}`}></div>
                </div>
             </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;