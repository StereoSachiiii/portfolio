import React, { useState, useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Camera, Megaphone } from 'lucide-react';
import { data } from './data';
import { Identity } from './components/Identity';
import { ProjectDetail } from './components/ProjectDetail';
import { StackDropdown } from './components/StackDropdown';
import { Contact } from './components/Contact';

const EQ = () => {
  const bars = 40;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      className="absolute bottom-0 left-0 right-0 w-full z-0 pointer-events-none"
      style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-evenly', height: '48px', padding: '0 8px' }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const t = i / bars;
        // frequency shape: bass (0–0.15), mid scoop (0.15–0.45), synth (0.45–0.85), highs (0.85–1)
        let baseH, randH, speed, isBass;
        if (t < 0.15)       { baseH = 60; randH = 40; speed = 0.5;                        isBass = t < 0.06; }
        else if (t < 0.45)  { baseH = 15; randH = 15; speed = 0.8 + Math.random();        isBass = false; }
        else if (t < 0.85)  { baseH = 30; randH = 50; speed = 0.3 + Math.random() * 0.4; isBass = i % 6 === 0; }
        else                { baseH = 10; randH = 20; speed = 0.15 + Math.random() * 0.2; isBass = false; }
        return (
          <div
            key={i}
            className={isBass ? 'bass-bar' : 'normal-bar'}
            style={{
              flex: 1, maxWidth: '3px', margin: '0 1px',
              background: '#dcb6c0',
              borderTopLeftRadius: '2px', borderTopRightRadius: '2px',
              transformOrigin: 'bottom',
              height: isBass ? '100%' : `${baseH + Math.random() * randH}%`,
              ...(!isBass && { animation: `eq ${speed}s ease-in-out infinite alternate`, animationDelay: `${Math.random() * 0.5}s` })
            }}
          />
        );
      })}
    </motion.div>
  );
}

