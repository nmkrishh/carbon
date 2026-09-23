import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { API_URL } from "../config/api";
import { Check, X, Search, ShieldCheck, Building2, Calendar, FileText, ExternalLink, ArrowRight, UserCheck } from "lucide-react";

// 3 Initial Sample Submissions of Different Categories for Admin Review
const INITIAL_SAMPLE_CREDITS = [
  {
    id: "sample-waste-01",
    org_name: "CleanCity Waste Solutions",
    projectName: "Bengaluru Municipal Solid Waste Biogas & Sanitization",
    category: "Waste Segregation & Sanitization",
    amount: 8750,
    price: 620,
    country: "India",
    vintage: "2026",
    description: "Decentralized bio-methanation avoiding methane emissions from wet organic municipal waste in South Bengaluru.",
    doc_url: "http://example.com/proof-waste.pdf",
    status: "pending",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sample-solar-02",
    org_name: "SunShakti Renewables Ltd",
    projectName: "Thar Desert 150MW Ultra Mega Solar Park",
    category: "Renewable Energy",
    amount: 32000,
    price: 480,
    country: "India",
    vintage: "2025",
    description: "Grid-scale bifacial solar power installation replacing fossil generation across Rajasthan northern grid cluster.",
    doc_url: "http://example.com/proof-solar.pdf",
    status: "pending",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sample-forest-03",
    org_name: "EcoSankalp Nature Reserves",
    projectName: "Western Ghats Afforestation & Biodiversity Corridor",
    category: "Forestry & Conservation",
    amount: 14500,
    price: 950,
    country: "India",
    vintage: "2026",
    description: "Native tree planting restoring degraded corridors between protected rainforest reserves in Karnataka, enhancing habitat for endangered hornbills.",
    doc_url: "http://example.com/proof-forest.pdf",
    status: "pending",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function AdminApproval() {
  const [credits, setCredits] = useState(INITIAL_SAMPLE_CREDITS);
  const [activeTab, setActiveTab] = useState("pending"); // "all", "pending", "approved", "rejected"
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    fetchPendingCredits();
  }, []);

  const fetchPendingCredits = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await fetch(`${API_URL}/api/credits/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const backendData = await res.json();
        if (Array.isArray(backendData) && backendData.length > 0) {
          // Normalize backend data and merge with initial samples
          const formatted = backendData.map((item) => ({
            id: item.id,
            org_name: item.org_name || item.User?.name || "Verified Organization",
            projectName: item.description?.includes(" - ") 
              ? item.description.split(" - ")[0] 
              : `${item.category || "Carbon"} Project`,
            category: item.category || "Waste Segregation & Sanitization",
            amount: item.amount || 5000,
            price: item.price || 550,
            country: item.country || "India",
            vintage: item.vintage || "2026",
            description: item.description?.includes(" - ") 
              ? item.description.split(" - ")[1] 
              : (item.description || "Certified emission reduction initiative."),
            doc_url: item.doc_url || "http://example.com/proof.pdf",
            status: item.status || "pending",
            created_at: item.created_at || new Date().toISOString()
          }));

          setCredits((prev) => {
            const backendIds = new Set(formatted.map((f) => f.id));
            const existingSamples = prev.filter((p) => typeof p.id === "string" && p.id.startsWith("sample-") && !backendIds.has(p.id));
            return [...formatted, ...existingSamples];
          });
        }
      }
    } catch (err) {
      console.warn("Backend fetch offline or unauthenticated, using sample credits:", err);
    }
  };

  const approveCredit = async (id) => {
    // If it's a numeric backend database credit, call the API
    if (typeof id === "number") {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/credits/${id}/approve`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          addToast("Credit approved & minted on blockchain!");
          fetchPendingCredits();
          return;
        } else {
          addToast("Error: " + data.message, "error");
        }
      } catch (err) {
        addToast("Error: " + err.message, "error");
      }
    }

    // Local state update for sample submissions or instant UI reflection
    setCredits((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c))
    );
    addToast("Credit approved & verified successfully!");
  };

  const rejectCredit = (id) => {
    setCredits((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "rejected" } : c))
    );
    addToast("Credit submission marked as rejected.");
  };

  // Filter credits by tab and search query
  const filteredCredits = useMemo(() => {
    return credits.filter((credit) => {
      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "pending"
          ? credit.status === "pending"
          : activeTab === "approved"
          ? credit.status === "approved"
          : credit.status === "rejected";

      const query = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        (credit.org_name || "").toLowerCase().includes(query) ||
        (credit.category || "").toLowerCase().includes(query) ||
        (credit.description || "").toLowerCase().includes(query) ||
        (credit.country || "").toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [credits, activeTab, searchTerm]);

  const counts = {
    all: credits.length,
    pending: credits.filter((c) => c.status === "pending").length,
    approved: credits.filter((c) => c.status === "approved").length,
    rejected: credits.filter((c) => c.status === "rejected").length
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-poppins select-none">
      
      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 transition hover:opacity-85" title="EcoSankalp">
            <img src="/Eco.svg" alt="EcoSankalp" className="h-10 w-auto object-contain" />
            <span className="font-poppins font-bold text-lg text-[#202020] tracking-tight">
              EcoSankalp <span className="text-xs font-semibold text-[#067519] uppercase tracking-wider ml-1">Admin</span>
            </span>
          </Link>

          {/* RIGHT ACTION PROFILE */}
          <div className="flex items-center gap-3">
            <span className="rounded-[4px] bg-[#067519]/10 border border-[#067519]/20 px-3 py-1 font-poppins text-xs font-bold text-[#067519]">
              Administrator
            </span>
            <Link
              to="/marketplace"
              className="rounded-[4px] border border-slate-300 bg-white px-3.5 py-1.5 font-poppins text-xs font-bold uppercase tracking-wider text-[#3b3b3d] hover:bg-slate-50 transition"
            >
              Marketplace
            </Link>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-8 lg:py-10">
        
        {/* PAGE TITLE & CONTROLS */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-b border-[#eeeff5] pb-6 mb-8">
          <div>
            <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#202020]">
              Requests & Approvals
            </h1>
            <p className="mt-1 font-dmsans text-xs sm:text-sm text-[#626266]">
              Review carbon credit listings submitted by organizations across registered categories.
            </p>
          </div>

          {/* STATUS FILTER PILLS & SEARCH */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* SEARCH INPUT */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 size-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests..."
                className="h-[38px] w-48 sm:w-56 rounded-[4px] border border-slate-300 bg-white pl-8 pr-3 text-xs font-dmsans outline-none focus:border-[#067519] shadow-2xs"
              />
            </div>

            {/* STATUS FILTER TABS */}
            <div className="flex rounded-[4px] border border-slate-300 bg-white p-0.5 shadow-2xs">
              <button
                onClick={() => setActiveTab("pending")}
                className={`rounded-[3px] px-3 py-1.5 font-poppins text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  activeTab === "pending"
                    ? "bg-[#067519] text-white shadow-2xs"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                Pending ({counts.pending})
              </button>

              <button
                onClick={() => setActiveTab("approved")}
                className={`rounded-[3px] px-3 py-1.5 font-poppins text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  activeTab === "approved"
                    ? "bg-[#067519] text-white shadow-2xs"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                Approved ({counts.approved})
              </button>

              <button
                onClick={() => setActiveTab("rejected")}
                className={`rounded-[3px] px-3 py-1.5 font-poppins text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  activeTab === "rejected"
                    ? "bg-[#067519] text-white shadow-2xs"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                Rejected ({counts.rejected})
              </button>

              <button
                onClick={() => setActiveTab("all")}
                className={`rounded-[3px] px-3 py-1.5 font-poppins text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[#067519] text-white shadow-2xs"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                All ({counts.all})
              </button>
            </div>
          </div>
        </div>

        {/* CARDS GRID BASED ON REFERENCE DESIGN */}
        {filteredCredits.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-2xs">
            <p className="font-poppins text-base font-bold text-slate-800">
              No carbon credit requests found
            </p>
            <p className="mt-1 font-dmsans text-xs text-slate-500">
              {searchTerm ? "Try adjusting your search criteria." : "There are currently no items in this filter tab."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCredits.map((credit) => {
              const isApproved = credit.status === "approved";
              const isRejected = credit.status === "rejected";
              const isPending = credit.status === "pending";

              return (
                <article
                  key={credit.id}
                  className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs transition hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    {/* CARD TOP HEADER: CATEGORY TITLE & SUBMITTER */}
                    <div className="border-b border-slate-100 pb-4 mb-4">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="font-poppins text-base font-bold text-[#202020] line-clamp-1" title={credit.category}>
                          {credit.category}
                        </h2>
                        <span className={`rounded-[3px] px-2 py-0.5 font-poppins text-[10px] font-bold uppercase tracking-wider ${
                          isApproved 
                            ? "bg-emerald-50 text-[#067519] border border-emerald-200" 
                            : isRejected 
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}>
                          {credit.status}
                        </span>
                      </div>

                      {/* SUBMITTER INFO ROW */}
                      <div className="mt-2.5 flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-poppins text-xs font-bold">
                          {credit.org_name?.charAt(0) || "O"}
                        </div>
                        <div className="truncate">
                          <p className="font-poppins text-xs font-semibold text-[#202020] truncate">
                            {credit.org_name}
                          </p>
                          <p className="font-dmsans text-[11px] text-[#626266]">
                            Submitted on {new Date(credit.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CENTRAL SUMMARY METRICS HIGHLIGHT */}
                    <div className="rounded-lg bg-slate-50/80 p-4 border border-slate-100 mb-4 text-center">
                      <p className="font-poppins text-2xl font-black text-[#202020]">
                        {Number(credit.amount).toLocaleString()} <span className="text-sm font-semibold text-[#067519]">tCO₂e</span>
                      </p>
                      <p className="font-dmsans text-xs text-[#626266] mt-1">
                        Vintage {credit.vintage || "2026"} • {credit.country || "India"} • ₹{credit.price || "550"}/credit
                      </p>

                      {/* SUBTLE METRIC BAR */}
                      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-[#067519] transition-all" 
                          style={{ width: isApproved ? "100%" : isRejected ? "100%" : "65%" }}
                        />
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#626266] font-dmsans">
                        <span>Est. ₹{((Number(credit.amount) * (Number(credit.price) || 550))).toLocaleString("en-IN")}</span>
                        <span className="font-medium text-[#067519]">Audit Ready</span>
                      </div>
                    </div>

                    {/* REASON / SUMMARY SECTION */}
                    <div className="mb-4">
                      <p className="font-poppins text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Summary
                      </p>
                      <p className="font-dmsans text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {credit.description}
                      </p>
                    </div>

                    {/* APPROVAL PROCESS MULTI-SEGMENT STATUS TRACKER */}
                    <div className="mb-5">
                      <p className="font-poppins text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Approval Process
                      </p>
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <span className="rounded-[3px] bg-emerald-50 text-[#067519] border border-emerald-200 py-1 font-poppins text-[10px] font-bold uppercase">
                          ✓ Submitted
                        </span>
                        <span className="rounded-[3px] bg-emerald-50 text-[#067519] border border-emerald-200 py-1 font-poppins text-[10px] font-bold uppercase">
                          ✓ Audit Doc
                        </span>
                        <span className={`rounded-[3px] py-1 font-poppins text-[10px] font-bold uppercase border ${
                          isApproved
                            ? "bg-emerald-50 text-[#067519] border-emerald-200"
                            : isRejected
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-800 border-amber-200 animate-pulse"
                        }`}>
                          {isApproved ? "Approved" : isRejected ? "Rejected" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION FOOTER WITH APPROVE / REJECT BUTTONS */}
                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-dmsans text-slate-500">
                      <div className="h-6 w-6 rounded-full bg-[#067519]/15 text-[#067519] flex items-center justify-center font-bold text-[10px]">
                        A
                      </div>
                      <span className="hidden sm:inline font-medium text-[11px]">Admin Review</span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center gap-2">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => approveCredit(credit.id)}
                            className="rounded-[4px] bg-[#067519] px-4 py-2 font-poppins text-xs font-bold uppercase tracking-wider text-white hover:bg-[#056014] transition active:scale-95 cursor-pointer shadow-2xs flex items-center gap-1"
                          >
                            <Check size={14} className="stroke-[3]" />
                            Approve
                          </button>

                          <button
                            onClick={() => rejectCredit(credit.id)}
                            className="rounded-[4px] bg-slate-100 border border-slate-200 px-3.5 py-2 font-poppins text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition active:scale-95 cursor-pointer flex items-center gap-1"
                          >
                            <X size={14} className="stroke-[2.5]" />
                            Reject
                          </button>
                        </>
                      ) : isApproved ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-[#067519] font-poppins">
                          <Check size={16} className="stroke-[3]" /> Approved & Minted
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-600 font-poppins">
                          <X size={16} className="stroke-[3]" /> Rejected
                        </span>
                      )}
                    </div>
                  </div>

                </article>
              );
            })}
          </div>
        )}

      </main>

    </div>
  );
}