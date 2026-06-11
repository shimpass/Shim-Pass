import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Terminal, Shield, ArrowLeft } from "lucide-react";
import ShimLogo from "@/components/ShimLogo";

export default function Page() {
  return (
    <div className="min-h-screen bg-black flex text-white font-sans selection:bg-white/20">
      
      {/* Left Side - Brand & Marketing */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden border-r border-white/5 bg-[#050505]">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-white opacity-[0.03] blur-[120px]"></div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            <ShimLogo className="w-8 h-8 text-white" />
            Shim
          </Link>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400 mb-6 uppercase tracking-widest">
            <Shield size={14} />
            Enterprise Stealth
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 leading-tight text-white">
            Access your <br />
            stealth environment.
          </h1>
          <p className="text-zinc-400 text-lg font-light leading-relaxed">
            Log in to manage your active hardware bindings, monitor interception logs, and configure your live AI models.
          </p>
        </div>
        
        <div className="relative z-10 text-zinc-600 text-sm">
          &copy; {new Date().getFullYear()} Shim Stealth Architecture. All rights reserved.
        </div>
      </div>

      {/* Right Side - Auth */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <Link href="/" className="absolute top-8 left-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> <span className="hidden sm:inline">Return to Architecture</span>
        </Link>

        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
          <SignIn appearance={{
            elements: {
              card: 'bg-transparent border-0 shadow-none sm:bg-[#0a0a0a] sm:border sm:border-white/10 sm:shadow-2xl rounded-2xl w-full',
              headerTitle: 'text-white text-2xl font-bold tracking-tight',
              headerSubtitle: 'text-zinc-400',
              socialButtonsBlockButton: 'bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors',
              socialButtonsBlockButtonText: 'text-white font-medium',
              dividerLine: 'bg-white/10',
              dividerText: 'text-zinc-500',
              formFieldLabel: 'text-zinc-300 font-medium',
              formFieldInput: 'bg-white/5 border border-white/10 text-white focus:border-white/30 focus:ring-1 focus:ring-white/30 rounded-lg transition-all',
              formButtonPrimary: 'bg-white text-black hover:bg-zinc-200 text-sm font-semibold normal-case rounded-lg transition-colors py-2.5',
              footerActionText: 'text-zinc-400',
              footerActionLink: 'text-white hover:text-zinc-300 font-medium',
              identityPreviewText: 'text-white',
              identityPreviewEditButtonIcon: 'text-zinc-400 hover:text-white',
            }
          }} />
        </div>
      </div>
    </div>
  );
}
