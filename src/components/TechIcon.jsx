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
    twitter: "1DA1F2",
    php: "777BB4",
    javascript: "F7DF1E",
    html5: "E34F26",
    css3: "1572B6",
    tailwindcss: "06B6D4",
    docker: "2496ED",
    postgresql: "4169E1",
    java: "007396",
    react: "61DAFB",
    amazonwebservices: "232F3E",
    spring: "6DB33F",
    githubactions: "2088FF",
    fastapi: "009688",
    langchain: "1C3C3C",
    nextdotjs: "000000",
    appwrite: "F02D5E",
    sqlite: "003B57"
  };

  const slug = name.toLowerCase();
  const color = colorMap[slug] || "000000";
  
  return (
    <img 
      src={`https://cdn.simpleicons.org/${slug}/${color}`}
      alt={`${name} icon`}
      width={size}
      height={size}
      className={`transition-all ${className}`}
    />
  );
};
