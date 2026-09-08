export default function BuyerSellerCards() {
    const scrollToMarketplace = () => {
      document
        .getElementById("marketplace")
        ?.scrollIntoView({ behavior: "smooth" });
    };
  
    return (
      <section className="bg-slate-50 px-6 py-24">
  
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
  
          {/* Buyers */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
  
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-2xl">
              🌍
            </div>
  
            <h2 className="mt-6 text-2xl font-bold text-green-800">
              For Buyers
            </h2>
  
            <p className="mt-4 leading-7 text-slate-500">
              Discover and retire a global selection of verified carbon
              credits with full price transparency and instant settlement.
            </p>
  
            <button
              onClick={scrollToMarketplace}
              className="mt-10 w-full rounded-full bg-green-700 py-4 text-sm font-semibold text-white shadow-lg shadow-green-200 transition hover:bg-green-800"
            >
              Explore Carbon Credits
            </button>
  
          </div>
  
          {/* Sellers */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
  
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-2xl">
              ♻️
            </div>
  
            <h2 className="mt-6 text-2xl font-bold text-green-800">
              For Sellers
            </h2>
  
            <p className="mt-4 leading-7 text-slate-500">
              List your carbon credits on a transparent marketplace and
              connect directly with buyers around the world.
            </p>
  
            <button className="mt-10 w-full rounded-full bg-green-700 py-4 text-sm font-semibold text-white shadow-lg shadow-green-200 transition hover:bg-green-800">
              Become a Supplier
            </button>
  
          </div>
  
        </div>
  
      </section>
    );
  }