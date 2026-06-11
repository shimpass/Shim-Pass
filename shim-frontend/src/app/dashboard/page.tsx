"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Key, MonitorOff, Clock, ShieldAlert, ShieldCheck, Zap, Plus, X, Copy, Cpu, LayoutDashboard, ChevronRight } from "lucide-react";
import ShimLogo from "@/components/ShimLogo";
import { motion } from "framer-motion";

type License = {
  key: string;
  tier: string;
  user_email: string;
  device_id: string | null;
  is_active: boolean;
  expires_at: string;
  created_at: string;
};

type Payment = {
  id: number;
  status: string;
  created_at: string;
};

export default function Dashboard() {
  const { isLoaded, user } = useUser();
  const [view, setView] = useState<"grid" | "upload">("grid");
  
  const [licenses, setLicenses] = useState<License[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUserData = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    try {
      const [licRes, payRes] = await Promise.all([
        fetch(`/api/user/licenses`),
        fetch(`/api/user/history`)
      ]);

      if (licRes.ok) setLicenses(await licRes.json());
      if (payRes.ok) setPayments(await payRes.json());
    } catch (err) {
      console.error("Failed to fetch user data", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    setUploadStatus("idle");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user.id);
    formData.append("user_email", user.primaryEmailAddress?.emailAddress || "unknown@example.com");

    try {
      const response = await fetch(`/api/payments/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("success");
        setFile(null);
        fetchUserData(); // Refresh to show pending payment
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || "Failed to upload payment");
        setUploadStatus("error");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  const handleUnbind = async (key: string) => {
    if (!confirm("Are you sure you want to unbind this device? You will need to log in again on your extension.")) return;
    
    try {
      const response = await fetch(`/api/user/unbind`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ key })
      });
      if (response.ok) {
        alert("Device successfully unbound.");
        fetchUserData();
      } else {
        alert("Failed to unbind device.");
      }
    } catch (err) {
      alert("Error unbinding device.");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Key copied to clipboard!");
  };

  if (!isLoaded || loadingData) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-500" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-white/20 pb-20 relative overflow-hidden">
      {/* Dynamic Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15),transparent_50%)] pointer-events-none blur-[100px] z-0"></div>
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center px-5 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <ShimLogo className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">Shim Control Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-medium text-green-400 uppercase tracking-widest">System Online</span>
            </div>
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 border border-white/10 shadow-lg rounded-lg" } }} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5 bg-white/[0.02] border border-white/5 rounded-lg p-6 backdrop-blur-sm shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">Welcome, {user?.firstName || "Operator"}</h2>
            <p className="text-zinc-400 text-sm font-light max-w-2xl">Monitor your active stealth deployments, manage hardware bounds, and deploy new instances globally.</p>
          </div>
          
          <div className="relative z-10">
            {view === "grid" ? (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView("upload")}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] text-sm w-full md:w-auto"
              >
                <Plus size={16} /> Deploy New Instance
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView("grid")}
                className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white rounded-lg font-medium transition-colors text-sm w-full md:w-auto"
              >
                <X size={16} /> Cancel Deployment
              </motion.button>
            )}
          </div>
        </div>

        {view === "grid" ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Active Licenses */}
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
                  <LayoutDashboard className="text-purple-400" size={18} /> 
                  Active Deployments
                </h3>
                <span className="bg-white/10 text-white text-[10px] px-2.5 py-1 rounded-full font-medium">{licenses.length} Total</span>
              </div>
              
              {licenses.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-lg p-10 flex flex-col items-center justify-center text-center bg-zinc-950/50 backdrop-blur-md">
                  <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-lg">
                    <MonitorOff size={28} className="text-zinc-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-1">No Active Deployments</h4>
                  <p className="text-sm text-zinc-400 mb-6 max-w-sm">You currently do not have any active stealth environments deployed. Purchase a license to get started.</p>
                  <button onClick={() => setView("upload")} className="px-6 py-2.5 bg-white text-black rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors shadow-lg">Initialize Deployment</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {licenses.map(lic => (
                    <div key={lic.key} className={`rounded-lg p-5 relative group overflow-hidden transition-all duration-300 ${lic.is_active ? 'bg-zinc-900/50 border border-white/10 hover:border-white/30 hover:bg-zinc-900/80 shadow-lg' : 'bg-red-950/20 border border-red-500/20'}`}>
                      {lic.is_active ? (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-[40px] -mr-8 -mt-8 pointer-events-none"></div>
                      ) : (
                        <div className="absolute top-4 right-4 text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20">REVOKED</div>
                      )}
                      
                      <div className="flex flex-col h-full relative z-10">
                        {/* Header */}
                        <div className="mb-6">
                          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider mb-3 ${lic.tier === 'ultra' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.1)]' : 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]'}`}>
                            {lic.tier === 'ultra' ? <Zap size={12} className="animate-pulse" /> : <ShieldCheck size={12} />}
                            {lic.tier} Tier
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4 flex-grow">
                          <div>
                            <p className="text-[10px] text-zinc-500 mb-1.5 uppercase tracking-widest font-semibold flex items-center gap-1"><Key size={10}/> License Key</p>
                            <div className="flex items-center justify-between bg-black/50 border border-white/5 rounded-lg px-3 py-2 group-hover:border-white/20 transition-colors">
                              <code className="text-xs font-mono text-zinc-200 truncate mr-2">{lic.key}</code>
                              <button onClick={() => handleCopy(lic.key)} className="text-zinc-500 hover:text-white transition-colors p-1 bg-white/5 rounded hover:bg-white/10" title="Copy Key">
                                <Copy size={12} />
                              </button>
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] text-zinc-500 mb-1.5 uppercase tracking-widest font-semibold flex items-center gap-1"><Cpu size={10}/> Hardware Binding</p>
                            {lic.device_id ? (
                              <div className="flex items-center justify-between bg-black/50 border border-white/5 rounded-lg px-3 py-2 group-hover:border-white/20 transition-colors">
                                <span className="text-xs font-mono text-zinc-300 truncate mr-2" title={lic.device_id}>{lic.device_id.substring(0, 16)}...</span>
                                <button onClick={() => handleUnbind(lic.key)} className="text-[10px] font-bold bg-white/5 hover:bg-red-500/20 border border-white/5 hover:border-red-500/30 text-zinc-400 hover:text-red-400 px-2 py-1 rounded transition-colors whitespace-nowrap">
                                  UNBIND
                                </button>
                              </div>
                            ) : (
                              <div className="bg-black/30 border border-white/5 rounded-lg px-3 py-2 border-dashed">
                                <span className="text-xs text-zinc-500 italic flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></div> Awaiting first login
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                          <span className="flex items-center gap-1"><Clock size={12} /> Valid until {new Date(lic.expires_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Payments Queue */}
            {payments.filter(p => p.status === 'pending').length > 0 && (
              <div className="mt-14">
                <h3 className="text-xl font-semibold mb-5 flex items-center gap-2 border-b border-white/5 pb-3 text-white">
                  <Clock size={18} className="text-zinc-400" /> Pending Deployments
                </h3>
                <div className="space-y-3">
                  {payments.filter(p => p.status === 'pending').map(pay => (
                    <div key={pay.id} className="flex flex-col sm:flex-row sm:items-center justify-between border border-white/10 bg-zinc-900/40 backdrop-blur-sm p-4 rounded-lg gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <Loader2 className="animate-spin text-zinc-400" size={14} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Payment #{pay.id}</div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">Submitted on {new Date(pay.created_at).toLocaleString()}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-lg uppercase tracking-wider text-center">
                        Awaiting Verification
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Upload / Purchase Flow */
          <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent blur-3xl -z-10 rounded-full"></div>
            
            <div className="border border-white/10 bg-zinc-900/80 backdrop-blur-xl rounded-lg p-8 shadow-2xl">
              <div className="mb-8 text-center">
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Zap size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Initialize Deployment</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Upload your cryptocurrency payment receipt below. Once our automated system or an admin verifies the transaction hash, your secure license key will be provisioned.</p>
              </div>

              <form onSubmit={handleUpload} className="flex flex-col gap-6">
                <div className="relative border border-dashed border-white/20 rounded-lg p-10 flex flex-col items-center justify-center hover:bg-white/[0.03] hover:border-white/30 transition-all cursor-pointer group bg-black/20">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-white/10 transition-all duration-300">
                    <UploadCloud className="text-zinc-400 group-hover:text-white" size={24} />
                  </div>
                  
                  <p className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors text-center">
                    {file ? <span className="text-green-400 flex items-center gap-1.5"><CheckCircle2 size={16}/> {file.name}</span> : "Drop your receipt here"}
                  </p>
                  <p className="text-xs text-zinc-600 mt-2 font-medium">PNG or JPG up to 5MB</p>
                </div>
                
                <button
                  type="submit"
                  disabled={!file || uploading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed rounded-lg font-bold transition-all text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:shadow-none"
                >
                  {uploading ? <><Loader2 className="animate-spin" size={18} /> Securing Upload...</> : "Submit for Verification"}
                </button>

                {uploadStatus === "success" && (
                  <motion.div initial={{opacity:0, y:5}} animate={{opacity:1,y:0}} className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="text-[13px] font-bold text-green-400">Upload Successful & Secured</p>
                      <p className="text-xs text-green-400/80 mt-1 leading-relaxed">Your receipt is now in the secure queue. You can monitor its status under your Pending Deployments on the dashboard.</p>
                    </div>
                  </motion.div>
                )}
                
                {uploadStatus === "error" && (
                  <motion.div initial={{opacity:0, y:5}} animate={{opacity:1,y:0}} className="flex items-start gap-3 p-4 border border-red-500/20 bg-red-500/10 rounded-lg">
                    <ShieldAlert className="text-red-400 shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="text-[13px] font-bold text-red-400">Upload Failed</p>
                      <p className="text-xs text-red-400/80 mt-1">{errorMessage}</p>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
