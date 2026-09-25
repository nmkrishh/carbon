import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Wallet } from "lucide-react";
import WalletModal from "./WalletModal";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "../lib/utils";
import { MenuToggleIcon } from "./ui/menu-toggle-icon";
import { useScroll } from "./ui/use-scroll";
import { createPortal } from "react-dom";

function MobileMenu({ open, children, className, ...props }) {
  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        "bg-white/95 supports-[backdrop-filter]:bg-white/90 backdrop-blur-lg",
        "fixed top-16 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y border-slate-200 md:hidden"
      )}
    >
      <div
        data-slot={open ? "open" : "closed"}
        className={cn(
          "data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 ease-out",
          "size-full p-4 overflow-y-auto",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScroll(10);
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
    localStorage.removeItem("name");
    localStorage.removeItem("wallet_address");
    navigate("/");
    setOpen(false);
  };

  const handleNavScroll = (elementId) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-b border-transparent transition-colors", {
        "bg-white/95 supports-[backdrop-filter]:bg-white/80 border-slate-200 backdrop-blur-lg shadow-sm":
          scrolled,
      })}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 lg:px-10">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center shrink-0 rounded-md p-1 hover:bg-slate-50 transition-colors" title="EcoSankalp">
          <img
            src="/Eco.svg"
            alt="EcoSankalp Logo"
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </Link>

        {/* CENTER LINKS (DESKTOP) */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            to="/sahayak"
            className={cn(buttonVariants({ variant: "ghost" }), "flex items-center gap-2", {
              "bg-green-50 text-green-800 font-semibold": isPath("/sahayak"),
            })}
          >
            <span className={cn("h-2 w-2 rounded-full animate-pulse", isPath("/sahayak") ? "bg-emerald-600" : "bg-emerald-500")}></span>
            Carbon Sahayak
          </Link>
          <Link
            to="/marketplace"
            className={cn(buttonVariants({ variant: "ghost" }), {
              "bg-green-50 text-green-800 font-semibold": isPath("/marketplace"),
            })}
          >
            Marketplace
          </Link>
          <button
            onClick={() => handleNavScroll("how-it-works")}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavScroll("take-action")}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Take Action
          </button>
          <button
            onClick={() => handleNavScroll("carbon-guide")}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Explore
          </button>
        </div>

        {/* RIGHT ACTIONS (DESKTOP) */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              {/* CUSTODIAL WALLET PILL */}
              <button
                onClick={() => setIsWalletOpen(true)}
                title="View Eco-Custodial Smart Wallet & Transactions"
                className="flex items-center gap-1.5 rounded-[4px] border border-[#067519]/30 bg-emerald-50/70 px-3.5 py-1.5 text-xs font-semibold text-[#067519] transition hover:bg-emerald-100/80 hover:border-[#067519] shadow-sm cursor-pointer font-poppins"
              >
                <Wallet size={14} className="text-[#067519]" />
                <span className="font-mono text-xs">
                  {walletAddress.length > 10 ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : walletAddress}
                </span>
              </button>

              <Link
                to={role === "admin" ? "/admin" : role === "org" ? "/dashboard" : "/marketplace"}
                className={cn(buttonVariants({ variant: "outline" }), {
                  "bg-green-50 text-green-800 border-green-200": isPath("/dashboard") || isPath("/admin"),
                })}
              >
                {role === "admin" ? "Admin Panel" : role === "org" ? "Org Dashboard" : "Marketplace"}
              </Link>
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className={cn(buttonVariants({ variant: "outline" }))}>
                Sign In
              </Link>
              <Link to="/marketplace" className={cn(buttonVariants({ variant: "default" }))}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex items-center gap-2 md:hidden">
          {isLoggedIn && (
            <button
              onClick={() => setIsWalletOpen(true)}
              className="flex items-center justify-center rounded-[4px] border border-[#067519]/30 bg-emerald-50/70 p-1.5 text-[#067519] transition hover:bg-emerald-100/80 shadow-sm"
            >
              <Wallet size={16} />
            </button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <MenuToggleIcon open={open} className="size-5" />
          </Button>
        </div>

      </nav>

      {/* MOBILE MENU */}
      <MobileMenu open={open} className="flex flex-col justify-between gap-4">
        <div className="grid gap-y-2 mt-2">
          <Link
            to="/sahayak"
            onClick={() => setOpen(false)}
            className={cn(buttonVariants({ variant: "ghost", className: "justify-start text-base py-6" }), {
              "bg-green-50 text-green-800": isPath("/sahayak"),
            })}
          >
            <span className={cn("h-2 w-2 rounded-full mr-2", isPath("/sahayak") ? "bg-emerald-600" : "bg-emerald-500")}></span>
            Carbon Sahayak
          </Link>
          <Link
            to="/marketplace"
            onClick={() => setOpen(false)}
            className={cn(buttonVariants({ variant: "ghost", className: "justify-start text-base py-6" }), {
              "bg-green-50 text-green-800": isPath("/marketplace"),
            })}
          >
            Marketplace
          </Link>
          <button
            onClick={() => handleNavScroll("how-it-works")}
            className={cn(buttonVariants({ variant: "ghost", className: "justify-start text-base py-6" }))}
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavScroll("take-action")}
            className={cn(buttonVariants({ variant: "ghost", className: "justify-start text-base py-6" }))}
          >
            Take Action
          </button>
          <button
            onClick={() => handleNavScroll("carbon-guide")}
            className={cn(buttonVariants({ variant: "ghost", className: "justify-start text-base py-6" }))}
          >
            Explore
          </button>
        </div>

        <div className="flex flex-col gap-3 mt-auto pb-8">
          {isLoggedIn ? (
            <>
              <Link
                to={role === "admin" ? "/admin" : role === "org" ? "/dashboard" : "/marketplace"}
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "outline", className: "w-full py-6 text-base" }), {
                  "bg-green-50 text-green-800 border-green-200": isPath("/dashboard") || isPath("/admin"),
                })}
              >
                {role === "admin" ? "Admin Panel" : role === "org" ? "Org Dashboard" : "Marketplace"}
              </Link>
              <Button variant="outline" className="w-full py-6 text-base" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className={cn(buttonVariants({ variant: "outline", className: "w-full bg-white py-6 text-base" }))}>
                Sign In
              </Link>
              <Link to="/marketplace" onClick={() => setOpen(false)} className={cn(buttonVariants({ variant: "default", className: "w-full py-6 text-base" }))}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </MobileMenu>

      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
    </header>
  );
}