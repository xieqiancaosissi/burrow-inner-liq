import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const PendingMemeComponent = dynamic(
  () => import("../components/PendingMeme"),
  {
    ssr: false,
  }
);

const HistoryMemeComponent = dynamic(
  () => import("../components/HistoryMeme"),
  {
    ssr: false,
  }
);

export default function MemePage() {
  const [activeTab, setActiveTab] = useState("index");

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
            <span>Back to Home</span>
          </Link>
        </div>
        <div className="flex justify-center flex-1 w-full">
          <div className="inline-flex bg-dark-200 p-1 rounded-2xl w-[60%]">
            <button
              className={`px-8 py-3 rounded-xl transition-all duration-300 ease-in-out flex-1 ${
                activeTab === "index"
                  ? "bg-green-50 text-black shadow-md"
                  : "text-purple-50 hover:text-purple-60"
              }`}
              onClick={() => setActiveTab("index")}
            >
              Pending Meme Liquidation
            </button>
            <button
              className={`px-8 py-3 rounded-xl transition-all duration-300 ease-in-out flex-1 ${
                activeTab === "history"
                  ? "bg-green-50 text-black shadow-md"
                  : "text-purple-50 hover:text-purple-60"
              }`}
              onClick={() => setActiveTab("history")}
            >
              History Meme Liquidation
            </button>
          </div>
        </div>
        <div className="w-[200px]"></div>
      </div>
      {activeTab === "index" ? (
        <PendingMemeComponent />
      ) : (
        <HistoryMemeComponent />
      )}
    </div>
  );
}
