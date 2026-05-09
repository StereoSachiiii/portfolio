import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, SquarePen, Mail, Rss, ArrowUpRight, Code2, Terminal, Cpu } from 'lucide-react';

const portfolioContent = {
    identity: {
        name: "Sachin Lakshitha",
        oneLine: "going deeper than the abstraction until something real appears",
        philosophy: "one day i hope to maintain systems and infrastructure that the world and other engineers depend on, even a small one.",
        photo: "https://api.dicebear.com/7.x/initials/svg?seed=SL&backgroundColor=ffffff&fontFamily=DM+Mono"
    },
    social: [
        { id: "github", icon: <Github size={18} />, url: "https://github.com/StereoSachiiii" },
        { id: "linkedin", icon: <Linkedin size={18} />, url: "https://linkedin.com/in/sachin-lakshitha-97425a306" },
        { id: "medium", icon: <SquarePen size={18} />, url: "https://medium.com/@niroshasulochini" },
        { id: "email", icon: <Mail size={18} />, url: "mailto:sachinlakshitha20021216@gmail.com" },
        { id: "rss", icon: <Rss size={18} />, url: "rss.xml" }
    ],
    stack: [
        { id: "cpp", label: "C++", icon: <Terminal size={14} /> },
        { id: "python", label: "Python", icon: <Code2 size={14} /> },
        { id: "typescript", label: "TypeScript", icon: <Cpu size={14} /> }
    ],
    projects: [
        {
            id: "backtesting",
            title: "BACKTESTING ENGINE",
            nouns: "NASDAQ ITCH 5.0 · store buffer drain · cache-line aligned",
            description: "A high-performance C++ orderbook reconstructor designed for nanosecond-level latency. It parses raw NASDAQ ITCH 5.0 binary feeds into a cache-aware limit order book using custom lock-free SPSC queues and object pools."
        },
        {
            id: "os-dev-project",
            title: "LUCKY OS",
            nouns: "x86 Assembly · BIOS interrupts · bootloader",
            description: "A 16-bit operating system written in x86 Assembly. Features a custom bootloader, CPUID detection, and a minimal kernel from zero."
        },
        {
            id: "royal-liquor",
            title: "ROYAL LIQUOR",
            nouns: "custom DI container · framework-less SPA · middleware pipeline",
            description: "A full-scale e-commerce platform built from scratch to understand the underlying mechanics of modern PHP frameworks."
        },
        {
            id: "reservation_system",
            title: "RESERVATION SYSTEM",
            nouns: "Spring Boot · STOMP WebSocket · Stripe",
            description: "Enterprise-grade book fair management system with real-time updates and custom stall map designer."
        },
        {
            id: "rag-pipeline",
            title: "RAG PIPELINE",
            nouns: "vector embeddings · groq inference · context-aware retrieval",
            description: "Minimal retrieval-augmented generation pipeline optimized for high-speed expert response systems."
        },
        {
            id: "GPT-2-style-BPE",
            title: "BPE TOKENIZER",
            nouns: "Byte Pair Encoding · NLP · Python",
            description: "Pure Python implementation of the BPE algorithm used in GPT-2, focusing on vocabulary construction from scratch."
        }
    ],
    writing: [
        {
            id: "deadlines",
            title: "Deadlines? — Banned C++ Features in Real-Time Systems",
            url: "https://medium.com/@niroshasulochini/deadlines-83d54ef287bf",
            date: "Mar 2026",
            description: "Why every banned feature in HFT has cost = f(runtime input). WCET analysis, store buffer drains, and making systems provably bounded."
        },
        {
            id: "wildfire",
            title: "How Mathematics is Predicting Wildfire Paths",
            url: "https://medium.com/@niroshasulochini/how-mathematics-is-predicting-wildfire-paths-4fd00dcf3f58",
            date: "Dec 2025",
            description: "ICAPS 2025 research review — Level Set Method combined with Bayesian correction for self-correcting wildfire boundary simulation."
        },
        {
            id: "luckyos",
            title: "Building an OS from Scratch",
            url: "https://medium.com/@niroshasulochini/my-journey-into-the-machine-building-an-os-from-scratch-a87f1d41e11d",
            date: "Jun 2025",
            description: "LuckyOS — a 16-bit operating system written in x86 Assembly. BIOS interrupts, CPUID, custom bootloader, and kernel from zero."
        },
        {
            id: "stored-procedures",
            title: "MySQL Stored Procedures",
            url: "https://medium.com/@niroshasulochini/mysql-stored-procedures-4a75f1dcdfeb",
            date: "Jan 2025",
            description: "Precompiled SQL, reduced network traffic, and encapsulated database logic. When to use them and when to avoid."
        },
        {
            id: "cia-triad",
            title: "The CIA Triad: The Cornerstone of Cyber Security",
            url: "https://medium.com/@niroshasulochini/the-cia-triad-the-cornerstone-of-cyber-security-9a99d0e65bea",
            date: "Jul 2024",
            description: "Confidentiality, Integrity, Availability — the framework for evaluating security measures across digital and physical environments."
        }
    ]
};

