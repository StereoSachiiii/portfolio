import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Github, Linkedin, Twitter, Terminal, CheckCircle2 } from 'lucide-react';
import { contactConfig } from '../config';

export const Contact = ({ links }) => {
  const [formState, setFormState] = useState('idle'); // idle, sending, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('sending');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-[1fr_350px] gap-12 md:gap-20">
        
        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-black uppercase leading-none">
              {contactConfig.heading}
            </h2>
            <p className="text-black/80 font-medium leading-relaxed max-w-md">
              {contactConfig.subheading}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-8">
              <div className="group relative">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/50 group-focus-within:text-black transition-colors mb-2 block">
                  Name
                </label>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  required
                  className="w-full bg-transparent border-b border-black/20 focus:border-black outline-none py-3 text-lg font-medium transition-all placeholder:text-black/20"
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/50 group-focus-within:text-black transition-colors mb-2 block">
                  Email
                </label>
                <input 
                  type="email" 
                  placeholder="name@domain.com" 
                  required
                  className="w-full bg-transparent border-b border-black/20 focus:border-black outline-none py-3 text-lg font-medium transition-all placeholder:text-black/20"
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/50 group-focus-within:text-black transition-colors mb-2 block">
                  Message
                </label>
                <textarea 
                  placeholder="Describe your project or inquiry..." 
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-black/20 focus:border-black outline-none py-3 text-lg font-medium transition-all placeholder:text-black/20 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={formState !== 'idle'}
              className={`group relative flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-all overflow-hidden ${
                formState === 'success' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-black text-white hover:bg-black/80'
              }`}
            >
              <span className="relative z-10 flex items-center gap-3">
                {formState === 'idle' && (
                  <>
                    Send Message
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
                {formState === 'sending' && (
                  <>
                    Sending...
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Terminal size={18} />
                    </motion.div>
                  </>
                )}
                {formState === 'success' && (
                  <>
                    Message Sent
                    <CheckCircle2 size={18} />
                  </>
                )}
              </span>
            </button>
          </form>
        </motion.div>

        {/* Sidebar Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-12"
        >
          <div className="space-y-8 p-6 md:p-8 rounded-2xl bg-black/5 border border-black/10">
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/50">
                {contactConfig.emailHeading}
              </h4>
              <a href={`mailto:${contactConfig.email}`} className="block text-xl font-bold hover:text-black/60 transition-colors">
                {contactConfig.email}
              </a>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/50">
                {contactConfig.socialsHeading}
              </h4>
              <div className="flex flex-col gap-4">
                {links.map((link) => (
                  <a 
                    key={link.id} 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                      {link.icon}
                    </div>
                    <span className="font-bold text-sm uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                      {link.id}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </div>
  );
};
