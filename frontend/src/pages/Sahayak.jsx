import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  Leaf, 
  Trash2, 
  Recycle, 
  ShieldCheck, 
  Sparkles, 
  Gauge, 
  TrendingUp, 
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
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <Navbar />

      {/* HEADER BANNER */}
      <div className="border-b border-slate-200 bg-white px-6 py-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          
          

          <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-700">
                Carbon Accounting & Verification
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Carbon & Waste <span className="text-green-700">Sahayak</span> (सहायक)
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Deterministic calculation platform that converts municipal, campus, and industrial 
                <strong className="text-slate-800"> waste segregation</strong> and <strong className="text-slate-800">sanitary disposal</strong> into tradeable, verified carbon credits.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleExportEvidence}
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
              >
                <Download size={16} className="text-green-700" />
                Export Audit Bundle
              </button>
              <button 
                onClick={handleTransferToDashboard}
                className="flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-green-800 active:scale-95"
              >
                Mint on Marketplace
                <ArrowRight size={16} />
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
            
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Trash2 className="text-green-700" size={22} />
                    Waste Segregation & Sanitization Stream
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter measured weights from campus or municipal collection to calculate Scope 3 avoided emissions.
                  </p>
                </div>
                <span className="hidden rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-800 sm:inline-block">
                  v2.4 MRV Active
                </span>
              </div>

              {/* Facility details */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Reporting Facility / Campus
                  </label>
                  <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <Building2 size={16} className="mr-2 text-slate-400" />
                    <input 
                      type="text" 
                      value={orgName} 
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Verification Standard
                  </label>
                  <select 
                    value={selectedStandard}
                    onChange={(e) => setSelectedStandard(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none"
                  >
                    <option value="CPCB_IPCC_2026">CPCB & IPCC 2026 National Guidelines</option>
                    <option value="CCTS_INDIA">India Carbon Credit Scheme (CCTS)</option>
                    <option value="GOLD_STANDARD">Gold Standard Waste Management</option>
                  </select>
                </div>
              </div>

              {/* STREAM INPUTS */}
              <div className="mt-8 space-y-5">
                
                {/* 1. Organic Waste */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-green-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                        <Leaf size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Organic & Food Waste (Composting / Biogas)</h3>
                        <p className="text-xs text-slate-500">Avoids methane from open landfill dumping (Factor: 0.52 tCO₂e/t)</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-green-700">+{calculations.orgCredits.toFixed(2)} tCO₂e</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="0.5" 
                      value={organicTons} 
                      onChange={(e) => setOrganicTons(e.target.value)}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-green-700"
                    />
                    <div className="flex w-28 items-center rounded-lg border border-slate-300 bg-white px-2.5 py-1.5">
                      <input 
                        type="number" 
                        value={organicTons} 
                        onChange={(e) => setOrganicTons(e.target.value)}
                        className="w-full bg-transparent text-right text-sm font-bold text-slate-900 outline-none" 
                      />
                      <span className="ml-1 text-xs text-slate-500 font-medium">t</span>
                    </div>
                  </div>
                </div>

                {/* 2. Plastic & Packaging */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-blue-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        <Recycle size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Plastic & Circular Packaging Recycled</h3>
                        <p className="text-xs text-slate-500">Displaces virgin petrochemical polymers (Factor: 1.40 tCO₂e/t)</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-700">+{calculations.plasticCredits.toFixed(2)} tCO₂e</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      step="0.2" 
                      value={plasticTons} 
                      onChange={(e) => setPlasticTons(e.target.value)}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
                    />
                    <div className="flex w-28 items-center rounded-lg border border-slate-300 bg-white px-2.5 py-1.5">
                      <input 
                        type="number" 
                        value={plasticTons} 
                        onChange={(e) => setPlasticTons(e.target.value)}
                        className="w-full bg-transparent text-right text-sm font-bold text-slate-900 outline-none" 
                      />
                      <span className="ml-1 text-xs text-slate-500 font-medium">t</span>
                    </div>
                  </div>
                </div>

                {/* 3. Sanitary & Bio-Medical Waste */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-amber-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Sanitary & Bio-Medical Waste Disinfection</h3>
                        <p className="text-xs text-slate-500">Autoclave & High-Temp sanitization disposal (Factor: 0.85 tCO₂e/t)</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-700">+{calculations.sanitaryCredits.toFixed(2)} tCO₂e</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="30" 
                      step="0.1" 
                      value={sanitaryTons} 
                      onChange={(e) => setSanitaryTons(e.target.value)}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-amber-600"
                    />
                    <div className="flex w-28 items-center rounded-lg border border-slate-300 bg-white px-2.5 py-1.5">
                      <input 
                        type="number" 
                        value={sanitaryTons} 
                        onChange={(e) => setSanitaryTons(e.target.value)}
                        className="w-full bg-transparent text-right text-sm font-bold text-slate-900 outline-none" 
                      />
                      <span className="ml-1 text-xs text-slate-500 font-medium">t</span>
                    </div>
                  </div>
                </div>

                {/* 4. E-Waste */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-purple-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                        <Cpu size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">E-Waste Collection & Urban Mining</h3>
                        <p className="text-xs text-slate-500">High-intensity mineral recovery offsets (Factor: 2.10 tCO₂e/t)</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-700">+{calculations.ewasteCredits.toFixed(2)} tCO₂e</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      step="0.1" 
                      value={ewasteTons} 
                      onChange={(e) => setEwasteTons(e.target.value)}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-purple-600"
                    />
                    <div className="flex w-28 items-center rounded-lg border border-slate-300 bg-white px-2.5 py-1.5">
                      <input 
                        type="number" 
                        value={ewasteTons} 
                        onChange={(e) => setEwasteTons(e.target.value)}
                        className="w-full bg-transparent text-right text-sm font-bold text-slate-900 outline-none" 
                      />
                      <span className="ml-1 text-xs text-slate-500 font-medium">t</span>
                    </div>
                  </div>
                </div>

                {/* 5. Waste to Energy */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-yellow-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                        <Zap size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Waste-to-Energy / Biogas Grid Export</h3>
                        <p className="text-xs text-slate-500">Grid fossil fuel displacement (Factor: 0.65 tCO₂e/MWh)</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-yellow-700">+{calculations.energyCredits.toFixed(2)} tCO₂e</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      step="0.5" 
                      value={wasteToEnergyMWh} 
                      onChange={(e) => setWasteToEnergyMWh(e.target.value)}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-yellow-600"
                    />
                    <div className="flex w-28 items-center rounded-lg border border-slate-300 bg-white px-2.5 py-1.5">
                      <input 
                        type="number" 
                        value={wasteToEnergyMWh} 
                        onChange={(e) => setWasteToEnergyMWh(e.target.value)}
                        className="w-full bg-transparent text-right text-sm font-bold text-slate-900 outline-none" 
                      />
                      <span className="ml-1 text-xs text-slate-500 font-medium">MWh</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* METHODOLOGY DRAWER */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-500 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Info size={16} className="text-green-700" />
                Mathematical Emission Factor Basis (IPCC Tier 2 & CPCB Framework)
              </div>
              <p className="mt-2 leading-relaxed">
                Emissions Avoided (tCO₂e) = Σ (Waste Mass × DOC × DOC_f × F × 16/12 × GWP_CH4) − Baseline Transport Emissions.
                Methane (CH₄) from unsegregated solid municipal waste carries a Global Warming Potential (GWP) of 28× over 100 years. Segregating compostable and recyclable streams directly prevents methanogenesis in open landfills.
              </p>
            </div>

          </div>

          {/* RIGHT: THE SAHAYAK INTELLIGENCE COCKPIT (5 Cols) */}
          <div className="space-y-6 lg:col-span-5">

            {/* LIVE COCKPIT CARD */}
            <div className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">
                    Live Impact Summary
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">Sahayak Intelligence Cockpit</h3>
                </div>
                <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-800">
                  <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></span>
                  Audit-Ready
                </span>
              </div>

              {/* BIG STATS */}
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Carbon Credits Generated</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                    {calculations.totalTCO2e}
                  </span>
                  <span className="text-lg font-bold text-green-700">tCO₂e</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Equivalent to <strong className="text-slate-800">{calculations.totalKgCO2e} kg CO₂e</strong> greenhouse gas emissions prevented.
                </p>
              </div>

              {/* ESTIMATED VALUE & CONFIDENCE */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Market Value</p>
                  <p className="mt-2 text-2xl font-bold text-green-700">₹{calculations.totalValueINR}</p>
                  <p className="mt-1 text-[10px] text-slate-400 font-medium">at ₹1,250/credit (CCTS)</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <span>Audit Score</span>
                    <Gauge size={14} className="text-green-700" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{calculations.confidenceScore}%</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div 
                      className="h-full rounded-full bg-green-600"
                      style={{ width: `${calculations.confidenceScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* SCOPE 3 CATEGORY BREAKDOWN BAR */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-slate-500">
                  <span className="font-semibold">Emission Avoidance Breakdown</span>
                  <span className="font-bold text-slate-800">{calculations.totalWasteTonnes} Tonnes Waste</span>
                </div>
                
                {/* Visual Segments */}
                <div className="mt-2 flex h-3.5 overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200">
                  <span style={{ width: `${calculations.orgPct}%` }} className="bg-green-600 rounded-l-full" title={`Organic: ${calculations.orgPct}%`} />
                  <span style={{ width: `${calculations.plasticPct}%` }} className="bg-blue-600" title={`Plastic: ${calculations.plasticPct}%`} />
                  <span style={{ width: `${calculations.sanitaryPct}%` }} className="bg-amber-500" title={`Sanitary: ${calculations.sanitaryPct}%`} />
                  <span style={{ width: `${calculations.ewastePct}%` }} className="bg-purple-600 rounded-r-full" title={`E-Waste: ${calculations.ewastePct}%`} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-600" /> Organic ({calculations.orgPct}%)</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-600" /> Plastic ({calculations.plasticPct}%)</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Sanitary ({calculations.sanitaryPct}%)</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-purple-600" /> E-Waste ({calculations.ewastePct}%)</span>
                </div>
              </div>

              {/* SANITIZATION & PUBLIC HEALTH IMPACT */}
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50/70 p-4 text-xs">
                <div className="flex items-center gap-2 font-bold text-green-900">
                  <CheckCircle2 size={16} className="text-green-700" />
                  Sanitization & Public Hygiene Index
                </div>
                <p className="mt-1 text-slate-600 leading-relaxed">
                  Proper segregation of <strong className="text-slate-900">{sanitaryTons}t</strong> of bio-medical waste eliminates hazardous leachate and bacterial dispersion into public water reservoirs.
                </p>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="mt-6">
                <button
                  onClick={handleTransferToDashboard}
                  className="w-full rounded-xl bg-green-700 py-4 text-center font-bold text-white shadow-md transition duration-200 hover:bg-green-800 active:scale-[0.98]"
                >
                  Transfer & List {calculations.totalTCO2e} Credits on EcoSankalp
                </button>
              </div>

            </div>

            {/* AUDIT CARDS */}
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <FileCheck size={18} className="text-green-700 mb-2" />
                <h4 className="font-bold text-slate-900">Immutable Ledger</h4>
                <p className="text-slate-500 mt-1">Ready for Polygon smart contract minting with cryptographic proof of disposal.</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <Layers size={18} className="text-blue-600 mb-2" />
                <h4 className="font-bold text-slate-900">Factor Versioning</h4>
                <p className="text-slate-500 mt-1">CPCB / MoEFCC 2026 certified factor coefficients with audit reproducibility.</p>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
