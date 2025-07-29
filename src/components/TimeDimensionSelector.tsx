import React from "react";
import { TimeDimension } from "../interface/types";

const TimeDimensionSelector: React.FC<{
  dimension: TimeDimension;
  onChange: (d: TimeDimension) => void;
}> = ({ dimension, onChange }) => (
  <div className="flex gap-2">
    {(["d", "w", "m"] as TimeDimension[]).map((d) => (
      <button
        key={d}
        onClick={() => onChange(d)}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
          dimension === d
            ? "bg-accent-green text-dark-bg shadow-lg"
            : "bg-dark-card text-gray-300 hover:bg-gray-800 border border-gray-700"
        }`}
      >
        {d === "d" ? "Daily" : d === "w" ? "Weekly" : "Monthly"}
      </button>
    ))}
  </div>
);

export default TimeDimensionSelector;
