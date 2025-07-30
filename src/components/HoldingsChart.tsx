import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  RankingDataPoint,
  TimeDimension,
  TokenType,
  TopCount,
} from "../interface/types";
import { getRandomSoftColor } from "../utils/colors";
import { formatNumberWithSuffix, formatNumberForTooltip } from "../utils/number";

interface HoldingsChartProps {
  data: RankingDataPoint[];
  dimension: TimeDimension;
  tokenType: TokenType;
  topCount: TopCount;
  onTokenTypeChange: (tokenType: TokenType) => void;
  onTopCountChange: (topCount: TopCount) => void;
}

const HoldingsChart: React.FC<HoldingsChartProps> = ({
  data,
  dimension,
  tokenType,
  topCount,
  onTokenTypeChange,
  onTopCountChange,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartType, setChartType] = useState<"line" | "bar">("bar");

  const getDimensionLabel = (dim: TimeDimension) => {
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

  const getTokenLabel = (token: TokenType) => {
    switch (token) {
      case "ref":
        return "Ref";
      case "brrr":
        return "Brrr";
      case "rhea":
        return "Rhea";
      case "xref":
        return "xRef";
      case "xrhea":
        return "xRhea";
      default:
        return "Ref";
    }
  };

  const getChartOption = (isFullscreenMode: boolean = false) => {
    if (!data || data.length === 0) {
      return {
        backgroundColor: "transparent",
        title: {
          text: `No data available for ${getTokenLabel(tokenType)}`,
          left: "center",
          top: "center",
          textStyle: {
            fontSize: isFullscreenMode ? 24 : 18,
            color: "#A0A0A0",
          },
        },
      };
    }
    const timePoints = data.map((item) => item.time);
    const allUsers = new Set<string>();
    data.forEach((point) => {
      point.userRankings.forEach((user) => {
        allUsers.add(user.account_id);
      });
    });
    const userLines: any[] = [];
    Array.from(allUsers).forEach((userId, index) => {
      const userData = data.map((point) => {
        const user = point.userRankings.find((u) => u.account_id === userId);
        return user ? user.balance : null;
      });
      userLines.push({
        name: `${userId.slice(0, 8)}...${userId.slice(-6)}`,
        type: chartType,
        data: userData,
        symbol: chartType === "line" ? "circle" : undefined,
        symbolSize: chartType === "line" ? 6 : undefined,
        lineStyle: chartType === "line" ? { width: 2 } : undefined,
        itemStyle: {
          color: getRandomSoftColor(index),
        },
        emphasis: {
          focus: "series",
        },
      });
    });
    return {
      backgroundColor: "transparent",
      title: {
        text: `${getTokenLabel(
          tokenType
        )} Top${topCount} Holdings (${getDimensionLabel(dimension)})`,
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
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
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
            if (param.value !== null) {
              const value = formatNumberForTooltip(param.value);
              result += `<div style="margin: 4px 0;">
                <span style="display: inline-block; width: 12px; height: 12px; background: ${param.color}; margin-right: 8px; border-radius: 2px;"></span>
                <span style="font-weight: 500;">${param.seriesName}:</span> 
                <span style="float: right; font-weight: bold;">${value}</span>
              </div>`;
            }
          });
          return result;
        },
      },
      legend: {
        data: userLines.map((line) => line.name),
        type: "scroll",
        orient: "horizontal",
        top: 60,
        left: "center",
        textStyle: {
          fontSize: isFullscreenMode ? 12 : 10,
          color: "#FFFFFF",
        },
        itemGap: 10,
        pageButtonItemGap: 5,
        pageButtonGap: 5,
        pageButtonPosition: "end",
        pageIconColor: "#FFFFFF",
        pageIconInactiveColor: "#666666",
        pageTextStyle: {
          color: "#FFFFFF",
        },
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "0%",
        top: isFullscreenMode ? "20%" : "25%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: timePoints,
        axisLabel: {
          fontSize: isFullscreenMode ? 14 : 12,
          color: "#A0A0A0",
        },
        axisLine: {
          lineStyle: {
            color: "#333333",
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          fontSize: isFullscreenMode ? 14 : 12,
          color: "#A0A0A0",
          formatter: function (value: number) {
            return formatNumberWithSuffix(value);
          },
        },
        axisLine: {
          lineStyle: {
            color: "#333333",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#222222",
            type: "dashed",
          },
        },
      },
      series: userLines,
    };
  };

  const formatNumber = (value: number) => {
    return formatNumberWithSuffix(value);
  };

  const chartStyle = isFullscreen
    ? {
        width: "100vw",
        height: "100vh",
        position: "fixed" as const,
        top: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: "#000000",
      }
    : {
        width: "100%",
        height: "500px",
      };

  return (
    <div className="w-full flex flex-col h-full">
      {!isFullscreen && (
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Chart Type Selector */}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as "line" | "bar")}
            className="px-4 py-2 bg-dark-card text-white rounded-lg border border-gray-700 focus:border-accent-green focus:outline-none"
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
          </select>
          {/* Token Type Selector */}
          <select
            value={tokenType}
            onChange={(e) => onTokenTypeChange(e.target.value as TokenType)}
            className="px-4 py-2 bg-dark-card text-white rounded-lg border border-gray-700 focus:border-accent-green focus:outline-none"
          >
            <option value="ref">Ref</option>
            <option value="brrr">Brrr</option>
            <option value="rhea">Rhea</option>
            <option value="xref">xRef</option>
            <option value="xrhea">xRhea</option>
          </select>
          {/* Top Count Selector */}
          <select
            value={topCount}
            onChange={(e) =>
              onTopCountChange(parseInt(e.target.value) as TopCount)
            }
            className="px-4 py-2 bg-dark-card text-white rounded-lg border border-gray-700 focus:border-accent-green focus:outline-none"
          >
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>
          <div className="flex-1" />
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
      <div
        className={isFullscreen ? "w-full h-full" : "flex-1 min-h-0"}
        style={isFullscreen ? chartStyle : undefined}
      >
        <ReactECharts
          option={getChartOption(isFullscreen)}
          style={{ width: "100%", height: "100%" }}
        />
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

export default HoldingsChart;
