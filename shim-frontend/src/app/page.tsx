"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { ArrowRight, Shield, MonitorOff, Keyboard, Bot, Fingerprint, Cpu, Lock, Zap, Server, Check, X, Activity, Target } from "lucide-react";
import { motion } from "framer-motion";
import ShimLogo from "@/components/ShimLogo";

export default function Home() {
  const { userId } = useAuth();

  // Premium Spring Animations
  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 60, damping: 15 } }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 80, damping: 20 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const fastStagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 }
    }
  };

  const logLine = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-white/5 relative z-10"
      >
        <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShimLogo className="w-6 h-6" />
          Shim
        </div>
        <nav>
          {userId ? (
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/sign-in" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-medium bg-white text-black px-5 py-2 rounded-md hover:bg-zinc-200 transition-colors"
              >
                Get Access
              </Link>
            </div>
          )}
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.main 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="flex flex-col items-center justify-center pt-32 pb-24 px-4 text-center relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_50%)] pointer-events-none"></div>

        <motion.div variants={scaleUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400 mb-8 uppercase tracking-widest relative z-10">
          <span className="flex h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
          Ultra Tier Available
        </motion.div>
        
        <motion.h2 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 max-w-5xl text-white leading-[1.1] relative z-10">
          The ultimate stealth toolkit <br className="hidden md:block"/> 
          for unrestricted access.
        </motion.h2>
        
        <motion.p variants={fadeIn} className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-12 font-light relative z-10">
          Advanced bypass capabilities, ghost typing, and an invisible AI assistant overlay. 
          Built for absolute privacy and designed for performance.
        </motion.p>

        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/sign-up"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition-colors w-full sm:w-auto shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Start Deploying <ArrowRight size={18} />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="#features"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/10 text-white font-medium rounded-md hover:bg-white/5 transition-colors w-full sm:w-auto"
            >
              Explore Architecture
            </Link>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Scale Ribbon */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="border-y border-white/5 bg-white/[0.01] py-8"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          <motion.div variants={fadeIn} className="pt-4 md:pt-0">
            <div className="text-3xl font-bold text-white mb-1">100k+</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest">Bypasses Generated</div>
          </motion.div>
          <motion.div variants={fadeIn} className="pt-4 md:pt-0">
            <div className="text-3xl font-bold text-white mb-1">0.00%</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest">Detection Rate</div>
          </motion.div>
          <motion.div variants={fadeIn} className="pt-4 md:pt-0">
            <div className="text-3xl font-bold text-white mb-1">&lt;5ms</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest">Execution Latency</div>
          </motion.div>
        </div>
      </motion.div>

      {/* API Interception Engine Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-32 max-w-5xl mx-auto px-6"
      >
        <motion.div variants={fadeIn} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Low-Level API Interception</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light">Watch the injection engine completely overwrite native browser security APIs in real-time. Built to dominate strict environments.</p>
        </motion.div>
        
        <motion.div variants={scaleUp} className="rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center px-4 py-3 border-b border-white/5 bg-[#111]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
            </div>
            <div className="mx-auto text-xs text-zinc-500 font-mono">shim-core — execution-log</div>
          </div>
          <motion.div 
            variants={fastStagger}
            className="p-6 font-mono text-sm leading-relaxed text-zinc-300"
          >
            <motion.div variants={logLine} className="text-zinc-500 mb-2">[SYSTEM] Initializing Shim Core payloads...</motion.div>
            <motion.div variants={logLine} className="text-zinc-300 mb-2">[HOOK] Overriding window.console (Redaction Active)... <span className="text-green-400">OK</span></motion.div>
            <motion.div variants={logLine} className="text-zinc-300 mb-2">[HOOK] Intercepting Function.prototype.constructor (Debugger Defeated)... <span className="text-green-400">OK</span></motion.div>
            <motion.div variants={logLine} className="text-zinc-300 mb-2">[INJECT] Applying ±0.2ms micro-jitter to performance.now()... <span className="text-green-400">OK</span></motion.div>
            <motion.div variants={logLine} className="text-zinc-300 mb-2">[HOOK] Hijacking navigator.mediaDevices.getDisplayMedia... <span className="text-green-400">OK</span></motion.div>
            <motion.div variants={logLine} className="text-zinc-300 mb-4">[SYSTEM] Native Messaging Host connected for Hardware Ghost Typing.</motion.div>
            <motion.div variants={logLine} className="text-white mt-1 font-semibold">[SUCCESS] All proctoring detection vectors neutralized. System is completely cloaked.</motion.div>
            <motion.div variants={logLine} className="animate-pulse mt-1">_</motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* How It Works (Workflow) */}
      <div className="border-t border-white/5 bg-white/[0.01] py-32">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6"
        >
          <motion.div variants={fadeIn} className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Deployment Pipeline</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light">A completely seamless, three-step execution framework.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-white/20 origin-left"
            ></motion.div>

            {[
              { icon: Lock, title: "1. Hardware Bind", desc: "Purchase a license key which permanently locks to your specific device ID, ensuring exclusive access." },
              { icon: Server, title: "2. Initialize Cloak", desc: "The extension intercepts all low-level browser APIs, replacing them with spoofed endpoints." },
              { icon: Zap, title: "3. Unrestricted Execution", desc: "Press Ctrl+Shift+S. The Shadow DOM captures the context and streams live data instantly." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                variants={fadeIn}
                whileHover={{ y: -10 }}
                className="relative text-center flex flex-col items-center group cursor-default"
              >
                <div className="w-24 h-24 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-8 relative z-10 shadow-[0_0_40px_rgba(255,255,255,0.05)] group-hover:border-white/30 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all">
                  <step.icon size={32} className="text-white group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-32 max-w-7xl mx-auto px-6 w-full">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Unrestricted Access Architecture
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light">
            Our bleeding-edge extension operates at the lowest level of the browser API, completely intercepting and defeating detection systems.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
        >
          {[
            { icon: Shield, title: "Stealth Mode & Anti-Debug", desc: "Console redaction, dynamic jitter timing, global stack scrubbing, and full <code class='font-mono text-white/80 bg-white/10 px-1 py-0.5 rounded'>debugger</code> interception to remain completely invisible." },
            { icon: MonitorOff, title: "Screen & Tab Cloaking", desc: "Intercepts <code class='font-mono text-white/80 bg-white/10 px-1 py-0.5 rounded'>getDisplayMedia</code> to pipe blank canvases or frozen video frames. Defeats all blur and focus event listeners." },
            { icon: Keyboard, title: "Ghost Typing Engine", desc: "OS-level Native Messaging Host simulation with JavaScript fallbacks for undetectable, human-like keystroke injection." },
            { icon: Bot, title: "Isolated AI Overlay", desc: "Resizable, draggable AI UI injected directly via Shadow DOM to prevent CSS leaks and click-tracking detection by portals." },
            { icon: Fingerprint, title: "Metadata Spoofing", desc: "Bypasses mandatory extension checks by forcefully injecting fake metadata to simulate required secure tools." },
            { icon: Cpu, title: "Live AI Dispatch", desc: "Hotkey-driven (<code class='font-mono text-white/80 bg-white/10 px-1 py-0.5 rounded'>Ctrl+Shift+S</code>) live capture linked directly to Gemini, Groq, and DeepSeek with real-time Markdown streaming." },
          ].map((feat, i) => (
             <motion.div key={i} variants={fadeIn} whileHover={{ y: -5, scale: 1.02 }} className="border border-white/5 bg-white/[0.02] p-8 rounded-xl hover:bg-white/[0.04] transition-colors relative overflow-hidden group cursor-default">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <feat.icon className="text-zinc-300 mb-6 relative z-10" size={28} />
                <h3 className="text-xl font-semibold text-white mb-3 relative z-10">{feat.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed relative z-10" dangerouslySetInnerHTML={{ __html: feat.desc }}></p>
             </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-32 max-w-7xl mx-auto px-6 w-full">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Deployment Tiers
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light">
            Select the exact level of stealth and hardware manipulation required for your environment.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Free Tier */}
          <motion.div variants={fadeIn} className="border border-white/10 bg-black p-8 rounded-2xl flex flex-col hover:border-white/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <ShimLogo className="w-8 h-8 text-white" />
              <span className="text-xl font-bold tracking-tighter">Shim</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-white">₹0</span>
            </div>
            <p className="text-zinc-400 text-sm mb-8 flex-grow">Perfect for basic testing environments where users have their own AI keys.</p>
            <ul className="space-y-4 mb-8 text-sm text-zinc-300">
              <li className="flex gap-3"><Check size={16} className="text-white shrink-0 mt-0.5" /> Invisible AI Chat Overlay</li>
              <li className="flex gap-3"><Check size={16} className="text-white shrink-0 mt-0.5" /> Bring Your Own Key (BYOK)</li>
              <li className="flex gap-3"><Check size={16} className="text-white shrink-0 mt-0.5" /> Basic Stealth Defense (Console override)</li>
              <li className="flex gap-3"><Check size={16} className="text-white shrink-0 mt-0.5" /> Smart Copy/Paste override</li>
              <li className="flex gap-3 opacity-40 text-zinc-500"><X size={16} className="shrink-0 mt-0.5" /> No Screen-Share Bypass</li>
              <li className="flex gap-3 opacity-40 text-zinc-500"><X size={16} className="shrink-0 mt-0.5" /> No Ghost Typing</li>
            </ul>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/sign-up" className="block w-full py-3 rounded-md border border-white/20 text-center font-medium hover:bg-white/5 transition-colors">Start Free</Link>
            </motion.div>
          </motion.div>

          {/* Pro Tier */}
          <motion.div variants={fadeIn} className="border border-white/20 bg-white/[0.02] p-8 rounded-2xl flex flex-col relative hover:border-white/40 transition-colors">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.3)]">Standard</div>
            <h3 className="text-xl font-semibold text-white mb-2">Pro Stealth</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-white">₹19</span>
              <span className="text-zinc-500">/ month</span>
            </div>
            <p className="text-zinc-400 text-sm mb-8 flex-grow">Premium AI access and advanced hardware-level stealth.</p>
            <ul className="space-y-4 mb-8 text-sm text-zinc-300">
              <li className="flex gap-3"><Check size={16} className="text-white shrink-0 mt-0.5" /> <strong>Included Premium AI Access</strong> (GPT-4o, Gemini 1.5 Pro)</li>
              <li className="flex gap-3"><Check size={16} className="text-white shrink-0 mt-0.5" /> <strong>Hardware Ghost Typing</strong> via Native Host</li>
              <li className="flex gap-3"><Check size={16} className="text-white shrink-0 mt-0.5" /> Secure Device Binding (1 active device)</li>
              <li className="flex gap-3"><Check size={16} className="text-white shrink-0 mt-0.5" /> Everything in Free</li>
              <li className="flex gap-3 opacity-40 text-zinc-500"><X size={16} className="shrink-0 mt-0.5" /> No Screen-Share Bypass</li>
            </ul>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/sign-up" className="block w-full py-3 rounded-md bg-white/10 border border-white/10 text-white text-center font-medium hover:bg-white/20 transition-colors">Deploy Pro</Link>
            </motion.div>
          </motion.div>

          {/* Ultra Tier */}
          <motion.div variants={scaleUp} className="border border-white bg-white p-8 rounded-2xl flex flex-col text-black shadow-[0_0_60px_rgba(255,255,255,0.15)] relative z-10 transform md:scale-105">
            <h3 className="text-xl font-bold mb-2">Ultra Bypass</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold">₹49</span>
              <span className="text-zinc-600 font-medium">/ month</span>
            </div>
            <p className="text-zinc-700 text-sm mb-8 flex-grow">The absolute ultimate bypass. Defeats live video proctoring and screen recording.</p>
            <ul className="space-y-4 mb-8 text-sm font-semibold">
              <li className="flex gap-3"><Check size={16} className="shrink-0 mt-0.5" /> The Ultimate Screen-Share Bypass (Intercept getDisplayMedia)</li>
              <li className="flex gap-3"><Check size={16} className="shrink-0 mt-0.5" /> Priority AI Routing (Bypass queues)</li>
              <li className="flex gap-3"><Check size={16} className="shrink-0 mt-0.5" /> Full Suite Unlock (All stealth modules)</li>
              <li className="flex gap-3"><Check size={16} className="shrink-0 mt-0.5" /> Everything in Pro</li>
            </ul>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-auto">
              <Link href="/sign-up" className="block w-full py-3 rounded-md bg-black text-white text-center font-bold hover:bg-zinc-800 transition-colors shadow-xl">Unlock Ultra</Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-white/5 py-40 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Ready to deploy the ultimate stealth environment?
          </h2>
          <p className="text-zinc-400 text-xl mb-12 font-light">
            Join the elite tier of users operating undetected.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link
              href="/sign-up"
              className="flex items-center justify-center gap-2 px-12 py-5 bg-white text-black font-semibold rounded-md hover:bg-zinc-200 transition-colors text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Get Access Now <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
