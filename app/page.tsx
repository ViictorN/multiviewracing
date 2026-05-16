'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Tv, LayoutGrid, Maximize, X, Square, Columns, Rows, Video, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type VideoInfo = {
  id: string;
  title: string;
  videoId: string;
  driver?: string;
  team?: string;
};

const VIDEOS: VideoInfo[] = [
  { id: 'main', title: 'Main Broadcast', videoId: '4ryVt9OnqeY' },
  { id: 'ver', title: 'Onboard: Max Verstappen', videoId: '5t3WpNypCUw', driver: 'VER', team: 'Red Bull' },
  { id: 'est', title: 'Onboard: Kevin Estre', videoId: 'uofChxeVADU', driver: 'EST', team: 'Porsche' },
  { id: 'far', title: 'Onboard: Augusto Farfus', videoId: 'X2Icmd1PXOU', driver: 'FAR', team: 'BMW' },
  { id: 'pit', title: 'Pit Lane Camera', videoId: 'OZdE2ZOAXfo' },
];

type LayoutMode = 'sidebar-right' | 'sidebar-left' | 'sidebar-bottom' | 'grid' | 'main-only';

export default function RaceControlPage() {
  const [mainVideoId, setMainVideoId] = useState<string>('main');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('sidebar-right');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Handle mobile overriding
  const currentLayoutMode = isMobile ? 'mobile' : layoutMode;

  // Helper to get video styles depending on layout mode
  const getLayoutClasses = () => {
    switch (currentLayoutMode) {
      case 'mobile':
        return "flex flex-col w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar bg-black";
      case 'sidebar-right':
        return "grid grid-cols-4 grid-rows-4 w-full h-full";
      case 'sidebar-left':
        return "grid grid-cols-4 grid-rows-4 w-full h-full";
      case 'sidebar-bottom':
        return "grid grid-cols-4 grid-rows-4 w-full h-full";
      case 'grid':
        return "grid grid-cols-2 md:grid-cols-3 grid-rows-2 w-full h-full";
      case 'main-only':
        return "grid grid-cols-1 grid-rows-1 w-full h-full";
      default:
        return "grid grid-cols-4 grid-rows-4 w-full h-full";
    }
  };

  const getMainVideoClasses = () => {
    switch (currentLayoutMode) {
      case 'mobile':
        return "w-full aspect-video shrink-0 sticky top-0 z-30 shadow-2xl";
      case 'sidebar-right':
        return "col-span-3 row-span-4";
      case 'sidebar-left':
        return "col-span-3 row-span-4 col-start-2";
      case 'sidebar-bottom':
        return "col-span-4 row-span-3";
      case 'grid':
        return "col-span-1 row-span-1";
      case 'main-only':
        return "col-span-1 row-span-1";
      default:
        return "col-span-3 row-span-4";
    }
  };

  const getSideVideoClasses = (index: number) => {
    switch (currentLayoutMode) {
      case 'mobile':
        return "w-full aspect-video shrink-0";
      case 'sidebar-right':
        return `col-span-1 row-span-1 col-start-4 row-start-${index + 1}`;
      case 'sidebar-left':
        return `col-span-1 row-span-1 col-start-1 row-start-${index + 1}`;
      case 'sidebar-bottom':
        return `col-span-1 row-span-1 col-start-${index + 1} row-start-4`;
      case 'grid':
        return "col-span-1 row-span-1";
      case 'main-only':
        return "hidden";
      default:
        return "";
    }
  };

  // Reorder videos to ensure main is at the top/prominent in flex/grid order
  // but handled mostly via CSS grid positioning.
  const displayVideos = [...VIDEOS].sort((a, b) => {
    if (layoutMode === 'grid') return 0; // maintain original order for grid
    if (a.id === mainVideoId) return -1;
    if (b.id === mainVideoId) return 1;
    return 0;
  });

  const sideVideoCount = VIDEOS.filter(v => v.id !== mainVideoId);

  return (
    <div ref={containerRef} className="w-screen h-screen bg-black overflow-hidden relative font-sans text-neutral-50 flex">
      <main className={cn(getLayoutClasses(), "flex-1")}>
        {/* Render Main Video First */}
        <div key={`main-${mainVideoId}`} className={cn("relative z-0 bg-black group", getMainVideoClasses())}>
          <iframe
            src={`https://www.youtube.com/embed/${VIDEOS.find(v => v.id === mainVideoId)?.videoId}?autoplay=1&mute=1&playsinline=1&controls=1&modestbranding=1&rel=0`}
            className="absolute inset-0 w-full h-full pointer-events-auto border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {currentLayoutMode !== 'main-only' && (
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <h3 className="text-xl font-medium text-white drop-shadow-md">
                {VIDEOS.find(v => v.id === mainVideoId)?.title}
              </h3>
            </div>
          )}
        </div>

        {/* Render Side Videos */}
        {currentLayoutMode !== 'main-only' && sideVideoCount.map((video, index) => (
          <div
            key={video.id}
            onClick={() => setMainVideoId(video.id)}
            className={cn(
              "relative bg-black group cursor-pointer border-[0.5px] border-white/10",
              getSideVideoClasses(index)
            )}
          >
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0`}
              className="absolute inset-0 w-full h-full border-none pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Interaction Shield */}
            <div className="absolute inset-0 z-10 bg-black/5 group-hover:bg-black/20 hover:ring-1 hover:ring-white/50 transition-all" />
            
            <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <h3 className="font-medium text-xs text-neutral-200 drop-shadow-md truncate">
                {video.title}
              </h3>
            </div>
            
            <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-black/60 backdrop-blur justify-center items-center flex opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none scale-90 group-hover:scale-100">
              <Maximize className="w-4 h-4 text-white" />
            </div>
          </div>
        ))}
      </main>

      {/* Floating Settings Button */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.1}
        dragMomentum={false}
        className="fixed z-50 flex flex-col items-center gap-2"
        style={{ top: '2rem', right: '2rem' }}
      >
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-12 h-12 bg-neutral-900/80 backdrop-blur-md rounded-full shadow-2xl border border-white/20 flex items-center justify-center text-white hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {isSettingsOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
        </button>

        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-14 right-0 w-72 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl text-sm"
              onPointerDownCapture={e => e.stopPropagation()} // prevent dragging when clicking inside panel
            >
              <h2 className="font-semibold text-white mb-4">View Settings</h2>
              
              <div className="space-y-6">
                {/* Layout Options */}
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-2">Layout</label>
                  {isMobile ? (
                    <div className="bg-white/5 rounded-lg p-3 text-center text-neutral-400 flex flex-col items-center gap-2 border border-white/5">
                      <Smartphone className="w-5 h-5 text-neutral-500" />
                      <span className="text-xs">Mobile layout optimized for your device.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setLayoutMode('sidebar-right')}
                        className={cn("p-2 rounded-lg border transition-colors flex flex-col items-center gap-1", layoutMode === 'sidebar-right' ? "bg-red-500/20 border-red-500/50 text-white" : "border-white/10 text-neutral-400 hover:bg-white/5")}
                      >
                        <Columns className="w-4 h-4" />
                        <span className="text-[10px]">Right</span>
                      </button>
                      <button
                        onClick={() => setLayoutMode('sidebar-bottom')}
                        className={cn("p-2 rounded-lg border transition-colors flex flex-col items-center gap-1", layoutMode === 'sidebar-bottom' ? "bg-red-500/20 border-red-500/50 text-white" : "border-white/10 text-neutral-400 hover:bg-white/5")}
                      >
                        <Rows className="w-4 h-4" />
                        <span className="text-[10px]">Bottom</span>
                      </button>
                      <button
                        onClick={() => setLayoutMode('sidebar-left')}
                        className={cn("p-2 rounded-lg border transition-colors flex flex-col items-center gap-1", layoutMode === 'sidebar-left' ? "bg-red-500/20 border-red-500/50 text-white" : "border-white/10 text-neutral-400 hover:bg-white/5")}
                      >
                        <Columns className="w-4 h-4 scale-x-[-1]" />
                        <span className="text-[10px]">Left</span>
                      </button>
                      <button
                        onClick={() => setLayoutMode('grid')}
                        className={cn("p-2 rounded-lg border transition-colors flex flex-col items-center gap-1", layoutMode === 'grid' ? "bg-red-500/20 border-red-500/50 text-white" : "border-white/10 text-neutral-400 hover:bg-white/5")}
                      >
                        <LayoutGrid className="w-4 h-4" />
                        <span className="text-[10px]">Grid</span>
                      </button>
                      <button
                        onClick={() => setLayoutMode('main-only')}
                        className={cn("p-2 rounded-lg border transition-colors flex flex-col items-center gap-1", layoutMode === 'main-only' ? "bg-red-500/20 border-red-500/50 text-white" : "border-white/10 text-neutral-400 hover:bg-white/5")}
                      >
                        <Square className="w-4 h-4" />
                        <span className="text-[10px]">Main</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Main Camera Selection */}
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-2">Main Camera</label>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {VIDEOS.map(video => (
                      <button
                        key={video.id}
                        onClick={() => setMainVideoId(video.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between",
                          mainVideoId === video.id ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5"
                        )}
                      >
                        <span className="truncate pr-2">{video.title}</span>
                        {mainVideoId === video.id && <Video className="w-3 h-3 text-red-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

