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
  { id: 'main', title: 'Transmissão Principal', videoId: '4ryVt9OnqeY' },
  { id: 'telemetry', title: 'Telemetria', iframeUrl: 'https://livetiming.azurewebsites.net/events/50/results/' },
  { id: 'ver', title: 'Onboard: Max Verstappen', videoId: '5t3WpNypCUw', driver: 'VER', team: 'Red Bull' },
  { id: 'est', title: 'Onboard: Kevin Estre', videoId: 'uofChxeVADU', driver: 'EST', team: 'Porsche' },
  { id: 'far', title: 'Onboard: Augusto Farfus', videoId: 'X2Icmd1PXOU', driver: 'FAR', team: 'BMW' },
  { id: 'pit', title: 'Câmera dos Boxes', videoId: 'OZdE2ZOAXfo' },
];

type LayoutMode = 'auto' | 'sidebar-right' | 'sidebar-left' | 'sidebar-bottom' | 'grid' | 'main-only';

export default function RaceControlPage() {
  const [mainVideoId, setMainVideoId] = useState<string>('main');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('auto');
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

  // User explicitly selects layout
  const currentLayoutMode = layoutMode === 'auto'
    ? (isMobile ? (isLandscape ? 'sidebar-right' : 'mobile-portrait') : 'sidebar-right')
    : layoutMode;

  // Helper to get video styles depending on layout mode
  const getLayoutClasses = () => {
    switch (currentLayoutMode) {
      case 'mobile-portrait':
        return "flex flex-col w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar bg-black";
      case 'sidebar-right':
        return "flex flex-row w-full h-full overflow-hidden";
      case 'sidebar-left':
        return "flex flex-row-reverse w-full h-full overflow-hidden";
      case 'sidebar-bottom':
        return "flex flex-col w-full h-full overflow-hidden";
      case 'grid':
        return "grid grid-cols-2 md:grid-cols-3 auto-rows-fr w-full h-full overflow-y-auto";
      case 'main-only':
        return "flex w-full h-full";
      default:
        return "flex flex-row w-full h-full overflow-hidden";
    }
  };

  const getMainVideoClasses = () => {
    switch (currentLayoutMode) {
      case 'mobile-portrait':
        return "w-full aspect-video shrink-0 sticky top-0 z-30 shadow-2xl";
      case 'sidebar-right':
      case 'sidebar-left':
        return "w-3/4 h-full shrink-0 flex-grow";
      case 'sidebar-bottom':
        return "w-full h-3/4 shrink-0 flex-grow";
      case 'grid':
        return "col-span-1 md:col-span-2 row-span-2";
      case 'main-only':
        return "w-full h-full";
      default:
        return "w-3/4 h-full shrink-0 flex-grow";
    }
  };

  const getSideContainerClasses = () => {
    switch (currentLayoutMode) {
      case 'mobile-portrait':
        return "w-full flex flex-col pb-20";
      case 'sidebar-right':
      case 'sidebar-left':
        return "w-1/4 shrink-0 h-full flex flex-col overflow-y-auto custom-scrollbar";
      case 'sidebar-bottom':
        return "w-full h-1/4 shrink-0 flex flex-row overflow-x-auto custom-scrollbar";
      case 'grid':
        return "contents";
      case 'main-only':
        return "hidden";
      default:
        return "";
    }
  };

  const getSideVideoClasses = (video: VideoInfo) => {
    const isTelemetry = video.id === 'telemetry';
    switch (currentLayoutMode) {
      case 'mobile-portrait':
        return cn(
          "w-full shrink-0 border-t border-white/5",
          isTelemetry ? "flex-1 min-h-[300px]" : "aspect-video"
        );
      case 'sidebar-right':
      case 'sidebar-left':
        return cn(
          "w-full shrink-0 border-b border-white/10",
          isTelemetry ? "flex-1 min-h-[150px]" : "aspect-video"
        );
      case 'sidebar-bottom':
        return cn(
          "h-full shrink-0 border-r border-white/10",
          isTelemetry ? "flex-1 min-w-[300px]" : "aspect-video"
        );
      case 'grid':
        return "col-span-1 row-span-1 min-h-[250px] aspect-video md:aspect-auto border border-white/10";
      case 'main-only':
        return "hidden";
      default:
        return "";
    }
  };

  const sideVideoCount = VIDEOS.filter(v => v.id !== mainVideoId && !hiddenVideoIds.includes(v.id));

  const renderSettingsContent = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-white">Configurações</h2>
        {isMobile && (
          <button onClick={() => setIsSettingsOpen(false)} className="group text-neutral-400 hover:text-white p-1 transition-colors">
            <X className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        {/* Layout Options */}
        <div>
          <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-2">Layout</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setLayoutMode('auto')}
              className={cn("p-2 rounded-lg border transition-all flex flex-col items-center gap-1 group hover:scale-105 active:scale-95", layoutMode === 'auto' ? "bg-red-500/20 border-red-500/50 text-white" : "border-white/10 text-neutral-400 hover:bg-white/5")}
            >
              <Smartphone className={cn("w-4 h-4 transition-transform group-hover:scale-110", layoutMode === 'auto' && "animate-pulse text-red-400")} />
              <span className="text-[10px]">Auto</span>
            </button>
            <button
              onClick={() => setLayoutMode('sidebar-right')}
              className={cn("p-2 rounded-lg border transition-all flex flex-col items-center gap-1 group hover:scale-105 active:scale-95", layoutMode === 'sidebar-right' ? "bg-red-500/20 border-red-500/50 text-white" : "border-white/10 text-neutral-400 hover:bg-white/5")}
            >
              <Columns className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-[10px]">Direita</span>
            </button>
            <button
              onClick={() => setLayoutMode('sidebar-bottom')}
              className={cn("p-2 rounded-lg border transition-all flex flex-col items-center gap-1 group hover:scale-105 active:scale-95", layoutMode === 'sidebar-bottom' ? "bg-red-500/20 border-red-500/50 text-white" : "border-white/10 text-neutral-400 hover:bg-white/5")}
            >
              <Rows className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-[10px]">Abaixo</span>
            </button>
            <button
              onClick={() => setLayoutMode('sidebar-left')}
              className={cn("p-2 rounded-lg border transition-all flex flex-col items-center gap-1 group hover:scale-105 active:scale-95", layoutMode === 'sidebar-left' ? "bg-red-500/20 border-red-500/50 text-white" : "border-white/10 text-neutral-400 hover:bg-white/5")}
            >
              <Columns className="w-4 h-4 scale-x-[-1] transition-transform group-hover:scale-110" />
              <span className="text-[10px]">Esquerda</span>
            </button>
            <button
              onClick={() => setLayoutMode('grid')}
              className={cn("p-2 rounded-lg border transition-all flex flex-col items-center gap-1 group hover:scale-105 active:scale-95", layoutMode === 'grid' ? "bg-red-500/20 border-red-500/50 text-white" : "border-white/10 text-neutral-400 hover:bg-white/5")}
            >
              <LayoutGrid className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-[10px]">Grade</span>
            </button>
            <button
              onClick={() => setLayoutMode('main-only')}
              className={cn("p-2 rounded-lg border transition-all flex flex-col items-center gap-1 group hover:scale-105 active:scale-95", layoutMode === 'main-only' ? "bg-red-500/20 border-red-500/50 text-white" : "border-white/10 text-neutral-400 hover:bg-white/5")}
            >
              <Square className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-[10px]">Principal</span>
            </button>
          </div>
        </div>
        
        {/* Main Camera Selection */}
        <div>
          <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-2">Câmera Principal</label>
          <div className="space-y-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar mb-4">
            {VIDEOS.map(video => (
              <button
                key={`main-sel-${video.id}`}
                onClick={() => setMainVideoId(video.id)}
                className={cn(
                  "group w-full text-left px-3 py-2 rounded-lg text-xs transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between",
                  mainVideoId === video.id ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 border border-transparent"
                )}
              >
                <span className="truncate pr-2">{video.title}</span>
                {mainVideoId === video.id && <Video className="w-3 h-3 text-red-500 shrink-0 animate-pulse transition-transform group-hover:scale-125" />}
              </button>
            ))}
          </div>
          
          {/* Visibility Settings */}
          <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-2">Visibilidade das Câmeras</label>
          <div className="space-y-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {VIDEOS.map(video => (
              <button
                key={`vis-${video.id}`}
                onClick={() => video.id !== mainVideoId && toggleVisibility(video.id)}
                className={cn(
                  "group w-full text-left px-3 py-2 rounded-lg text-xs transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between",
                  video.id === mainVideoId ? "opacity-50 cursor-not-allowed text-neutral-500" : "text-neutral-300 hover:bg-white/5"
                )}
                disabled={video.id === mainVideoId}
              >
                <span className="truncate pr-2">{video.title}</span>
                {video.id === mainVideoId ? (
                  <Eye className="w-3 h-3 text-neutral-600 shrink-0 transition-transform group-hover:scale-110" />
                ) : hiddenVideoIds.includes(video.id) ? (
                  <EyeOff className="w-3 h-3 text-neutral-500 shrink-0 transition-transform group-hover:scale-110" />
                ) : (
                  <Eye className="w-3 h-3 text-red-500 shrink-0 transition-transform group-hover:scale-110" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );

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
              <div className="relative flex-1 overflow-hidden">
                <iframe
                  src={VIDEOS.find(v => v.id === mainVideoId)?.iframeUrl}
                  className="absolute left-0 w-full border-none bg-white"
                  style={{ 
                    top: "-190px", 
                    height: "calc(100% + 190px)",
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
        {currentLayoutMode !== 'main-only' && (
          <div className={getSideContainerClasses()}>
            {sideVideoCount.map((video) => (
              <div
                key={video.id}
                className={cn(
                  "relative bg-black group overflow-hidden",
                  getSideVideoClasses(video)
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
                    <div className="relative flex-1 overflow-hidden">
                      <iframe
                        src={video.iframeUrl}
                        className="absolute left-0 w-full border-none bg-white pointer-events-auto"
                        style={{ 
                          top: "-190px", 
                          height: "calc(100% + 190px)",
                          filter: "invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.95)" 
                        }}
                        loading="lazy"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
                
                <div className={cn("absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-20 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity", video.videoId ? "h-12" : "h-10")}>
                  <h3 className="font-medium text-xs text-neutral-200 drop-shadow-md truncate max-w-[70%]">
                    {video.title}
                  </h3>
                </div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-2xl backdrop-blur-sm border border-white/10">
                  <button
                    onClick={() => setMainVideoId(video.id)}
                    className="group/btn p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 active:scale-95 text-white"
                    title="Câmera Principal"
                  >
                    <Maximize className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                  </button>
                  <button
                    onClick={() => toggleVisibility(video.id)}
                    className="group/btn p-2 rounded-full bg-white/10 hover:bg-red-500/80 transition-all hover:scale-110 active:scale-95 text-white"
                    title="Ocultar Câmera"
                  >
                    <EyeOff className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Settings Component */}
      {isMobile ? (
        <div className={cn("fixed bottom-6 right-4 z-50 flex flex-col items-end transition-opacity duration-300", !isSettingsOpen ? "opacity-50 hover:opacity-100 active:opacity-100" : "opacity-100")}>
          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.2 }}
                className="mb-4 w-[calc(100vw-2rem)] max-w-sm max-h-[70vh] overflow-y-auto bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl origin-bottom-right"
              >
                {renderSettingsContent()}
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="group w-14 h-14 bg-red-600 rounded-full shadow-lg flex items-center justify-center text-white focus:outline-none shadow-red-600/30 font-medium"
          >
            {isSettingsOpen ? <X className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" /> : <Settings className="w-6 h-6 transition-transform duration-500 group-hover:rotate-180" />}
          </button>
        </div>
      ) : (
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0.1}
          dragMomentum={false}
          className={cn("fixed z-50 flex flex-col items-center gap-2 transition-opacity duration-300", !isSettingsOpen ? "opacity-30 hover:opacity-100" : "opacity-100")}
          style={{ top: '2rem', right: '2rem' }}
        >
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="group w-12 h-12 bg-neutral-900/80 backdrop-blur-md rounded-full shadow-2xl border border-white/20 flex items-center justify-center text-white hover:bg-neutral-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-grab active:cursor-grabbing hover:scale-105"
          >
            {isSettingsOpen ? <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" /> : <Settings className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180" />}
          </button>

          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.2 }}
                className="absolute top-14 right-0 w-72 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl text-sm origin-top-right"
                onPointerDownCapture={e => e.stopPropagation()} // prevent dragging when clicking inside panel
              >
                {renderSettingsContent()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

