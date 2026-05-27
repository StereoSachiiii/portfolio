import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArchDiagram } from './ArchDiagram';

export const ProjectDetail = ({ project, view, setView, onBack }) => {
  const toolsRef = useRef(null);
  const screenshotsRef = useRef(null);

  useEffect(() => {
    if (view === 'technical') {
      setTimeout(() => {
        toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [view]);

  const handleStackClick = () => {
    setView('technical');
  };

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.4 }}
      className="w-full relative min-w-0"
    >
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-50 flex justify-between items-center py-3 md:py-6 mb-8 md:mb-12 bg-pink-50/90 backdrop-blur-md border-b border-black/5 -mx-4 md:-mx-8 px-4 md:px-8 overflow-x-clip">
        <button 
          onClick={onBack}
          className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-[0.4em] text-black border border-black/10 px-4 md:px-6 py-2 md:py-2.5 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-1.5 md:gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> <span className="hidden xs:inline">Back to</span> Projects
        </button>

        <a 
          href={project.github || "#"} 
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-[0.4em] bg-black text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full hover:bg-black/80 transition-all flex items-center gap-1.5 md:gap-2"
        >
          GitHub <span className="opacity-50">↗</span>
        </a>
      </div>
      
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
        <h2 className="text-3xl md:text-6xl font-semibold tracking-tighter text-black leading-tight break-words">{project.title}</h2>

        {/* Card deck — click to jump to screenshots */}
        {project.screenshots && (
          <motion.button
            onClick={() => screenshotsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="relative shrink-0 w-32 h-24 mt-2 cursor-pointer"
            aria-label="View screenshots"
            whileHover="fanned"
            initial="stacked"
          >
            {project.screenshots.slice(0, 3).map((s, i) => {
              const stackedRotations = [-8, -4, 0];
              const fannedTransforms = [
                { rotate: -20, x: -32, y: -6 },
                { rotate: -6, x: -8, y: -10 },
                { rotate: 8, x: 18, y: -6 },
              ];
              return (
                <motion.div
                  key={i}
                  variants={{
                    stacked: { rotate: stackedRotations[i] ?? 0, x: 0, y: 0, zIndex: i },
                    fanned: { rotate: fannedTransforms[i]?.rotate ?? 0, x: fannedTransforms[i]?.x ?? 0, y: fannedTransforms[i]?.y ?? 0, zIndex: i },
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22, delay: i * 0.04 }}
                  className="absolute inset-0 rounded-2xl border border-black/10 bg-white shadow-md flex items-center justify-center"
                  style={{ originX: '50%', originY: '80%' }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/20">
                    <rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </motion.div>
              );
            })}
            <motion.span
              variants={{ stacked: { opacity: 0 }, fanned: { opacity: 1 } }}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-black/30 whitespace-nowrap"
            >
              view screenshots
            </motion.span>
          </motion.button>
        )}
      </div>
      <p className="text-sm font-medium text-black mb-12 max-w-2xl leading-relaxed">{project.tags}</p>

      {/* Top Section: Metrics + Tech Stack */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-20 mb-20 items-start">
        {/* Left 50% - Bento Box Metrics */}
        {project.metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-1">
            {project.metrics.map((m, index) => {
              const isFeatured = index === 0;
              return (
                <div 
                  key={m.label} 
                  className={`group relative overflow-hidden bg-white/60 border border-black/5 rounded-lg p-6 md:p-8 hover:bg-white hover:border-black/10 hover:shadow-xl hover:shadow-black/5 transition-all duration-500 flex flex-col justify-center min-w-0 ${
                    isFeatured ? 'md:col-span-2 md:row-span-1' : 'md:col-span-1 md:row-span-1'
                  }`}
                >
                  <p className={`font-mono text-black/40 uppercase tracking-[0.3em] mb-4 relative z-10 ${isFeatured ? 'text-[11px]' : 'text-[9px]'}`}>
                    {m.label}
                  </p>
                  <p className={`font-black text-black leading-none tracking-tight mb-3 relative z-10 break-words hyphens-auto ${isFeatured ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                    {m.value}
                  </p>
                  {m.sub && (
                    <p className={`text-black/60 font-medium leading-relaxed relative z-10 ${isFeatured ? 'text-[13px] max-w-sm mt-4' : 'text-[11px] mt-2'}`}>
                      {m.sub}
                    </p>
                  )}
                  
                  {/* Subtle gradient glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              );
            })}
          </div>
        )}

        {/* Right 50% - Tech Stack */}
        {project.stack && (
          <div className="flex flex-col xl:items-start pt-2 w-full min-w-0">
            <span className="text-[10px] font-mono font-bold text-black uppercase tracking-[0.3em] mb-5">Tech Stack</span>
            <div className="grid grid-cols-4 gap-0 w-full max-w-[320px] md:max-w-[380px]">
              {project.stack.map((item, index) => {
                let layoutClass = "flex-col items-center justify-center gap-1.5 p-1"; 
                let spanClass = "col-span-1 row-span-1 aspect-square";
                let textClass = "text-[9px] md:text-[10px] text-center";
                let iconSize = 20;
                
                if (index === 0) {
                  spanClass = "col-span-2 row-span-2 aspect-square";
                  layoutClass = "flex-col items-center justify-center gap-3 p-2 md:p-3";
                  textClass = "text-[14px] md:text-[16px] text-center";
                  iconSize = 56;
                } else if (index === 1) {
                  spanClass = "col-span-2 row-span-1 aspect-[2/1]";
                  layoutClass = "flex-col items-center justify-center gap-1 p-1.5 md:p-2";
                  textClass = "text-[11px] md:text-[12px] text-center";
                  iconSize = 28;
                } else if (index === 6) {
                  spanClass = "col-span-2 row-span-1 aspect-[2/1]";
                  layoutClass = "flex-col items-center justify-center gap-1 p-1.5 md:p-2";
                  textClass = "text-[11px] md:text-[12px] text-center";
                  iconSize = 28;
                }

                return (
                  <motion.button 
                    key={item.name}
                    onClick={handleStackClick}
                    initial="rest"
                    whileHover="hover"
                    variants={{
                      rest: { zIndex: 1 },
                      hover: { zIndex: 50 }
                    }}
                    className={`group relative bg-white/60 border border-black/5 hover:border-black/10 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-500 rounded-none flex min-w-0 overflow-visible ${spanClass} ${layoutClass}`}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(100%+2px)] px-2.5 py-1.5 bg-black text-white text-[8px] font-mono uppercase tracking-widest rounded opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out whitespace-nowrap pointer-events-none shadow-xl origin-bottom">
                      Why did I use this? ↗
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-black"></div>
                    </div>
                    <div className="relative shrink-0 order-last md:order-none">
                      <motion.div 
                        variants={{
                          rest: { scale: 1, rotate: 0, y: 0 },
                          hover: { scale: 1.65, rotate: -14, y: -6 }
                        }}
                        transition={{ type: "spring", stiffness: 600, damping: 10, mass: 0.8 }}
                        className="text-black"
                      >
                        {React.cloneElement(item.icon, { size: iconSize })}
                      </motion.div>
                    </div>
                    <motion.span 
                      variants={{
                        rest: { y: 0 },
                        hover: { y: 4 }
                      }}
                      transition={{ type: "spring", stiffness: 600, damping: 14 }}
                      className={`font-mono font-bold text-black uppercase tracking-widest break-words line-clamp-2 ${textClass}`}
                    >
                      {item.name}
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>
            <p className="text-[10px] font-mono text-black/40 mt-5 leading-relaxed">
              Click any tool to jump to technical sections
            </p>
          </div>
        )}
      </div>

      {/* View Toggle */}
      {(project.overview || project.technicalSections) && (
        <div className="flex gap-6 md:gap-12 mb-12 md:mb-16 border-b border-black/5 relative overflow-x-auto no-scrollbar">
          {['overview', 'technical'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`pb-4 text-[10px] md:text-[11px] font-mono uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all relative whitespace-nowrap ${
                view === v ? 'text-black font-bold' : 'text-black/20 hover:text-black/40'
              }`}
            >
              {v}
              {view === v && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-black z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      )}
      
      <div className="space-y-12">
        <div className="max-w-5xl">
          {view === 'overview' ? (
            <div className="grid grid-cols-1 gap-12 lg:gap-20">
              {/* Main Content Flow */}
              <div className="space-y-24 min-w-0">

                {/* 0. What is this — plain English for non-technical readers */}
                {project.whatIsThis && (
                  <div className="max-w-2xl space-y-3">
                    <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-black/30 uppercase">What is this?</p>
                    <p className="text-[15px] text-black leading-relaxed font-medium">{project.whatIsThis}</p>
                  </div>
                )}

                {/* 0b. Interactive 3-layer diagram — data driven from project.overviewLayers */}
                {project.overviewLayers && (
                  <div className="space-y-6">
                    <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-black/30 uppercase">How it's built</p>
                    <div className="flex flex-col md:flex-row items-stretch gap-0">
                      {project.overviewLayers.map((layer, i) => (
                        <React.Fragment key={i}>
                          <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12, duration: 0.45 }}
                            whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
                            className={`group flex-1 p-6 md:p-8 rounded-2xl border-2 ${layer.colorBg} ${layer.colorBorder} cursor-default`}
                          >
                            <div className={`${layer.colorIcon} mb-5`}>{layer.icon}</div>
                            <p className="text-[18px] font-black text-black tracking-tight leading-tight mb-1">{layer.label}</p>
                            <p className="text-[11px] text-black/40 font-mono uppercase tracking-wider mb-5">{layer.tagline}</p>
                            <ul className="space-y-2.5 mb-5">
                              {layer.bullets.map((b, j) => (
                                <li key={j} className="flex items-center gap-2.5 text-[13px] text-black/70 font-medium">
                                  <span className={`w-1.5 h-1.5 rounded-full ${layer.colorDot} shrink-0`}></span>
                                  {b}
                                </li>
                              ))}
                            </ul>
                            <div className="overflow-hidden border-t border-black/10 pt-4 max-h-0 group-hover:max-h-20 transition-all duration-500">
                              <p className="text-[12px] text-black/50 italic leading-relaxed">{layer.reveal}</p>
                            </div>
                          </motion.div>
                          {i < project.overviewLayers.length - 1 && (
                            <div className="flex md:items-center justify-center py-4 md:py-0 md:px-3">
                              <div className="relative md:w-10 w-px md:h-px h-10 bg-black/10 rounded-full overflow-hidden">
                                <motion.div
                                  className="absolute w-2.5 h-2.5 rounded-full bg-black/30 -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:left-0 top-0 left-1/2"
                                  animate={{ left: ['0%', '100%'] }}
                                  transition={{ duration: 1.6, delay: i * 0.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
                                />
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    {project.featureChips && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.featureChips.map((f, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.025 }}
                            whileHover={{ scale: 1.06, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                            className="text-[12px] font-medium px-3.5 py-1.5 rounded-full border border-black/10 bg-white text-black cursor-default shadow-sm"
                          >
                            {f}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 0c. Screenshot section */}
                {project.screenshots && (
                  <div ref={screenshotsRef} className="space-y-4 scroll-mt-20">
                    <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-black/30 uppercase">Screenshots</p>
                    <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar">
                      {project.screenshots.map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                          className="shrink-0 w-72 h-48 rounded-2xl border border-black/10 bg-black/[0.02] flex flex-col items-center justify-center gap-2 text-black/20 hover:border-black/20 hover:bg-black/[0.03] transition-colors"
                        >
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                          <span className="text-[11px] font-mono">{s.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Why / Context */}
                {project.whyParagraph && (
                  <div className="max-w-3xl">
                    <p className="text-[18px] text-black leading-relaxed font-normal opacity-90">
                      {project.whyParagraph}
                    </p>
                  </div>
                )}

                {/* 3. Build Story */}
                {project.buildStory && (
                  <div className="max-w-3xl py-8 px-6 md:px-10 border-l-2 border-black/5 bg-black/[0.01]">
                    <p className="text-[14px] text-black/60 leading-relaxed italic">
                      {project.buildStory}
                    </p>
                  </div>
                )}




              </div>

              {/* 7. Tech Stack Sidebar (Moved to top section) */}
            </div>
          ) : (
            <div className="space-y-24 min-w-0">
              {/* Detailed architecture diagram — controlled by project.showArchDiagram */}
              {project.showArchDiagram && (
                <div className="space-y-4">
                  <h4 className="text-[15px] font-mono font-bold tracking-widest text-black">Request Flow</h4>
                  <ArchDiagram />
                </div>
              )}



              {/* Performance Proof Section */}
              <div className="grid md:grid-cols-2 gap-20">
                {/* Benchmark Table */}
                {project.benchmarks && (
                  <div>
                    <h4 className="text-[15px] font-mono font-bold tracking-widest text-black mb-10">Performance Proof</h4>
                    <div className="border border-black/10 rounded-xl overflow-x-auto bg-black/[0.02]">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-black/10 bg-black/5">
                            <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-black/50">Scenario</th>
                            <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-black/50">Throughput</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.benchmarks.map((b, i) => (
                            <tr key={i} className="border-b border-black/5 last:border-0 hover:bg-black/[0.03] transition-colors">
                              <td className="px-6 py-4 text-[13px] font-semibold text-black">{b.scenario}</td>
                              <td className="px-6 py-4 text-[13px] font-mono text-black">{b.throughput}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Timeline Section */}
                {project.timeline && (
                  <div>
                    <h4 className="text-[15px] font-mono font-bold tracking-widest text-black mb-10">Development Timeline</h4>
                    <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-black/10">
                      {project.timeline.map(item => (
                        <div key={item.date} className="pl-8 relative group/time">
                          <div className="absolute left-0 top-2 w-[15px] h-[15px] -translate-x-[7px] rounded-full bg-white border-2 border-black/20 group-hover/time:border-black transition-colors"></div>
                          <div className="flex gap-6 items-baseline">
                            <p className="text-[10px] font-mono text-black/40 uppercase tracking-widest min-w-[60px]">{item.date}</p>
                            <p className="text-[14px] text-black font-medium leading-snug">{item.event}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* What I used & for what Section */}
              {project.tools && (
                <div className="pt-20 border-t border-black/10">
                  <h4 ref={toolsRef} className="text-[15px] font-mono font-bold tracking-widest text-black mb-12">What I used & for what</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {project.tools.map((tool, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                        key={tool.name} 
                        className="group relative p-6 md:p-8 rounded-3xl bg-white border border-black/[0.06] hover:border-purple-900/20 hover:shadow-[0_12px_40px_rgba(88,28,135,0.06)] transition-all duration-500 flex flex-col"
                      >
                        {/* Header: Icon, Name, Desc */}
                        <div className="flex flex-col mb-8 gap-4">
                          <div className="flex items-center gap-4">
                            {tool.icon && (
                              <div className="w-12 h-12 flex items-center justify-center bg-black/[0.02] group-hover:bg-purple-50 rounded-2xl group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 text-black group-hover:text-purple-600">
                                {React.cloneElement(tool.icon, { size: 24 })}
                              </div>
                            )}
                            <div className="flex flex-col justify-center">
                              <span className="text-[16px] font-black tracking-tight text-black">{tool.name}</span>
                              <span className="text-[10px] text-black/40 uppercase tracking-[0.2em] font-mono mt-0.5">{tool.desc}</span>
                            </div>
                          </div>
                        </div>
                        {/* Proof Section (Inset Block) */}
                        <div className="relative mt-auto pt-5 border-t border-black/[0.06] group-hover:border-purple-900/10 transition-colors">
                          <p className="text-[14px] text-black/70 leading-relaxed group-hover:text-black/90 transition-colors">
                            {tool.proof}
                          </p>
                        </div>
                        
                        {/* Subtle Background Glow on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-pink-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why / Context in Technical View */}
              {project.whyParagraph && (
                <div className="pt-20 border-t border-black/10">
                  <h4 className="text-[15px] font-mono font-bold tracking-widest text-black mb-10">Architectural Context</h4>
                  <p className="text-[18px] text-black leading-relaxed font-normal opacity-90 max-w-4xl">
                    {project.whyParagraph}
                  </p>
                </div>
              )}

              {/* Technical Deep Dives (Code) */}
              {project.technicalSections && (
                <div className="space-y-24">
                  <h4 className="text-[15px] font-mono font-bold tracking-widest text-black mb-10">System Implementation</h4>
                  {project.technicalSections.map((section, i) => (
                    <div key={i} className="group">
                      <h5 className="text-[12px] font-bold text-black mb-10 uppercase tracking-[0.3em] font-mono">{section.title}</h5>
                      <div className="grid md:grid-cols-[1.2fr_1fr] gap-16">
                        <div>
                          <p className="text-[17px] text-black leading-relaxed font-normal opacity-90">
                            {section.desc}
                          </p>
                        </div>
                        {section.code && (
                          <div className="relative group/code min-w-0 overflow-x-auto">
                            <pre className="relative text-[11px] font-mono p-7 bg-black text-white rounded-xl overflow-x-auto shadow-2xl leading-relaxed border border-white/10">
                              <code className="language-cpp">{section.code}</code>
                            </pre>

                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Technical Learnings */}
              {project.learnings && (
                <div className="pt-20 border-t border-black/10 space-y-12">
                  <h4 className="text-[15px] font-mono font-bold tracking-widest text-black">Stuff I got wrong at first</h4>
                  <div className="grid md:grid-cols-2 gap-8">
                    {project.learnings.map((l, i) => (
                      <div key={i} className="p-8 border border-black/10 rounded-2xl bg-white hover:border-black transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <h5 className="text-[13px] font-bold text-black mb-4 uppercase tracking-widest">{l.title}</h5>
                        <p className="text-[15px] text-black/70 leading-relaxed">{l.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-32 pt-12 border-t border-black/5 flex justify-between items-center">
        <div></div>
      </div>
    </motion.div>
  );
};
