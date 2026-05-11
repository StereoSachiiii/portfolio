import React from 'react';
import { motion } from 'framer-motion';

export const StackDropdown = ({ item, onProjectClick }) => {
  if (!item.projects || item.projects.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full left-0 mt-4 z-50 min-w-[280px] bg-white border border-black/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 origin-top-left"
    >
      <div className="mb-4">
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-black/30 uppercase italic">Used in</p>
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
              <h5 className="text-[14px] font-bold text-black group-hover/item:text-emerald-600 transition-colors flex items-center gap-2">
                <span className="text-black/20 group-hover/item:text-emerald-500 transition-colors">→</span>
                {project.title}
              </h5>
            </div>
            {project.context && (
              <p className="text-[12px] text-black/60 leading-relaxed pl-5 border-l border-black/5 group-hover/item:border-emerald-200 transition-colors">
                {project.context}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-black/5">
        <p className="text-[9px] font-mono text-black/30 italic">Click to see implementation proof ↗</p>
      </div>
    </motion.div>
  );
};
