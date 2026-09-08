import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#f5f6f8] px-6 pt-20 text-[#4b5565]">
      <div className="mx-auto max-w-[1600px]">

        {/* TOP ROW */}
        <div className="flex flex-col justify-between gap-10 border-b border-[#dfe3e8] pb-10 md:flex-row md:items-center">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#244db5] text-xl font-bold text-[#244db5] font-bold text-green-900">
              C
            </div>

            <span className="text-[15px] font-bold tracking-[0.42em] text-[#344054] font-bold text-green-900">
              CARBONX
            </span>
          </Link>

          {/* RIGHT TEXT */}
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <p className="text-[18px] tracking-wide text-[#5d6675]">
              The universal carbon marketplace
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#e9ecf1] text-xl text-[#394150] transition hover:bg-[#dfe3e8]">
                𝕏
              </div>

              <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#e9ecf1] text-sm font-bold text-[#394150] transition hover:bg-[#dfe3e8]">
                in
              </div>

              <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#e9ecf1] text-sm text-[#394150] transition hover:bg-[#dfe3e8]">
                ▶
              </div>
            </div>
          </div>
        </div>


        {/* MAIN FOOTER CONTENT */}
        <div className="grid grid-cols-1 gap-12 border-b border-[#dfe3e8] py-12 md:grid-cols-3">

          {/* PLATFORM */}
          <div>
            <h3 className="mb-6 text-[14px] font-bold tracking-[0.2em] text-[#273244]">
              PLATFORM
            </h3>

            <div className="flex flex-col gap-4 text-[18px]">

              <Link
                to="/"
                className="transition hover:text-green-700"
              >
                Home
              </Link>

              <Link
                to="/marketplace"
                className="transition hover:text-green-700"
              >
                Marketplace
              </Link>

              <Link
                to="/dashboard"
                className="transition hover:text-green-700"
              >
                Sell Carbon Credits
              </Link>

              <Link
                to="/login"
                className="transition hover:text-green-700"
              >
                Login
              </Link>

            </div>
          </div>


          {/* SOLUTIONS */}
          <div>
            <h3 className="mb-6 text-[14px] font-bold tracking-[0.2em] text-[#273244]">
              SOLUTIONS
            </h3>

            <div className="flex flex-col gap-4 text-[18px]">

              <Link
                to="/marketplace"
                className="transition hover:text-green-700"
              >
                Buy Carbon Credits
              </Link>

              <Link
                to="/dashboard"
                className="transition hover:text-green-700"
              >
                Organization Dashboard
              </Link>

              <Link
                to="/certificate"
                className="transition hover:text-green-700"
              >
                Carbon Certificates
              </Link>

              <Link
                to="/admin"
                className="transition hover:text-green-700"
              >
                Credit Approval
              </Link>

            </div>
          </div>


          {/* CONTACT */}
          <div>
            <h3 className="mb-6 text-[14px] font-bold tracking-[0.2em] text-[#273244]">
              CONTACT
            </h3>

            <div className="flex flex-col gap-4 text-[18px]">

              <a
                href="mailto:contact@carbonx.com"
                className="transition hover:text-green-700"
              >
                Contact Us
              </a>

              <a
                href="mailto:info@carbonx.com"
                className="transition hover:text-green-700"
              >
                info@carbonx.com
              </a>

              <p className="mt-2 max-w-[350px] leading-[1.65]">
                Building transparent, accessible, and reliable carbon markets
                for organizations and individuals worldwide.
              </p>

            </div>
          </div>

        </div>


        {/* BOTTOM ROW */}
        <div className="flex flex-col gap-3 py-7 text-[16px] tracking-wide md:flex-row md:items-center">

          <span>© CarbonX, 2026</span>

          <span className="hidden md:inline">·</span>

          <button className="text-left hover:text-green-700">
            Privacy Policy
          </button>

          <span className="hidden md:inline">·</span>

          <button className="text-left hover:text-green-700">
            Code of Ethics
          </button>

        </div>

      </div>
    </footer>
  );
}