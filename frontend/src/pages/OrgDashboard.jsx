import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { UploadCloud } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function OrgDashboard() {
  const [activeTab, setActiveTab] = useState("submit");
  const [listings, setListings] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [listPrice, setListPrice] = useState("");
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    orgName: "",
    projectName: "",
    amount: "",
    price: "",
    country: "",
    category: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchMyCredits();
  }, []);

  const fetchMyCredits = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/credits/mine", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if(res.ok) setListings(data);
    } catch(err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: formData.amount,
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
      const res = await fetch(`http://localhost:5000/api/marketplace/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ creditId: selectedListing.id, price: listPrice })
      });
      const data = await res.json();
      if(res.ok) {
        addToast("Successfully listed on Marketplace!");
        setIsModalOpen(false);
        setListPrice("");
        fetchMyCredits();
      } else {
        addToast("Failed to list: " + data.message, "error");
      }
    } catch(err) {
      addToast(err.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        
        {/* PAGE HEADER */}
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Seller Dashboard
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            List Your Carbon Credits
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
            Add verified carbon credits to the CarbonX marketplace and connect
            with buyers around the world.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          
          {/* LISTING FORM */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            
            <h2 className="text-2xl font-bold text-slate-800">
              Carbon Credit Details
            </h2>

            <p className="mt-2 text-slate-500">
              Provide information about the credits you want to sell.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">

              <div className="grid gap-6 md:grid-cols-2">
                
                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Organization Name
                  </label>

                  <input
                    type="text"
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleChange}
                    placeholder="Your organization"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Project Name
                  </label>

                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="Carbon project name"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600"
                  />
                </div>

              </div>

              <div className="grid gap-6 md:grid-cols-2">
                
                <div>
                  <label className="mb-2 block font-medium text-slate-700">
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600"
                  />
                </div>

              </div>

              <div className="grid gap-6 md:grid-cols-3">
                
                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600"
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
                  <label className="mb-2 block font-medium text-slate-700">
                    Vintage
                  </label>

                  <input
                    type="number"
                    name="vintage"
                    value={formData.vintage}
                    onChange={handleChange}
                    placeholder="2024"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600"
                  />
                </div>

              </div>

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Project Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your carbon credit project..."
                  rows="5"
                  required
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-600"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-green-700 py-4 text-lg font-semibold text-white shadow-lg shadow-green-300/30 transition hover:bg-green-800 active:scale-[0.99]"
              >
                LIST CARBON CREDITS
              </button>

            </form>
          </section>

          {/* SELLER INFORMATION */}
          <aside className="space-y-6">
            
          <div className="rounded-2xl bg-gradient-to-br from-green-900 via-green-800 to-green-400 p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-300">
              CarbonX Marketplace
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white">
              Reach verified carbon buyers.
            </h2>

            <p className="mt-4 leading-relaxed text-green-100">
              List your verified carbon credits and make them visible to
              buyers searching across the CarbonX marketplace.
            </p>
          </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h3 className="text-xl font-bold text-slate-800">
                How it works
              </h3>

              <div className="mt-6 space-y-6">
                
                <div className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    1
                  </span>

                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Add your credits
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Enter details about your verified carbon credits.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    2
                  </span>

                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Get discovered
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Your listing becomes available to potential buyers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    3
                  </span>

                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Complete a sale
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Manage your carbon credit transactions through CarbonX.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </aside>

        </div>

        {/* SELLER LISTINGS */}
        <section className="mt-16">
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                Your Portfolio
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Your Carbon Credit Listings
              </h2>
            </div>

            <span className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">
              {listings.length} Listings
            </span>
          </div>

          {listings.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
              
              <div className="text-5xl">🌱</div>

              <h3 className="mt-4 text-xl font-bold text-slate-700">
                No listings yet
              </h3>

              <p className="mt-2 text-slate-500">
                Your carbon credit listings will appear here.
              </p>

            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        Credit #{listing.id}
                      </h3>

                      <p className="mt-1 text-slate-500 line-clamp-1">
                        {listing.description}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {listing.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    
                    <div>
                      <p className="text-sm text-slate-400">
                        Credits
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-800">
                        {Number(listing.amount).toLocaleString()}
                      </p>
                    </div>

                  </div>

                  {listing.status === 'verified' && (
                    <button 
                      onClick={() => {
                        setSelectedListing(listing);
                        setIsModalOpen(true);
                      }}
                      className="mt-4 w-full rounded-md bg-blue-600 py-2 text-white font-bold hover:bg-blue-700">
                      List on Marketplace
                    </button>
                  )}
                </div>
              ))}

            </div>
          )}

        </section>

      </main>

      {/* PRICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-bold text-slate-800">
              List on Marketplace
            </h3>
            <p className="mb-6 text-sm text-slate-500">
              Set a price per credit to list this project on the CarbonX marketplace.
            </p>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Price (₹)
              </label>
              <div className="flex items-center rounded-md border border-slate-300 px-3 bg-slate-50">
                <span className="text-slate-500 font-medium">₹</span>
                <input
                  type="number"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  className="w-full bg-transparent p-3 outline-none"
                  placeholder="Enter price..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setListPrice("");
                }}
                className="rounded-md px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleListToMarketplace}
                className="rounded-md bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700 transition"
              >
                Confirm Listing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}