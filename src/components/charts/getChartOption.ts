import { TimeUnit, SeriesData } from "./DashBoardEChart";

export function getChartOption(
  xAxisData: number[],
  seriesData: SeriesData[],
  timeUnit: TimeUnit,
  type: "bar" | "line" = "bar",
  stack: boolean = false,
  singleBar: boolean = false
) {
  return {
    title: undefined,
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: function (params: any) {
        const date = new Date(params[0].axisValue * 1000);
        let timeStr = "";

        if (timeUnit === "hour") {
          timeStr = `${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
        } else if (timeUnit === "day") {
          timeStr = date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
          });
        } else {
          const weekStart = date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
          });
          const weekEndDate = new Date(date);
          weekEndDate.setDate(weekEndDate.getDate() + 6);
          const weekEnd = weekEndDate.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
          });
          timeStr = `${weekStart} - ${weekEnd}`;
        }

        return (
          timeStr +
          params
            .map(
              (item: any) =>
                `<br/>${item.seriesName}: ${parseFloat(item.value.toFixed(2))}`
            )
            .join("")
        );
      },
    },
    legend: {
      data: seriesData.map((item) => item.name),
      textStyle: { color: "#C0C4E9" },
    },
    toolbox: {
      show: true,
      feature: {
        magicType: {
          show: true,
          type: ["line", "bar"],
          title: {
            line: "Switch to Line Chart",
            bar: "Switch to Bar Chart",
          },
        },
      },
      iconStyle: {
        borderColor: "#C0C4E9",
      },
      itemSize: 12,
      top: 0,
      right: 10,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "20%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xAxisData,
      axisLabel: {
        color: "#C0C4E9",
        interval: timeUnit === "hour" ? 1 : timeUnit === "day" ? 0 : 0,
        rotate: 0,
        formatter: function (value: number) {
          const date = new Date(value * 1000);
          if (timeUnit === "hour") {
            return `${date.getHours().toString().padStart(2, "0")}:${date
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;
          } else if (timeUnit === "day") {
            return date.toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
            });
          } else {
            const weekStart = new Date(date);
            const weekEnd = new Date(date);
            weekEnd.setDate(weekEnd.getDate() + 6);

            return `${weekStart.toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
            })} - ${weekEnd.toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
            })}`;
          }
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#C0C4E9" },
      splitLine: {
        show: false,
      },
    },
    series: seriesData.map((item, index) => ({
      name: item.name,
      type: type,
      stack: stack ? "stack" : undefined,
      barGap: singleBar ? "0%" : "20%",
      barCategoryGap: singleBar ? "0%" : "30%",
      barWidth: singleBar ? "40%" : "20%",
      data: item.data.map((value) => parseFloat(value.toFixed(2))),
      itemStyle: {
        color: item.color,
        borderRadius: type === "bar" ? [4, 4, 0, 0] : undefined,
      },
      lineStyle:
        type === "line"
          ? {
              width: 2,
            }
          : undefined,
      symbol: type === "line" ? "circle" : undefined,
      symbolSize: type === "line" ? 6 : undefined,
    })),
  };
}
