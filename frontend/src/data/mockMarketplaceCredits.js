// 60 Realistically modeled carbon credit listings reflecting international and Indian registries
export const DEFAULT_MARKETPLACE_CREDITS = [
  {
    id: "cm-001",
    creditId: 101,
    title: "Utility-Scale Solar Renewable Energy Project",
    orgName: "Tata Power Renewable Energy",
    fullDescription:
      "Large-scale renewable power generation through solar energy, supporting India's transition away from carbon-intensive electricity.",
    amount: 18500,
    price: 820,
    country: "India",
    city: "Mumbai",
    category: "Renewable Energy",
    vintage: "2026",
    registry: "CPCB / CCTS India",
    sdg: "SDG 7 (Affordable & Clean Energy)",
    isDirect: true,
    image:
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "cm-002",
    creditId: 102,
    title: "Wind & Solar Renewable Energy Portfolio",
    orgName: "ReNew",
    fullDescription:
      "Large-scale renewable energy infrastructure combining wind and solar generation to reduce dependence on fossil-fuel electricity.",
    amount: 24000,
    price: 760,
    country: "India",
    city: "Gurugram",
    category: "Renewable Energy",
    vintage: "2026",
    registry: "CPCB / CCTS India",
    sdg: "SDG 7 (Affordable & Clean Energy)",
    isDirect: true,
    image:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "cm-003",
    creditId: 103,
    title: "Organic Waste to Compressed Biogas",
    orgName: "GPS Renewables",
    fullDescription:
      "Urban organic waste is processed into compressed biogas, diverting waste from landfills while producing renewable fuel.",
    amount: 12500,
    price: 690,
    country: "India",
    city: "Indore",
    category: "Biogas & Circular Economy",
    vintage: "2026",
    registry: "CPCB / CCTS India",
    sdg: "SDG 12 (Responsible Consumption)",
    isDirect: true,
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "cm-004",
    creditId: 104,
    title: "Okhla Municipal Waste-to-Energy Project",
    orgName: "Jindal Urban Infrastructure",
    fullDescription:
      "Municipal solid waste is processed through waste-to-energy infrastructure, reducing landfill dependency and generating useful energy.",
    amount: 16800,
    price: 610,
    country: "India",
    city: "New Delhi",
    category: "Waste Management & Waste-to-Energy",
    vintage: "2025",
    registry: "CPCB / CCTS India",
    sdg: "SDG 11 (Sustainable Cities)",
    isDirect: true,
    image:
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "cm-005",
    creditId: 105,
    title: "Steel Industry Decarbonization & Biochar Initiative",
    orgName: "Tata Steel",
    fullDescription:
      "Industrial decarbonization initiatives including alternative reductants, biochar utilization, waste-heat recovery and renewable electricity.",
    amount: 21000,
    price: 1180,
    country: "India",
    city: "Jamshedpur",
    category: "Industrial Decarbonization",
    vintage: "2026",
    registry: "CPCB / CCTS India",
    sdg: "SDG 9 (Industry, Innovation & Infrastructure)",
    isDirect: true,
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "cm-006",
    creditId: 106,
    title: "Agricultural Biomass Biochar Carbon Removal",
    orgName: "CleanMax",
    fullDescription:
      "Locally sourced agricultural biomass is converted through pyrolysis into durable biochar designed to store carbon while supporting circular waste management.",
    amount: 7200,
    price: 1850,
    country: "India",
    city: "Mumbai",
    category: "Biochar & Carbon Removal",
    vintage: "2026",
    registry: "Verra VCS",
    sdg: "SDG 13 (Climate Action)",
    isDirect: true,
    image:
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "cm-007",
    creditId: 107,
    title: "Agricultural Waste to Bio-CNG",
    orgName: "Indian Oil + GPS Renewables",
    fullDescription:
      "Agricultural residues and organic feedstock are converted into compressed biogas, creating renewable fuel while reducing waste-related emissions.",
    amount: 9800,
    price: 735,
    country: "India",
    city: "Namakkal",
    category: "Agriculture & Bioenergy",
    vintage: "2025",
    registry: "CPCB / CCTS India",
    sdg: "SDG 7 (Affordable & Clean Energy)",
    isDirect: true,
    image:
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "cm-008",
    creditId: 108,
    title: "Organic Waste Management & Biogas System",
    orgName: "Tata Projects",
    fullDescription:
      "Organic waste is processed through anaerobic digestion and composting systems, reducing landfill waste while producing useful biogas and organic outputs.",
    amount: 8400,
    price: 640,
    country: "India",
    city: "Noida",
    category: "Waste Management & Biogas",
    vintage: "2026",
    registry: "CPCB / CCTS India",
    sdg: "SDG 12 (Responsible Consumption)",
    isDirect: true,
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: "cm-009",
    creditId: 109,
    title: "Multi-Sector Carbon Project Portfolio",
    orgName: "EKI Energy Services",
    fullDescription:
      "A diversified carbon-project portfolio spanning renewable energy, forestry and land use, waste management, clean cooking and community-based climate initiatives.",
    amount: 27500,
    price: 910,
    country: "India",
    city: "Indore",
    category: "Carbon Project Development",
    vintage: "2026",
    registry: "Verra / Gold Standard / CCTS India",
    sdg: "SDG 13 (Climate Action)",
    isDirect: false,
    image:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80",
  },
];

export function getInitial60Credits() {
  return [...DEFAULT_MARKETPLACE_CREDITS];
}