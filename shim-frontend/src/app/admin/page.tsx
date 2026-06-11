"use client";

import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Check, X, ShieldAlert, Loader2, Key, Users, CreditCard, Ban, MonitorOff, Copy, Activity, Zap } from "lucide-react";
import ShimLogo from "@/components/ShimLogo";
import { motion } from "framer-motion";

type Payment = {
  id: number;
  user_id: string;
  user_email: string;
  screenshot_url: string;
  status: string;
  created_at: string;
};

type License = {
  key: string;
  tier: string;
  user_email: string;
  device_id: string | null;
  is_active: boolean;
  expires_at: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<"payments" | "licenses">("payments");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [secret, setSecret] = useState(""); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (user?.primaryEmailAddress?.emailAddress !== adminEmail) {
        router.push("/dashboard");
      }
    }
  }, [isLoaded, user, router]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/admin/payments/pending`, {
        headers: { "admin-secret": secret }
      });
      if (res.ok) {
        setPayments(await res.json());
        setError("");
      } else {
        setPayments([]);
        if (secret) setError("Invalid Admin Secret");
      }
    } catch (e) {
      setError("Network connection error");
    } finally {
      setLoading(false);
    }
  };

  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/admin/licenses`, {
        headers: { "admin-secret": secret }
      });
      if (res.ok) {
        setLicenses(await res.json());
        setError("");
      } else {
        setLicenses([]);
        if (secret) setError("Invalid Admin Secret");
      }
    } catch (e) {
      setError("Network connection error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "payments") fetchPayments();
    if (tab === "licenses") fetchLicenses();
  }, [secret, tab]);

  const handleVerify = async (id: number, tier: string, user_email: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/admin/payments/${id}/verify?tier=${tier}&user_email=${encodeURIComponent(user_email)}`, {
        method: "POST",
        headers: { "admin-secret": secret }
      });
      if (res.ok) fetchPayments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/admin/payments/${id}/reject`, {
        method: "POST",
        headers: { "admin-secret": secret }
      });
      if (res.ok) fetchPayments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRevoke = async (key: string) => {
    if (!confirm("Are you sure you want to permanently REVOKE this license?")) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/admin/licenses/${key}/revoke`, {
        method: "POST",
        headers: { "admin-secret": secret }
      });
      if (res.ok) fetchLicenses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnbind = async (key: string) => {
    if (!confirm("Are you sure you want to clear the hardware lock for this license?")) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/admin/licenses/${key}/unbind`, {
        method: "POST",
        headers: { "admin-secret": secret }
      });
      if (res.ok) fetchLicenses();
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!isLoaded || user?.primaryEmailAddress?.emailAddress !== adminEmail) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-500" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-white/20 pb-20 relative overflow-hidden">
      {/* Dynamic Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none blur-[100px] z-0"></div>

      <header className="flex justify-between items-center px-5 py-4 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <h1 className="text-base font-bold tracking-tight flex items-center gap-3">
          <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <ShimLogo className="w-4 h-4 text-blue-400" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Shim Admin Console</span>
        </h1>
        <div className="flex gap-4 items-center">
          <div className="relative flex items-center group">
            <Key size={12} className="absolute left-3 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="password" 
              value={secret} 
              onChange={e => setSecret(e.target.value)}
              className="bg-black/50 border border-white/10 pl-8 pr-3 py-1.5 rounded-lg text-[13px] outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all w-44 placeholder:text-zinc-600 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
              placeholder="Enter Admin Secret"
            />
          </div>
          <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 border border-white/10 shadow-lg rounded-lg" } }} />
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 pt-8 relative z-10">
        <div className="flex gap-6 border-b border-white/10">
          <button 
            onClick={() => setTab("payments")}
            className={`pb-3 text-sm font-semibold transition-all flex items-center gap-2 relative ${tab === 'payments' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <CreditCard size={16} className={tab === 'payments' ? 'text-blue-400' : ''} /> 
            Pending Verifications
            {tab === 'payments' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></motion.div>
            )}
          </button>
          <button 
            onClick={() => setTab("licenses")}
            className={`pb-3 text-sm font-semibold transition-all flex items-center gap-2 relative ${tab === 'licenses' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Users size={16} className={tab === 'licenses' ? 'text-blue-400' : ''} /> 
            Global Directory
            {tab === 'licenses' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></motion.div>
            )}
          </button>
        </div>
      </div>

      <main className="p-6 max-w-7xl mx-auto relative z-10">
        
        {error && secret && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium flex items-center gap-2 shadow-lg">
            <ShieldAlert size={14} />
            {error}
          </motion.div>
        )}
        
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-24 space-y-3">
             <Loader2 className="animate-spin text-blue-500" size={28} />
             <p className="text-zinc-500 text-sm font-medium">Decrypting admin ledger...</p>
          </div>
        ) : (
          <>
            {tab === "payments" && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Activity className="text-blue-400" size={20} /> Pending Queue
                  </h2>
                  <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{payments.length} in queue</span>
                </div>
                
                <div className="space-y-4">
                  {!error && payments.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-lg bg-zinc-900/30 backdrop-blur-sm">
                      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-3">
                        <Check className="text-zinc-500" size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">Queue is Empty</h3>
                      <p className="text-sm text-zinc-500 font-medium max-w-sm">There are currently no pending payments waiting for verification.</p>
                    </div>
                  )}
                  
                  {payments.map(p => (
                    <motion.div whileHover={{ y: -2 }} key={p.id} className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-lg p-4 flex flex-col md:flex-row items-center gap-6 shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all">
                      <div className="w-full md:w-56 aspect-video bg-black/80 rounded-lg overflow-hidden shrink-0 border border-white/5 relative group cursor-pointer">
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white/20 backdrop-blur-md text-white font-medium px-3 py-1.5 rounded-lg text-xs border border-white/10">View Full Image</span>
                        </div>
                        <img src={p.screenshot_url} alt="Receipt" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      
                      <div className="flex-1 min-w-0 w-full text-left">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[9px] font-bold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded text-yellow-400 animate-pulse">
                            Pending
                          </span>
                          <p className="text-sm font-bold text-white truncate" title={p.user_email}>{p.user_email}</p>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5"><Key size={12}/> ID: {p.user_id}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                        <button 
                          onClick={() => handleVerify(p.id, "pro", p.user_email)}
                          className="flex items-center justify-center gap-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-5 py-2.5 rounded-lg font-bold text-[11px] transition-colors border border-blue-500/20 hover:border-blue-500/40 shadow-sm"
                        >
                          <Check size={14} /> Verify Pro
                        </button>
                        <button 
                          onClick={() => handleVerify(p.id, "ultra", p.user_email)}
                          className="flex items-center justify-center gap-1.5 bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-lg font-bold text-[11px] transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                          <Zap size={14} className="fill-black" /> Verify Ultra
                        </button>
                        <button 
                          onClick={() => handleReject(p.id)}
                          className="flex items-center justify-center gap-1.5 bg-transparent text-zinc-500 hover:text-red-400 border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 px-4 py-2.5 rounded-lg font-bold text-[11px] transition-colors"
                          title="Reject & Delete"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {tab === "licenses" && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Users className="text-blue-400" size={20} /> Global Directory
                  </h2>
                  <span className="bg-white/10 text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-white/10">{licenses.length} Total</span>
                </div>
                
                <div className="overflow-hidden border border-white/10 rounded-lg bg-zinc-900/40 backdrop-blur-xl shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-zinc-500 bg-black/40">
                          <th className="p-4 font-bold">Status</th>
                          <th className="p-4 font-bold">User Identity</th>
                          <th className="p-4 font-bold">License Key</th>
                          <th className="p-4 font-bold">Tier</th>
                          <th className="p-4 font-bold">Hardware Lock</th>
                          <th className="p-4 font-bold text-right">Overrides</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        {licenses.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-10 text-center text-zinc-500 font-medium">No licenses found in the directory.</td>
                          </tr>
                        )}
                        {licenses.map(lic => (
                          <tr key={lic.key} className={`hover:bg-white/[0.02] transition-colors group ${!lic.is_active ? 'bg-red-950/10' : ''}`}>
                            <td className="p-4">
                              {lic.is_active ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                                  <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></span> Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                                  <span className="w-1 h-1 rounded-full bg-red-400"></span> Revoked
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-zinc-300 font-semibold">{lic.user_email}</td>
                            <td className="p-4 font-mono text-zinc-400">
                              <div className="flex items-center gap-1.5 bg-black/30 w-fit px-2 py-1 rounded border border-white/5 group-hover:border-white/20 transition-colors">
                                {lic.key.substring(0, 16)}...
                                <button onClick={() => copyToClipboard(lic.key)} className="text-zinc-500 hover:text-white transition-colors"><Copy size={12} /></button>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded border text-[10px] uppercase tracking-wider font-bold ${lic.tier === 'ultra' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                {lic.tier}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-[10px] text-zinc-500">
                              {lic.device_id ? (
                                <span className="text-zinc-300 bg-black/30 px-1.5 py-0.5 rounded border border-white/5" title={lic.device_id}>{lic.device_id.substring(0, 16)}...</span>
                              ) : (
                                <span className="italic text-zinc-600 font-sans">Unbound</span>
                              )}
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2">
                              <button 
                                onClick={() => handleUnbind(lic.key)}
                                disabled={!lic.device_id || !lic.is_active}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-zinc-300 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Force clear the hardware lock"
                              >
                                <MonitorOff size={12} /> Unbind
                              </button>
                              <button 
                                onClick={() => handleRevoke(lic.key)}
                                disabled={!lic.is_active}
                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Permanently disable this key"
                              >
                                <Ban size={12} /> Revoke
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
