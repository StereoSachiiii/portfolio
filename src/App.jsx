import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { data } from './data';
import { Identity } from './components/Identity';
import { ProjectDetail } from './components/ProjectDetail';

export default function App() {
  const [tab, setTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectView, setProjectView] = useState("overview");

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white relative overflow-x-clip">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-10 grayscale mix-blend-multiply"
        >
          <source src="/vecteezy_clean-backdrop-loop_13695175.mov" />
        </video>
        <div className="absolute inset-0 bg-white/80"></div>
      </div>

      <main className="relative z-10 w-full px-8 md:px-16 lg:px-32 grid md:grid-cols-[280px_1fr] gap-12 md:gap-32">
        
        {/* Left Side: Identity */}
        <Identity identity={data.identity} />

        {/* Right Side: Content Panel */}
        <div className="flex flex-col py-24 md:py-32 min-h-screen">
          <AnimatePresence mode="wait">
            {!selectedProject ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                <nav className="flex gap-16 mb-16 border-b border-black/10">
                  {['projects', 'stack', 'writing'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`pb-6 text-2xl transition-all relative font-bold tracking-tighter ${
                        tab === t ? 'text-black' : 'text-black/20 hover:text-black/40'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                      {tab === t && (
                        <motion.div 
                          layoutId="mainTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-black"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  ))}
                </nav>

                {tab === 'projects' ? (
                  <div className="grid grid-cols-1 gap-12">
                    {data.projects.map((project, index) => {
                      const isFeatured = index === 0;
                      return (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => {
                            setSelectedProject(project);
                            setProjectView("overview");
                          }}
                          className={`group cursor-pointer border border-black/5 rounded-3xl transition-all duration-500 overflow-hidden ${
                            isFeatured 
                            ? 'bg-white p-12 hover:border-black shadow-[0_4px_30px_rgba(0,0,0,0.02)]' 
                            : 'p-8 hover:bg-black/[0.02] hover:border-black/20'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                            <div className="flex-1 space-y-6">
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono font-bold tracking-[0.2em] bg-black text-white px-3 py-1 rounded-full uppercase">
                                  {project.category}
                                </span>
                                <span className="text-[11px] font-mono text-black/30">{project.date}</span>
                              </div>
                              
                              <div>
                                <h3 className={`font-semibold tracking-tighter text-black mb-4 group-hover:text-black transition-colors ${
                                  isFeatured ? 'text-4xl' : 'text-2xl'
                                }`}>
                                  {project.title}
                                </h3>
                                <p className={`text-black opacity-60 leading-relaxed max-w-2xl ${
                                  isFeatured ? 'text-lg' : 'text-sm'
                                }`}>
                                  {project.tags}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col items-end justify-center min-w-[140px]">
                              <div className="flex -space-x-2">
                                {project.stack?.slice(0, 3).map((s, i) => (
                                  <div key={i} className="w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center p-1.5 shadow-sm">
                                    {s.icon}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : tab === 'stack' ? (
                  <div className="space-y-20">
                    {data.fullStack.map((cat, i) => (
                      <div key={i} className="space-y-8">
                        <h4 className="text-[11px] font-mono font-bold tracking-[0.4em] text-black/30 uppercase border-b border-black/5 pb-4">
                          {cat.category}
                        </h4>
                        <div className="flex flex-wrap gap-x-12 gap-y-8">
                          {cat.items.map((item, j) => (
                            <div key={j} className="group relative">
                              {/* Technical Keyword */}
                              <div className="flex items-center gap-6 cursor-default group/keyword">
                                <div className="transition-transform duration-300 group-hover/keyword:scale-110">
                                  {item.icon}
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-black border-b border-black/5 group-hover:border-black transition-all tracking-tight">
                                      {item.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
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
  );
}