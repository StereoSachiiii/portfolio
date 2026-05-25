import React from 'react';
import { motion } from 'framer-motion';

export const StackDropdown = ({ item, onProjectClick }) => {
  if (!item.projects || item.projects.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute top-full left-0 md:left-0 mt-4 z-50 min-w-[280px] md:min-w-[300px] w-[calc(100vw-4rem)] md:w-auto bg-white border border-black/10 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-6 origin-top-left"
    >
      <div className="mb-6 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-black/40" />
        <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-black/40 uppercase">Used In</p>
      </div>
      
      <div className="space-y-6">
        {item.projects.map((project, i) => (
          <div 
            key={i} 
            className="group/item cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onProjectClick(project);
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <h5 className="text-[15px] font-bold text-black flex items-center gap-2">
                <span className="text-black/20 group-hover/item:text-black transition-colors font-mono">→</span>
                {project.title}
              </h5>
            </div>
            {project.context && (
              <p className="text-[13px] text-black/60 leading-relaxed pl-6 border-l-2 border-black/5 group-hover/item:border-black/20 transition-colors">
                {project.context}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-5 border-t border-black/10 flex items-center justify-between group/proof cursor-pointer">
        <p className="text-[9px] font-mono font-bold tracking-widest text-black/40 uppercase group-hover/proof:text-black transition-colors">
          Click to see proof
        </p>
        <span className="text-black/30 group-hover/proof:text-black transition-colors">↗</span>
      </div>
    </motion.div>
  );
};
