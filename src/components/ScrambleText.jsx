import React, { useState, useEffect, useCallback } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';

export const ScrambleText = ({ text, delay = 0, duration = 800, animateOnMount = true }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);

  const scramble = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, duration / (text.length * 3));

    return () => clearInterval(interval);
  }, [text, duration]);

  useEffect(() => {
    if (animateOnMount) {
      const timeout = setTimeout(scramble, delay);
      return () => clearTimeout(timeout);
    }
  }, [scramble, delay, animateOnMount]);

  return (
    <span 
      onMouseEnter={() => {
        if (!isHovering) {
          setIsHovering(true);
          scramble();
          setTimeout(() => setIsHovering(false), duration);
        }
      }}
      className="inline-block cursor-default"
    >
      {displayText}
    </span>
  );
};
