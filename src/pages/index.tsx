import React, { useState } from "react";
import Holder from "../components/holder";
import Conversion from "../components/conversion";
import Airdrop from "../components/airdrop";

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("holder");

  const tabs = [
    { id: "holder", name: "Holder", component: <Holder /> },
    { id: "conversion", name: "Conversion", component: <Conversion /> },
    { id: "airdrop", name: "Airdrop", component: <Airdrop /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6 w-full">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-8 py-4 font-bold ${
                activeTab === tab.id
                  ? "text-white transform scale-105 border-b border-[#00F7A5]"
                  : "text-gray-400 hover:text-white hover:scale-102"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="transition-colors duration-300">
                  {tab.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content with fade transition */}
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default HomePage;
