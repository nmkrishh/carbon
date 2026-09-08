import { Link } from "react-router-dom";

export default function Certificate() {
  const certificate = {
    buyerName: "Sample Buyer",
    amount: 250,
    date: "September 6, 2026",
    transactionHash:
      "0x8f3a7c21b9d4e6f8a2c5b7d9e1f4a6c8b0d2e5f7a9c3b6d8e1f2a4b5c7d9e0",
  };

  const explorerUrl = `https://amoy.polygonscan.com/tx/${certificate.transactionHash}`;

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-12">

      <div className="mx-auto max-w-5xl">

        {/* TOP NAVIGATION */}

        <div className="mb-8 flex items-center justify-between">

          <Link
            to="/marketplace"
            className="text-sm font-semibold text-blue-700 transition hover:text-blue-900"
          >
            ← Back to Marketplace
          </Link>

          <p className="text-sm font-semibold tracking-[0.2em] text-slate-500">
            CARBONX VERIFIED
          </p>

        </div>


        {/* CERTIFICATE */}

        <div className="relative overflow-hidden border-[12px] border-double border-blue-800 bg-white px-8 py-16 text-center shadow-2xl md:px-20">

          {/* DECORATIVE CORNERS */}

          <div className="absolute left-6 top-6 h-16 w-16 border-l-2 border-t-2 border-blue-700" />

          <div className="absolute right-6 top-6 h-16 w-16 border-r-2 border-t-2 border-blue-700" />

          <div className="absolute bottom-6 left-6 h-16 w-16 border-b-2 border-l-2 border-blue-700" />

          <div className="absolute bottom-6 right-6 h-16 w-16 border-b-2 border-r-2 border-blue-700" />


          {/* LOGO */}

          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-700">

            <span className="text-4xl font-bold text-blue-700">
              C
            </span>

          </div>


          {/* TITLE */}

          <p className="text-sm font-semibold tracking-[0.4em] text-blue-700">
            CARBON OFFSET CERTIFICATE
          </p>

          <h1 className="mt-6 text-4xl font-semibold text-slate-900 md:text-5xl">
            Certificate of Carbon Offset
          </h1>


          {/* DESCRIPTION */}

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600">
            This certificate confirms that carbon credits have been
            successfully purchased and retired through the CarbonX platform.
          </p>


          {/* BUYER */}

          <div className="mt-12">

            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Presented To
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-slate-900">
              {certificate.buyerName}
            </h2>

          </div>


          {/* AMOUNT */}

          <div className="mx-auto mt-12 max-w-md border-y border-slate-200 py-8">

            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Carbon Offset
            </p>

            <p className="mt-3 text-5xl font-semibold text-blue-700">
              {certificate.amount.toLocaleString()} tCO₂
            </p>

          </div>


          {/* DATE */}

          <div className="mt-10">

            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Date of Retirement
            </p>

            <p className="mt-3 text-xl font-medium text-slate-800">
              {certificate.date}
            </p>

          </div>


          {/* BLOCKCHAIN */}

          <div className="mx-auto mt-12 max-w-2xl rounded-xl bg-slate-50 p-6">

            <p className="text-sm font-semibold tracking-wide text-slate-700">
              Blockchain Transaction
            </p>

            <a
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block break-all text-sm text-blue-700 hover:underline"
            >
              {certificate.transactionHash}
            </a>

          </div>


          {/* VERIFIED */}

          <div className="mt-12">

            <p className="text-sm font-semibold tracking-[0.25em] text-green-600">
              ✓ VERIFIED ON BLOCKCHAIN
            </p>

          </div>

        </div>


        {/* ACTIONS */}

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

          <button
            onClick={() => window.print()}
            className="rounded-full bg-blue-700 px-8 py-4 font-semibold text-white transition hover:bg-blue-800"
          >
            Download Certificate
          </button>

          <Link
            to="/marketplace"
            className="rounded-full border border-slate-300 px-8 py-4 text-center font-semibold text-slate-700 transition hover:bg-white"
          >
            Return to Marketplace
          </Link>

        </div>

      </div>

    </div>
  );
}