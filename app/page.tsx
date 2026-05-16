'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Tv, LayoutGrid, Maximize, X, Square, Columns, Rows, Video, Smartphone, EyeOff, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type VideoInfo = {
  id: string;
  title: string;
  videoId?: string;
  iframeUrl?: string;
  driver?: string;
  team?: string;
};

const VIDEOS: VideoInfo[] = [
  { id: 'main', title: 'Main Broadcast', videoId: '4ryVt9OnqeY' },
  { id: 'ver', title: 'Onboard: Max Verstappen', videoId: '5t3WpNypCUw', driver: 'VER', team: 'Red Bull' },
  { id: 'est', title: 'Onboard: Kevin Estre', videoId: 'uofChxeVADU', driver: 'EST', team: 'Porsche' },
  { id: 'far', title: 'Onboard: Augusto Farfus', videoId: 'X2Icmd1PXOU', driver: 'FAR', team: 'BMW' },
  { id: 'pit', title: 'Pit Lane Camera', videoId: 'OZdE2ZOAXfo' },
  { id: 'telemetry', title: 'Live Timing', iframeUrl: 'https://livetiming.azurewebsites.net/events/50/results/' },
];

type LayoutMode = 'sidebar-right' | 'sidebar-left' | 'sidebar-bottom' | 'grid' | 'main-only';

export default function RaceControlPage() {
  const [mainVideoId, setMainVideoId] = useState<string>('main');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('sidebar-right');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hiddenVideoIds, setHiddenVideoIds] = useState<string[]>([]);
  const [isLandscape, setIsLandscape] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkOrientation = () => setIsLandscape(window.innerWidth > window.innerHeight);
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Make sure mainVideoId is never hidden
  useEffect(() => {
    if (hiddenVideoIds.includes(mainVideoId)) {
      setHiddenVideoIds(prev => prev.filter(vid => vid !== mainVideoId));
    }
  }, [mainVideoId, hiddenVideoIds]);

  const toggleVisibility = (id: string) => {
    setHiddenVideoIds(prev => 
      prev.includes(id) ? prev.filter(vid => vid !== id) : [...prev, id]
    );
  };

  // Handle mobile overriding
  const currentLayoutMode = isMobile ? (isLandscape ? 'mobile-landscape' : 'mobile-portrait') : layoutMode;

  // Helper to get video styles depending on layout mode
  const getLayoutClasses = () => {
    switch (currentLayoutMode) {
      case 'mobile-portrait':
        return "flex flex-col w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar bg-black";
      case 'sidebar-right':
      case 'mobile-landscape':
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
      case 'mobile-portrait':
        return "w-full aspect-video shrink-0 sticky top-0 z-30 shadow-2xl";
      case 'sidebar-right':
      case 'mobile-landscape':
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
      case 'mobile-portrait':
        return "w-full aspect-video shrink-0 border-t border-white/5";
      case 'sidebar-right':
      case 'mobile-landscape':
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

  const sideVideoCount = VIDEOS.filter(v => v.id !== mainVideoId && !hiddenVideoIds.includes(v.id));

  return (
    <div ref={containerRef} className="w-screen h-screen bg-black overflow-hidden relative font-sans text-neutral-50 flex">
      <main className={cn(getLayoutClasses(), "flex-1")}>
        {/* Render Main Video First */}
        <div key={`main-${mainVideoId}`} className={cn("relative z-0 bg-black group", getMainVideoClasses())}>
          {VIDEOS.find(v => v.id === mainVideoId)?.videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${VIDEOS.find(v => v.id === mainVideoId)?.videoId}?autoplay=1&mute=1&playsinline=1&controls=1&modestbranding=1&rel=0`}
              className="absolute inset-0 w-full h-full pointer-events-auto border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 w-full h-full shadow-[inset_0_0_50px_rgba(225,29,72,0.1)] border-[0.5px] border-red-500/20 bg-neutral-950 flex flex-col pointer-events-auto">
              <div className="h-8 border-b border-red-500/20 bg-black/50 flex items-center px-4 shrink-0 relative z-10">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2" />
                <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-semibold flex-1">Live Telemetry Data</span>
              </div>
              <div className="relative flex-1 overflow-hidden">
                <iframe
                  src={VIDEOS.find(v => v.id === mainVideoId)?.iframeUrl}
                  className="absolute left-0 w-full border-none bg-white"
                  style={{ 
                    top: "-240px", 
                    height: "calc(100% + 240px)",
                    filter: "invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.95)" 
                  }}
                  allowFullScreen
                />
              </div>
            </div>
          )}
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
            className={cn(
              "relative bg-black group border-[0.5px] border-white/10 overflow-hidden",
              getSideVideoClasses(index)
            )}
          >
            {video.videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&playsinline=1&controls=1&modestbranding=1&rel=0`}
                className="absolute inset-0 w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                loading="lazy"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 w-full h-full flex flex-col bg-neutral-950 border-[0.5px] border-red-500/20 shadow-[inset_0_0_30px_rgba(225,29,72,0.1)] pointer-events-auto">
                <div className="h-6 border-b border-red-500/20 bg-black/50 flex items-center px-2 shrink-0 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-2" />
                  <span className="text-[9px] font-mono text-red-500/80 uppercase tracking-widest flex-1">Telemetry</span>
                </div>
                <div className="relative flex-1 overflow-hidden pointer-events-none">
                  <iframe
                    src={video.iframeUrl}
                    className="absolute left-0 w-full border-none bg-white"
                    style={{ 
                      top: "-240px", 
                      height: "calc(100% + 240px)",
                      filter: "invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.95)" 
                    }}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
            
            <div className={cn("absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-20 flex justify-between items-start", video.videoId ? "h-12" : "h-10 opacity-0 group-hover:opacity-100 transition-opacity")}>
              <h3 className="font-medium text-xs text-neutral-200 drop-shadow-md truncate max-w-[70%]">
                {video.title}
              </h3>
            </div>
            
            <div className="absolute top-2 right-2 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setMainVideoId(video.id)}
                className="p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-neutral-800 transition-colors"
                title="Make Main Camera"
              >
                <Maximize className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleVisibility(video.id)}
                className="p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-neutral-800 transition-colors"
                title="Hide Camera"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
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
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar mb-4">
                    {VIDEOS.map(video => (
                      <button
                        key={video.id}
                        onClick={() => setMainVideoId(video.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between",
                          mainVideoId === video.id ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 border border-transparent"
                        )}
                      >
                        <span className="truncate pr-2">{video.title}</span>
                        {mainVideoId === video.id && <Video className="w-3 h-3 text-red-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                  
                  {/* Visibility Settings */}
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-2">Cameras Visibility</label>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {VIDEOS.map(video => (
                      <button
                        key={`vis-${video.id}`}
                        onClick={() => video.id !== mainVideoId && toggleVisibility(video.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between",
                          video.id === mainVideoId ? "opacity-50 cursor-not-allowed text-neutral-500" : "text-neutral-300 hover:bg-white/5"
                        )}
                        disabled={video.id === mainVideoId}
                      >
                        <span className="truncate pr-2">{video.title}</span>
                        {video.id === mainVideoId ? (
                          <Eye className="w-3 h-3 text-neutral-600 shrink-0" />
                        ) : hiddenVideoIds.includes(video.id) ? (
                          <EyeOff className="w-3 h-3 text-neutral-500 shrink-0" />
                        ) : (
                          <Eye className="w-3 h-3 text-red-500 shrink-0" />
                        )}
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

