import { useState } from "react";

export const FILTER_OPTIONS = {
  Country: [
    "India",
    "Brazil",
    "Paraguay",
    "Kenya",
    "United States",
    "Indonesia",
    "Italy",
    "Ghana"
  ],
  Category: [
    "Forestry & Conservation",
    "Renewable Energy",
    "Waste Segregation & Sanitization",
    "Agriculture & Soil Sequestration",
    "Blue Carbon & Marine Restoration",
    "Biochar & Carbon Removal",
    "Energy Efficiency"
  ],
  Vintage: ["2026", "2025", "2024", "2023", "2022", "2021", "2020"],
  Registry: [
    "CPCB / CCTS India",
    "Verra VCS",
    "Gold Standard",
    "UNFCCC Clean Dev",
    "Puro.earth",
    "ICR (International Carbon Registry)"
  ],
  "UN SDG": [
    "SDG 13 (Climate Action)",
    "SDG 12 (Responsible Consumption)",
    "SDG 15 (Life on Land)",
    "SDG 14 (Life Below Water)",
    "SDG 7 (Affordable & Clean Energy)",
    "SDG 6 (Clean Water & Sanitation)",
    "SDG 11 (Sustainable Cities)"
  ]
};

export default function MarketplaceSidebar({
  selectedFilters,
  onToggleFilter,
  directOnly,
  onToggleDirectOnly,
  onClearFilters,
  filteredCount,
  totalCount,
  onContactClick
}) {
  const [openAccordions, setOpenAccordions] = useState({});
  const [showDirectTooltip, setShowDirectTooltip] = useState(false);

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filterKeys = ["Country", "Category", "Vintage", "Registry", "UN SDG"];

  return (
    <div className="w-full bg-white p-6 font-poppins select-none">
      {/* 5 FILTER ACCORDIONS */}
      <div className="flex flex-col">
        {filterKeys.map((group) => {
          const count = selectedFilters[group]?.length || 0;
          const isOpen = !!openAccordions[group];
          const options = FILTER_OPTIONS[group] || [];

          return (
            <div key={group} className="border-b border-[#eeeff5]">
              {/* ACCORDION HEADER */}
              <button
                type="button"
                onClick={() => toggleAccordion(group)}
                className="w-full py-4 flex items-center justify-between text-left cursor-pointer transition hover:opacity-85 focus:outline-none"
              >
                {/* Left: Category Title */}
                <span className="font-poppins font-bold text-[18px] text-[#3b3b3d]">
                  {group}
                </span>

                {/* Right: Selected Count & Chevron */}
                <div className="flex items-center gap-2">
                  <span className="font-poppins font-normal text-[15px] text-[#3b3b3d]">
                    {count} Selected
                  </span>
                  <svg
                    className={`w-4 h-4 text-[#3b3b3d] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* ACCORDION EXPANDED CONTENT */}
              {isOpen && (
                <div className="pb-4 pt-1 px-1 space-y-2.5 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                  {options.map((option) => {
                    const isChecked = selectedFilters[group]?.includes(option);
                    return (
                      <label
                        key={option}
                        className="flex items-center gap-3 cursor-pointer group py-0.5 text-left"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter(group, option)}
                          className="w-4 h-4 rounded-[3px] border-[#8b8fae] text-[#202020] accent-[#202020] cursor-pointer focus:ring-0"
                        />
                        <span
                          className={`text-[14px] font-poppins transition-colors ${
                            isChecked
                              ? "font-semibold text-[#000000]"
                              : "text-[#3b3b3d] group-hover:text-black"
                          }`}
                        >
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DIRECT LISTINGS TOGGLE */}
      <div className="mt-5 mb-5 flex items-center justify-between relative">
        <div className="flex items-center gap-3.5">
          {/* Switch pill */}
          <button
            type="button"
            role="switch"
            aria-checked={directOnly}
            onClick={onToggleDirectOnly}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-[3px] transition-colors duration-200 ease-in-out focus:outline-none ${
              directOnly ? "bg-[#3b3b3d]" : "bg-[#8b8fae]"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                directOnly ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>

          {/* Toggle label */}
          <span 
            onClick={onToggleDirectOnly}
            className="font-poppins font-medium text-[16px] text-black cursor-pointer select-none"
          >
            Carbonmark Direct listings
          </span>
        </div>

        {/* Info Icon with Tooltip */}
        <div className="relative flex items-center">
          <button
            type="button"
            onMouseEnter={() => setShowDirectTooltip(true)}
            onMouseLeave={() => setShowDirectTooltip(false)}
            onClick={() => setShowDirectTooltip((v) => !v)}
            className="text-[#626266] hover:text-black focus:outline-none cursor-pointer p-0.5"
            aria-label="Direct listings info"
          >
            <svg
              className="w-[18px] h-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>

          {showDirectTooltip && (
            <div className="absolute right-0 bottom-full mb-2 w-60 rounded-md bg-[#202020] text-white p-2.5 text-[12px] leading-snug font-dmsans shadow-lg z-50">
              Projects directly issued and verified on the platform by project developers or registered partners.
            </div>
          )}
        </div>
      </div>

      {/* CLEAR FILTERS BUTTON */}
      <button
        type="button"
        onClick={onClearFilters}
        className="w-full h-[48px] border border-[#626266] bg-white rounded-[4px] text-[#3b3b3d] font-poppins font-bold text-[14px] uppercase tracking-[0.06em] flex items-center justify-center transition-all hover:bg-[#f5f5f7] active:scale-[0.99] cursor-pointer shadow-none"
      >
        CLEAR FILTERS
      </button>

      {/* RESULTS COUNTER */}
      <div className="mt-5 mb-5 text-center font-poppins font-bold text-[18px] text-[#3b3b3d]">
        {filteredCount} of {totalCount} Results
      </div>

      {/* DIVIDER LINE */}
      <div className="w-full border-t border-[#9ea1bb]/70 my-5" />

      {/* SUPPORT COPY */}
      <p className="font-dmsans text-[15px] text-[#626266] leading-[1.45] text-left mb-4">
        Need help selecting a project? Our team is here to support.
      </p>

      {/* CONTACT US BUTTON */}
      <button
        type="button"
        onClick={onContactClick}
        className="w-full h-[48px] bg-[#067525] rounded-[4px] text-white font-poppins font-bold text-[14px] uppercase tracking-[0.06em] flex items-center justify-center transition-all hover:bg-[#000000] active:scale-[0.99] cursor-pointer shadow-none"
      >
        CONTACT US
      </button>

    </div>
  );
}
