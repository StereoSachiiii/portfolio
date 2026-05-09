import React from 'react';

export const TechIcon = ({ name, size = 20, className = "" }) => {
  // Official brand colors from SimpleIcons
  const colorMap = {
    cplusplus: "00599C",
    go: "00ADD8",
    python: "3776AB",
    gdb: "8B0000",
    llvm: "612E7B",
    compilerexplorer: "424242",
    github: "181717",
    linkedin: "0A66C2",
    twitter: "1DA1F2"
  };

  const slug = name.toLowerCase();
  const color = colorMap[slug] || "000000";
  
  return (
    <img 
      src={`https://cdn.simpleicons.org/${slug}/${color}`}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={`opacity-90 hover:opacity-100 transition-all ${className}`}
    />
  );
};
