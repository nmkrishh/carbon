export default function CarbonNetwork() {
  const nodes = [
    {
      name: "Retailers",
      top: "4%",
      left: "50%",
      labelPosition: "top",
    },
    {
      name: "Brokers",
      top: "16%",
      left: "18%",
      labelPosition: "top",
    },
    {
      name: "Buyers",
      top: "16%",
      right: "18%",
      labelPosition: "top",
    },
    {
      name: "Project Developers",
      top: "48%",
      left: "5%",
      labelPosition: "left",
    },
    {
      name: "Exchanges",
      top: "48%",
      right: "5%",
      labelPosition: "right",
    },
    {
      name: "AI Agents",
      bottom: "14%",
      left: "18%",
      labelPosition: "bottom",
    },
    {
      name: "SaaS & Fintech",
      bottom: "14%",
      right: "18%",
      labelPosition: "bottom",
    },
    {
      name: "Registries",
      bottom: "2%",
      left: "50%",
      labelPosition: "bottom",
    },
  ];

  return (
    <section className="w-full overflow-hidden">

      {/* CARBON ECOSYSTEM GRAPHIC */}

      <div className="mx-auto mt-12 w-full max-w-4xl animate-ecosystem-float">

        <div className="relative h-[500px] w-full">

          {/* ROTATING ORBITS */}
          <div className="absolute inset-0 animate-orbits">

          {/* ORBIT 1 */}
          <div className="absolute left-1/2 top-1/2 h-[190px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-slate-300/98 -rotate-[45deg]" />

          {/* ORBIT 2 */}
          <div className="absolute left-1/2 top-1/2 h-[190px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-slate-300/98 rotate-[70deg]" />

          {/* ORBIT 3 */}
          <div className="absolute left-1/2 top-1/2 h-[190px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-slate-300/98 rotate-[20deg]" />

          </div>
          {/* CENTER CARBON ELEMENT */}

          <div className="absolute left-1/2 top-1/2 h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2">

            {/* Orbit Lines */}

            <div className="absolute inset-0 rounded-[45%] border-2 border-green-700 rotate-[20deg]" />

            <div className="absolute inset-3 rounded-[45%] border-2 border-green-700 rotate-[65deg]" />

            <div className="absolute inset-6 rounded-[45%] border-2 border-green-700 -rotate-[25deg]" />

            <div className="absolute inset-9 rounded-[45%] border-2 border-green-700 rotate-[100deg]" />


            {/* Center Core */}

            <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800" />


            {/* Small Electrons */}

            <div className="absolute left-[22%] top-[28%] h-3 w-3 rounded-full bg-slate-800" />

            <div className="absolute right-[18%] top-[38%] h-3 w-3 rounded-full bg-slate-800" />

            <div className="absolute bottom-[18%] left-[35%] h-3 w-3 rounded-full bg-slate-800" />

            <div className="absolute right-[35%] top-[12%] h-3 w-3 rounded-full bg-slate-800" />

          </div>


          {/* ECOSYSTEM NODES */}

          {nodes.map((node) => (
            <div
              key={node.name}
              className="absolute -translate-x-1/2"
              style={{
                top: node.top,
                left: node.left,
                right: node.right,
                bottom: node.bottom,
              }}
            >

              {/* TOP LABEL */}

              {node.labelPosition === "top" && (
                <p className="absolute bottom-10 left-1/2 w-max -translate-x-1/2 whitespace-nowrap text-center text-lg font-medium tracking-wide text-slate-700">
                  {node.name}
                </p>
              )}


              {/* LEFT LABEL */}

              {node.labelPosition === "left" && (
                <p className="absolute right-10 top-1/2 w-36 -translate-y-1/2 text-right text-lg font-medium leading-tight tracking-wide text-slate-700">
                  {node.name}
                </p>
              )}


              {/* RIGHT LABEL */}

              {node.labelPosition === "right" && (
                <p className="absolute left-10 top-1/2 w-36 -translate-y-1/2 text-left text-lg font-medium leading-tight tracking-wide text-slate-700">
                  {node.name}
                </p>
              )}


              {/* BOTTOM LABEL */}

              {node.labelPosition === "bottom" && (
                <p className="absolute left-1/2 top-10 w-max -translate-x-1/2 whitespace-nowrap text-center text-lg font-medium leading-tight tracking-wide text-slate-700">
                  {node.name}
                </p>
              )}


              {/* green NODE */}

              <div className="h-7 w-7 rounded-full bg-green-700 shadow-lg shadow-green-300/50" />

            </div>
          ))}

        </div>

      </div>


      {/* DESCRIPTION SECTION */}

      <div className="mx-auto mt-8 max-w-5xl px-6 text-center">

        <p className="text-lg leading-relaxed tracking-wide text-slate-600 md:text-2xl">

          CarbonX is the climate infrastructure layer for the next generation
          of the carbon market

          <br className="hidden md:block" />

          — delivering connection, transparency, speed, and accessibility to{" "}

          <span className="text-green-700">
            carbon markets.
          </span>

        </p>


        <p className="mx-auto mt-8 max-w-4xl text-base leading-relaxed tracking-wide text-slate-500 md:text-xl">

          With real-time pricing, traceability of each tonne of CO₂, and
          scalable technology, CarbonX provides end-to-end visibility and
          control across the carbon credit lifecycle.

        </p>


        <button
          className="mt-12 rounded-full bg-green-700 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-green-300/40 transition duration-300 hover:-translate-y-1 hover:bg-green-800"
        >
          Contact Us
        </button>

      </div>

    </section>
  );
}