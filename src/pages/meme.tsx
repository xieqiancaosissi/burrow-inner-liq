import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const NormalMemeLiquidationComponent = dynamic(
  () => import("../components/meme/NormalMemeLiquidation"),
  {
    ssr: false,
  }
);

const MarginMemeLiquidationComponent = dynamic(
  () => import("../components/meme/MarginMemeLiquidation"),
  {
    ssr: false,
  }
);

const NormalMemeHistoryComponent = dynamic(
  () => import("../components/meme/NormalMemeHistory"),
  {
    ssr: false,
  }
);

const MarginMemeHistoryComponent = dynamic(
  () => import("../components/meme/MarginMemeHistory"),
  {
    ssr: false,
  }
);

export default function MemePage() {
  const [activeTab, setActiveTab] = useState("normal");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedTab = localStorage.getItem("memeActiveTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
    setIsLoading(false);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("memeActiveTab", tab);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="w-[200px] flex justify-start">
          <Link
            href="/"
            className="text-white transition-all duration-300 ease-in-out flex items-center space-x-2"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back to Main</span>
          </Link>
        </div>
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
        <div className="w-[200px]"></div>
      </div>
      {activeTab === "normal" && <NormalMemeLiquidationComponent />}
      {activeTab === "margin" && <MarginMemeLiquidationComponent />}
      {activeTab === "normalHistory" && <NormalMemeHistoryComponent />}
      {activeTab === "marginHistory" && <MarginMemeHistoryComponent />}
    </div>
  );
}
