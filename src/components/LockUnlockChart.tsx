import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  LockUnlockChartDataPoint,
  WeekOption,
  ChartType,
  TimeDimension,
} from "../interface/types";

interface LockUnlockChartProps {
  data: LockUnlockChartDataPoint[];
  dimension: TimeDimension;
  selectedWeeks: WeekOption[];
  chartType: ChartType;
  onWeekSelectionChange: (weeks: WeekOption[]) => void;
  onChartTypeChange: (type: ChartType) => void;
}

const LockUnlockChart: React.FC<LockUnlockChartProps> = ({
  data,
  dimension,
  selectedWeeks,
  chartType,
  onWeekSelectionChange,
  onChartTypeChange,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartDisplayType, setChartDisplayType] = useState<"line" | "bar">(
    "bar"
  );

  const getDimensionLabel = (dim: string) => {
    switch (dim) {
      case "d":
        return "Daily";
      case "w":
        return "Weekly";
      case "m":
        return "Monthly";
      default:
        return "Daily";
    }
  };

  const weekOptions: WeekOption[] = [0, 5, 10, 20];
  const chartTypes: ChartType[] = ["lock", "unlock"];

  const handleWeekToggle = (week: WeekOption) => {
    if (selectedWeeks.includes(week)) {
      onWeekSelectionChange(selectedWeeks.filter((w) => w !== week));
    } else {
      onWeekSelectionChange([...selectedWeeks, week]);
    }
  };

  const getChartOption = (isFullscreenMode: boolean = false) => {
    const times = data.map((item) => item.time);

    // Prepare series data for selected weeks
    const series = selectedWeeks.map((week) => ({
      name: `${week} Week`,
      type: chartDisplayType,
      data: data.map(
        (item) =>
          item[`${week}week` as keyof LockUnlockChartDataPoint] as number
      ),
      smooth: chartDisplayType === "line",
      lineStyle: chartDisplayType === "line" ? { width: 2 } : undefined,
      symbol: chartDisplayType === "line" ? "circle" : undefined,
      symbolSize: chartDisplayType === "line" ? 6 : undefined,
    }));

    // Dynamic color array based on selected weeks (no Total series)
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"]; // 4 weeks max

    return {
      backgroundColor: "transparent",
      title: {
        text: `${
          chartType.charAt(0).toUpperCase() + chartType.slice(1)
        } Data (${getDimensionLabel(dimension)})`,
        left: "center",
        top: 10,
        textStyle: {
          fontSize: isFullscreenMode ? 24 : 18,
          fontWeight: "bold",
          color: "#FFFFFF",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          shadowStyle: {
            color: "rgba(0,0,0,0.1)",
          },
        },
        backgroundColor: "rgba(22, 22, 27, 0.95)",
        borderColor: "#00F7A5",
        borderWidth: 1,
        textStyle: {
          color: "#FFFFFF",
        },
        formatter: function (params: any) {
          let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
          params.forEach((param: any) => {
            const value = param.value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            result += `<div style="margin: 4px 0;">
              <span style="display: inline-block; width: 12px; height: 12px; background: ${param.color}; margin-right: 8px; border-radius: 2px;"></span>
              <span style="font-weight: 500;">${param.seriesName}:</span> 
              <span style="float: right; font-weight: bold;">${value}</span>
            </div>`;
          });
          return result;
        },
      },
      grid: {
        left: isFullscreenMode ? "5%" : "3%",
        right: isFullscreenMode ? "5%" : "3%",
        bottom: isFullscreenMode ? "15%" : "10%",
        top: isFullscreenMode ? "20%" : "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: times,
        axisLine: {
          lineStyle: {
            color: "#444",
          },
        },
        axisLabel: {
          color: "#FFFFFF",
          fontSize: isFullscreenMode ? 14 : 12,
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#444",
          },
        },
        axisLabel: {
          color: "#FFFFFF",
          fontSize: isFullscreenMode ? 14 : 12,
          formatter: function (value: number) {
            return value.toLocaleString("en-US");
          },
        },
        splitLine: {
          lineStyle: {
            color: "#333",
          },
        },
      },
      series: series,
      color: colors,
    };
  };

  return (
    <div className="w-full flex flex-col h-full">
      {!isFullscreen && (
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-dark-card rounded-lg">
          {/* Chart Type Selector */}
          <select
            value={chartType}
            onChange={(e) => onChartTypeChange(e.target.value as ChartType)}
            className="px-4 py-2 bg-dark-card text-white rounded-lg border border-gray-700 focus:border-accent-green focus:outline-none"
          >
            {chartTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          {/* Week Selection */}
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              {weekOptions.map((week) => (
                <button
                  key={week}
                  onClick={() => handleWeekToggle(week)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedWeeks.includes(week)
                      ? "bg-accent-green text-dark-bg shadow-md"
                      : "bg-dark-card text-white border border-gray-700 hover:border-accent-green"
                  }`}
                >
                  {week} Week
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1" />

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-4 py-2 bg-accent-green text-dark-bg rounded-lg hover:bg-green-400 transition-all duration-200 font-medium shadow-md flex items-center gap-2"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Fullscreen
          </button>
        </div>
      )}

      {/* Chart or No Data Message */}
      <div
        className={isFullscreen ? "w-full h-full" : "flex-1 min-h-0"}
        style={
          isFullscreen
            ? {
                width: "100vw",
                height: "100vh",
                position: "fixed" as const,
                top: 0,
                left: 0,
                zIndex: 9999,
                backgroundColor: "#000000",
              }
            : undefined
        }
      >
        {data && data.length > 0 ? (
          <ReactECharts
            key={`${chartType}-${chartDisplayType}-${selectedWeeks.join("-")}`}
            option={getChartOption(isFullscreen)}
            style={{ width: "100%", height: "100%" }}
            opts={{ renderer: "canvas" }}
            notMerge={true}
          />
        ) : (
          <div className="text-center py-8 text-gray-400">
            No {chartType} data available
          </div>
        )}
      </div>

      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 z-[10000] px-4 py-2 bg-accent-green text-dark-bg rounded-lg hover:bg-green-400 transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Exit Fullscreen
        </button>
      )}
    </div>
  );
};

export default LockUnlockChart;
