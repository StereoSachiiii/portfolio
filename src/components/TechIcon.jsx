import React, { useState } from 'react';

export const TechIcon = ({ name, size = 20, className = "" }) => {
  const [error, setError] = useState(false);

  // Official brand colors and slug mapping
  const brandConfig = {
    cplusplus: { slug: "cplusplus", color: "00599C" },
    cpp: { slug: "cplusplus", color: "00599C" },
    go: { slug: "go", color: "00ADD8" },
    python: { slug: "python", color: "3776AB" },
    gdb: { slug: "gdb", color: "8B0000" },
    llvm: { slug: "llvm", color: "612E7B" },
    compilerexplorer: { slug: "compilerexplorer", color: "424242" },
    github: { slug: "github", color: "181717" },
    linkedin: { slug: "linkedin", color: "0A66C2" },
    twitter: { slug: "twitter", color: "1DA1F2" },
    php: { slug: "php", color: "777BB4" },
    javascript: { slug: "javascript", color: "F7DF1E" },
    js: { slug: "javascript", color: "F7DF1E" },
    html5: { slug: "html5", color: "E34F26" },
    css3: { slug: "css3", color: "1572B6" },
    css: { slug: "css3", color: "1572B6" },
    tailwindcss: { slug: "tailwindcss", color: "06B6D4" },
    docker: { slug: "docker", color: "2496ED" },
    postgresql: { slug: "postgresql", color: "4169E1" },
    postgres: { slug: "postgresql", color: "4169E1" },
    java: { slug: "openjdk", color: "white" }, // openjdk is very reliable
    react: { slug: "react", color: "61DAFB" },
    amazonwebservices: { slug: "amazonaws", color: "232F3E" },
    aws: { slug: "amazonaws", color: "232F3E" },
    spring: { slug: "spring", color: "6DB33F" },
    githubactions: { slug: "githubactions", color: "2088FF" },
    fastapi: { slug: "fastapi", color: "009688" },
    nextdotjs: { slug: "nextdotjs", color: "000000" },
    appwrite: { slug: "appwrite", color: "F02D5E" },
    sqlite: { slug: "sqlite", color: "003B57" },
    typescript: { slug: "typescript", color: "3178C6" },
    ts: { slug: "typescript", color: "3178C6" },
    cmake: { slug: "cmake", color: "064F8C" },
    linux: { slug: "linux", color: "FCC624" },
    microsoft: { slug: "microsoft", color: "5E5E5E" },
    visualstudio: { slug: "visualstudio", color: "5C2D91" },
    gcc: { slug: "gnu", color: "A1D135" },
    gnubash: { slug: "gnubash", color: "4EAA25" }
  };

  const config = brandConfig[name.toLowerCase()] || { slug: name.toLowerCase(), color: "000000" };
  
  if (error || !name) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`flex items-center justify-center bg-black/5 rounded-sm text-[8px] font-bold text-black/40 uppercase ${className}`}
      >
        {name ? name.charAt(0) : '?'}
      </div>
    );
  }

  return (
    <img 
      src={`https://cdn.simpleicons.org/${config.slug}/${config.color}`}
      alt={`${name} icon`}
      width={size}
      height={size}
      onError={() => setError(true)}
      className={`transition-all ${className} object-contain`}
    />
  );
};
