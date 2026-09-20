import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, ShieldCheck, History, ArrowUpRight, CheckCircle2, Wallet } from "lucide-react";
import { API_URL } from "../config/api";
import { useToast } from "../context/ToastContext";

export default function WalletModal({ isOpen, onClose }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = (typeof window !== "undefined" && localStorage.getItem("role")) || "consumer";
  const name = (typeof window !== "undefined" && localStorage.getItem("name")) || "Eco Member";
  
  // Wallet address from localStorage or fallback
  const walletAddress = (typeof window !== "undefined" && localStorage.getItem("wallet_address")) || "0x708ac289d9755a94a6b775ad87df00de20013638";

  // Lock background scrolling and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/marketplace/transactions`, {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTransactions(Array.isArray(data) ? data : []);
        } else {
          console.warn("Transactions fetch returned status:", res.status);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isOpen]);

  if (!isOpen) return null;

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    addToast("Wallet address copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate total credits transacted
  const totalCredits = transactions.reduce((sum, tx) => {
    const amt = Number(tx.Listing?.Credit?.amount) || 0;
    return sum + amt;
  }, 0);

  const modalContent = (
    <AnimatePresence>
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-hidden select-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl font-poppins"
        >
          {/* MODAL HEADER */}
          <header className="flex shrink-0 items-center justify-between border-b border-[#eeeff5] px-6 py-4 bg-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#067519] text-white">
                <Wallet size={18} />
              </span>
              <div>
                <h3 className="font-poppins font-bold text-base text-[#202020]">
                  Eco-Custodial Smart Wallet
                </h3>
                <p className="font-dmsans text-xs text-[#626266]">
                  Polygon Amoy Network (Proof of Stake)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              title="Close wallet"
              className="rounded-[4px] p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </header>

          {/* MODAL BODY */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">

            {/* WALLET CARD WITH #067519 GREEN ACCENT */}
            <article className="relative overflow-hidden rounded-xl bg-[#067519] p-6 text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-poppins text-[11px] font-bold uppercase tracking-[0.15em] text-white/80">
                    Custodial Account ({role.toUpperCase()})
                  </span>
                  <h4 className="mt-1 font-poppins text-2xl font-extrabold text-white">
                    {name}
                  </h4>
                </div>
                <span className="flex items-center gap-1.5 rounded-[4px] bg-black/20 border border-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                  Polygon Amoy
                </span>
              </div>

              {/* WALLET ADDRESS */}
              <div className="mt-5 flex items-center justify-between rounded-[4px] bg-black/25 p-3 border border-white/15">
                <span className="font-mono text-xs text-white/95 truncate mr-2">
                  {walletAddress}
                </span>
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-1.5 font-poppins text-xs font-bold uppercase tracking-wider text-white bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-[4px] transition cursor-pointer shrink-0"
                >
                  {copied ? <CheckCircle2 size={13} className="text-emerald-300" /> : <Copy size={13} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* BALANCE METRICS */}
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/15 pt-4">
                <div>
                  <p className="font-dmsans text-xs text-white/80">
                    {role === "org" ? "Credits Sold" : "Active Carbon Balance"}
                  </p>
                  <p className="font-poppins text-2xl font-extrabold text-white">
                    {totalCredits.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-white/80">tCO₂e</span>
                  </p>
                </div>
                <div>
                  <p className="font-dmsans text-xs text-white/80">Smart Contract</p>
                  <p className="font-poppins text-sm font-bold text-white flex items-center gap-1.5 mt-1">
                    <ShieldCheck size={16} className="text-white" />
                    <span>ERC-1155 Verified</span>
                  </p>
                </div>
              </div>
            </article>

            {/* ON-CHAIN TRANSACTION HISTORY */}
            <section>
              <div className="flex items-center justify-between mb-3 border-b border-[#eeeff5] pb-2">
                <h4 className="font-poppins text-sm font-bold text-[#202020] flex items-center gap-2">
                  <History size={15} className="text-[#067519]" />
                  <span>On-Chain Transaction History</span>
                </h4>
                <span className="font-poppins text-xs font-medium text-[#626266]">
                  {transactions.length} record{transactions.length === 1 ? "" : "s"}
                </span>
              </div>

              {loading ? (
                <div className="py-8 text-center font-dmsans text-xs text-[#626266]">
                  Loading blockchain records...
                </div>
              ) : transactions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-[#f5f6fa]">
                  <p className="font-poppins text-xs font-bold text-[#3b3b3d]">
                    No transactions recorded yet
                  </p>
                  <p className="font-dmsans text-[11px] text-[#626266] mt-1">
                    When you purchase or list carbon credits, the transaction receipt and Polygon Amoy hash will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <article
                      key={tx.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[4px] border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-[#067519]/50"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-[4px] px-2 py-0.5 font-poppins text-[10px] font-bold uppercase tracking-wider border ${
                            role === "org" 
                              ? "bg-slate-100 text-slate-800 border-slate-200" 
                              : "bg-emerald-50 text-[#067519] border-[#067519]/25"
                          }`}>
                            {role === "org" ? "CREDIT SALE" : "PURCHASE / OFFSET"}
                          </span>
                          <span className="font-dmsans text-xs text-[#626266]">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <h5 className="mt-1 font-poppins text-sm font-bold text-[#202020] line-clamp-1">
                          {tx.Listing?.Credit?.description || "Carbon Offset Credit"}
                        </h5>

                        <p className="font-dmsans text-xs text-[#626266]">
                          {role === "org" ? (
                            <>Buyer: {(!tx.User?.name || tx.User?.name.toLowerCase() === 'consumer') ? "Eco Carbon Buyer" : tx.User?.name}</>
                          ) : (
                            <>Seller: {tx.Listing?.Credit?.org_name || ((!tx.Listing?.User?.name || tx.Listing?.User?.name.toLowerCase() === 'org') ? "GreenTech Renewables" : tx.Listing?.User?.name)}</>
                          )}
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <p className="font-poppins text-sm font-extrabold text-[#202020]">
                          ₹{Number(tx.amount_paid).toLocaleString("en-IN")}
                        </p>
                        <p className="font-poppins text-xs font-bold text-[#067519]">
                          +{Number(tx.Listing?.Credit?.amount || 0).toLocaleString()} tCO₂e
                        </p>

                        {tx.tx_hash && (
                          <a
                            href={`https://amoy.polygonscan.com/tx/${tx.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-[#626266] hover:text-[#067519] transition"
                          >
                            <span>{tx.tx_hash.slice(0, 8)}...{tx.tx_hash.slice(-6)}</span>
                            <ArrowUpRight size={12} />
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

          </main>

          {/* MODAL FOOTER */}
          <footer className="shrink-0 border-t border-[#eeeff5] bg-[#f5f6fa] px-6 py-3.5 flex justify-between items-center text-xs text-[#626266] font-dmsans">
            <span>Protected by EcoSankalp Blockchain Relayer</span>
            <button
              onClick={onClose}
              className="rounded-[4px] bg-[#067519] px-4 py-2 font-poppins text-xs font-bold uppercase tracking-wider text-white hover:bg-[#056014] transition cursor-pointer"
            >
              Close
            </button>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : modalContent;
}
