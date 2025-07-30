// 柔和的颜色方案配置
export const chartColors = {
  // 主要颜色 - 柔和版本
  primary: {
    blue: "#60A5FA", // 柔和蓝色
    green: "#34D399", // 柔和绿色
    purple: "#A78BFA", // 柔和紫色
    orange: "#FBBF24", // 柔和橙色
    pink: "#F472B6", // 柔和粉色
    teal: "#5EEAD4", // 柔和青色
    indigo: "#818CF8", // 柔和靛蓝
    yellow: "#FCD34D", // 柔和黄色
  },

  // 次要颜色 - 更柔和的版本
  secondary: {
    blue: "#93C5FD", // 更柔和的蓝色
    green: "#6EE7B7", // 更柔和的绿色
    purple: "#C4B5FD", // 更柔和的紫色
    orange: "#FCD34D", // 更柔和的橙色
    pink: "#F9A8D4", // 更柔和的粉色
    teal: "#99F6E4", // 更柔和的青色
    indigo: "#A5B4FC", // 更柔和的靛蓝
    yellow: "#FDE68A", // 更柔和的黄色
  },

  // 图表系列颜色数组
  series: [
    "#60A5FA", // 柔和蓝色
    "#34D399", // 柔和绿色
    "#A78BFA", // 柔和紫色
    "#FBBF24", // 柔和橙色
    "#F472B6", // 柔和粉色
    "#5EEAD4", // 柔和青色
    "#818CF8", // 柔和靛蓝
    "#FCD34D", // 柔和黄色
    "#93C5FD", // 更柔和的蓝色
    "#6EE7B7", // 更柔和的绿色
    "#C4B5FD", // 更柔和的紫色
    "#FCD34D", // 更柔和的橙色
    "#F9A8D4", // 更柔和的粉色
    "#99F6E4", // 更柔和的青色
    "#A5B4FC", // 更柔和的靛蓝
    "#FDE68A", // 更柔和的黄色
  ],

  // 特定用途的颜色
  specific: {
    total: "#34D399", // Total 使用柔和绿色
    ref: "#60A5FA", // Ref 使用柔和蓝色
    brrr: "#F472B6", // Brrr 使用柔和粉色
    rhea: "#5EEAD4", // Rhea 使用柔和青色
    xref: "#A78BFA", // xRef 使用柔和紫色
    xrhea: "#FBBF24", // xRhea 使用柔和橙色
  },

  // 周数颜色
  weeks: {
    "0": "#60A5FA", // 0 Week - 柔和蓝色
    "5": "#34D399", // 5 Week - 柔和绿色
    "10": "#A78BFA", // 10 Week - 柔和紫色
    "20": "#FBBF24", // 20 Week - 柔和橙色
  },

  // 渐变颜色
  gradients: {
    blue: {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: "#60A5FA" },
        { offset: 1, color: "#3B82F6" },
      ],
    },
    green: {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: "#34D399" },
        { offset: 1, color: "#10B981" },
      ],
    },
    purple: {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: "#A78BFA" },
        { offset: 1, color: "#8B5CF6" },
      ],
    },
    orange: {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: "#FBBF24" },
        { offset: 1, color: "#F59E0B" },
      ],
    },
    pink: {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: "#F472B6" },
        { offset: 1, color: "#EC4899" },
      ],
    },
  },
};

// 获取随机柔和颜色
export const getRandomSoftColor = (index: number) => {
  return chartColors.series[index % chartColors.series.length];
};

// 获取特定token的颜色
export const getTokenColor = (tokenType: string) => {
  return (
    chartColors.specific[tokenType as keyof typeof chartColors.specific] ||
    chartColors.series[0]
  );
};

// 获取周数颜色
export const getWeekColor = (week: number) => {
  return (
    chartColors.weeks[week.toString() as keyof typeof chartColors.weeks] ||
    chartColors.series[0]
  );
};
