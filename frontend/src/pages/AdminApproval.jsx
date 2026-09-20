import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useToast } from "../context/ToastContext";
import { API_URL } from "../config/api";

export default function AdminApproval() {
  const [credits, setCredits] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    fetchPendingCredits();
  }, []);

  const fetchPendingCredits = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/credits/pending`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if(res.ok) setCredits(data);
    } catch(err) {
      console.error(err);
    }
  };

  const approveCredit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/credits/${id}/approve`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if(res.ok) {
        addToast("Credit approved & minted on blockchain!");
        fetchPendingCredits();
      } else {
        addToast("Error: " + data.message, "error");
      }
    } catch(err) {
      addToast("Error: " + err.message, "error");
    }
  };

  const pendingCredits = credits; // The API only returns pending credits

  return (
    <div className="min-h-screen bg-slate-50">

      {/* TOP NAVIGATION */}
      <div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* CARBONX LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3 transition hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-900 text-lg font-bold text-green-900">
              C
            </div>

            <span className="text-lg font-bold tracking-[0.3em] text-green-900">
              CARBONX
            </span>
          </Link>


          {/* PAGE LABEL */}
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            Admin Panel
          </span>

        </div>
      </div>

      {/* HEADER */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <p className="text-sm font-semibold tracking-[0.2em] text-green-700">
            CARBONX ADMIN
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-slate-900">
            Credit Approval Center
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-slate-500">
            Review carbon credit submissions from organizations and approve
            verified projects for the CarbonX marketplace.
          </p>
        </div>

        {/* STATS */}
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Pending Requests
            </p>

            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {pendingCredits.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Submissions
            </p>

            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {credits.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Approved
            </p>

            <p className="mt-2 text-3xl font-semibold text-green-600">
              {
                credits.filter(
                  (credit) => credit.status === "Approved"
                ).length
              }
            </p>
          </div>
        </div>

        {/* CREDIT REQUESTS */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Pending Carbon Credit Requests
            </h2>
          </div>

          {pendingCredits.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No pending credit requests.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">

              {pendingCredits.map((credit) => (
                <div
                  key={credit.id}
                  className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between"
                >

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {credit.org_name || credit.User?.name || "Unknown Org"}
                    </h3>

                    <p className="mt-2 text-slate-500">
                      {credit.description}
                    </p>

                    <p className="mt-3 font-medium text-green-700">
                      {Number(credit.amount).toLocaleString()} tCO₂
                    </p>
                  </div>

                  <button
                    onClick={() => approveCredit(credit.id)}
                    className="rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                  >
                    Approve Credit
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}