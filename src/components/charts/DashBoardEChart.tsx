import React from "react";
import ReactECharts from "echarts-for-react";
import { getChartOption } from "./getChartOption";

export interface SeriesData {
  name: string;
  data: number[];
  color: string;
}

export type TimeUnit = "hour" | "day" | "week";

interface EChartProps {
  xAxisData: number[];
  seriesData: SeriesData[];
  timeUnit: TimeUnit;
  title?: string;
  style?: React.CSSProperties;
  type?: "bar" | "line";
  stack?: boolean;
  singleBar?: boolean;
}

export default function DashBoardEChart({
  xAxisData,
  seriesData,
  timeUnit,
  title,
  style,
  type = "bar",
  stack = false,
  singleBar = false,
}: EChartProps) {
  const option = getChartOption(
    xAxisData,
    seriesData,
    timeUnit,
    type,
    stack,
    singleBar
  );
  return (
    <div style={style}>
      {title && (
        <div className="text-lg font-semibold mb-2 text-gray-200">{title}</div>
      )}
      <ReactECharts option={option} style={{ height: 320, width: "100%" }} />
    </div>
  );
}
