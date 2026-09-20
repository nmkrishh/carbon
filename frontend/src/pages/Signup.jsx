import { useState } from "react";
import { Eye, EyeOff, KeyRound, User, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "consumer",
    wallet_address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Save JWT token and profile info
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", formData.role);
        localStorage.setItem("name", data.name || formData.name || "Eco Member");
        localStorage.setItem("wallet_address", data.wallet_address || ("0x" + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')));
      }

      setMessage("Account created successfully!");

      // Redirect based on role
      setTimeout(() => {
        if (formData.role === "consumer") {
          navigate("/marketplace");
        } else if (formData.role === "org") {
          navigate("/dashboard");
        } else if (formData.role === "admin") {
          navigate("/admin");
        }
      }, 1000);

    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">

      {/* LEFT SIGNUP SECTION */}
      <section className="flex w-full justify-center bg-[#fafafa] lg:w-[45%]">

      <div className="w-full max-w-[460px] px-8 pb-12 pt-2">

          {/* LOGO */}
          <Link
            to="/"
            className="mb-12 flex w-fit items-center"
            title="EcoSankalp"
          >
            <img
              src="/Eco.svg"
              alt="EcoSankalp Logo"
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain hover:scale-105 transition-transform duration-200"
            />
          </Link>

          <Link
            to="/login"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            ← Back to Login
          </Link>

          {/* SIGNUP CONTENT */}
          <div>

            <h1 className="text-[42px] font-medium tracking-[-0.04em] text-[#171717]">
              Create an account
            </h1>

            <p className="mt-1 text-[16px] text-[#4f4f4f]">
              Join EcoSankalp and access the carbon marketplace.
            </p>

            {/* FORM */}
            <form onSubmit={handleSignup} className="mt-8">

              {/* NAME */}
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder={formData.role === "org" ? "Organization / Company Name (e.g. EcoTech Energy Ltd)" : "Enter your full name"}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-[50px] w-full rounded-md border border-[#d5d5d5] bg-white px-4 pr-12 text-[15px] text-[#222] outline-none transition placeholder:text-[#8a8a8a] focus:border-[#555]"
                />

                <User
                  size={17}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333]"
                />
              </div>

              {/* EMAIL */}
              <div className="relative mt-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
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
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
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

              {/* ROLE */}
              <div className="mt-4">

                <label className="mb-2 block text-[14px] font-medium text-[#333]">
                  I want to join as
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="h-[50px] w-full rounded-md border border-[#d5d5d5] bg-white px-4 text-[15px] text-[#222] outline-none transition focus:border-[#555]"
                >
                  <option value="consumer">
                    Consumer / Carbon Buyer
                  </option>

                  <option value="org">
                    Organization / Carbon Seller
                  </option>

                  <option value="admin">
                    Administrator
                  </option>
                </select>

              </div>

              {/* WALLET ADDRESS */}
              <div className="relative mt-4">

                <input
                  type="text"
                  name="wallet_address"
                  placeholder="Wallet address (optional)"
                  value={formData.wallet_address}
                  onChange={handleChange}
                  className="h-[50px] w-full rounded-md border border-[#d5d5d5] bg-white px-4 pr-12 text-[15px] text-[#222] outline-none transition placeholder:text-[#8a8a8a] focus:border-[#555]"
                />

                <Wallet
                  size={17}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333]"
                />

              </div>

              {/* MESSAGE */}
              {message && (
                <p
                  className={`mt-4 text-sm ${
                    message === "Account created successfully!"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {message}
                </p>
              )}

              {/* SIGNUP BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 h-[52px] w-full rounded-md bg-[#21180f] text-[15px] font-medium text-white transition hover:bg-[#382a1d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

            </form>

            

          </div>

        </div>

      </section>


      {/* RIGHT VISUAL SECTION */}
      <section className="relative hidden min-h-screen flex-1 overflow-hidden lg:block">

        <img
          src="/LoginPageImage.jpg"
          alt="Carbon project landscape"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/35" />

        {/* CONTENT */}
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">

          <div className="max-w-[330px]">

            <p className="text-[13px] font-semibold tracking-[0.15em]">
              JOIN THE TRANSITION
            </p>

            <h2 className="mt-5 text-4xl font-medium leading-tight">
              A more transparent future for carbon markets.
            </h2>

          </div>

          <div className="max-w-[350px]">

            <p className="text-lg leading-relaxed text-white/85">
              Connect with organizations, climate projects, and buyers building
              a more sustainable global economy.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}