import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Wallet } from "lucide-react";
import WalletModal from "./WalletModal";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const walletAddress = localStorage.getItem("wallet_address") || "0x742d...f44e";
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const isLoggedIn = !!token;

  const isPath = (path) => location.pathname === path;

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleNavScroll = (elementId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 lg:px-10">

        {/* LOGO */}
        <Link to="/" className="flex items-center shrink-0" title="EcoSankalp">
          <img
            src="/Eco.svg"
            alt="EcoSankalp Logo"
            className="h-14 sm:h-16 w-auto object-contain -my-2 hover:scale-110 transition-transform duration-200"
          />
        </Link>

        {/* CENTER NAVIGATION - FULLY ALIGNED WITH DYNAMIC ACTIVE TAB STYLING */}
        <div className="hidden items-center gap-2 lg:flex">

          {/* CARBON & WASTE SAHAYAK */}
          <Link
            to="/sahayak"
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-200 ${
              isPath("/sahayak")
                ? "bg-green-700 text-white font-semibold shadow-sm"
                : "text-slate-700 font-medium hover:text-green-800 hover:bg-green-50"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isPath("/sahayak") ? "bg-white" : "bg-emerald-500"} animate-pulse`}></span>
            Carbon Sahayak
          </Link>

          {/* MARKETPLACE */}
          <Link
            to="/marketplace"
            className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
              isPath("/marketplace")
                ? "bg-green-700 text-white font-semibold shadow-sm"
                : "text-slate-700 font-medium hover:text-green-800 hover:bg-green-50"
            }`}
          >
            Marketplace
          </Link>

          {/* HOW IT WORKS */}
          <button
            onClick={() => handleNavScroll("how-it-works")}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-green-800 hover:bg-green-50"
          >
            How It Works
          </button>

          {/* TAKE ACTION */}
          <button
            onClick={() => handleNavScroll("take-action")}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-green-800 hover:bg-green-50"
          >
            Take Action
          </button>

          {/* EXPLORE */}
          <button
            onClick={() => handleNavScroll("carbon-guide")}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-green-800 hover:bg-green-50"
          >
            Explore
          </button>

        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-3">

          {isLoggedIn ? (
            <>
              {/* CUSTODIAL WALLET PILL */}
              <button
                onClick={() => setIsWalletOpen(true)}
                title="View Eco-Custodial Smart Wallet & Transactions"
                className="flex items-center gap-1.5 rounded-[4px] border border-[#067519]/30 bg-emerald-50/70 px-3.5 py-1.5 text-xs font-semibold text-[#067519] transition hover:bg-emerald-100/80 hover:border-[#067519] shadow-2xs cursor-pointer font-poppins"
              >
                <Wallet size={14} className="text-[#067519]" />
                <span className="font-mono text-xs">
                  {walletAddress.length > 10 ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : walletAddress}
                </span>
              </button>

              <Link
                to={role === "admin" ? "/admin" : role === "org" ? "/dashboard" : "/marketplace"}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                  isPath("/dashboard") || isPath("/admin")
                    ? "bg-green-700 text-white font-semibold shadow-sm"
                    : "border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:text-green-800"
                }`}
              >
                {role === "admin" ? "Admin Panel" : role === "org" ? "Org Dashboard" : "Marketplace"}
              </Link>

              <button
                onClick={onLogout}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  isPath("/login")
                    ? "bg-green-700 text-white font-semibold shadow-sm"
                    : "border border-green-700 text-green-800 hover:bg-green-50"
                }`}
              >
                Login
              </Link>

              <Link
                to="/marketplace"
                className="hidden sm:inline-block rounded-full bg-green-700 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-green-800 active:scale-95"
              >
                Marketplace
              </Link>
            </>
          )}

        </div>

      </nav>

      {/* CUSTODIAL WALLET & TRANSACTION MODAL */}
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
    </header>
  );
}