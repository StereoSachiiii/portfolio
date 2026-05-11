import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { data } from './data';
import { Identity } from './components/Identity';
import { ProjectDetail } from './components/ProjectDetail';
import { StackDropdown } from './components/StackDropdown';

export default function App() {
  const [tab, setTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectView, setProjectView] = useState("overview");
  const [hoveredTech, setHoveredTech] = useState(null);

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
        <div className="flex flex-col py-12 md:py-16 min-h-screen">
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
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
                    {data.projects.map((project, index) => {
                      const categoryStyles = {
                        SYSTEMS: { border: 'border-black', tag: 'bg-black text-white', accent: 'bg-black/5', gradient: 'from-black/10 to-transparent' },
                        OS: { border: 'border-blue-500', tag: 'bg-blue-600 text-white', accent: 'bg-blue-50', gradient: 'from-blue-500/10 to-transparent' },
                        WEB: { border: 'border-orange-500', tag: 'bg-orange-600 text-white', accent: 'bg-orange-50', gradient: 'from-orange-500/10 to-transparent' },
                        ML: { border: 'border-purple-500', tag: 'bg-purple-600 text-white', accent: 'bg-purple-50', gradient: 'from-purple-500/10 to-transparent' }
                      };
                      const style = categoryStyles[project.category] || categoryStyles.WEB;

                      return (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                          onClick={() => {
                            setSelectedProject(project);
                            setProjectView("overview");
                          }}
                          className="group relative cursor-pointer flex flex-col h-full bg-white border border-black/10 rounded-2xl overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500"
                        >
                          {/* Card Header / Visual Area */}
                          <div className={`h-36 w-full ${style.accent} relative flex items-center justify-center overflow-hidden`}>
                            {/* Abstract Background Elements */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-50`}></div>
                            <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
                              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                            </div>
                            
                            <div className="z-10 flex flex-col items-center text-center px-4">
                              <span className={`text-[8px] font-mono font-bold tracking-[0.4em] px-2.5 py-1 rounded-full uppercase mb-2.5 ${style.tag} shadow-lg shadow-black/5`}>
                                {project.category}
                              </span>
                              {project.highlight && (
                                <div className="text-black font-bold text-xs md:text-sm tracking-tighter bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/20 shadow-xl shadow-black/5 transform group-hover:scale-105 transition-transform duration-500">
                                  {project.highlight}
                                </div>
                              )}
                            </div>

                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                              <ArrowUpRight className="text-black/40 group-hover:text-black" size={18} />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-6 md:p-8 flex flex-col">
                            <div className="flex-1 space-y-3">
                              <h3 className="text-2xl font-black tracking-tighter text-black leading-none">
                                {project.title}
                              </h3>
                              <p className="text-black/50 text-sm leading-relaxed font-medium line-clamp-2">
                                {project.description}
                              </p>

                              {/* Surfacing a key metric if available */}
                              {project.metrics && project.metrics.length > 0 && (
                                <div className="pt-2 flex gap-6">
                                  {project.metrics.slice(0, 2).map((m, i) => (
                                    <div key={i} className="flex flex-col">
                                      <span className="text-[8px] font-mono font-bold text-black/30 uppercase tracking-[0.2em] mb-0.5">{m.label}</span>
                                      <span className="text-[11px] font-bold text-black/80">{m.value}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-2.5">
                                  {project.stack?.slice(0, 5).map((tech, i) => (
                                    <div 
                                      key={i} 
                                      className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center p-1.5 shadow-sm relative z-[10] hover:z-[20] hover:-translate-y-1 transition-all"
                                      title={tech.name || tech.label}
                                    >
                                      {tech.icon}
                                    </div>
                                  ))}
                                </div>
                                {project.stack?.length > 5 && (
                                  <span className="text-[10px] font-bold text-black/20 ml-1">
                                    +{project.stack.length - 5}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-1.5 group/btn text-black/30 hover:text-black transition-colors">
                                <span className="text-[9px] font-bold tracking-[0.2em] uppercase">
                                  Proof
                                </span>
                                <ArrowUpRight size={12} className="opacity-0 group-hover/btn:opacity-100 transition-all" />
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
                        <div className="flex flex-wrap gap-x-16 gap-y-12">
                          {cat.items.map((item, j) => (
                            <div 
                              key={j} 
                              className="group relative"
                              onMouseEnter={() => setHoveredTech(item.name)}
                              onMouseLeave={() => setHoveredTech(null)}
                            >
                              {/* Technical Keyword */}
                              <div className="flex items-center gap-4 cursor-default group/keyword">
                                <div className="transition-transform duration-300 group-hover/keyword:scale-110">
                                  {item.icon}
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-baseline gap-3">
                                    <span className="text-xl font-bold text-black border-b border-black/5 group-hover:border-black transition-all tracking-tight">
                                      {item.name}
                                    </span>
                                    {item.projects?.length > 0 && (
                                      <span className="text-[10px] font-mono font-bold text-black/20 group-hover:text-black/40 transition-colors">
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
                                    onProjectClick={(projData) => {
                                      const fullProject = data.projects.find(p => p.id === projData.id);
                                      if (fullProject) {
                                        setSelectedProject(fullProject);
                                        setProjectView("technical");
                                        // The ProjectDetail component will handle the scroll to technical proof
                                      }
                                    }}
                                  />
                                )}
                              </AnimatePresence>
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