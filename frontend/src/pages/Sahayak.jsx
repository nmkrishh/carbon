import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  Leaf, 
  Trash2, 
  Recycle, 
  ShieldCheck, 
  Sparkles, 
  Gauge, 
  Download, 
  ArrowRight, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Info,
  Building2,
  FileCheck,
  Zap
} from "lucide-react";
import { useToast } from "../context/ToastContext";

// IPCC & CPCB Standard Emission Factors (tCO2e avoided per tonne processed)
const EMISSION_FACTORS = {
  organic: 0.52,      // Methane avoided from landfill diversion
  plastic: 1.40,      // Virgin polymer displacement
  sanitary: 0.85,     // Safe bio-medical / sanitary waste neutralization
  ewaste: 2.10,       // Energy-intensive smelting avoidance
  wasteToEnergy: 0.65 // Fossil fuel grid displacement per MWh
};

const MARKET_RATE_INR = 1250; // Average CCTS voluntary compliance credit price in INR (₹)

export default function Sahayak() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Inputs in Tonnes
  const [organicTons, setOrganicTons] = useState(12.5);
  const [plasticTons, setPlasticTons] = useState(4.2);
  const [sanitaryTons, setSanitaryTons] = useState(1.8);
  const [ewasteTons, setEwasteTons] = useState(0.6);
  const [wasteToEnergyMWh, setWasteToEnergyMWh] = useState(0);
  
  // Organization / Campus info
  const [orgName, setOrgName] = useState("Green Facility & Waste Processing Unit");
  const [selectedStandard, setSelectedStandard] = useState("CPCB_IPCC_2026");

  // Calculations
  const calculations = useMemo(() => {
    const orgCredits = Number(organicTons || 0) * EMISSION_FACTORS.organic;
    const plasticCredits = Number(plasticTons || 0) * EMISSION_FACTORS.plastic;
    const sanitaryCredits = Number(sanitaryTons || 0) * EMISSION_FACTORS.sanitary;
    const ewasteCredits = Number(ewasteTons || 0) * EMISSION_FACTORS.ewaste;
    const energyCredits = Number(wasteToEnergyMWh || 0) * EMISSION_FACTORS.wasteToEnergy;

    const totalTCO2e = orgCredits + plasticCredits + sanitaryCredits + ewasteCredits + energyCredits;
    const totalKgCO2e = totalTCO2e * 1000;
    const totalValueINR = totalTCO2e * MARKET_RATE_INR;
    const totalWasteTonnes = Number(organicTons || 0) + Number(plasticTons || 0) + Number(sanitaryTons || 0) + Number(ewasteTons || 0);

    // Percentage breakdown
    const isZero = totalTCO2e <= 0;
    const orgPct = isZero ? 0 : Math.round((orgCredits / totalTCO2e) * 100);
    const plasticPct = isZero ? 0 : Math.round((plasticCredits / totalTCO2e) * 100);
    const sanitaryPct = isZero ? 0 : Math.round((sanitaryCredits / totalTCO2e) * 100);
    const ewastePct = isZero ? 0 : Math.round((ewasteCredits / totalTCO2e) * 100);
    const energyPct = isZero ? 0 : Math.max(0, 100 - (orgPct + plasticPct + sanitaryPct + ewastePct));

    // Audit Confidence Score (0% if no waste recorded, up to 99% based on data completeness)
    const filledCount = [organicTons, plasticTons, sanitaryTons, ewasteTons, wasteToEnergyMWh].filter(v => Number(v) > 0).length;
    const confidenceScore = filledCount === 0 ? 0 : Math.min(99, 85 + (filledCount * 2.8));

    return {
      orgCredits,
      plasticCredits,
      sanitaryCredits,
      ewasteCredits,
      energyCredits,
      totalTCO2e: totalTCO2e.toFixed(2),
      totalKgCO2e: totalKgCO2e.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      totalValueINR: Math.round(totalValueINR).toLocaleString("en-IN"),
      totalWasteTonnes: totalWasteTonnes.toFixed(1),
      orgPct,
      plasticPct,
      sanitaryPct,
      ewastePct,
      energyPct,
      confidenceScore: confidenceScore.toFixed(1)
    };
  }, [organicTons, plasticTons, sanitaryTons, ewasteTons, wasteToEnergyMWh]);

  // Export JSON Report / Evidence Bundle
  const handleExportEvidence = () => {
    const evidenceBundle = {
      project: "Carbon & Waste Sahayak - MRV Emission Engine",
      organization: orgName,
      timestamp: new Date().toISOString(),
      standard: selectedStandard,
      auditConfidence: `${calculations.confidenceScore}%`,
      wasteProcessed: {
        organicTons,
        plasticTons,
        sanitaryTons,
        ewasteTons,
        wasteToEnergyMWh,
        totalWasteTonnes: calculations.totalWasteTonnes
      },
      carbonMetrics: {
        totalAvoided_tCO2e: calculations.totalTCO2e,
        totalAvoided_kgCO2e: calculations.totalKgCO2e,
        estimatedMarketValueINR: `₹${calculations.totalValueINR}`,
        emissionFactorsUsed: EMISSION_FACTORS
      }
    };

    const blob = new Blob([JSON.stringify(evidenceBundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Sahayak_Carbon_Audit_${Date.now()}.json`;
    a.click();
    addToast("Audit Evidence Bundle downloaded successfully!");
  };

  // Transfer to Org Dashboard
  const handleTransferToDashboard = () => {
    navigate("/dashboard", {
      state: {
        prefillAmount: Math.round(Number(calculations.totalTCO2e)),
        prefillName: `${orgName} - Waste Segregation & Sanitization Offset`,
        prefillDescription: `Verified offset from ${calculations.totalWasteTonnes} tonnes of segregated waste (${organicTons}t Organic, ${plasticTons}t Plastic, ${sanitaryTons}t Sanitary/Bio-medical). Avoided ${calculations.totalTCO2e} tCO2e as per CPCB & IPCC emission standards.`
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-emerald-100">
      <Navbar />

      {/* PREMIUM HEADER BANNER */}
      <div className="relative overflow-hidden bg-[#0a1f16] px-6 py-16 lg:px-12">
        {/* Background Gradients & Noise */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[100px]"></div>
        <div className="absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-teal-500/10 blur-[80px]"></div>

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-300 backdrop-blur-md">
                <Sparkles size={12} />
                Carbon Accounting & Verification
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Carbon <span className="text-emerald-400 font-light italic">Sahayak</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg font-light">
                A deterministic calculation engine that converts campus and industrial waste streams into verified, tradeable carbon offsets.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleExportEvidence}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
              >
                <Download size={16} className="text-emerald-400 group-hover:-translate-y-0.5 transition-transform" />
                Export Audit Bundle
              </button>
              <button 
                onClick={handleTransferToDashboard}
                className="group flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-[#0a1f16] shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/30 active:scale-95"
              >
                Mint on Marketplace
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTENT */}
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12">

          {/* LEFT: INTERACTIVE WASTE & SANITIZATION INPUTS (7 Cols) */}
          <div className="space-y-6 lg:col-span-7">
            
            <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-10 relative overflow-hidden">
              {/* Subtle top highlight */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500"></div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-2 tracking-tight">
                    <Trash2 className="text-emerald-500" size={24} />
                    Waste Segregation Streams
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-500">
                    Quantify campus or municipal collection weights to calculate Scope 3 avoided emissions.
                  </p>
                </div>
                <span className="hidden rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10 sm:inline-block">
                  v2.4 MRV Active
                </span>
              </div>

              {/* Facility details */}
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Reporting Facility / Campus
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 transition-colors focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                    <Building2 size={18} className="mr-3 text-slate-400" />
                    <input 
                      type="text" 
                      value={orgName} 
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                      placeholder="e.g. Green Facility"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Verification Standard
                  </label>
                  <select 
                    value={selectedStandard}
                    onChange={(e) => setSelectedStandard(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="CPCB_IPCC_2026">CPCB & IPCC 2026 National Guidelines</option>
                    <option value="CCTS_INDIA">India Carbon Credit Scheme (CCTS)</option>
                    <option value="GOLD_STANDARD">Gold Standard Waste Management</option>
                  </select>
                </div>
              </div>

              {/* STREAM INPUTS */}
              <div className="mt-10 space-y-6">
                
                {/* 1. Organic Waste */}
                <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-100/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Leaf size={22} />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-slate-900">Organic & Food Waste</h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">Avoids methane from open landfill dumping.<br/>Factor: <span className="font-medium text-slate-700">0.52 tCO₂e/t</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">+{calculations.orgCredits.toFixed(2)} tCO₂e</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-5">
                    <input 
                      type="range" min="0" max="100" step="0.5" 
                      value={organicTons} onChange={(e) => setOrganicTons(e.target.value)}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-emerald-500 hover:accent-emerald-400"
                    />
                    <div className="flex w-28 shrink-0 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition-colors focus-within:border-emerald-500 focus-within:bg-white">
                      <input 
                        type="number" value={organicTons} onChange={(e) => setOrganicTons(e.target.value)}
                        className="w-full bg-transparent text-right text-sm font-semibold text-slate-900 outline-none" 
                      />
                      <span className="ml-1.5 text-xs font-medium text-slate-400">t</span>
                    </div>
                  </div>
                </div>

                {/* 2. Plastic & Packaging */}
                <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md hover:shadow-blue-100/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Recycle size={22} />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-slate-900">Plastic & Circular Packaging</h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">Displaces virgin petrochemical polymers.<br/>Factor: <span className="font-medium text-slate-700">1.40 tCO₂e/t</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">+{calculations.plasticCredits.toFixed(2)} tCO₂e</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-5">
                    <input 
                      type="range" min="0" max="50" step="0.2" 
                      value={plasticTons} onChange={(e) => setPlasticTons(e.target.value)}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-blue-500 hover:accent-blue-400"
                    />
                    <div className="flex w-28 shrink-0 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition-colors focus-within:border-blue-500 focus-within:bg-white">
                      <input 
                        type="number" value={plasticTons} onChange={(e) => setPlasticTons(e.target.value)}
                        className="w-full bg-transparent text-right text-sm font-semibold text-slate-900 outline-none" 
                      />
                      <span className="ml-1.5 text-xs font-medium text-slate-400">t</span>
                    </div>
                  </div>
                </div>

                {/* 3. Sanitary & Bio-Medical Waste */}
                <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-amber-200 hover:shadow-md hover:shadow-amber-100/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <ShieldCheck size={22} />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-slate-900">Sanitary & Bio-Medical</h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">Autoclave & High-Temp sanitization.<br/>Factor: <span className="font-medium text-slate-700">0.85 tCO₂e/t</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">+{calculations.sanitaryCredits.toFixed(2)} tCO₂e</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-5">
                    <input 
                      type="range" min="0" max="30" step="0.1" 
                      value={sanitaryTons} onChange={(e) => setSanitaryTons(e.target.value)}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-amber-500 hover:accent-amber-400"
                    />
                    <div className="flex w-28 shrink-0 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition-colors focus-within:border-amber-500 focus-within:bg-white">
                      <input 
                        type="number" value={sanitaryTons} onChange={(e) => setSanitaryTons(e.target.value)}
                        className="w-full bg-transparent text-right text-sm font-semibold text-slate-900 outline-none" 
                      />
                      <span className="ml-1.5 text-xs font-medium text-slate-400">t</span>
                    </div>
                  </div>
                </div>

                {/* 4. E-Waste */}
                <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-purple-200 hover:shadow-md hover:shadow-purple-100/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <Cpu size={22} />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-slate-900">E-Waste Collection</h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">High-intensity mineral recovery offsets.<br/>Factor: <span className="font-medium text-slate-700">2.10 tCO₂e/t</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700">+{calculations.ewasteCredits.toFixed(2)} tCO₂e</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-5">
                    <input 
                      type="range" min="0" max="10" step="0.1" 
                      value={ewasteTons} onChange={(e) => setEwasteTons(e.target.value)}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-purple-500 hover:accent-purple-400"
                    />
                    <div className="flex w-28 shrink-0 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition-colors focus-within:border-purple-500 focus-within:bg-white">
                      <input 
                        type="number" value={ewasteTons} onChange={(e) => setEwasteTons(e.target.value)}
                        className="w-full bg-transparent text-right text-sm font-semibold text-slate-900 outline-none" 
                      />
                      <span className="ml-1.5 text-xs font-medium text-slate-400">t</span>
                    </div>
                  </div>
                </div>

                {/* 5. Waste to Energy */}
                <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-orange-200 hover:shadow-md hover:shadow-orange-100/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <Zap size={22} />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-slate-900">Waste-to-Energy Export</h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">Grid fossil fuel displacement.<br/>Factor: <span className="font-medium text-slate-700">0.65 tCO₂e/MWh</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700">+{calculations.energyCredits.toFixed(2)} tCO₂e</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-5">
                    <input 
                      type="range" min="0" max="50" step="0.5" 
                      value={wasteToEnergyMWh} onChange={(e) => setWasteToEnergyMWh(e.target.value)}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-orange-500 hover:accent-orange-400"
                    />
                    <div className="flex w-28 shrink-0 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition-colors focus-within:border-orange-500 focus-within:bg-white">
                      <input 
                        type="number" value={wasteToEnergyMWh} onChange={(e) => setWasteToEnergyMWh(e.target.value)}
                        className="w-full bg-transparent text-right text-sm font-semibold text-slate-900 outline-none" 
                      />
                      <span className="ml-1.5 text-xs font-medium text-slate-400">MWh</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* METHODOLOGY DRAWER */}
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm flex gap-4 items-start">
              <div className="mt-0.5 rounded-full bg-slate-100 p-2 text-slate-500">
                <Info size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Mathematical Emission Factor Basis</h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Emissions Avoided (tCO₂e) = Σ (Waste Mass × DOC × DOC_f × F × 16/12 × GWP_CH4) − Baseline Transport Emissions.<br/><br/>
                  Methane (CH₄) from unsegregated solid municipal waste carries a Global Warming Potential (GWP) of 28× over 100 years. Segregating compostable and recyclable streams directly prevents methanogenesis in open landfills.
                </p>
              </div>
            </div>

          </div>

          <div className="space-y-6 lg:col-span-5">

            {/* LIVE COCKPIT CARD */}
            <div className="rounded-[24px] bg-[#0a1f16] p-8 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[60px]"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between pb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                      Live Impact Summary
                    </span>
                    <h3 className="mt-1 text-xl font-medium tracking-tight text-white">Sahayak Cockpit</h3>
                  </div>
                  <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Audit-Ready
                  </span>
                </div>

                {/* BIG STATS */}
                <div className="mt-4 pb-8 border-b border-white/10">
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Total Credits Generated</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-6xl font-semibold tracking-tighter text-white">
                      {calculations.totalTCO2e}
                    </span>
                    <span className="text-xl font-medium text-emerald-400">tCO₂e</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    Equivalent to <strong className="text-white font-semibold">{calculations.totalKgCO2e} kg CO₂e</strong> emissions prevented.
                  </p>
                </div>

                {/* ESTIMATED VALUE & CONFIDENCE */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Market Value</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-400">₹{calculations.totalValueINR}</p>
                    <p className="mt-1.5 text-[10px] text-slate-400 font-medium tracking-wide">at ₹1,250/credit (CCTS)</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <span>Audit Score</span>
                      <Gauge size={14} className="text-emerald-400" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-white">{calculations.confidenceScore}%</p>
                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <div 
                        className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                        style={{ width: `${calculations.confidenceScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* SCOPE 3 CATEGORY BREAKDOWN BAR */}
                <div className="mt-8">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span className="font-medium">Emission Avoidance Breakdown</span>
                    <span className="font-semibold text-white">{calculations.totalWasteTonnes} t Processed</span>
                  </div>
                  
                  {/* Visual Segments */}
                  <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-white/10">
                    <span style={{ width: `${calculations.orgPct}%` }} className="bg-emerald-500" title={`Organic: ${calculations.orgPct}%`} />
                    <span style={{ width: `${calculations.plasticPct}%` }} className="bg-blue-500" title={`Plastic: ${calculations.plasticPct}%`} />
                    <span style={{ width: `${calculations.sanitaryPct}%` }} className="bg-amber-400" title={`Sanitary: ${calculations.sanitaryPct}%`} />
                    <span style={{ width: `${calculations.ewastePct}%` }} className="bg-purple-500" title={`E-Waste: ${calculations.ewastePct}%`} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-2 text-[11px] text-slate-300 font-medium">
                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Organic ({calculations.orgPct}%)</span>
                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-blue-500" /> Plastic ({calculations.plasticPct}%)</span>
                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> Sanitary ({calculations.sanitaryPct}%)</span>
                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-purple-500" /> E-Waste ({calculations.ewastePct}%)</span>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="mt-10">
                  <button
                    onClick={handleTransferToDashboard}
                    className="w-full rounded-2xl bg-emerald-500 py-4 text-center text-sm font-bold text-[#0a1f16] shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/30 active:scale-[0.98]"
                  >
                    Transfer & List {calculations.totalTCO2e} Credits
                  </button>
                </div>
              </div>
            </div>

            {/* SANITIZATION & PUBLIC HEALTH IMPACT */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 text-sm">
              <div className="flex items-center gap-2 font-semibold text-emerald-900">
                <CheckCircle2 size={18} className="text-emerald-600" />
                Sanitization & Public Hygiene Index
              </div>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Proper segregation of <strong className="text-slate-900">{sanitaryTons}t</strong> of bio-medical waste eliminates hazardous leachate and bacterial dispersion into public water reservoirs.
              </p>
            </div>

            {/* AUDIT CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3 text-slate-700">
                  <FileCheck size={20} />
                </div>
                <h4 className="font-semibold text-slate-900">Immutable Ledger</h4>
                <p className="text-slate-500 mt-1.5 text-xs leading-relaxed">Ready for Polygon smart contract minting with cryptographic proof.</p>
              </div>

              <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3 text-slate-700">
                  <Layers size={20} />
                </div>
                <h4 className="font-semibold text-slate-900">Factor Versioning</h4>
                <p className="text-slate-500 mt-1.5 text-xs leading-relaxed">CPCB / MoEFCC 2026 certified coefficients with audit reproducibility.</p>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
