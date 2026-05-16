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
      className="w-full relative"
    >
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-50 flex justify-between items-center py-6 mb-12 bg-white/90 backdrop-blur-md border-b border-black/5 -mx-4 px-4">
        <button 
          onClick={onBack}
          className="text-[10px] font-mono uppercase tracking-[0.4em] text-black border border-black/10 px-6 py-2.5 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Projects
        </button>

        <a 
          href={project.github || "#"} 
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono uppercase tracking-[0.4em] bg-black text-white px-6 py-2.5 rounded-full hover:bg-black/80 transition-all flex items-center gap-2"
        >
          View on GitHub <span className="opacity-50">↗</span>
        </a>
      </div>
      
      <div className="flex items-start justify-between gap-6 mb-6">
        <h2 className="text-6xl font-semibold tracking-tighter text-black">{project.title}</h2>

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

      {/* Metrics Header Row */}
      {project.metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 border-y border-black/5 py-10">
          {project.metrics.map(m => (
            <div key={m.label} className="group">
              <p className="text-[10px] text-black/40 uppercase tracking-[0.3em] mb-3 font-mono">{m.label}</p>
              <p className="text-3xl font-semibold text-black leading-tight tracking-tight">{m.value}</p>
              {m.sub && <p className="text-[11px] text-black mt-2 italic font-medium">{m.sub}</p>}
            </div>
          ))}
        </div>
      )}

      {/* View Toggle */}
      {(project.overview || project.technicalSections) && (
        <div className="flex gap-12 mb-16 border-b border-black/5 relative">
          {['overview', 'technical'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`pb-4 text-[11px] font-mono uppercase tracking-[0.4em] transition-all relative ${
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
            <div className="grid md:grid-cols-[1fr_180px] gap-20">
              {/* Main Content Flow */}
              <div className="space-y-24">

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
                <div className="max-w-3xl">
                  <p className="text-[18px] text-black leading-relaxed font-normal opacity-90">
                    {project.whyParagraph}
                  </p>
                </div>

                {/* 3. Build Story */}
                <div className="max-w-3xl py-8 px-10 border-l-2 border-black/5 bg-black/[0.01]">
                  <p className="text-[14px] text-black/60 leading-relaxed italic">
                    {project.buildStory}
                  </p>
                </div>


                {/* 6. Limitations / Next Steps */}
                <div className="grid md:grid-cols-2 gap-20 pt-12 border-t border-black/5">
                  <div className="space-y-8">
                    <h4 className="text-[12px] font-mono font-bold tracking-widest text-black/40 uppercase italic">Honest Limitations</h4>
                    <ul className="space-y-4">
                      {project.limitations?.map((item, i) => (
                        <li key={i} className="text-[13px] font-mono text-black/60 flex items-start gap-3">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-black/20 shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-8">
                    <h4 className="text-[12px] font-mono font-bold tracking-widest text-black/40 uppercase italic">What's Next</h4>
                    <ul className="space-y-4">
                      {project.nextSteps?.map((item, i) => (
                        <li key={i} className="text-[13px] font-mono text-black flex items-start gap-3">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-black shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA for technical readers */}
                <motion.button
                  onClick={() => setView('technical')}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="group flex items-center justify-between w-full max-w-2xl px-6 py-5 rounded-2xl border border-black/10 hover:border-black/30 hover:bg-black/[0.01] transition-colors text-left"
                >
                  <div>
                    <p className="text-[13px] font-bold text-black">Built without any frameworks</p>
                    <p className="text-[12px] text-black/40 mt-0.5">See the architecture, request flow, and what I learned building this →</p>
                  </div>
                  <span className="text-black/20 group-hover:text-black transition-colors text-xl font-light ml-4">→</span>
                </motion.button>
              </div>

              {/* 7. Tech Stack Sidebar */}
              <div className="space-y-10">
                <div className="flex flex-col gap-3 items-end sticky top-32">
                  <span className="text-[10px] font-mono font-bold text-black uppercase tracking-[0.3em] mb-4">Tech Stack</span>
                  {project.stack?.map(item => (
                    <button 
                      key={item.name}
                      onClick={handleStackClick}
                      className="group flex items-center gap-4 w-fit px-5 py-2.5 bg-white border border-black/5 hover:border-black hover:bg-black transition-all duration-300 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                    >
                      <span className="text-[12px] font-mono font-bold text-black group-hover:text-white transition-colors uppercase tracking-widest">
                        {item.name}
                      </span>
                      <div className="relative">
                        <div className="absolute right-full mr-4 top-1 px-3 py-1 bg-black text-white text-[9px] font-mono uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl">
                          Implementation proof ↗
                        </div>
                        <div className="transition-transform duration-300 group-hover:scale-110">
                          {React.cloneElement(item.icon, { size: 18 })}
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  <p className="text-[10px] font-mono text-black/40 text-right mt-6 leading-relaxed max-w-[140px]">
                    Click to jump to technical sections
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-24">
              {/* Detailed architecture diagram — controlled by project.showArchDiagram */}
              {project.showArchDiagram && (
                <div className="space-y-4">
                  <h4 className="text-[15px] font-mono font-bold tracking-widest text-black">Request Flow</h4>
                  <ArchDiagram />
                </div>
              )}

              {/* Stuff I got wrong at first */}
              {project.learnings && (
                <div className="space-y-12">
                  <h4 className="text-[15px] font-mono font-bold tracking-widest text-black">Stuff I got wrong at first</h4>
                  <div className="grid md:grid-cols-2 gap-8">
                    {project.learnings.map((l, i) => (
                      <div key={i} className="p-8 border border-black/10 rounded-2xl bg-white hover:border-black transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <h5 className="text-[13px] font-bold text-black mb-4">{l.title}</h5>
                        <p className="text-[15px] text-black/70 leading-relaxed">{l.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Proof Section */}
              <div className="grid md:grid-cols-2 gap-20">
                {/* Benchmark Table */}
                {project.benchmarks && (
                  <div>
                    <h4 className="text-[15px] font-mono font-bold tracking-widest text-black mb-10">Performance Proof</h4>
                    <div className="border border-black/10 rounded-xl overflow-hidden bg-black/[0.02]">
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
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-16">
                    {project.tools.map((tool) => (
                      <div key={tool.name} className="group">
                        <div className="flex items-center gap-4 mb-5">
                          <div className="flex items-center gap-3">
                            {tool.icon && (
                              <div className="p-2.5 bg-black/[0.03] rounded-xl group-hover:bg-black/5 transition-all duration-300 scale-110">
                                {React.cloneElement(tool.icon, { size: 20 })}
                              </div>
                            )}
                            <span className="text-[15px] font-bold font-mono text-black uppercase tracking-wider">{tool.name}</span>
                          </div>
                          <span className="text-[9px] text-black/30 uppercase tracking-[0.2em] font-mono">{tool.desc}</span>
                        </div>
                        <div className="pl-6 border-l border-l-black/10">
                          <p className="text-[14px] text-black leading-relaxed opacity-80">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-black/40 mr-3 italic">Proof:</span>
                            {tool.proof}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why / Context in Technical View */}
              <div className="pt-20 border-t border-black/10">
                <h4 className="text-[15px] font-mono font-bold tracking-widest text-black mb-10">Architectural Context</h4>
                <p className="text-[18px] text-black leading-relaxed font-normal opacity-90 max-w-4xl">
                  {project.whyParagraph}
                </p>
              </div>

              {/* Technical Deep Dives (Code) */}
              <div className="space-y-24">
                <h4 className="text-[15px] font-mono font-bold tracking-widest text-black mb-10">System Implementation</h4>
                {project.technicalSections?.map((section, i) => (
                  <div key={i} className="group">
                    <h5 className="text-[12px] font-bold text-black mb-10 uppercase tracking-[0.3em] font-mono">{section.title}</h5>
                    <div className="grid md:grid-cols-[1.2fr_1fr] gap-16">
                      <div>
                        <p className="text-[17px] text-black leading-relaxed font-normal opacity-90">
                          {section.desc}
                        </p>
                      </div>
                      {section.code && (
                        <div className="relative group/code">
                          <pre className="relative text-[11px] font-mono p-7 bg-black text-white rounded-xl overflow-x-auto shadow-2xl leading-relaxed border border-white/10">
                            <code className="language-cpp">{section.code}</code>
                          </pre>
                            <div className="mt-4 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                              <span className="text-[9px] font-mono text-black/40 uppercase tracking-widest">
                                {section.label || "System Logic"}
                              </span>
                            </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

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
