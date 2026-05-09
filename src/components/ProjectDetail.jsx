import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export const ProjectDetail = ({ project, view, setView, onBack }) => {
  const toolsRef = useRef(null);

  const handleStackClick = () => {
    setView('technical');
    setTimeout(() => {
      toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
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
      
      <h2 className="text-6xl font-semibold mb-6 tracking-tighter text-black">{project.title}</h2>
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

                {/* 4. Things that broke my mental model */}
                <div className="space-y-12">
                  <h4 className="text-[15px] font-mono font-bold tracking-widest text-black">Things that broke my mental model</h4>
                  <div className="grid md:grid-cols-2 gap-8">
                    {project.learnings?.map((l, i) => (
                      <div key={i} className="p-8 border border-black/10 rounded-2xl bg-white hover:border-black transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <h5 className="text-[13px] font-bold text-black mb-4 uppercase tracking-widest">{l.title}</h5>
                        <p className="text-[15px] text-black/70 leading-relaxed">
                          {l.desc}
                        </p>
                      </div>
                    ))}
                  </div>
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
              </div>

              {/* 7. Tech Stack Sidebar */}
              <div className="space-y-10">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.4em] text-black/40 text-right">Tech Stack</h4>
                <div className="flex flex-col gap-6 items-end sticky top-32">
                  {project.stack?.map(item => (
                    <button 
                      key={item.name}
                      onClick={handleStackClick}
                      className="group relative flex items-center gap-4 w-fit"
                    >
                      <div className="absolute right-full mr-4 px-3 py-1.5 bg-black text-white text-[9px] font-mono uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl">
                        See how I used this ↗
                      </div>
                      <div className="p-3 bg-black/[0.03] rounded-xl group-hover:bg-black group-hover:invert transition-all duration-300">
                        {item.icon}
                      </div>
                    </button>
                  ))}
                  <p className="text-[9px] font-mono text-black/30 text-right mt-4 leading-relaxed">
                    Click to see what I<br />actually used these for →
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-24">
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
                            {tool.icon && <div className="p-2.5 bg-black/[0.03] rounded-xl group-hover:bg-black transition-all duration-300 group-hover:invert scale-110">{tool.icon}</div>}
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

              {/* Technical Deep Dives */}
              <div className="pt-20 border-t border-black/10 space-y-24">
                <h4 className="text-[15px] font-mono font-bold tracking-widest text-black mb-10">Design Documentation</h4>
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
                             <span className="text-[9px] font-mono text-black/40 uppercase tracking-widest">Hot Path Optimization</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
