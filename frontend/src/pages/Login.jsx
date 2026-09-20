import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useToast } from "../context/ToastContext";
import { API_URL } from "../config/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("consumer");

  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      addToast("Please enter your email and password.", "error");
      return;
    }
  
    // Demo login — any email/password is accepted
    localStorage.setItem("token", "demo-token");
    localStorage.setItem("role", role);
    localStorage.setItem("name", email.split("@")[0] || "Eco User");
  
    // Generate a demo wallet address
    localStorage.setItem(
      "wallet_address",
      "0x" +
        Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("")
    );
  
    // Redirect according to selected RBAC role
    if (role === "consumer") {
      navigate("/marketplace");
    } else if (role === "organization") {
      navigate("/dashboard");
    } else if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">

      {/* LEFT LOGIN SECTION */}
      <section className="flex w-full items-center justify-center bg-[#fafafa] lg:w-[40%]">

        <div className="w-full max-w-[440px] px-8 py-12 pt-1">

          {/* LOGO */}
          <Link
            to="/"
            className="mb-20 flex w-fit items-center"
            title="EcoSankalp"
          >
            <img
              src="/Eco.svg"
              alt="EcoSankalp Logo"
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain hover:scale-105 transition-transform duration-200"
            />
          </Link>


          {/* LOGIN CONTENT */}
          <div>

            <h1 className="text-[42px] font-medium tracking-[-0.04em] text-[#171717]">
              Welcome!
            </h1>

            <p className="mt-1 text-[16px] text-[#4f4f4f]">
              Sign in to continue to EcoSankalp
            </p>

            {/* ROLE SELECTION */}
            <div className="mt-7">

            <p className="mb-3 text-sm font-medium text-[#303030]">
              Continue as
            </p>

            <div className="grid grid-cols-3 gap-2">

              <button
                type="button"
                onClick={() => setRole("consumer")}
                className={`rounded-md border px-3 py-3 text-sm font-medium transition ${
                  role === "consumer"
                    ? "border-[#21180f] bg-[#21180f] text-white"
                    : "border-[#d7d7d7] bg-white text-[#303030] hover:bg-[#f7f7f7]"
                }`}
              >
                Consumer
              </button>


              <button
                type="button"
                onClick={() => setRole("organization")}
                className={`rounded-md border px-3 py-3 text-sm font-medium transition ${
                  role === "organization"
                    ? "border-[#21180f] bg-[#21180f] text-white"
                    : "border-[#d7d7d7] bg-white text-[#303030] hover:bg-[#f7f7f7]"
                }`}
              >
                Organization
              </button>


              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`rounded-md border px-3 py-3 text-sm font-medium transition ${
                  role === "admin"
                    ? "border-[#21180f] bg-[#21180f] text-white"
                    : "border-[#d7d7d7] bg-white text-[#303030] hover:bg-[#f7f7f7]"
                }`}
              >
                Admin
              </button>

            </div>

            </div>


            {/* GOOGLE BUTTON */}
            <button
              className="mt-7 flex h-[48px] w-full items-center justify-center gap-3 rounded-md border border-[#d7d7d7] bg-white text-[15px] font-medium text-[#303030] shadow-sm transition hover:bg-[#f7f7f7]"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full text-[16px] font-bold text-red-500">
                G
              </span>

              Sign in with Google
            </button>


            {/* DIVIDER */}
            <div className="my-8 flex items-center gap-4">

              <div className="h-px flex-1 bg-[#dedede]" />

              <span className="text-[14px] text-[#555]">
                or
              </span>

              <div className="h-px flex-1 bg-[#dedede]" />

            </div>


            {/* EMAIL */}
            <div className="relative">

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="h-[50px] w-full rounded-md border border-[#d5d5d5] bg-white px-4 pr-12 text-[15px] text-[#222] outline-none transition placeholder:text-[#8a8a8a] focus:border-[#555]"
            />

              <KeyRound
                size={17}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333]"
              />

            </div>


            {/* PASSWORD */}
            <div className="relative mt-4">

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-[50px] w-full rounded-md border border-[#d5d5d5] bg-white px-4 pr-12 text-[15px] text-[#222] outline-none transition placeholder:text-[#8a8a8a] focus:border-[#555]"
            />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333]"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>


            {/* FORGOT PASSWORD */}
            <button className="mt-4 text-[14px] font-medium text-[#303030] hover:underline">
              Forgot password?
            </button>


            {/* CONTINUE BUTTON */}
            <button
              onClick={handleLogin}
              className="mt-6 h-[52px] w-full rounded-md bg-[#21180f] text-[15px] font-medium text-white transition hover:bg-[#382a1d]"
            >
              Continue
            </button>


            {/* SIGNUP */}
            <p className="mt-5 text-[14px] text-[#555]">

              Don't have an account?{" "}

              <Link
                to="/signup"
                className="font-medium text-[#222] underline underline-offset-2"
              >
                Sign up
              </Link>

            </p>

          </div>


          {/* BOTTOM DECORATION */}
          <div className="mt-20 flex items-center">

            <div className="relative h-9 w-9">

              <div className="absolute left-1 top-2 h-6 w-6 rounded-full border-2 border-[#7d6cff]" />

              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-[#91e8bb]" />

            </div>

          </div>

        </div>

      </section>


      {/* RIGHT IMAGE SECTION */}
      <section className="relative hidden min-h-screen flex-1 overflow-hidden lg:block">

        {/* SAMPLE BACKGROUND IMAGE */}
        <img
          src="/LoginPageImage.jpg"
          alt="Carbon project landscape"
          className="absolute inset-0 h-full w-full object-cover"
        />


        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/15" />


        {/* TOP INFORMATION */}
        <div className="absolute right-[8%] top-[4%] max-w-[300px] text-white">

          <p className="text-[14px] font-semibold tracking-[0.08em]">
            CarbonX / technology /
          </p>

          <p className="mt-2 text-[16px] leading-relaxed text-white/90">
            Building transparent and accessible carbon markets through
            technology and verified climate infrastructure.
          </p>

        </div>


        {/* CENTRAL GRID GRAPHIC */}
        {/* CARBON ELEMENT GRAPHIC */}
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] animate-carbon-move">

