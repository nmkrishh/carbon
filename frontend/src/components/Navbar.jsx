import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isLoggedIn = !!token;

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const scrollToCarbonGuide = () => {
    document
      .getElementById("carbon-guide")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const scrollToMarketplace = () => {
    document
      .getElementById("featured-projects")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const scrollToTakeAction = () => {
    document
      .getElementById("take-action")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">

        {/* LOGO */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-900 text-lg font-bold text-green-900">
            C
          </div>

          <span className="text-lg font-bold tracking-[0.3em] text-green-900">
            CARBONX
          </span>
        </Link>


        {/* CENTER NAVIGATION */}

        <div className="hidden items-center gap-10 lg:flex">

          {/* REAL BUYER MARKETPLACE */}

          <button
            onClick={scrollToMarketplace}
            className="text-sm font-medium text-slate-600 transition hover:text-green-700"
          >
            Marketplace
          </button>


          {/* HOME PAGE SECTION */}

          <button
            onClick={scrollToHowItWorks}
            className="text-sm font-medium text-slate-600 transition hover:text-green-700"
          >
            How It Works
          </button>


          <button
            onClick={scrollToTakeAction}
            className="text-sm font-medium text-slate-600 transition hover:text-green-700"
          >
            Take Action
          </button>


          <button
            onClick={scrollToCarbonGuide}
            className="text-sm font-medium text-slate-600 transition hover:text-green-700"
          >
            Explore
          </button>

        </div>


        {/* RIGHT SIDE */}

        <div className="flex items-center gap-3">

          {isLoggedIn ? (
            <>
              <Link
                to={role === "admin" ? "/admin" : role === "org" ? "/dashboard" : "/marketplace"}
                className="hidden text-sm font-semibold text-green-700 transition hover:text-green-800 md:block"
              >
                {role === "admin" ? "Admin Panel" : role === "org" ? "Org Dashboard" : "Marketplace"}
              </Link>

              <button
                onClick={onLogout}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* LOGIN */}

              <Link
                to="/login"
                className="rounded-full border border-green-700 px-6 py-2.5 text-sm font-semibold text-green-800 transition hover:bg-green-50"
              >
                Login
              </Link>


              {/* REAL MARKETPLACE */}

              <Link
                to="/marketplace"
                className="rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-900/20 transition hover:bg-green-700"
              >
                Go to Marketplace
              </Link>
            </>
          )}

        </div>

      </nav>

    </header>
  );
}