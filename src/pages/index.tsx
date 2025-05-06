import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const NormalLiquidationComponent = dynamic(
  () => import("../components/main/NormalLiquidation"),
  {
    ssr: false,
  }
);

const MarginLiquidationComponent = dynamic(
  () => import("../components/main/MarginLiquidation"),
  {
    ssr: false,
  }
);

const NormalHistoryComponent = dynamic(
  () => import("../components/main/NormalHistory"),
  {
    ssr: false,
  }
);

const MarginHistoryComponent = dynamic(
  () => import("../components/main/MarginHistory"),
  {
    ssr: false,
  }
);

export default function LiquidationIndex() {
  const [activeTab, setActiveTab] = useState("normal");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedTab = localStorage.getItem("mainActiveTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
    setIsLoading(false);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("mainActiveTab", tab);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="w-[200px]"></div>
        <div className="flex justify-center flex-1 w-full">
          <div className="inline-flex bg-dark-200 p-1 rounded-2xl w-[80%]">
            <button
              className={`px-6 py-3 rounded-xl transition-all duration-300 ease-in-out flex-1 ${
                activeTab === "normal"
                  ? "bg-green-50 text-black shadow-md"
                  : "text-purple-50 hover:text-purple-60"
              }`}
              onClick={() => handleTabChange("normal")}
            >
              Normal Position
            </button>
            <button
              className={`px-6 py-3 rounded-xl transition-all duration-300 ease-in-out flex-1 ${
                activeTab === "margin"
                  ? "bg-green-50 text-black shadow-md"
                  : "text-purple-50 hover:text-purple-60"
              }`}
              onClick={() => handleTabChange("margin")}
            >
              Margin Position
            </button>
            <button
              className={`px-6 py-3 rounded-xl transition-all duration-300 ease-in-out flex-1 ${
                activeTab === "normalHistory"
                  ? "bg-green-50 text-black shadow-md"
                  : "text-purple-50 hover:text-purple-60"
              }`}
              onClick={() => handleTabChange("normalHistory")}
            >
              Normal History
            </button>
            <button
              className={`px-6 py-3 rounded-xl transition-all duration-300 ease-in-out flex-1 ${
                activeTab === "marginHistory"
                  ? "bg-green-50 text-black shadow-md"
                  : "text-purple-50 hover:text-purple-60"
              }`}
              onClick={() => handleTabChange("marginHistory")}
            >
              Margin History
            </button>
          </div>
        </div>
        <div className="w-[200px] flex justify-end">
          <Link
            href="/meme"
            className="text-white transition-all duration-300 ease-in-out flex items-center space-x-2"
          >
            <span>Go to Meme</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
      {activeTab === "normal" && <NormalLiquidationComponent key="normal" />}
      {activeTab === "margin" && <MarginLiquidationComponent key="margin" />}
      {activeTab === "normalHistory" && (
        <NormalHistoryComponent key="normalHistory" />
      )}
      {activeTab === "marginHistory" && (
        <MarginHistoryComponent key="marginHistory" />
      )}
    </div>
  );
}
