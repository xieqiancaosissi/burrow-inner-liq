import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import { ConversionChartDataPoint } from "../interface/types";
import { chartColors } from "../utils/colors";

interface ConversionChartProps {
  data: ConversionChartDataPoint[];
  dimension: string;
}

const ConversionChart: React.FC<ConversionChartProps> = ({
  data,
  dimension,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No conversion data available
      </div>
    );
  }

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

  const getChartOption = (isFullscreenMode: boolean = false) => {
    const times = data.map((item) => item.time);

    // Prepare series data for each category
    const ref0WeekData = data.map((item) => item.ref_0week);
    const ref5WeeksData = data.map((item) => item.ref_5weeks);
    const ref10WeeksData = data.map((item) => item.ref_10weeks);
    const ref20WeeksData = data.map((item) => item.ref_20weeks);

    const brrr0WeekData = data.map((item) => item.brrr_0week);
    const brrr5WeeksData = data.map((item) => item.brrr_5weeks);
    const brrr10WeeksData = data.map((item) => item.brrr_10weeks);
    const brrr20WeeksData = data.map((item) => item.brrr_20weeks);

    return {
      backgroundColor: "transparent",
      title: {
        text: `Ref/Brrr Conversion Data (${getDimensionLabel(dimension)})`,
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
      legend: {
        data: [
          "Ref 0 Week",
          "Ref 5 Weeks",
          "Ref 10 Weeks",
          "Ref 20 Weeks",
          "Brrr 0 Week",
          "Brrr 5 Weeks",
          "Brrr 10 Weeks",
          "Brrr 20 Weeks",
        ],
        top: 60,
        textStyle: {
          fontSize: isFullscreenMode ? 16 : 14,
          color: "#FFFFFF",
        },
        itemGap: 10,
        itemWidth: 15,
        itemHeight: 10,
        type: "scroll",
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
        data: times,
        axisLabel: {
          fontSize: isFullscreenMode ? 14 : 12,
          color: "#A0A0A0",
          rotate: 0, // 不斜着显示
          interval: 0, // 显示所有标签
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
            if (value >= 1e9) {
              return (value / 1e9).toFixed(1) + "B";
            } else if (value >= 1e6) {
              return (value / 1e6).toFixed(1) + "M";
            } else if (value >= 1e3) {
              return (value / 1e3).toFixed(1) + "K";
            }
            return value.toFixed(1);
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
      series: [
        // Ref series
        {
          name: "Ref 0 Week",
          type: "bar",
          data: ref0WeekData,
          barGap: "10%",
          barCategoryGap: "20%",
          itemStyle: {
            color: chartColors.primary.blue,
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: "Ref 5 Weeks",
          type: "bar",
          data: ref5WeeksData,
          barGap: "10%",
          barCategoryGap: "20%",
          itemStyle: {
            color: chartColors.secondary.blue,
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: "Ref 10 Weeks",
          type: "bar",
          data: ref10WeeksData,
          barGap: "10%",
          barCategoryGap: "20%",
          itemStyle: {
            color: chartColors.primary.indigo,
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: "Ref 20 Weeks",
          type: "bar",
          data: ref20WeeksData,
          barGap: "10%",
          barCategoryGap: "20%",
          itemStyle: {
            color: chartColors.secondary.indigo,
            borderRadius: [4, 4, 0, 0],
          },
        },
        // Brrr series
        {
          name: "Brrr 0 Week",
          type: "bar",
          data: brrr0WeekData,
          barGap: "10%",
          barCategoryGap: "20%",
          itemStyle: {
            color: chartColors.primary.pink,
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: "Brrr 5 Weeks",
          type: "bar",
          data: brrr5WeeksData,
          barGap: "10%",
          barCategoryGap: "20%",
          itemStyle: {
            color: chartColors.secondary.pink,
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: "Brrr 10 Weeks",
          type: "bar",
          data: brrr10WeeksData,
          barGap: "10%",
          barCategoryGap: "20%",
          itemStyle: {
            color: chartColors.primary.orange,
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: "Brrr 20 Weeks",
          type: "bar",
          data: brrr20WeeksData,
          barGap: "10%",
          barCategoryGap: "20%",
          itemStyle: {
            color: chartColors.secondary.orange,
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    };
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
    <div className="w-full">
      {/* Control buttons */}
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
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
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div style={chartStyle}>
        <ReactECharts
          option={getChartOption(isFullscreen)}
          style={{ height: "100%", width: "100%" }}
        />
      </div>

      {/* Close button in fullscreen mode */}
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
          Close
        </button>
      )}
    </div>
  );
};

export default ConversionChart;