const App = () => {
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-inter selection:bg-white/10 selection:text-white relative overflow-hidden">
      {/* Background Video & Noise */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-40 mix-blend-screen grayscale"
        >
          <source src="/vecteezy_clean-backdrop-loop_13695175.mov" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/20 via-[#0a0a0a]/60 to-[#0a0a0a]"></div>
        <div className="noise-overlay"></div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-[1fr_1.5fr] gap-12 md:gap-24">
        
        {/* Left Side: Identity */}
        <div className="flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden mb-6 bg-white/5 flex items-center justify-center backdrop-blur-sm">
                <img src={portfolioContent.identity.photo} alt="Avatar" className="w-8 h-8 opacity-80" />
            </div>
            <h1 className="text-4xl font-light tracking-tight mb-2">{portfolioContent.identity.name}</h1>
            <p className="text-white/40 font-mono text-xs uppercase tracking-[0.2em] mb-4">
              {portfolioContent.identity.oneLine}
            </p>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-8">
              {portfolioContent.identity.philosophy}
            </p>

            {/* Stack Tokens */}
            <div className="flex flex-wrap gap-2 mb-10">
              {portfolioContent.stack.map(tech => (
                <div key={tech.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest uppercase text-white/50 hover:text-white/80 transition-colors cursor-default">
                  {tech.icon}
                  {tech.label}
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {portfolioContent.social.map(link => (
                <a 
                  key={link.id} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Content Panel */}
        <div className="flex flex-col">
          <nav className="flex gap-8 mb-12 border-b border-white/5">
            {['projects', 'writing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs font-mono tracking-[0.2em] uppercase transition-all relative ${
                  activeTab === tab ? 'text-white' : 'text-white/30 hover:text-white/50'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-px bg-white"
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'projects' ? (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.4 }}
                  className="grid gap-12"
                >
                  {portfolioContent.projects.map((project, idx) => (
                    <div key={project.id} className="group relative">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-normal tracking-tight group-hover:text-white transition-colors">{project.title}</h3>
                        <ArrowUpRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors" />
                      </div>
                      <p className="text-[10px] font-mono text-white/30 mb-3 tracking-wider">{project.nouns}</p>
                      <p className="text-sm text-white/50 leading-relaxed max-w-xl">{project.description}</p>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="writing"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.4 }}
                  className="grid gap-8"
                >
                  {portfolioContent.writing.map((post) => (
                    <a 
                      key={post.id} 
                      href={post.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group block border border-white/5 bg-white/[0.02] p-6 rounded-xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-md font-normal leading-snug group-hover:text-white transition-colors">{post.title}</h3>
                        <span className="text-[10px] font-mono text-white/20">{post.date}</span>
                      </div>
                      <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{post.description}</p>
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer / Status */}
      <footer className="fixed bottom-8 left-8 z-20 pointer-events-none hidden md:block">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse"></div>
          <span className="text-[10px] font-mono text-white/30 tracking-[0.2em] uppercase">SYSTEMS READY</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