// StackSection is isolated so hoveredTech state never re-renders App
const StackSection = memo(({ onProjectClick }) => {
  const [hoveredTech, setHoveredTech] = useState(null);
  return (
    <div className="space-y-20">
      {data.fullStack.map((cat, i) => (
        <div key={i} className="space-y-8">
          <h4 className="text-[11px] font-mono font-bold tracking-[0.4em] text-black/50 uppercase border-b border-black/10 pb-4">
            {cat.category}
          </h4>
          <div className="flex flex-wrap gap-x-6 md:gap-x-10 lg:gap-x-16 gap-y-10">
            {cat.items.map((item, j) => (
              <div
                key={j}
                className="group relative"
                onMouseEnter={() => setHoveredTech(item.name)}
                onMouseLeave={() => setHoveredTech(null)}
              >
                <div className="flex items-center gap-4 cursor-default group/keyword">
                  <div className="transition-transform duration-300 group-hover/keyword:scale-110">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-3">
                      <span className="text-xl font-bold text-black transition-all tracking-tight">
                        {item.name}
                      </span>
                      {item.projects?.length > 0 && (
                        <span className="text-[10px] font-mono font-bold text-black/40 group-hover:text-black transition-colors">
                          · {item.projects.length} {item.projects.length === 1 ? 'project' : 'projects'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  {hoveredTech === item.name && (
                    <StackDropdown
                      item={item}
                      onProjectClick={onProjectClick}
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

// Moved outside — never recreated on render
const categoryStyles = {
  SYSTEMS: { tag: 'bg-zinc-100 text-zinc-600 border border-zinc-200' },
  OS: { tag: 'bg-slate-100 text-slate-600 border border-slate-200' },
  WEB: { tag: 'bg-stone-100 text-stone-600 border border-stone-200' },
  ML: { tag: 'bg-violet-100 text-violet-600 border border-violet-200' },
  EXPERIMENTS: { tag: 'bg-stone-100 text-stone-600 border border-stone-200' }
};

// Thin top bar that sweeps across on mount — like a compiler running
const LoadingBar = () => {
  const [done, setDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDone(true), 900); return () => clearTimeout(t); }, []);
  return (
    <motion.div
      className="fixed top-0 left-0 h-[2px] bg-black z-50 origin-left"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: done ? 0 : 1, opacity: done ? 0 : 1 }}
      transition={done
        ? { opacity: { duration: 0.3, delay: 0.1 } }
        : { scaleX: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }
      }
      style={{ width: '100%' }}
    />
  );
};

// Memoized — only re-renders when its own project data changes
const ProjectCard = memo(({ project, onClick, onHoverStart, onHoverEnd }) => {
  const style = categoryStyles[project.category] || categoryStyles.WEB;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ 
        y: [-2, -5, -2],
        scale: [1, 1.006, 1],
        transition: { 
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (onHoverStart) onHoverStart();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (onHoverEnd) onHoverEnd();
      }}
      onClick={onClick}
      className="card group relative cursor-pointer flex flex-col h-full bg-transparent border border-black/10 hover:border-black/30 rounded-sm transition-colors duration-300"
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
        <ArrowUpRight className="text-black" size={16} />
      </div>

      <div className="flex-1 p-5 flex flex-col relative z-10">
        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4 opacity-60">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
            {project.category}
          </span>
          {project.stack?.slice(0, 3).map((tech, i) => (
            <React.Fragment key={i}>
              <span className="text-[10px] font-mono text-black/40">·</span>
              <span className="text-[10px] font-mono tracking-tight uppercase">
                {tech.name || tech.label}
              </span>
            </React.Fragment>
          ))}
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-black tracking-tight text-black mb-3 pr-6">
          {project.title}
        </h3>
        
        {/* Description / Highlight */}
        <p className="text-black/80 text-[13px] leading-snug mb-6">
          {project.highlight ? (
            <span className="font-semibold">{project.highlight}. </span>
          ) : null}
          <span className="opacity-80 line-clamp-2">{project.description}</span>
        </p>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Technical Metrics Block */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="flex flex-col gap-2 border-l-2 border-black/10 pl-3 mb-2">
            {project.metrics.slice(0, 3).map((m, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[11px] font-mono font-bold text-black min-w-[75px] pt-[2px]">{m.value}</span>
                <span className="text-[11.5px] font-medium text-black/60 leading-snug">{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Container for EQ (reserves height so content doesn't overlap bars) */}
      <div className="h-4 relative z-0">
        {isHovered && <EQ />}
      </div>

      {/* Screenshot Indicator (Opt-in) */}
      {project.screenshots && project.screenshots.length > 0 && (
        <div className="absolute bottom-5 right-5 flex flex-col items-center justify-center pointer-events-none z-10 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
          <div className="relative w-[34px] h-[24px] mb-1.5">
            {/* Bottom Card */}
            <div className="absolute inset-0 bg-white border border-black/10 rounded-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transform -rotate-[15deg] -translate-x-2.5 translate-y-1"></div>
            {/* Middle Card */}
            <div className="absolute inset-0 bg-white border border-black/10 rounded-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transform -rotate-[5deg] -translate-x-1 translate-y-0.5"></div>
            {/* Top Card */}
            <div className="absolute inset-0 bg-white border border-black/10 rounded-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transform rotate-[4deg] flex items-center justify-center">
              <Camera size={10} className="text-black/30" />
            </div>
          </div>
          <span className="text-[7.5px] font-medium text-black/40">view screenshots</span>
        </div>
      )}
    </motion.div>
  );
});

export default function App() {
  const [tab, setTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectView, setProjectView] = useState("overview");
  const [videoReady, setVideoReady] = useState(false);
  const [isGlobalCardHovered, setIsGlobalCardHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  // useMotionValue + useSpring: drives the parallax directly without any React re-renders
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { damping: 50, stiffness: 200 });
  const y = useSpring(rawY, { damping: 50, stiffness: 200 });

  const handleMouseMove = useCallback((e) => {
    rawX.set((e.clientX / window.innerWidth - 0.5) * 20);
    rawY.set((e.clientY / window.innerHeight - 0.5) * 20);
  }, [rawX, rawY]);

  return (
    <>
    <LoadingBar />
    
    {/* Global Pump Overlay — desktop only */}
    <AnimatePresence>
      {isGlobalCardHovered && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden hidden lg:block">
          {[
            { pos: 'top-8 left-8', rot: '45deg' },
            { pos: 'top-8 right-8', rot: '135deg' },
            { pos: 'bottom-8 left-8', rot: '-45deg' },
            { pos: 'bottom-8 right-8', rot: '-135deg' }
          ].map((corner, i) => (
            <motion.div
              key={`pump-${i}`}
              initial={{ scale: 0.8, opacity: 0, rotate: corner.rot }}
              animate={{ scale: [1, 1.08, 1], opacity: 0.12, rotate: corner.rot }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ opacity: { duration: 0.3 }, scale: { duration: 0.5, repeat: Infinity, ease: "easeInOut" } }}
              className={`absolute ${corner.pos} text-pink-400`}
              style={{ filter: 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.4)) drop-shadow(0 0 20px rgba(236, 72, 153, 0.2))' }}
            >
              <Megaphone size={64} strokeWidth={1.5} />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>

    <div
      className="min-h-screen bg-pink-50 text-black selection:bg-black selection:text-white relative overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Video with Parallax — loads async, fades in once ready */}
      <motion.div className="fixed inset-0 z-0 pointer-events-none" style={{ x, y }}>
        <motion.video
          autoPlay muted loop playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady ? 0.12 : 0 }}
          transition={{ duration: 2.5, ease: "easeIn" }}
          className="absolute inset-0 w-full h-full object-cover grayscale"
        >
          <source src="/tinywow_vecteezy_clean-backdrop-loop_13695175_89813285.mp4" type="video/mp4" />
        </motion.video>
        {/* Subtle scrim — much lighter so video shows through */}
        <div className="absolute inset-0 bg-pink-50/60"></div>
      </motion.div>

      <main className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] items-start gap-6 md:gap-8 lg:gap-16 xl:gap-20 min-w-0 overflow-x-hidden">
        <Identity 
          identity={data.identity} 
          className="min-w-0 w-full" 
          onHoverStart={() => setIsGlobalCardHovered(true)}
          onHoverEnd={() => setIsGlobalCardHovered(false)}
        />

        <div className="flex flex-col py-8 md:py-16 min-h-screen min-w-0 w-full max-w-full overflow-x-hidden">
          <AnimatePresence mode="wait">
            {!selectedProject ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                <nav className="flex flex-wrap gap-3 sm:gap-5 md:gap-8 lg:gap-12 mb-10 md:mb-16 px-2 md:px-0 w-full max-w-full relative">
                  {['projects', 'stack', 'writing', 'contact'].map((t, i) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`pb-4 md:pb-6 transition-all relative group flex items-baseline gap-1 md:gap-1.5 ${
                        tab === t ? 'text-black' : 'text-black/40 hover:text-black/80'
                      }`}
                    >
                      <span className="text-[8px] md:text-[9px] font-mono font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                        0{i + 1}
                      </span>
                      <span className="text-sm md:text-lg lg:text-xl xl:text-2xl font-black tracking-tighter uppercase whitespace-nowrap">{t}</span>
                      {/* Active tab underline — layoutId slides it between tabs */}
                      {tab === t && (
                        <motion.div
                          layoutId="tab-underline"
                          className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full"
                          style={{ background: 'linear-gradient(90deg, #ff1493, #ff69b4)', boxShadow: '0 0 8px rgba(255,20,147,0.7)' }}
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                    </button>
                  ))}
                </nav>

                {tab === 'projects' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-20">
                    {data.projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => {
                          setSelectedProject(project);
                          setProjectView("overview");
                        }}
                        onHoverStart={() => setIsGlobalCardHovered(true)}
                        onHoverEnd={() => setIsGlobalCardHovered(false)}
                      />
                    ))}
                  </div>
                ) : tab === 'stack' ? (
                  <StackSection
                    onProjectClick={(projData) => {
                      const fullProject = data.projects.find(p => p.id === projData.id);
                      if (fullProject) {
                        setSelectedProject(fullProject);
                        setProjectView("technical");
                      }
                    }}
                  />
                ) : tab === 'contact' ? (
                  <Contact links={data.identity.links} />
                ) : (
                  <div className="grid gap-8">
                    {data.writing?.map((w) => (
                      <a
                        key={w.id}
                        href={w.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block border border-black/10 p-6 rounded-xl hover:bg-black/5 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-[15px] font-medium text-black">{w.title}</h3>
                          <span className="text-[11px] text-black">{w.date}</span>
                        </div>
                        <p className="text-sm text-black leading-relaxed line-clamp-2">{w.description}</p>
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <ProjectDetail
                project={selectedProject}
                view={projectView}
                setView={setProjectView}
                onBack={() => setSelectedProject(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
    </>
  );
}