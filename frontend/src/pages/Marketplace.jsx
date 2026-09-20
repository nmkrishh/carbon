import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { API_URL } from "../config/api";
import MarketplaceSidebar from "../components/MarketplaceSidebar";
import { getInitial60Credits } from "../data/mockMarketplaceCredits";
import { Plus, SlidersHorizontal, X, Send, Building2, CheckCircle2 } from "lucide-react";

export default function BuyerMarketplace() {
  // Initialize with 60 comprehensive verified projects matching the exact "60 of 60 Results" view
  const [credits, setCredits] = useState(() => getInitial60Credits());
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [directOnly, setDirectOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isOrgListingModalOpen, setIsOrgListingModalOpen] = useState(false);

  // Form states for contact modal
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    org: "",
    type: "Selecting projects for carbon offset",
    message: ""
  });

  const [selectedFilters, setSelectedFilters] = useState({
    Country: [],
    Category: [],
    Vintage: [],
    Registry: [],
    "UN SDG": []
  });

  const navigate = useNavigate();
  const { addToast } = useToast();
  const userRole = localStorage.getItem("role");
  const isOrgUser = userRole === "org";

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const response = await fetch(`${API_URL}/api/marketplace`);
        if (!response.ok) return;
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const formattedCredits = data.map((listing) => {
            const rawOrgName = listing.Credit?.org_name || listing.Credit?.User?.name || "";
            const isGeneric = !rawOrgName || ["org", "consumer", "admin", "unknown org"].includes(rawOrgName.toLowerCase());
            const orgName = isGeneric ? "GreenTech Renewables" : rawOrgName;

            const rawDesc = listing.Credit?.description || "Carbon Offset Project";
            const dashIdx = rawDesc.indexOf(" - ");
            const projectTitle = dashIdx !== -1 ? rawDesc.substring(0, dashIdx).trim() : rawDesc;
            const projectDesc = dashIdx !== -1 ? rawDesc.substring(dashIdx + 3).trim() : rawDesc;

            return {
              id: String(listing.id),
              creditId: listing.credit_id || listing.id,
              orgName: orgName,
              title: projectTitle,
              fullDescription: projectDesc,
              amount: listing.Credit?.amount || 5000,
              price: listing.price,
              country: listing.Credit?.country || "India",
              category: listing.Credit?.category || "Waste Segregation & Sanitization",
              vintage: listing.Credit?.vintage || (listing.Credit?.created_at ? new Date(listing.Credit.created_at).getFullYear().toString() : "2026"),
              registry: "CPCB / CCTS India",
              sdg: "SDG 13 (Climate Action)",
              isDirect: true,
              image: "/LoginPageImage.jpg"
            };
          });

          // Prepend newly listed backend credits onto the defaults
          setCredits((prev) => {
            const existingIds = new Set(formattedCredits.map((c) => c.creditId));
            return [...formattedCredits, ...prev.filter((p) => !existingIds.has(p.creditId))];
          });
        }
      } catch (error) {
        console.warn("Using offline fallback listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketplace();
  }, []);

  const toggleFilter = (group, option) => {
    setSelectedFilters((prev) => {
      const current = prev[group] || [];
      const exists = current.includes(option);
      const updated = exists 
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [group]: updated };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      Country: [],
      Category: [],
      Vintage: [],
      Registry: [],
      "UN SDG": []
    });
    setDirectOnly(false);
    setSearch("");
    addToast("All filters cleared!");
  };

  // Filter and sort credits
  const filteredCredits = useMemo(() => {
    let result = credits.filter((credit) => {
      // Search text filter
      const matchesSearch =
        !search ||
        (credit.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (credit.orgName || "").toLowerCase().includes(search.toLowerCase()) ||
        (credit.category || "").toLowerCase().includes(search.toLowerCase()) ||
        (credit.country || "").toLowerCase().includes(search.toLowerCase());

      // Country filter
      const matchesCountry =
        selectedFilters.Country.length === 0 ||
        selectedFilters.Country.includes(credit.country);

      // Category filter
      const matchesCategory =
        selectedFilters.Category.length === 0 ||
        selectedFilters.Category.some((cat) => 
          (credit.category || "").toLowerCase().includes(cat.toLowerCase())
        );

      // Vintage filter
      const matchesVintage =
        selectedFilters.Vintage.length === 0 ||
        selectedFilters.Vintage.includes(credit.vintage);

      // Registry filter
      const matchesRegistry =
        selectedFilters.Registry.length === 0 ||
        selectedFilters.Registry.includes(credit.registry);

      // UN SDG filter
      const matchesSDG =
        selectedFilters["UN SDG"].length === 0 ||
        selectedFilters["UN SDG"].some((sdg) =>
          (credit.sdg || "").toLowerCase().includes(sdg.toLowerCase())
        );

      // Direct listing filter
      const matchesDirect = !directOnly || credit.isDirect;

      return (
        matchesSearch &&
        matchesCountry &&
        matchesCategory &&
        matchesVintage &&
        matchesRegistry &&
        matchesSDG &&
        matchesDirect
      );
    });

    // Sorting
    if (sortBy === "price_high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "price_low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "credits_high") {
      result.sort((a, b) => Number(b.amount) - Number(a.amount));
    }

    return result;
  }, [credits, search, selectedFilters, directOnly, sortBy]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    addToast("Support request logged! A representative will connect within 24 hours.");
    setIsContactModalOpen(false);
    setContactForm({
      name: "",
      email: "",
      org: "",
      type: "Selecting projects for carbon offset",
      message: ""
    });
  };

  const handleListCreditsClick = () => {
    if (isOrgUser) {
      navigate("/dashboard");
    } else {
      setIsOrgListingModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-poppins">
      {/* NAVBAR */}
      <Navbar />

      {/* MOBILE FILTER TOGGLE BAR */}
      <div className="lg:hidden sticky top-[65px] z-30 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3 shadow-sm">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 rounded-md border border-[#626266] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#3b3b3d]"
        >
          <SlidersHorizontal size={14} />
          Filters & Options
        </button>
        <span className="font-poppins font-bold text-xs text-[#3b3b3d]">
          {filteredCredits.length} of {credits.length} Results
        </span>
      </div>

      <div className="flex">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block sticky top-[69px] h-[calc(100vh-69px)] w-[340px] shrink-0 overflow-y-auto bg-white border-r border-[#e5e7eb]">
          <MarketplaceSidebar
            selectedFilters={selectedFilters}
            onToggleFilter={toggleFilter}
            directOnly={directOnly}
            onToggleDirectOnly={() => setDirectOnly((prev) => !prev)}
            onClearFilters={clearFilters}
            filteredCount={filteredCredits.length}
            totalCount={credits.length}
            onContactClick={() => setIsContactModalOpen(true)}
          />
        </aside>

        {/* MOBILE FILTER DRAWER */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-xs" 
              onClick={() => setMobileFilterOpen(false)} 
            />
            <div className="relative ml-auto flex h-full w-full max-w-[340px] flex-col overflow-y-auto bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between border-b border-[#eeeff5] pb-3">
                <span className="font-poppins font-bold text-base text-[#3b3b3d]">Marketplace Filters</span>
                <button 
                  onClick={() => setMobileFilterOpen(false)}
                  className="rounded-full p-1 text-[#626266] hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>
              <MarketplaceSidebar
                selectedFilters={selectedFilters}
                onToggleFilter={toggleFilter}
                directOnly={directOnly}
                onToggleDirectOnly={() => setDirectOnly((prev) => !prev)}
                onClearFilters={clearFilters}
                filteredCount={filteredCredits.length}
                totalCount={credits.length}
                onContactClick={() => {
                  setMobileFilterOpen(false);
                  setIsContactModalOpen(true);
                }}
              />
            </div>
          </div>
        )}

        {/* MAIN MARKETPLACE CONTENT */}
        <main className="flex-1 p-5 lg:p-8">

          {/* TOP ACTION & SEARCH HEADER */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH INPUT */}
            <div className="flex w-full max-w-[550px]">
              <input
                type="text"
                placeholder="Search by project name, organization, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-l-[4px] border border-slate-300 bg-white px-5 py-3 text-sm font-medium outline-none focus:border-[#ffb800] shadow-2xs font-dmsans"
              />
              <button 
                onClick={() => addToast(`Searching for "${search}"`)}
                className="rounded-r-[4px] bg-[#202020] px-6 font-poppins text-xs font-bold uppercase tracking-wider text-white transition hover:bg-black"
              >
                Search
              </button>
            </div>

            {/* ORG LISTING & SORT CONTROLS */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* LIST CARBON CREDITS BUTTON FOR ORGANIZATIONS */}
              <button
                onClick={handleListCreditsClick}
                className="flex items-center gap-2 rounded-[4px] bg-[#067525] px-4 py-2.5 font-poppins text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#f0ad00] active:scale-95 shadow-2xs"
                title="List verified carbon credits to the marketplace"
              >
                <Plus size={16} className="stroke-[2.5]" />
                <span>List Carbon Credits</span>
              </button>

              {/* SORT DROPDOWN */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-400 font-poppins">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-[4px] border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none shadow-2xs font-poppins cursor-pointer"
                >
                  <option value="newest">Newest Listings</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="credits_high">Credits: High to Low</option>
                </select>
              </div>

            </div>

          </div>

          {/* ACTIVE FILTER BADGES */}
          {(Object.values(selectedFilters).some((arr) => arr.length > 0) || directOnly || search) && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-400 mr-1 font-poppins">Active:</span>
              
              {search && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-800">
                  Search: "{search}"
                  <button onClick={() => setSearch("")} className="hover:text-red-600 font-bold ml-1 cursor-pointer">×</button>
                </span>
              )}

              {directOnly && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 text-white px-3 py-1 text-xs font-semibold">
                  Direct Only
                  <button onClick={() => setDirectOnly(false)} className="hover:text-amber-300 font-bold ml-1 cursor-pointer">×</button>
                </span>
              )}

              {Object.entries(selectedFilters).map(([group, list]) =>
                list.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-slate-800">
                    <span className="text-slate-500 font-normal">{group}:</span> {item}
                    <button onClick={() => toggleFilter(group, item)} className="hover:text-red-600 font-bold ml-1 cursor-pointer">×</button>
                  </span>
                ))
              )}

              <button
                onClick={clearFilters}
                className="text-xs font-bold text-red-600 hover:underline ml-2 cursor-pointer font-poppins"
              >
                Clear all
              </button>
            </div>
          )}

          {/* LOADING STATE */}
          {loading ? (
            <div className="py-24 text-center text-base font-semibold text-slate-500 font-poppins">
              Loading carbon credits from blockchain & registry...
            </div>
          ) : (
            /* CARBON CREDIT GRID */
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCredits.map((credit) => (
                <div
                  key={credit.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs transition duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    {/* PROJECT IMAGE */}
                    <div className="relative h-[180px] overflow-hidden bg-slate-100">
                      <img
                        src={credit.image}
                        alt={credit.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <span className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-xs font-poppins">
                        {credit.country}
                      </span>
                      {credit.isDirect && (
                        <span className="absolute top-3 left-3 rounded-full bg-[#ffffff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-xs font-poppins">
                          Direct Listing
                        </span>
                      )}
                    </div>

                    {/* CARD CONTENT */}
                    <div className="p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-2xl font-extrabold text-slate-900 font-poppins">
                          ₹{Number(credit.price).toFixed(2)}
                          <span className="text-xs font-normal text-slate-400 ml-1">/ tonne</span>
                        </span>

                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 font-poppins">
                          {Number(credit.amount).toLocaleString()} tCO₂e
                        </span>
                      </div>

                      {/* PROJECT TITLE */}
                      <h2 className="text-lg font-bold text-slate-900 line-clamp-1 font-poppins" title={credit.title}>
                        {credit.title}
                      </h2>

                      {/* ISSUING ORGANIZATION */}
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700 font-poppins">
                        <span className="font-normal text-slate-400">By</span>
                        <span className="truncate">{credit.orgName}</span>
                      </p>

                      {/* SHORT DESCRIPTION */}
                      <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2 font-dmsans">
                        {credit.fullDescription || credit.title}
                      </p>

                      {/* TAGS */}
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 font-poppins">
                          {credit.category}
                        </span>

                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 font-poppins">
                          Vintage: {credit.vintage}
                        </span>

                        <span className="rounded-md border border-amber-200 bg-amber-50/70 px-2.5 py-1 text-[11px] font-semibold text-slate-800 font-poppins">
                          {credit.registry}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BUY / DETAILS BUTTON */}
                  <div className="px-6 pb-6 pt-0">
                    <button
                      onClick={() =>
                        navigate(`/listing/${credit.id}`, {
                          state: { listing: credit },
                        })
                      }
                      className="w-full rounded-[4px] bg-[#067525] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-black active:scale-[0.98] font-poppins cursor-pointer"
                    >
                      VIEW DETAILS & BUY
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* NO RESULTS EMPTY STATE */}
          {!loading && filteredCredits.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white py-20 text-center shadow-2xs">
              <p className="text-base font-bold text-slate-800 font-poppins">No matching carbon projects found</p>
              <p className="mt-1 text-xs text-slate-500 font-dmsans">Try clearing some of your filter criteria or search query.</p>
              <button 
                onClick={clearFilters}
                className="mt-4 rounded-[4px] bg-[#ffb800] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-xs transition hover:bg-[#f0ad00] cursor-pointer font-poppins"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </main>
      </div>

      {/* CONTACT SUPPORT MODAL */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsContactModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 sm:p-8 shadow-2xl z-10 animate-scaleUp font-poppins">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="font-poppins font-bold text-xl text-[#202020]">Contact Our Climate Team</h3>
                <p className="text-xs text-[#626266] font-dmsans mt-0.5">We help buyers select high-impact credits and guide project developers.</p>
              </div>
              <button 
                onClick={() => setIsContactModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#3b3b3d] mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-[4px] border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#ffb800] font-dmsans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#3b3b3d] mb-1.5">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full rounded-[4px] border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#ffb800] font-dmsans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#3b3b3d] mb-1.5">Organization</label>
                  <input
                    type="text"
                    value={contactForm.org}
                    onChange={(e) => setContactForm({ ...contactForm, org: e.target.value })}
                    placeholder="e.g. SolarTech Ltd."
                    className="w-full rounded-[4px] border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#ffb800] font-dmsans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#3b3b3d] mb-1.5">Inquiry Type</label>
                <select
                  value={contactForm.type}
                  onChange={(e) => setContactForm({ ...contactForm, type: e.target.value })}
                  className="w-full rounded-[4px] border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#ffb800] font-dmsans cursor-pointer bg-white"
                >
                  <option value="Selecting projects for carbon offset">Selecting projects for carbon offset</option>
                  <option value="I want to list my organization's carbon credits">I want to list my organization's carbon credits</option>
                  <option value="Enterprise / Volume Offset Procurement">Enterprise / Volume Offset Procurement</option>
                  <option value="Registry & Verification Assistance">Registry & Verification Assistance</option>
                  <option value="API & Automated Retirement Integration">API & Automated Retirement Integration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#3b3b3d] mb-1.5">Project details or message</label>
                <textarea
                  rows={3}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tell us what you're looking for, tonnes required, or project specifications..."
                  className="w-full rounded-[4px] border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[#ffb800] font-dmsans"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-[48px] bg-[#ffb800] rounded-[4px] text-black font-poppins font-bold text-[14px] uppercase tracking-[0.06em] flex items-center justify-center gap-2 transition hover:bg-[#f0ad00] active:scale-[0.99] cursor-pointer"
                >
                  <Send size={16} />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORG LISTING INFORMATION MODAL (for non-logged in or consumer users) */}
      {isOrgListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsOrgListingModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 sm:p-8 shadow-2xl z-10 font-poppins">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-amber-100 p-2 text-amber-900">
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-lg text-[#067525]">List Carbon Credits</h3>
                  <p className="text-xs text-[#626266] font-dmsans">Sell certified credits directly on the marketplace.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOrgListingModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 leading-relaxed font-dmsans">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 font-poppins">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Verified Registry Onboarding
                </div>
                EcoSankalp connects verified project developers with global enterprise buyers. You can list credits from CPCB/CCTS India, Verra VCS, Gold Standard, and Puro.earth with transparent on-chain settlement.
              </div>

              <div className="space-y-2 text-xs font-dmsans text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#ffb800] text-sm leading-none">•</span>
                  <span><strong>Zero upfront listing fees:</strong> List unretired credits freely on the marketplace.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#ffb800] text-sm leading-none">•</span>
                  <span><strong>Custodial smart escrow:</strong> Receive immediate fiat or stablecoin payouts on purchase.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#ffb800] text-sm leading-none">•</span>
                  <span><strong>Immutable audit trail:</strong> Publicly auditable registry retirement certificate issued to buyer.</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setIsOrgListingModalOpen(false);
                  navigate("/login");
                }}
                className="flex-1 h-[46px] rounded-[4px] bg-[#ffb800] text-black font-poppins font-bold text-xs uppercase tracking-wider flex items-center justify-center transition hover:bg-[#f0ad00] cursor-pointer"
              >
                Login as Organization
              </button>
              <button
                onClick={() => {
                  setIsOrgListingModalOpen(false);
                  navigate("/signup");
                }}
                className="flex-1 h-[46px] rounded-[4px] border border-[#202020] bg-white text-[#202020] font-poppins font-bold text-xs uppercase tracking-wider flex items-center justify-center transition hover:bg-slate-50 cursor-pointer"
              >
                Register Organization
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}