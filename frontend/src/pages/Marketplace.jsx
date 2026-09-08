import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";


import { useToast } from "../context/ToastContext";

export default function BuyerMarketplace() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/marketplace");
        const data = await response.json();
        
        const formattedCredits = data.map(listing => ({
          id: listing.id,
          orgName: listing.Credit?.User?.name || "Unknown Org",
          title: listing.Credit?.description || "Carbon Offset Project",
          amount: listing.Credit?.amount || 0,
          price: listing.price,
          country: "Global",
          category: "Carbon Offset",
          vintage: new Date(listing.Credit?.created_at).getFullYear() || "2024",
          image: "/carbon1.jpg",
          creditId: listing.credit_id
        }));

        setCredits(formattedCredits);
      } catch (error) {
        console.error("Failed to fetch marketplace", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketplace();
  }, []);

  const handleBuy = async (id) => {
    try {
      // Later connect this to:
      // POST /api/marketplace/:id/buy

      addToast(`Carbon credit ${id} selected for purchase`);
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };

  const filteredCredits = credits.filter((credit) =>
    (credit.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (credit.orgName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f6fa]">

      {/* NAVBAR */}
      <Navbar />

      <div className="flex">

        {/* LEFT FILTER SIDEBAR */}
        <aside className="sticky top-0 hidden min-h-screen w-[300px] border-r border-slate-200 bg-white p-6 lg:block">

          <div className="space-y-1">

            {["Country", "Category", "Vintage", "Registry", "UN SDG"].map(
              (filter) => (
                <button
                  key={filter}
                  className="flex w-full items-center justify-between border-b border-slate-200 py-5 text-left"
                >
                  <span className="text-lg font-semibold text-slate-700">
                    {filter}
                  </span>

                  <div className="flex items-center gap-4">
                    <span className="text-slate-500">
                      0 Selected
                    </span>

                    <span className="text-lg">⌄</span>
                  </div>
                </button>
              )
            )}

          </div>

          {/* DIRECT LISTINGS */}
          <div className="mt-8 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="h-6 w-10 rounded-full bg-slate-200 p-1">
                <div className="h-4 w-4 rounded-full bg-white shadow" />
              </div>

              <span className="text-base text-slate-700">
                CarbonX Direct listings
              </span>

            </div>

            <span className="text-slate-400">ⓘ</span>

          </div>

          {/* CLEAR FILTERS */}
          <button className="mt-8 w-full rounded-md border border-slate-400 py-4 font-semibold tracking-wide text-slate-600 transition hover:bg-slate-100">
            CLEAR FILTERS
          </button>

          {/* RESULTS */}
          <div className="mt-6 text-center text-lg font-semibold text-slate-600">
            {filteredCredits.length} Results
          </div>

          <div className="my-6 border-t border-slate-300" />

          <p className="text-base leading-relaxed text-slate-500">
            Need help selecting a project? Our team is here to support.
          </p>

          <button className="mt-6 w-full rounded-md bg-green-700 py-4 font-semibold tracking-wide text-white transition hover:bg-green-800">
            CONTACT US
          </button>

        </aside>

        {/* MAIN MARKETPLACE AREA */}
        <main className="flex-1 p-5 lg:p-8">

          {/* TOP SEARCH AREA */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}
            <div className="flex w-full max-w-[550px]">

              <input
                type="text"
                placeholder="Search for a project"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-l-lg border border-slate-200 bg-white px-5 py-4 text-lg outline-none focus:border-green-600"
              />

              <button className="rounded-r-lg bg-green-700 px-6 text-2xl text-white">
                ⌕
              </button>

            </div>

            {/* SORT */}
            <div className="flex gap-3">

              <select className="rounded-lg border border-slate-200 bg-white px-6 py-4 text-lg text-slate-700 outline-none">
                <option>Sort: Price Highest</option>
                <option>Sort: Price Lowest</option>
                <option>Newest Listings</option>
              </select>

              <button className="rounded-lg bg-green-600 px-6 text-white">
                ▦
              </button>

            </div>

          </div>

          {/* LOADING */}
          {loading ? (
            <div className="py-20 text-center text-lg text-slate-500">
              Loading carbon credits...
            </div>
          ) : (
            /* CARBON CREDIT GRID */
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

              {filteredCredits.map((credit) => (
                <div
                  key={credit.id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* PROJECT IMAGE */}
                  <div className="h-[180px] overflow-hidden bg-slate-200">

                    <img
                      src={credit.image}
                      alt={credit.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />

                  </div>

                  {/* CARD CONTENT */}
                  <div className="p-6">

                    <div className="mb-3 flex items-center justify-between">

                      <span className="text-2xl font-bold text-slate-800">
                        ₹{Number(credit.price).toFixed(2)}
                      </span>

                      <span className="text-sm text-slate-500">
                        {Number(credit.amount).toLocaleString()} credits
                      </span>

                    </div>

                    <h2 className="text-xl font-bold text-slate-800">
                      {credit.orgName}
                    </h2>

                    <p className="mt-2 text-base leading-relaxed text-slate-600">
                      {credit.title}
                    </p>

                    {/* TAGS */}
                    <div className="mt-5 flex flex-wrap gap-2">

                      <span className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-600">
                        {credit.country}
                      </span>

                      <span className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-600">
                        {credit.category}
                      </span>

                      <span className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-600">
                        {credit.vintage}
                      </span>

                    </div>

                    {/* BUY BUTTON */}
                    <button
                      onClick={() =>
                        navigate(`/listing/${credit.id}`, {
                          state: { listing: credit },
                        })
                      }
                      className="mt-6 w-full rounded-md bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 active:scale-[0.98]"
                    >
                      BUY CREDITS
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

          {/* NO RESULTS */}
          {!loading && filteredCredits.length === 0 && (
            <div className="py-20 text-center text-lg text-slate-500">
              No carbon credit projects found.
            </div>
          )}

        </main>

      </div>

    </div>
  );
}