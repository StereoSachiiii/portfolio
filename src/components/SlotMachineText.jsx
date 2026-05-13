import React from 'react';
import { motion } from 'framer-motion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const SlotMachineText = ({ text, delay = 0 }) => {
  return (
    <span className="flex overflow-hidden h-[1.2em] items-baseline">
      {text.split('').map((char, i) => (
        <div key={i} className="relative flex flex-col items-center">
          {/* Invisible character to set the width of the column */}
          <span className="opacity-0 pointer-events-none">{char}</span>
          
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: "-96.3%" }} // Moves to the 27th character (index 26)
            transition={{
              duration: 2.5,
              delay: delay + i * 0.15,
              ease: [0.22, 1, 0.36, 1], // Smooth deceleration
            }}
            className="absolute top-0 left-0 right-0 flex flex-col"
          >
            {[...Array(27)].map((_, j) => {
              const displayChar = j === 26 ? char : CHARS[Math.floor(Math.random() * CHARS.length)];
              return (
                <span key={j} className="h-[1.2em] flex items-center justify-center">
                  {displayChar}
                </span>
              );
            })}
          </motion.div>
        </div>
      ))}
    </span>
  );
};
