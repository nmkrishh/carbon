import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function CreditCard({
credit,
isLoggedIn,
userRole,
handleBuy,
}) {
const navigate = useNavigate();

const isOrg = userRole === "org";

const onBuyClick = () => {
// User is not logged in
if (!isLoggedIn) {
navigate("/login");
return;
}

```
// Consumer can buy credits
if (userRole === "consumer") {
  handleBuy(credit.id);
}
```

};

return ( <article className="group flex min-h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

```
  {/* Project Image */}
  <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600">
    {credit.imageUrl ? (
      <img
        src={credit.imageUrl}
        alt={credit.orgName}
        className="h-full w-full object-cover"
      />
    ) : (
      <>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-8 h-36 w-36 rounded-full bg-white/10" />

        <span className="relative text-6xl">
          🌱
        </span>
      </>
    )}
  </div>

  {/* Card Content */}
  <div className="flex flex-1 flex-col p-5">
    
    <h3 className="text-lg font-bold text-gray-900">
      {credit.orgName}
    </h3>

    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
      {credit.description}
    </p>

    {/* Amount and Price */}
    <div className="mt-5 grid grid-cols-2 gap-4 border-y border-gray-100 py-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Amount Available
        </p>

        <p className="mt-1 font-bold text-gray-900">
          {credit.amount.toLocaleString()} tCO2
        </p>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Price
        </p>

        <p className="mt-1 font-bold text-gray-900">
          ₹{credit.price}/tonne
        </p>
      </div>
    </div>

    {/* Status */}
    <div className="mt-4">
      <StatusBadge status={credit.status} />
    </div>

    {/* Buy Button */}
    <button
      onClick={onBuyClick}
      disabled={isOrg}
      className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
        isOrg
          ? "cursor-not-allowed bg-gray-100 text-gray-400"
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }`}
    >
      {isOrg ? "Organizations Cannot Buy" : "Buy Credits"}
    </button>
  </div>
</article>


);
}
