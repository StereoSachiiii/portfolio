import React from 'react';
import { motion } from 'framer-motion';

export const Identity = ({ identity }) => {
  return (
    <div className="md:sticky md:top-0 md:h-screen flex flex-col justify-center gap-8 py-24 md:py-0">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button 
          onClick={() => window.location.reload()} // Simplified back to home for now
          className="w-12 h-12 rounded-full border border-black/10 overflow-hidden mb-6 bg-black/5 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        >
          <img src={identity.photo} alt="Avatar" className="w-8 h-8 opacity-90 invert" />
        </button>
        <h1 className="text-3xl font-medium tracking-tight mb-2 text-black">{identity.name}</h1>
        <p className="text-black text-sm mb-4">
          {identity.oneLine}
        </p>
        <p className="text-black text-[13px] leading-relaxed max-w-[300px] mb-8">
          {identity.philosophy}
        </p>

        {/* Stack Tokens */}
        <div className="flex flex-wrap gap-2 mb-10">
          {identity.stack?.map(tech => (
            <div key={tech.label} className="flex items-center gap-2 px-3 py-1 rounded-full border border-black/20 text-[11px] text-black transition-colors cursor-default font-medium">
              {tech.icon}
              {tech.label}
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex gap-6 mb-8">
          {identity.links?.map(link => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:opacity-60 transition-opacity"
            >
              {link.icon}
            </a>
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
          <span className="text-[11px] text-black uppercase tracking-widest font-semibold">open to work</span>
        </div>
      </motion.div>
    </div>
  );
};
