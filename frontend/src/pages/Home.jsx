import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CreditCard from "../components/CreditCard";
import { dummyCredits } from "../data/credits";
import CarbonNetwork from "../components/CarbonNetwork";
import Partners from "../components/Partners";
import BuyerSellerCards from "../components/BuyerSellerCards";
import CarbonMarketGuide from "../components/CarbonMarketGuide";
import Footer from "../components/Footer";
import { ShoppingCart, Store } from "lucide-react";


export default function Home() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const navigate = useNavigate();
  const exploreFundamentalsRef = useRef(null);




  const isLoggedIn = false;
  const userRole = null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCredits(dummyCredits);
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const handleBuy = (creditId) => {
    console.log("Buying credit:", creditId);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const filteredCredits = useMemo(() => {
    const filtered = credits.filter((credit) => {
      const query = searchTerm.toLowerCase();

      return (
        credit.orgName.toLowerCase().includes(query) ||
        credit.description.toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price") {
        return a.price - b.price;
      }

      if (sortBy === "amount") {
        return b.amount - a.amount;
      }

      return 0;
    });
  }, [credits, searchTerm, sortBy]);



  return (
    <div className="min-h-screen bg-[#fafcfb] text-gray-900">
      <Navbar
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLogout={handleLogout}
      />

      <main>
        {/* HERO + STATS */}
        <section className="relative overflow-hidden bg-slate-950 text-white">


          {/* BACKGROUND IMAGE VIDEO */}
          <div className="absolute inset-0">

            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster=""
              className="h-full w-full object-cover"
            >
              {/* WebM for modern browsers */}
              <source src="/MainVideo.webm" type="video/webm" />

              {/* MP4 fallback */}
              <source src="/Video.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-slate-550/50" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />

          </div>


          {/* HERO CONTENT */}
          <div className="relative mx-auto max-w-7xl px-6 pt-32 lg:px-10 lg:pt-9">

            <div className="max-w-3xl">



              {/* SMALL LABEL */}
              <p className="text-xs font-bold tracking-[0.35em] text-emerald-300">
                TRANSPARENT • VERIFIED • GLOBAL
              </p>


              {/* MAIN HEADING */}
              <h1 className="mt-7 text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">

                Building the future
                <br />

                <span className="font-serif italic font-normal text-emerald-300">
                  of carbon markets.
                </span>

              </h1>


              {/* DESCRIPTION */}
              <p className="mt-10 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">

                EcoSankalp empowers municipal waste segregation and sanitization facilities to convert
                avoided emissions into tradeable, verified blockchain carbon credits.

              </p>


              {/* BUTTONS */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                {/* SAHAYAK BUTTON */}
                <button
                  onClick={() => navigate("/sahayak")}
                  className="flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-sm font-bold text-slate-950 shadow-xl transition hover:bg-emerald-400 active:scale-95"
                >
                  <span className="h-2 w-2 rounded-full bg-slate-950 animate-ping"></span>
                  Your Carbon Sahayak
                </button>

                {/* MARKETPLACE BUTTON */}
                <button
                  onClick={() => navigate("/marketplace")}
                  className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 shadow-xl transition hover:bg-emerald-300"
                >
                  Explore Marketplace
                </button>


                {/* SELL BUTTON */}
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-full border border-white/50 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-900"
                >
                  Start Selling Credits
                </button>

              </div>

            </div>


            {/* STATISTICS */}
            <div className="mt-24 border-t border-white/20">

              <div className="grid grid-cols-1 divide-y divide-white/15 md:grid-cols-3 md:divide-x md:divide-y-0">

                {/* STAT 1 */}
                <div className="py-10 md:pr-10">

                  <p className="text-3xl font-bold text-white lg:text-4xl">
                    6,20,934
                    <span className="ml-2 text-lg font-medium text-emerald-300">
                      tCO₂
                    </span>
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    carbon credits retired through meaningful climate action
                  </p>

                </div>


                {/* STAT 2 */}
                <div className="py-10 md:px-10">

                  <p className="text-3xl font-bold text-white lg:text-4xl">
                    21+
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    verified climate projects available across global markets
                  </p>

                </div>


                {/* STAT 3 */}
                <div className="py-10 md:pl-10">

                  <p className="text-3xl font-bold text-white lg:text-4xl">
                    67+
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    organizations and buyers participating in EcoSankalp
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* STATISTICS */}


        {/* CARBON NETWORK - NEW SECTION */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white px-6 py-24">
          <div className="mx-auto max-w-6xl">

            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-700">
                The Carbon Ecosystem
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Connecting every part of the carbon market
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                EcoSankalp brings together projects, organizations, buyers,
                sellers, and climate infrastructure into one transparent
                marketplace.
              </p>

            </div>


            <CarbonNetwork />

          </div>
        </section>

        {/* PARTNERS - NEW SECTION */}
        <Partners />

        {/* BUYERS AND SELLERS - NEW SECTION */}
        {/*          <BuyerSellerCards />     ------->   IT IS A CODE FOR BuyerSellerCards.jsx */}


        {/* CARBON PROJECTS */}
        <section
          id="featured-projects"
          className="overflow-hidden bg-gradient-to-b from-[#f7f9fd] via-white to-[#f6f3ed] py-24"
        >
          <div className="mx-auto max-w-7xl px-6">

            {/* Section Header */}
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-700">
                  Explore Projects
                </p>

                <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                  Choose From Diverse Carbon Projects
                </h2>

                <p className="mt-4 max-w-2xl text-lg text-slate-600">
                  Explore high-quality climate projects creating measurable
                  environmental impact around the world.
                </p>
              </div>

              <button
                onClick={() => navigate("/marketplace")}
                className="rounded-full bg-green-700 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-green-200 transition hover:bg-green-800"
              >
                Explore Marketplace
              </button>
            </div>

            {/* Project Grid */}
            <div
              id="projects-grid"
              className="mt-14 grid gap-6 md:grid-cols-2"
            >

              {/* Project 1 */}
              <div className="group relative min-h-[340px] overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-700 to-slate-900 shadow-xl">

                <div className="absolute inset-0 bg-black/25" />

                <div className="absolute inset-0 flex items-center justify-center text-[120px] opacity-20">
                  🌲
                </div>

                <div className="absolute inset-x-0 bottom-0 p-8 text-white">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    Reforestation
                  </p>

                  <h3 className="mt-3 text-2xl font-bold">
                    Sequester Carbon in Argentina
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-white/80">
                    Supporting sustainable reforestation projects that capture
                    carbon and restore natural ecosystems.
                  </p>

                  <div className="mt-6 flex items-center justify-between">

                    <div className="flex gap-6 text-xs">
                      <div>
                        <p className="text-white/60">Price per tonne</p>
                        <p className="mt-1 font-bold">₹11.05</p>
                      </div>

                      <div>
                        <p className="text-white/60">Available</p>
                        <p className="mt-1 font-bold">2,500 tCO₂</p>
                      </div>
                    </div>

                    <button className="rounded-full bg-green-700 px-5 py-3 text-xs font-semibold transition hover:bg-green-600">
                      Learn More
                    </button>

                  </div>
                </div>
              </div>


              {/* Project 2 */}
              <div className="group relative min-h-[340px] overflow-hidden rounded-3xl bg-gradient-to-br from-green-950 via-green-800 to-slate-900 shadow-xl">

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute inset-0 flex items-center justify-center text-[120px] opacity-20">
                  🦌
                </div>

                <div className="absolute inset-x-0 bottom-0 p-8 text-white">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    Forest Conservation
                  </p>

                  <h3 className="mt-3 text-2xl font-bold">
                    Drive Paraguay's Reforestation
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-white/80">
                    Protecting forests and supporting communities through verified
                    nature-based climate solutions.
                  </p>

                  <div className="mt-6 flex items-center justify-between">

                    <div className="flex gap-6 text-xs">
                      <div>
                        <p className="text-white/60">Price per tonne</p>
                        <p className="mt-1 font-bold">₹7.98</p>
                      </div>

                      <div>
                        <p className="text-white/60">Available</p>
                        <p className="mt-1 font-bold">1,800 tCO₂</p>
                      </div>
                    </div>

                    <button className="rounded-full bg-green-700 px-5 py-3 text-xs font-semibold transition hover:bg-green-600">
                      Learn More
                    </button>

                  </div>
                </div>
              </div>


              {/* Project 3 */}
              <div className="group relative min-h-[340px] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-800 to-amber-950 shadow-xl">

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute inset-0 flex items-center justify-center text-[120px] opacity-20">
                  🌱
                </div>

                <div className="absolute inset-x-0 bottom-0 p-8 text-white">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    Agriculture
                  </p>

                  <h3 className="mt-3 text-2xl font-bold">
                    Support Organic Waste Composting
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-white/80">
                    Transforming organic waste into sustainable resources while
                    reducing harmful greenhouse gas emissions.
                  </p>

                  <div className="mt-6 flex items-center justify-between">

                    <div className="flex gap-6 text-xs">
                      <div>
                        <p className="text-white/60">Price per tonne</p>
                        <p className="mt-1 font-bold">₹15.90</p>
                      </div>

                      <div>
                        <p className="text-white/60">Available</p>
                        <p className="mt-1 font-bold">950 tCO₂</p>
                      </div>
                    </div>

                    <button className="rounded-full bg-green-700 px-5 py-3 text-xs font-semibold transition hover:bg-green-600">
                      Learn More
                    </button>

                  </div>
                </div>
              </div>


              {/* Project 4 */}
              <div className="group relative min-h-[340px] overflow-hidden rounded-3xl bg-gradient-to-br from-orange-950 via-stone-800 to-slate-950 shadow-xl">

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute inset-0 flex items-center justify-center text-[120px] opacity-20">
                  ♻️
                </div>

                <div className="absolute inset-x-0 bottom-0 p-8 text-white">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    Carbon Removal
                  </p>

                  <h3 className="mt-3 text-2xl font-bold">
                    Fund Ocean Alkalinity Enhancement
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-white/80">
                    Supporting innovative technology that removes carbon dioxide
                    and helps restore ocean ecosystems.
                  </p>

                  <div className="mt-6 flex items-center justify-between">

                    <div className="flex gap-6 text-xs">
                      <div>
                        <p className="text-white/60">Price per tonne</p>
                        <p className="mt-1 font-bold">₹174.12</p>
                      </div>

                      <div>
                        <p className="text-white/60">Available</p>
                        <p className="mt-1 font-bold">400 tCO₂</p>
                      </div>
                    </div>

                    <button className="rounded-full bg-green-700 px-5 py-3 text-xs font-semibold transition hover:bg-green-600">
                      Learn More
                    </button>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* CLIENT TESTIMONIALS */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">

            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row">

              {/* Left Heading */}
              <div className="max-w-md">

                <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-700">
                  Testimonials
                </p>

                <h2 className="mt-4 text-5xl font-bold tracking-tight text-green-800">
                  What Our Clients and Partners Say
                </h2>

                <button
                  onClick={() =>
                    document
                      .getElementById("marketplace")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-10 rounded-full bg-green-700 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-green-200 transition hover:bg-green-800"
                >
                  Explore Projects
                </button>

              </div>


              {/* Testimonial Cards */}
              <div className="grid flex-1 gap-5 md:grid-cols-3">

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    A
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    “EcoSankalp has provided our organization with a simple and
                    transparent way to access verified carbon projects.”
                  </p>

                  <div className="mt-6">
                    <p className="font-semibold text-slate-900">
                      Alex Morgan
                    </p>

                    <p className="text-xs text-slate-500">
                      Sustainability Lead
                    </p>
                  </div>
                </div>


                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    S
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    “The marketplace makes purchasing carbon credits easier while
                    providing clear information about every climate project.”
                  </p>

                  <div className="mt-6">
                    <p className="font-semibold text-slate-900">
                      Sarah Johnson
                    </p>

                    <p className="text-xs text-slate-500">
                      Climate Consultant
                    </p>
                  </div>
                </div>


                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    D
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    “A modern platform that connects businesses with meaningful
                    climate action and high-quality carbon projects.”
                  </p>

                  <div className="mt-6">
                    <p className="font-semibold text-slate-900">
                      David Kim
                    </p>

                    <p className="text-xs text-slate-500">
                      Environmental Strategist
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>


        {/* FINAL CTA */}
        <section
          id="take-action"
          className="bg-gradient-to-r from-slate-50 via-[#f8f5ef] to-slate-50 py-24"
        >
          <div className="mx-auto max-w-7xl px-6">

            {/* ORIGINAL SECTION HEADING */}
            <div className="mx-auto max-w-4xl text-center">

              <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
                Take Climate Action
              </p>

              <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
                Ready to take your climate action to the next level?
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Join EcoSankalp and discover transparent, verifiable, and impactful
                ways to participate in the global carbon market.
              </p>

            </div>


            {/* BUYER AND SELLER CARDS */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">

              {/* FOR BUYERS */}
              <div className="flex min-h-[400px] flex-col justify-between rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm">

                <div>
                  <div className="flex items-center gap-4">

                    <ShoppingCart
                      size={42}
                      strokeWidth={1.8}
                      className="text-green-700"
                    />

                    <h3 className="text-3xl font-bold text-green-800">
                      For Buyers
                    </h3>

                  </div>

                  <p className="mt-12 max-w-3xl text-lg leading-8 text-slate-600">
                    Discover and retire a global selection of verified carbon credits
                    with full price transparency and instant settlement through our
                    open marketplace.
                  </p>
                </div>


                <button
                  onClick={() => navigate("/marketplace")}
                  className="mt-10 w-full rounded-full bg-green-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-green-800"
                >
                  Retire Carbon
                </button>

              </div>


              {/* FOR SELLERS */}
              <div className="flex min-h-[400px] flex-col justify-between rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm">

                <div>
                  <div className="flex items-center gap-4">

                    <Store
                      size={42}
                      strokeWidth={1.8}
                      className="text-green-700"
                    />

                    <h3 className="text-3xl font-bold text-green-800">
                      For Sellers
                    </h3>

                  </div>

                  <p className="mt-12 text-lg leading-8 text-slate-600">
                    List your carbon credits from supported registries on our
                    marketplace and connect with buyers across the global carbon
                    market.
                  </p>
                </div>


                <button
                  onClick={() => navigate("/login")}
                  className="mt-10 w-full rounded-full bg-green-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-green-800"
                >
                  Become a Supplier
                </button>

              </div>

            </div>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="border-y border-emerald-100 bg-emerald-50/50"
        >
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Simple & Transparent
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                How EcoSankalp Works
              </h2>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <span className="text-3xl font-bold text-emerald-600">
                  01
                </span>

                <h3 className="mt-5 text-lg font-bold">
                  Discover Projects
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Browse verified carbon projects and explore available credits.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <span className="text-3xl font-bold text-emerald-600">
                  02
                </span>

                <h3 className="mt-5 text-lg font-bold">
                  Trade Transparently
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Purchase credits with transparent pricing and verifiable
                  ownership.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <span className="text-3xl font-bold text-emerald-600">
                  03
                </span>

                <h3 className="mt-5 text-lg font-bold">
                  Create Impact
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Track and retire credits to support meaningful climate action.
                </p>
              </div>
            </div>
          </div>


        </section>

        {/* CARBON MARKET GUIDE */}
        <CarbonMarketGuide />

      </main>

      <Footer />
    </div>
  );
}