<div className="absolute left-1/2 top-1/2 h-[360px] w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-[3px] border-white/80 rotate-[45deg]" />

<div className="absolute left-1/2 top-1/2 h-[360px] w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-[3px] border-white/70 -rotate-[45deg]" />

<div className="absolute left-1/2 top-1/2 h-[170px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-[3px] border-white/60" />
{/* CENTER CARBON */}
<div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white/10 backdrop-blur-sm">

  <div className="text-center text-white">
    <span className="block text-4xl font-semibold">
      C
    </span>

    <span className="mt-1 block text-[10px] tracking-[0.3em] text-white/70">
      CARBON
    </span>
  </div>

</div>


{/* ELECTRON / CARBON POINTS */}

<div className="absolute left-[13%] top-[20%] h-4 w-4 rounded-full bg-white shadow-lg shadow-white/0" />

<div className="absolute right-[13%] top-[20%] h-4 w-4 rounded-full bg-white shadow-lg shadow-white/90" />

<div className="absolute bottom-[18%] left-[20%] h-3 w-3 rounded-full bg-white" />

<div className="absolute bottom-[18%] right-[20%] h-3 w-3 rounded-full bg-white" />

<div className="absolute left-1/2 top-[2%] h-3 w-3 -translate-x-1/2 rounded-full bg-white" />

</div>


        {/* BOTTOM INFORMATION */}
        <div className="absolute bottom-[10%] right-[8%] max-w-[270px] text-white">

          <p className="text-[14px] font-semibold tracking-[0.08em]">
            VERIFIED / TRACEABLE /
          </p>

          <p className="mt-3 text-[16px] leading-relaxed text-white/90">
            Every credit is designed to provide transparency and confidence
            throughout the carbon credit lifecycle.
          </p>

        </div>

      </section>

    </div>
  );
}