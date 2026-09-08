export default function MarketplaceCard({ credit, onBuy }) {
    return (
      <div className="overflow-hidden rounded-md bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
  
        {/* PROJECT IMAGE */}
  
        <div className="h-[190px] w-full overflow-hidden bg-slate-200">
  
          <img
            src={credit.image}
            alt={credit.name}
            className="h-full w-full object-cover"
          />
  
        </div>
  
  
        {/* CARD CONTENT */}
  
        <div className="p-6">
  
          {/* PRICE */}
  
          <p className="text-[25px] font-bold text-slate-900">
  
            ₹{credit.price.toFixed(2)}
  
          </p>
  
  
          {/* PROJECT NAME */}
  
          <h2 className="mt-3 line-clamp-2 text-xl font-bold text-slate-900">
  
            {credit.name}
  
          </h2>
  
  
          {/* ORGANIZATION */}
  
          <p className="mt-2 text-base text-slate-600">
  
            {credit.organization}
  
          </p>
  
  
          {/* AVAILABLE AMOUNT */}
  
          <p className="mt-3 text-sm text-slate-500">
  
            Available: {credit.amount.toLocaleString()} credits
  
          </p>
  
  
          {/* TAGS */}
  
          <div className="mt-5 flex flex-wrap gap-2">
  
            <span className="rounded border border-slate-300 px-3 py-1 text-sm">
  
              {credit.country}
  
            </span>
  
            <span className="rounded border border-slate-300 px-3 py-1 text-sm">
  
              {credit.year}
  
            </span>
  
          </div>
  
  
          {/* BUY BUTTON */}
  
          <button
            onClick={() => onBuy(credit.id)}
            className="mt-6 w-full rounded bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
  
            BUY CREDIT
  
          </button>
  
        </div>
  
      </div>
    );
  }