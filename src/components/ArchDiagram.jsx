import React from 'react';
import { motion } from 'framer-motion';

// Animated dot that travels along a path
const FlowDot = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-1.5 h-1.5 rounded-full bg-orange-500 left-0 top-1/2 -translate-y-1/2"
    animate={{ left: ['0%', '100%'] }}
    transition={{ duration: 1.6, delay, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
    style={{ marginTop: -3 }}
  />
);

const Node = ({ label, sub, delay = 0, accent = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
    className={`flex flex-col items-center text-center px-3 py-2.5 rounded-xl border min-w-[72px] ${
      accent
        ? 'bg-orange-50 border-orange-200'
        : 'bg-white border-black/10'
    }`}
  >
    <span className={`text-[11px] font-bold leading-tight ${accent ? 'text-orange-700' : 'text-black'}`}>{label}</span>
    {sub && <span className="text-[9px] text-black/40 font-mono mt-0.5 leading-tight">{sub}</span>}
  </motion.div>
);

const Arrow = ({ delay = 0 }) => (
  <div className="relative flex items-center flex-1 min-w-[24px]">
    <div className="w-full h-px bg-black/10 relative overflow-hidden rounded-full">
      <FlowDot delay={delay} />
    </div>
    <span className="absolute right-0 text-black/20 text-[10px] -mr-1">›</span>
  </div>
);

const Row = ({ label, nodes, baseDelay = 0 }) => (
  <div className="flex items-start gap-2">
    <span className="text-[9px] font-mono text-black/30 uppercase tracking-widest mt-3 w-16 shrink-0 text-right">
      {label}
    </span>
    <div className="flex items-center gap-1 flex-wrap flex-1">
      {nodes.map((node, i) => (
        <React.Fragment key={i}>
          <Node {...node} delay={baseDelay + i * 0.08} />
          {i < nodes.length - 1 && <Arrow delay={baseDelay + i * 0.3} />}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export const ArchDiagram = () => {
  const storefrontNodes = [
    { label: 'Browser', sub: 'customer' },
    { label: 'Apache', sub: 'mod_rewrite' },
    { label: 'Middleware', sub: 'auth · csrf · rate', accent: true },
    { label: 'Router', sub: 'regex match', accent: true },
    { label: 'DI Container', sub: 'auto-wired', accent: true },
    { label: 'Controller → Service → Repo', sub: 'no logic leaking between layers' },
    { label: 'PostgreSQL', sub: '36 views' },
  ];

  const adminNodes = [
    { label: 'Browser', sub: 'admin' },
    { label: 'SPA', sub: 'hash router' },
    { label: 'ES6 Modules', sub: 'dynamic import()', accent: true },
    { label: 'Fetch + CSRF', sub: 'auto-injected', accent: true },
    { label: 'same API', sub: '↑' },
    { label: 'PostgreSQL', sub: '36 views' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-4 p-6 rounded-2xl border border-black/[0.06] bg-black/[0.01] overflow-x-auto"
    >
      <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-black/30 uppercase mb-5">
        How a request flows
      </p>
      <div className="space-y-5 min-w-[600px]">
        <Row label="Storefront" nodes={storefrontNodes} baseDelay={0} />
        <Row label="Admin" nodes={adminNodes} baseDelay={0.15} />
      </div>
    </motion.div>
  );
};
