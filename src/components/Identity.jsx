import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Blinking cursor — programmer's signature
const Cursor = () => (
  <motion.span
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" }}
    className="inline-block w-[2px] h-[1em] bg-black align-middle ml-1"
  />
);

export const Identity = ({ identity, className = "", onHoverStart, onHoverEnd }) => {
  return (
    <div className={`md:sticky md:top-0 md:h-screen flex flex-col justify-center pt-12 pb-6 md:py-0 ${className}`}>
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="space-y-12 max-w-full md:max-w-[280px] w-full"
      >
        {/* Avatar Section */}
        <div className="relative group w-fit mx-auto md:mx-0">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <motion.button 
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative w-20 h-20 rounded-full border border-black/5 overflow-hidden bg-white flex items-center justify-center shadow-sm"
            >
              <img 
                src={identity.photo} 
                alt="Avatar" 
                className="w-full h-full object-cover object-top opacity-95 transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.button>
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

        {/* Heading Section — staggered reveal */}
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } }
          }}
        >
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-black leading-none uppercase italic block">
              {identity.name}
            </h1>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
              className="text-black text-lg font-bold tracking-tight leading-tight max-w-xs md:max-w-[280px]"
            >
              {identity.oneLine}<Cursor />
            </motion.p>
          </div>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
            className="text-black text-[13px] leading-relaxed max-w-full md:max-w-[300px] font-medium"
          >
            {identity.philosophy}
          </motion.p>
        </motion.div>

        {/* Stack Tokens */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-mono font-bold tracking-[0.25em] text-black">
            what I build with!
          </h4>
          <div className="flex flex-wrap gap-2 w-full max-w-full">
            {identity.stack?.map((tech, i) => (
              <motion.div
                key={i}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: 0.5 + (i * 0.08), duration: 0.35, ease: "easeOut" } },
                  hover: { y: -3, boxShadow: "0 8px 24px -4px rgba(0,0,0,0.12)", transition: { type: "spring", stiffness: 500, damping: 20 } }
                }}
                onHoverStart={onHoverStart}
                onHoverEnd={onHoverEnd}
                className="flex items-center gap-2 sm:gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-transparent border border-black/[0.1] text-[13px] sm:text-[15px] text-black hover:border-black/25 transition-colors cursor-default font-bold"
              >
                <motion.div
                  className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center origin-center"
                  variants={{
                    hover: { scale: 1.9, rotate: -10, transition: { type: "spring", stiffness: 400, damping: 12 } }
                  }}
                >
                  {tech.icon}
                </motion.div>
                {tech.label}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-8">
          <h4 className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.4em] text-black/50 uppercase mb-5">
            see what I'm up to!
          </h4>
          <div className="flex gap-4 sm:gap-5">
            {identity.links?.map((link, i) => (
              <motion.a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
                whileHover={{ 
                  scale: 1.25, 
                  y: -6,
                  rotate: i % 2 === 0 ? -12 : 12,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ scale: 0.85 }}
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl text-black border border-black/10 hover:border-black/30 hover:bg-white hover:shadow-2xl hover:shadow-black/10 transition-colors [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6"
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
