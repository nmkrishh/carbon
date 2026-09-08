export default function Partners() {
    const partners = [
      "EcoRegistry",
      "Puro Earth",
      "SCØ",
      "Mistra",
      "Circle",
      "ICR",
      "Aither",
      "Spherity",
      "Vinder",
      "CarbonConnect",
      "Cloverly",
    ];
  
    return (
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
  
          <h2 className="text-center text-3xl font-bold text-green-800">
            Our Partners
          </h2>
  
          <div className="mt-12 grid grid-cols-2 items-center gap-8 text-center sm:grid-cols-3 md:grid-cols-6">
            {partners.map((partner) => (
              <div
                key={partner}
                className="text-sm font-semibold text-slate-400 transition hover:text-blue-700"
              >
                {partner}
              </div>
            ))}
          </div>
  
        </div>
      </section>
    );
  }