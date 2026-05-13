import React from 'react';
import { motion } from 'framer-motion';
import { ScrambleText } from './ScrambleText';
import { SlotMachineText } from './SlotMachineText';

export const Identity = ({ identity }) => {
  return (
    <div className="md:sticky md:top-0 md:h-screen flex flex-col justify-center py-12 md:py-0">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="space-y-12"
      >
        {/* Avatar Section */}
        <div className="relative group w-fit">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <button 
              onClick={() => window.location.reload()}
              className="relative w-20 h-20 rounded-full border border-black/5 overflow-hidden bg-white flex items-center justify-center transition-all duration-500 group-hover:border-black/20 group-hover:shadow-2xl group-hover:shadow-black/5"
            >
              <img 
                src={identity.photo} 
                alt="Avatar" 
                className="w-14 h-14 opacity-90 transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </motion.div>
          
          {/* Status Indicator */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-black/5"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
            </div>
          </motion.div>
        </div>

        {/* Heading Section */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tight text-black leading-none uppercase italic block">
              <SlotMachineText text={identity.name} delay={0.5} />
            </h1>
            <p className="text-black text-lg font-bold tracking-tight leading-tight max-w-[280px]">
              {identity.oneLine}
            </p>
          </div>
          <p className="text-black text-[13px] leading-relaxed max-w-[300px] font-medium">
            {identity.philosophy}
          </p>
        </div>

        {/* Stack Tokens */}
        <div className="space-y-3">
          <h4 className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-black/50">
            What I build with
          </h4>
          <div className="flex flex-wrap gap-2">
            {identity.stack?.map((tech, i) => (
              <motion.div 
                key={tech.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/[0.02] border border-black/[0.1] text-[11px] text-black hover:bg-black/5 hover:border-black/20 transition-all cursor-default font-bold"
              >
                <div className="w-4 h-4 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                  {tech.icon}
                </div>
                {tech.label}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4 pt-4">
          <div className="flex gap-4">
            {identity.links?.map((link, i) => (
              <motion.a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-black border border-black/10 hover:border-black/30 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all active:scale-90"
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
          
        </div>
      </motion.div>
    </div>
  );
};
