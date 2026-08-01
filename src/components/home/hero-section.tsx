'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Database, Gift } from 'lucide-react';
import MarqueeAlongSvgPath from '@/components/ui/marquee-along-svg-path';

const svgPath =
  "M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5";

const stockImages = [
  {
    src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    alt: "Cyberpunk Gaming Setup",
  },
  {
    src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
    alt: "Arcade Neon Controller",
  },
  {
    src: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80",
    alt: "Futuristic Cyberpunk Aesthetic",
  },
  {
    src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    alt: "Retro Arcade Synthwave",
  },
  {
    src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    alt: "Abstract Geometry Dark Art",
  },
  {
    src: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    alt: "Neon Gaming Vibes",
  },
  {
    src: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
    alt: "Abstract Purple Tunnels",
  },
  {
    src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=600&q=80",
    alt: "3D Dark Mode Shapes",
  },
  {
    src: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=600&q=80",
    alt: "Retro Controller",
  },
  {
    src: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=600&q=80",
    alt: "Dark Neon Room",
  },
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    alt: "Abstract Dark Wave Art",
  },
  {
    src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    alt: "Vibrant Digital Art",
  },
];

export function HeroSection() {
  return (
    <div className="relative overflow-hidden pt-6 pb-16 sm:py-20 border-b border-white/10">
      {/* Subtle background gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 space-y-12 sm:space-y-16">
        {/* Top Text Content with generous breathing room */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#a1a1a1] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Official EGS Historical Tracker</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white leading-[1.1]">
            The Ultimate Epic Games{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ccc] to-[#888]">
              Free Vault
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#888] leading-relaxed max-w-2xl mx-auto">
            Track every free game giveaway on the Epic Games Store since December 2018. Explore over 600+ historical titles, live weekly drops, and manage your personal claimed library.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/archive"
              className="px-5 py-2.5 rounded-lg bg-white text-black font-medium text-sm hover:bg-[#ededed] transition-colors flex items-center gap-2 shadow-sm"
            >
              <Database className="w-4 h-4" />
              Explore 600+ Archive
            </Link>
            <Link
              href="#live-vault"
              className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Gift className="w-4 h-4 text-green-400" />
              Live Giveaways
              <ArrowRight className="w-3.5 h-3.5 text-[#888]" />
            </Link>
          </div>
        </div>

        {/* Marquee Along SVG Path - Interactive Visual Showcase with good breathing room */}
        <div className="w-full max-w-5xl mx-auto h-[260px] sm:h-[320px] relative px-2 sm:px-6">
          {/* Subtle instruction label */}
          <div className="absolute top-2 right-4 z-20 hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[#666]">
            <span>Drag to interact</span>
          </div>

          <MarqueeAlongSvgPath
            path={svgPath}
            viewBox="0 0 996 330"
            baseVelocity={8}
            slowdownOnHover={true}
            draggable={true}
            repeat={2}
            dragSensitivity={0.1}
            className="w-full h-full scale-100 sm:scale-105"
            responsive
            grabCursor
          >
            {stockImages.map((img, i) => (
              <div
                key={i}
                className="w-16 sm:w-20 aspect-[3/4] rounded-lg border border-white/15 bg-[#111] overflow-hidden shadow-xl hover:scale-125 hover:border-white/40 hover:z-30 transition-all duration-300 ease-in-out"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </MarqueeAlongSvgPath>
        </div>

        {/* Bottom Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#777] font-mono pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>100% Client-Side Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span>637+ Historical Entries</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Real-Time EGS API Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
