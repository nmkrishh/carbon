import { useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  FileText,
  Heart,
  Plus,
  Send,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";


export default function ListingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Get selected listing from Marketplace
  const listing = location.state?.listing;

  const [activeTab, setActiveTab] = useState("overview");
  const [quantity, setQuantity] = useState(100);
  const [bidPrice, setBidPrice] = useState(listing?.price || 0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState("");

  const [bids, setBids] = useState([
    {
      buyer: "ClimateFund",
      quantity: 500,
      price: 18.2,
    },
    {
      buyer: "GreenFuture Ltd.",
      quantity: 750,
      price: 17.8,
    },
    {
      buyer: "EcoCapital",
      quantity: 300,
      price: 17.5,
    },
  ]);


  // If listing was not passed from Marketplace
  if (!listing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7f5]">
        <div className="text-center">
          <p className="text-xl text-slate-600">
            Listing not found. Please return to the marketplace.
          </p>

          <button
            onClick={() => navigate("/marketplace")}
            className="mt-5 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }


  const availableCredits = listing.amount;
  const marketPrice = listing.price;


  // Increase quantity
  const increaseQuantity = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 50;

      if (newQuantity > availableCredits) {
        return availableCredits;
      }

      return newQuantity;
    });
  };


  // Handle bid
  const handleBid = async () => {
    const finalBidPrice = Number(bidPrice);
    if (!finalBidPrice || finalBidPrice <= 0) {
      setMessage("Please enter a valid bid price.");
      return;
    }
  
    if (!quantity || quantity <= 0) {
      setMessage("Please select a valid quantity.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/marketplace/${listing.id}/buy`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Purchase failed");

      setMessage(`Success! You have purchased this credit.`);
      
      // Auto-retire logic for demo purposes, or we can just retire it directly
      setTimeout(async () => {
         setMessage("Retiring credit and generating certificate...");
         try {
           const retireRes = await fetch(`http://localhost:5000/api/marketplace/retire/${listing.creditId}`, {
              method: "POST",
              headers: { "Authorization": `Bearer ${token}` }
           });
           const retireData = await retireRes.json();
           if(retireRes.ok) {
             navigate('/certificate', { state: { certificateData: retireData.certificateData } });
           } else {
             setMessage(retireData.message || "Failed to retire");
           }
         } catch(err) {
           setMessage(err.message);
         }
      }, 2000);

    } catch (error) {
      setMessage(error.message);
    }
  };


  return (
    <div className="min-h-screen bg-[#f5f7f5] text-slate-900">


      {/* ================= TOP NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4">


          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/marketplace")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-green-700"
          >
            <ArrowLeft size={18} />
            Back to Marketplace
          </button>


          {/* LOGO */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-green-800">
              <div className="h-3 w-3 rounded-full bg-green-800" />
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-900">
              CarbonX
            </span>
          </button>


          {/* FAVORITE BUTTON */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
              isFavorite
                ? "border-red-200 bg-red-50 text-red-500"
                : "border-slate-200 bg-white text-slate-500 hover:border-green-300 hover:text-green-700"
            }`}
          >
            <Heart
              size={19}
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>

        </div>

      </header>


      {/* ================= MAIN PAGE ================= */}
      <main className="mx-auto max-w-[1500px] px-6 py-10">


        {/* ================= PAGE HEADER ================= */}
        <div className="mb-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">


          {/* LISTING INFORMATION */}
          <div className="max-w-3xl">


            <div className="flex flex-wrap items-center gap-3">

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700">
                Verified Project
              </span>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                {listing.category}
              </span>

            </div>


            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              {listing.title}
            </h1>


            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">


              <div className="flex items-center gap-2">
                <MapPin
                  size={17}
                  className="text-green-700"
                />

                {listing.country}
              </div>


              <div className="flex items-center gap-2">
                <Calendar
                  size={17}
                  className="text-green-700"
                />

                Vintage: {listing.vintage}
              </div>


              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={17}
                  className="text-green-700"
                />

                Verified Carbon Credits
              </div>

            </div>

          </div>


          {/* PRICE */}
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Market Price
            </p>


            <div className="mt-2 flex items-end gap-2">

              <span className="text-4xl font-bold text-slate-900">
                ₹{Number(marketPrice).toFixed(2)}
              </span>

              <span className="mb-1 text-sm text-slate-500">
                per tCO₂
              </span>

            </div>

          </div>

        </div>



        {/* ================= MAIN TWO COLUMN LAYOUT ================= */}
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">


          {/* ================================================= */}
          {/* LEFT COLUMN */}
          {/* IMAGE + PLACE BID */}
          {/* ================================================= */}
          <div className="space-y-6">


            {/* ================= PROJECT IMAGE ================= */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">


              {/* MAIN IMAGE */}
              <div className="relative h-[460px] bg-slate-100">

                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />


                {/* IMAGE OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />


                {/* IMAGE TEXT */}
                <div className="absolute bottom-0 left-0 p-8 text-white">

                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-300">
                    Featured Carbon Project
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {listing.title}
                  </h2>

                </div>

              </div>


              {/* ================= THUMBNAILS ================= */}
              <div className="flex gap-3 overflow-x-auto p-5">


                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-20 w-28 shrink-0 rounded-xl object-cover ring-2 ring-green-600"
                />


                <img
                  src="/forest-project.jpg"
                  alt="Project view"
                  className="h-20 w-28 shrink-0 rounded-xl object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />


                <img
                  src="/climate-project.jpg"
                  alt="Climate project"
                  className="h-20 w-28 shrink-0 rounded-xl object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

              </div>

            </div>



            {/* ================================================= */}
            {/* PLACE A BID */}
            {/* ================================================= */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg">


              {/* BID HEADER */}
              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
                    Place a Bid
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Buy Carbon Credits
                  </h2>

                </div>


                <CheckCircle2
                  className="text-green-600"
                  size={28}
                />

              </div>



              {/* ================= BID PRICE ================= */}
              <div className="mt-7">

                <label className="text-sm font-semibold text-slate-700">
                  Your Bid Price
                </label>


                <div className="mt-2 flex items-center rounded-xl border border-slate-300 bg-slate-50 px-4">

                  <span className="text-lg font-semibold text-slate-500">
                    ₹
                  </span>


                  <input
                  type="number"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  className="h-14 w-full bg-transparent px-3 text-lg font-semibold outline-none"
                  />


                  <span className="text-sm text-slate-400">
                    / tCO₂
                  </span>

                </div>

              </div>



              {/* ================= QUANTITY ================= */}
              <div className="mt-6">

                <label className="text-sm font-semibold text-slate-700">
                  Credit Quantity
                </label>


                <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-300 p-2">


                  <input
                    type="number"
                    min="1"
                    max={availableCredits}
                    value={quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      if (value <= availableCredits) {
                        setQuantity(value);
                      }
                    }}
                    className="w-full bg-transparent px-4 text-lg font-bold outline-none"
                  />


                  <button
                    onClick={increaseQuantity}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-slate-200"
                  >
                    <Plus size={18} />
                  </button>

                </div>


                <p className="mt-2 text-xs text-slate-400">
                  Maximum available:{" "}
                  {availableCredits.toLocaleString()} credits
                </p>

              </div>



              {/* ================= BID TOTAL ================= */}
              <div className="mt-7 rounded-2xl bg-green-50 p-5">


                <div className="flex justify-between text-sm text-slate-600">

                  <span>Bid Value</span>

                  <span>
                    ₹
                    {(
                      Number(quantity) * Number(bidPrice || 0)
                    ).toLocaleString()}
                  </span>

                </div>


                <div className="mt-3 flex justify-between border-t border-green-200 pt-3">

                  <span className="font-bold text-slate-900">
                    Total Bid
                  </span>

                  <span className="text-xl font-bold text-green-700">
                    ₹
                    {(
                      Number(quantity) * Number(bidPrice || 0)
                    ).toLocaleString()}
                  </span>

                </div>

              </div>



              {/* SUCCESS / ERROR MESSAGE */}
              {message && (
                <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm leading-6 text-green-700">
                  {message}
                </div>
              )}



              {/* PLACE BID BUTTON */}
              <button
                onClick={handleBid}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-green-700 font-semibold text-white shadow-lg shadow-green-200 transition hover:bg-green-800 active:scale-[0.99]"
              >
                <Send size={18} />

                Place Bid
              </button>

            </div>

          </div>



          {/* ================================================= */}
          {/* RIGHT COLUMN */}
          {/* TABS + DETAILS + BIDS */}
          {/* ================================================= */}
          <aside className="space-y-6">


            {/* ================= TABS ================= */}
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

              <div className="flex gap-2 overflow-x-auto">


                {[
                  ["overview", "Overview"],
                  ["details", "Project Details"],
                  ["documents", "Documents"],
                ].map(([tabId, label]) => (

                  <button
                    key={tabId}
                    onClick={() => setActiveTab(tabId)}
                    className={`whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold transition ${
                      activeTab === tabId
                        ? "bg-green-700 text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {label}
                  </button>

                ))}

              </div>

            </div>



            {/* ================= TAB CONTENT ================= */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">


              {/* OVERVIEW */}
              {activeTab === "overview" && (

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Project Overview
                  </h2>


                  <p className="mt-5 leading-7 text-slate-600">
                    {listing.title} is a verified carbon project offered
                    through the CarbonX marketplace. The project contributes
                    to measurable climate action and environmental impact.
                  </p>


                  <p className="mt-5 leading-7 text-slate-600">
                    Carbon credits generated by this project support
                    long-term conservation, biodiversity protection,
                    and sustainable economic opportunities.
                  </p>


                  <div className="mt-7 grid gap-4 sm:grid-cols-2">


                    <div className="rounded-2xl bg-slate-50 p-5">

                      <p className="text-sm text-slate-500">
                        Estimated Annual Impact
                      </p>

                      <p className="mt-2 text-xl font-bold text-slate-900">
                        32,500 tCO₂
                      </p>

                    </div>


                    <div className="rounded-2xl bg-slate-50 p-5">

                      <p className="text-sm text-slate-500">
                        Available Credits
                      </p>

                      <p className="mt-2 text-xl font-bold text-green-700">
                        {availableCredits.toLocaleString()}
                      </p>

                    </div>

                  </div>

                </div>

              )}



              {/* PROJECT DETAILS */}
              {activeTab === "details" && (

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Project Details
                  </h2>


                  <div className="mt-7 grid gap-4 sm:grid-cols-2">

                    <DetailItem
                      label="Project Type"
                      value={listing.category || "Carbon Removal"}
                    />

                    <DetailItem
                      label="Country"
                      value={listing.country}
                    />

                    <DetailItem
                      label="Vintage"
                      value={listing.vintage}
                    />

                    <DetailItem
                      label="Registry"
                      value="CarbonX Verified"
                    />

                    <DetailItem
                      label="Credit Type"
                      value="Verified Carbon Credits"
                    />

                    <DetailItem
                      label="Project Status"
                      value="Active"
                    />

                  </div>

                </div>

              )}



              {/* DOCUMENTS */}
              {activeTab === "documents" && (

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Project Documents
                  </h2>


                  <div className="mt-6 space-y-4">

                    <Document
                      name="Project Verification Report"
                    />

                    <Document
                      name="Carbon Credit Certificate"
                    />

                    <Document
                      name="Monitoring & Impact Report"
                    />

                  </div>

                </div>

              )}

            </div>



            {/* ================================================= */}
            {/* CURRENT BIDS */}
            {/* ================================================= */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">


              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Marketplace Activity
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Current Bids
                  </h2>

                </div>


                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  Live
                </span>

              </div>



              <div className="mt-6">


                {/* TABLE HEADER */}
                <div className="grid grid-cols-3 border-b border-slate-100 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">

                  <span>Buyer</span>

                  <span className="text-center">
                    Quantity
                  </span>

                  <span className="text-right">Total Bid</span>

                </div>



                {/* BID LIST */}
                <div className="divide-y divide-slate-100">

                  {bids.map((bid, index) => (

                    <div
                      key={index}
                      className="grid grid-cols-3 items-center py-4 text-sm"
                    >

                      <span className="truncate font-medium text-slate-700">
                        {bid.buyer}
                      </span>


                      <span className="text-center text-slate-500">
                        {bid.quantity.toLocaleString()}
                      </span>


                      <span className="text-right font-bold text-green-700">
                      ₹{(bid.quantity * bid.price).toLocaleString()}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </div>



            {/* ================================================= */}
            {/* VERIFIED MARKETPLACE */}
            {/* ================================================= */}
            <div className="rounded-3xl bg-slate-900 p-7 text-white">

              <ShieldCheck
                size={30}
                className="text-green-400"
              />


              <h3 className="mt-5 text-xl font-bold">
                Verified Marketplace Listing
              </h3>


              <p className="mt-3 text-sm leading-6 text-white/65">
                This carbon project has been reviewed and its credit
                information is transparently displayed on the CarbonX
                marketplace.
              </p>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}



/* ================================================= */
/* REUSABLE COMPONENTS */
/* ================================================= */


function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">

      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
}



function Document({ name }) {
  return (
    <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-green-300 hover:bg-green-50">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-green-700">

          <FileText size={19} />

        </div>


        <span className="font-medium text-slate-700">
          {name}
        </span>

      </div>


      <ExternalLink
        size={17}
        className="text-slate-400"
      />

    </button>
  );
}