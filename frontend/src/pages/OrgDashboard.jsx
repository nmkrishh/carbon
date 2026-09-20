import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Sparkles, Wallet, Plus, ArrowRight } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { API_URL } from "../config/api";
import WalletModal from "../components/WalletModal";

export default function OrgDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("submit");
  const [listings, setListings] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [listPrice, setListPrice] = useState("");
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    orgName: "",
    projectName: location.state?.prefillName || "",
    amount: location.state?.prefillAmount || "",
    price: "",
    country: "India",
    category: "Waste Segregation & Sanitization",
    description: location.state?.prefillDescription || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchMyCredits();
    if (location.state?.prefillAmount) {
      addToast(`Imported ${location.state.prefillAmount} tCO2e from Carbon Sahayak!`);
    }
  }, []);

  const fetchMyCredits = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/credits/mine`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setListings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/credits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: formData.amount,
          org_name: formData.orgName,
          country: formData.country,
          category: formData.category,
          vintage: formData.vintage,
          description: formData.projectName + " - " + formData.description,
          doc_url: "http://example.com/proof.pdf"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit");

      addToast("Credit submitted! Waiting for Admin approval.");
      fetchMyCredits();

      setFormData({
        orgName: "",
        projectName: "",
        amount: "",
        price: "",
        country: "",
        category: "",
        vintage: "",
        description: "",
      });
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  const handleListToMarketplace = async () => {
    if (!listPrice || !selectedListing) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/marketplace/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ creditId: selectedListing.id, price: listPrice })
      });
      const data = await res.json();
      if (res.ok) {
        addToast("Successfully listed on Marketplace!");
        setIsModalOpen(false);
        setListPrice("");
        fetchMyCredits();
      } else {
        addToast("Failed to list: " + data.message, "error");
      }
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-poppins" style={{ zoom: 1.03 }}>
      <Navbar />

      {/* 
        CONTAINER WIDTH & PADDING:
        - Change max-w-7xl to max-w-full, max-w-[1400px], or max-w-screen-2xl to adjust width.
        - Change px-5 sm:px-8 to increase/decrease left and right empty side space.
      */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        
        {/* PAGE HEADER */}
        <header className="mb-8">
          <p className="font-poppins text-xs font-bold uppercase tracking-[0.2em] text-[#626266]">
            Seller Dashboard
          </p>

          <h1 className="mt-2 font-poppins text-3xl md:text-4xl font-extrabold text-[#202020] tracking-tight">
            List Your Carbon Credits
          </h1>

          <p className="mt-2 max-w-2xl font-dmsans text-sm md:text-base text-[#626266] leading-relaxed">
            Add verified carbon credits to the EcoSankalp marketplace and connect
            with buyers around the world.
          </p>

          {/* CARBON SAHAYAK BANNER */}
          <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-[#067519] text-white shadow-2xs">
                <Sparkles size={18} />
              </span>
              <div>
                <h2 className="font-poppins text-sm font-bold text-[#202020]">
                  Need to calculate credits from waste or sanitization?
                </h2>
                <p className="font-dmsans text-xs text-[#626266] mt-0.5">
                  Use Carbon & Waste Sahayak to convert segregated waste weights into certified tCO₂e credits.
                </p>
              </div>
            </div>

            <Link 
              to="/sahayak"
              className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#202020] px-4 py-2.5 font-poppins text-xs font-bold uppercase tracking-wider text-white transition hover:bg-black whitespace-nowrap shadow-2xs"
            >
              <span>Open Carbon Sahayak</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </header>

        {/* MAIN TWO-COLUMN SECTION */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          
          {/* LISTING FORM CARD */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-2xs">
            <h2 className="font-poppins text-xl md:text-2xl font-bold text-[#202020]">
              Carbon Credit Details
            </h2>

            <p className="mt-1 font-dmsans text-xs md:text-sm text-[#626266]">
              Provide information about the credits you want to sell.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-[#3b3b3d] mb-1.5">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleChange}
                    placeholder="Your organization"
                    required
                    className="w-full rounded-[4px] border border-slate-300 bg-white px-4 py-3 font-dmsans text-sm text-slate-800 outline-none transition focus:border-[#067519] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-[#3b3b3d] mb-1.5">
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="Carbon project name"
                    required
                    className="w-full rounded-[4px] border border-slate-300 bg-white px-4 py-3 font-dmsans text-sm text-slate-800 outline-none transition focus:border-[#067519] shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-[#3b3b3d] mb-1.5">
                    Available Credits
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="e.g. 1000"
                    required
                    min="1"
                    className="w-full rounded-[4px] border border-slate-300 bg-white px-4 py-3 font-dmsans text-sm text-slate-800 outline-none transition focus:border-[#067519] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-[#3b3b3d] mb-1.5">
                    Price per Credit (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    required
                    min="1"
                    className="w-full rounded-[4px] border border-slate-300 bg-white px-4 py-3 font-dmsans text-sm text-slate-800 outline-none transition focus:border-[#067519] shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-[#3b3b3d] mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    required
                    className="w-full rounded-[4px] border border-slate-300 bg-white px-4 py-3 font-dmsans text-sm text-slate-800 outline-none transition focus:border-[#067519] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-[#3b3b3d] mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-[4px] border border-slate-300 bg-white px-4 py-3 font-dmsans text-sm text-slate-800 outline-none transition focus:border-[#067519] shadow-2xs cursor-pointer"
                  >
                    <option value="">Select</option>
                    <option>Forestry</option>
                    <option>green Carbon</option>
                    <option>Biochar</option>
                    <option>Renewable Energy</option>
                    <option>Agriculture</option>
                  </select>
                </div>

                <div>
                  <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-[#3b3b3d] mb-1.5">
                    Vintage
                  </label>
                  <input
                    type="number"
                    name="vintage"
                    value={formData.vintage}
                    onChange={handleChange}
                    placeholder="2024"
                    required
                    className="w-full rounded-[4px] border border-slate-300 bg-white px-4 py-3 font-dmsans text-sm text-slate-800 outline-none transition focus:border-[#067519] shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-[#3b3b3d] mb-1.5">
                  Project Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your carbon credit project..."
                  rows="4"
                  required
                  className="w-full resize-none rounded-[4px] border border-slate-300 bg-white px-4 py-3 font-dmsans text-sm text-slate-800 outline-none transition focus:border-[#067519] shadow-2xs"
                />
              </div>

              <button
                type="submit"
                className="w-full h-[48px] rounded-[4px] bg-[#067519] font-poppins text-[14px] font-bold uppercase tracking-[0.06em] text-white shadow-none transition hover:bg-[#056014] active:scale-[0.99] cursor-pointer"
              >
                LIST CARBON CREDITS
              </button>

            </form>
          </section>

          {/* SELLER INFORMATION ASIDE */}
          <aside className="space-y-6">
            
            {/* PROMO CARD */}
            <div className="rounded-xl bg-[#067519] p-7 text-white shadow-2xs">
              <p className="font-poppins text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
                EcoSankalp Marketplace
              </p>

              <h2 className="mt-3 font-poppins text-2xl font-bold text-white">
                Reach verified carbon buyers.
              </h2>

              <p className="mt-3 font-dmsans text-sm leading-relaxed text-white/90">
                List your verified carbon credits and make them visible to
                buyers searching across the EcoSankalp marketplace.
              </p>
            </div>

            {/* HOW IT WORKS CARD */}
            <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-2xs">
              <h3 className="font-poppins text-lg font-bold text-[#202020]">
                How it works
              </h3>

              <div className="mt-5 space-y-5">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#067519] font-poppins text-xs font-bold text-white">
                    1
                  </span>
                  <div>
                    <h4 className="font-poppins text-sm font-bold text-[#202020]">
                      Add your credits
                    </h4>
                    <p className="mt-0.5 font-dmsans text-xs text-[#626266] leading-relaxed">
                      Enter details about your verified carbon credits.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#067519] font-poppins text-xs font-bold text-white">
                    2
                  </span>
                  <div>
                    <h4 className="font-poppins text-sm font-bold text-[#202020]">
                      Get discovered
                    </h4>
                    <p className="mt-0.5 font-dmsans text-xs text-[#626266] leading-relaxed">
                      Your listing becomes available to potential buyers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#067519] font-poppins text-xs font-bold text-white">
                    3
                  </span>
                  <div>
                    <h4 className="font-poppins text-sm font-bold text-[#202020]">
                      Complete a sale
                    </h4>
                    <p className="mt-0.5 font-dmsans text-xs text-[#626266] leading-relaxed">
                      Manage your carbon credit transactions through EcoSankalp.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </aside>

        </div>

        {/* SELLER LISTINGS PORTFOLIO */}
        <section className="mt-14">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eeeff5] pb-5">
            <div>
              <p className="font-poppins text-xs font-bold uppercase tracking-[0.2em] text-[#626266]">
                Your Portfolio
              </p>

              <h2 className="mt-1 font-poppins text-2xl font-bold text-[#202020] md:text-3xl">
                Your Carbon Credit Listings
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsWalletOpen(true)}
                className="inline-flex items-center gap-2 rounded-[4px] border border-[#067519]/30 bg-emerald-50/70 px-4 py-2 font-poppins text-xs font-bold uppercase tracking-wider text-[#067519] shadow-2xs transition hover:bg-emerald-100/80 cursor-pointer"
              >
                <Wallet size={14} className="text-[#067519]" />
                <span>Smart Wallet & Transactions</span>
              </button>

              <span className="rounded-[4px] bg-[#202020] px-3.5 py-2 font-poppins text-xs font-bold uppercase tracking-wider text-white">
                {listings.length} Listings
              </span>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-2xs">
              <div className="text-4xl">🌱</div>

              <h3 className="mt-3 font-poppins text-lg font-bold text-[#202020]">
                No listings yet
              </h3>

              <p className="mt-1 font-dmsans text-xs text-[#626266]">
                Your carbon credit listings will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <article
                  key={listing.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs transition hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-poppins text-lg font-bold text-[#202020]">
                          Credit #{listing.id}
                        </h3>

                        <p className="mt-1 font-dmsans text-xs text-[#626266] line-clamp-2">
                          {listing.description}
                        </p>
                      </div>

                      <span className={`rounded-[4px] px-2.5 py-1 font-poppins text-[10px] font-bold uppercase tracking-wider ${
                        listing.status === 'verified'
                          ? 'bg-emerald-50 border border-emerald-200 text-[#067519]'
                          : listing.status === 'listed'
                          ? 'bg-emerald-50 border border-emerald-200 text-[#067519]'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {listing.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-5 border-t border-[#eeeff5] pt-4">
                      <p className="font-poppins text-[11px] font-medium text-[#626266] uppercase">
                        Credits
                      </p>
                      <p className="mt-0.5 font-poppins text-xl font-extrabold text-[#202020]">
                        {Number(listing.amount).toLocaleString()} <span className="text-xs font-normal text-[#626266]">tCO₂e</span>
                      </p>
                    </div>
                  </div>

                  {listing.status === 'verified' && (
                    <button 
                      onClick={() => {
                        setSelectedListing(listing);
                        setIsModalOpen(true);
                      }}
                      className="mt-5 w-full h-[42px] rounded-[4px] bg-[#067519] font-poppins text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#056014] active:scale-[0.98] cursor-pointer"
                    >
                      List on Marketplace
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}

        </section>

      </main>

      {/* PRICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 sm:p-7 shadow-2xl font-poppins">
            <h3 className="font-poppins text-xl font-bold text-[#202020]">
              List on Marketplace
            </h3>
            <p className="mt-1 font-dmsans text-xs text-[#626266]">
              Set a price per credit to list this project on the EcoSankalp marketplace.
            </p>

            <div className="my-5">
              <label className="block font-poppins text-xs font-bold uppercase tracking-wider text-[#3b3b3d] mb-1.5">
                Price (₹)
              </label>
              <div className="flex items-center rounded-[4px] border border-slate-300 bg-white px-3 shadow-2xs focus-within:border-[#067519]">
                <span className="font-poppins font-medium text-slate-500">₹</span>
                <input
                  type="number"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  className="w-full bg-transparent p-2.5 font-dmsans text-sm outline-none text-slate-800"
                  placeholder="Enter price..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setListPrice("");
                }}
                className="rounded-[4px] border border-slate-300 px-4 py-2 font-poppins text-xs font-bold uppercase tracking-wider text-[#3b3b3d] hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleListToMarketplace}
                className="rounded-[4px] bg-[#067519] px-5 py-2 font-poppins text-xs font-bold uppercase tracking-wider text-white hover:bg-[#056014] transition cursor-pointer"
              >
                Confirm Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTODIAL WALLET & TRANSACTION MODAL */}
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />

    </div>
  );
}