import React, { useState, useEffect } from "react";
import {
  getLiquidations,
  getHistoryData,
  getMemeLiquidateRecordPage,
} from "@/services/api";
import { BeatLoading } from "@/components/Loading";
import { format_usd, toReadableDecimalsNumber } from "@/utils/number";
import { SeriesData, TimeUnit } from "@/components/charts/DashBoardEChart";
import DashBoardEChart from "@/components/charts/DashBoardEChart";
import { ftGetTokenMetadata } from "@/services/near";
import { getPerice } from "@/services/api";

interface DashboardData {
  main_regular_tobe_liquidated_count: number;
  main_regular_tobe_liquidated_value: number;
  main_margin_tobe_liquidated_count: number;
  main_margin_tobe_liquidated_value: number;
  main_margin_tobe_forced_count: number;
  main_margin_tobe_forced_value: number;
  meme_regular_tobe_liquidated_count: number;
  meme_regular_tobe_liquidated_value: number;
  meme_margin_tobe_liquidated_count: number;
  meme_margin_tobe_liquidated_value: number;
  meme_margin_tobe_forced_count: number;
  meme_margin_tobe_forced_value: number;
}

interface HistoryData {
  date: string;
  total_liquidation_count: number;
  team_liquidation_count: number;
  community_liquidation_count: number;
  total_liquidation_value: number;
  team_liquidation_value: number;
  community_liquidation_value: number;
  total_force_count: number;
  total_force_value: number;
  total_liquidator_profit: number;
  team_liquidator_profit: number;
  community_liquidator_profit: number;
  protocol_liquidation_profit: number;
  team_force_count: number;
  community_force_count: number;
  team_force_value: number;
  community_force_value: number;
}

interface MarginLiquidationData {
  type: string;
  debt: {
    value: string;
  };
}

export default function DashBoard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [timeRange, setTimeRange] = useState<"daily" | "weekly">("daily");

  const [memeMargin, setMemeMargin] = useState<any[]>([]);
  const [tokenMetas, setTokenMetas] = useState<Record<string, any>>({});
  const [tokenPrices, setTokenPrices] = useState<Record<string, any>>({});

  useEffect(() => {
    async function fetchTokenInfo() {
      const tokenIds = new Set<string>();
      getLiquidations(
        "LiquidatableMarginPositions",
        "meme-burrow.ref-labs.near"
      ).then((res) => {
        setMemeMargin(res.data);
        res.data.forEach((item: any) => {
          if (item.debt?.token_id) tokenIds.add(item.debt.token_id);
        });
        Promise.all(
          Array.from(tokenIds).map((id) => ftGetTokenMetadata(id))
        ).then((metas) => {
          const metaMap: Record<string, any> = {};
          Array.from(tokenIds).forEach((id, idx) => (metaMap[id] = metas[idx]));
          setTokenMetas(metaMap);
        });
      });
      getPerice().then(setTokenPrices);
    }
    fetchTokenInfo();
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchHistoryData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      const [mainRegular, mainMargin, memeRegular, memeMargin] =
        await Promise.all([
          getLiquidations(
            "LiquidatableAccountViewInfos",
            "contract.main.burrow.near"
          ),
          getLiquidations(
            "LiquidatableMarginPositions",
            "contract.main.burrow.near"
          ),
          getLiquidations(
            "LiquidatableAccountViewInfos",
            "meme-burrow.ref-labs.near"
          ),
          getLiquidations(
            "LiquidatableMarginPositions",
            "meme-burrow.ref-labs.near"
          ),
        ]);
      if (
        memeMargin.data.length &&
        Object.keys(tokenMetas).length &&
        Object.keys(tokenPrices).length
      ) {
        const memeMarginValue = memeMargin.data.reduce(
          (sum: number, item: any) => {
            const tokenId = item.debt?.token_id;
            const meta = tokenMetas[tokenId] || {};
            const price = tokenPrices[tokenId]?.price || 0;
            const decimals = meta.decimals || 24;
            const amount = toReadableDecimalsNumber(
              decimals,
              String(item.debt?.amount || "0")
            );
            return sum + parseFloat(amount) * price;
          },
          0
        );
        const memeMarginForceValue = memeMargin.data
          .filter((item: any) => item.type === "Foreclose")
          .reduce((sum: number, item: any) => {
            const tokenId = item.debt?.token_id;
            const meta = tokenMetas[tokenId] || {};
            const price = tokenPrices[tokenId]?.price || 0;
            const decimals = meta.decimals || 24;
            const amount = toReadableDecimalsNumber(
              decimals,
              String(item.debt?.amount || "0")
            );
            return sum + parseFloat(amount) * price;
          }, 0);

        const data: DashboardData = {
          main_regular_tobe_liquidated_count: mainRegular.data.length,
          main_regular_tobe_liquidated_value: mainRegular.data.reduce(
            (sum, item) => sum + parseFloat(item.gapSum),
            0
          ),
          main_margin_tobe_liquidated_count: mainMargin.data.length,
          main_margin_tobe_liquidated_value: mainMargin.data.reduce(
            (sum, item) => {
              const marginItem = item as unknown as MarginLiquidationData;
              return sum + parseFloat(marginItem.debt?.value || "0");
            },
            0
          ),
          main_margin_tobe_forced_count: mainMargin.data.filter((item) => {
            const marginItem = item as unknown as MarginLiquidationData;
            return marginItem.type === "Foreclose";
          }).length,
          main_margin_tobe_forced_value: mainMargin.data
            .filter((item) => {
              const marginItem = item as unknown as MarginLiquidationData;
              return marginItem.type === "Foreclose";
            })
            .reduce((sum, item) => {
              const marginItem = item as unknown as MarginLiquidationData;
              return sum + parseFloat(marginItem.debt?.value || "0");
            }, 0),
          meme_regular_tobe_liquidated_count: memeRegular.data.length,
          meme_regular_tobe_liquidated_value: memeRegular.data.reduce(
            (sum, item) => sum + parseFloat(item.gapSum),
            0
          ),
          meme_margin_tobe_liquidated_count: memeMargin.data.length,
          meme_margin_tobe_liquidated_value: memeMarginValue,
          meme_margin_tobe_forced_count: memeMargin.data.filter(
            (item: any) => item.type === "Foreclose"
          ).length,
          meme_margin_tobe_forced_value: memeMarginForceValue,
        };

        setDashboardData(data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const fetchHistoryData = async () => {
    try {
      const days = timeRange === "daily" ? 7 : 49;
      const [mainRegular, mainMargin, memeRegular, memeMargin] =
        await Promise.all([
          getHistoryData(1, 100, "timestamp", "desc", "regular", days),
          getHistoryData(1, 100, "timestamp", "desc", "margin", days),
          getMemeLiquidateRecordPage(1, 100, "timestamp", "desc", "regular"),
          getMemeLiquidateRecordPage(1, 100, "timestamp", "desc", "margin"),
        ]);
      const processData = (data: any[]): HistoryData[] => {
        const groupedData = data.reduce(
          (acc: Record<string, HistoryData>, item: any) => {
            const date = new Date(item.timestamp);
            const key =
              timeRange === "daily"
                ? date.toISOString().split("T")[0]
                : `${date.getFullYear()}-W${Math.ceil(
                    (date.getDate() + date.getDay()) / 7
                  )}`;

            if (!acc[key]) {
              acc[key] = {
                date: key,
                total_liquidation_count: 0,
                team_liquidation_count: 0,
                community_liquidation_count: 0,
                total_liquidation_value: 0,
                team_liquidation_value: 0,
                community_liquidation_value: 0,
                total_force_count: 0,
                total_force_value: 0,
                total_liquidator_profit: 0,
                team_liquidator_profit: 0,
                community_liquidator_profit: 0,
                protocol_liquidation_profit: 0,
                team_force_count: 0,
                community_force_count: 0,
                team_force_value: 0,
                community_force_value: 0,
              };
            }

            const record = acc[key];
            record.total_liquidation_count++;
            record.total_liquidation_value += parseFloat(
              item.liquidation_value || 0
            );
            record.total_force_count += item.type === "force" ? 1 : 0;
            record.total_force_value +=
              item.type === "force"
                ? parseFloat(item.liquidation_value || 0)
                : 0;
            record.total_liquidator_profit += parseFloat(
              item.liquidator_profit || 0
            );
            record.protocol_liquidation_profit += parseFloat(
              item.protocol_profit || 0
            );

            if (item.liquidator_type === "team") {
              record.team_liquidation_count++;
              record.team_liquidation_value += parseFloat(
                item.liquidation_value || 0
              );
              record.team_liquidator_profit += parseFloat(
                item.liquidator_profit || 0
              );
              record.team_force_count += item.type === "force" ? 1 : 0;
              record.team_force_value +=
                item.type === "force"
                  ? parseFloat(item.liquidation_value || 0)
                  : 0;
            } else {
              record.community_liquidation_count++;
              record.community_liquidation_value += parseFloat(
                item.liquidation_value || 0
              );
              record.community_liquidator_profit += parseFloat(
                item.liquidator_profit || 0
              );
              record.community_force_count += item.type === "force" ? 1 : 0;
              record.community_force_value +=
                item.type === "force"
                  ? parseFloat(item.liquidation_value || 0)
                  : 0;
            }

            return acc;
          },
          {}
        );

        return Object.values(groupedData).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      };

      const allHistoryData = [
        ...processData(mainRegular.data),
        ...processData(mainMargin.data),
        ...processData(memeRegular.data),
        ...processData(memeMargin.data),
      ];

      const mergedData = allHistoryData.reduce(
        (acc: Record<string, HistoryData>, item: HistoryData) => {
          if (!acc[item.date]) {
            acc[item.date] = { ...item };
          } else {
            const existing = acc[item.date];
            existing.total_liquidation_count += item.total_liquidation_count;
            existing.team_liquidation_count += item.team_liquidation_count;
            existing.community_liquidation_count +=
              item.community_liquidation_count;
            existing.total_liquidation_value += item.total_liquidation_value;
            existing.team_liquidation_value += item.team_liquidation_value;
            existing.community_liquidation_value +=
              item.community_liquidation_value;
            existing.total_force_count += item.total_force_count;
            existing.total_force_value += item.total_force_value;
            existing.total_liquidator_profit += item.total_liquidator_profit;
            existing.team_liquidator_profit += item.team_liquidator_profit;
            existing.community_liquidator_profit +=
              item.community_liquidator_profit;
            existing.protocol_liquidation_profit +=
              item.protocol_liquidation_profit;
            existing.team_force_count += item.team_force_count;
            existing.community_force_count += item.community_force_count;
            existing.team_force_value += item.team_force_value;
            existing.community_force_value += item.community_force_value;
          }
          return acc;
        },
        {}
      );

      const finalData = Object.values(mergedData).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setHistoryData(finalData);
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
  };

  function getEChartData(
    data: HistoryData[],
    type: string,
    timeUnit: TimeUnit
  ) {
    const xAxisData = data.map((item) => new Date(item.date).getTime() / 1000);
    const seriesData: SeriesData[] = [
      {
        name: "Total",
        data: data.map(
          (item) => item[`total_${type}` as keyof HistoryData] as number
        ),
        color: "#4fd1c5",
      },
      {
        name: "Team",
        data: data.map(
          (item) => item[`team_${type}` as keyof HistoryData] as number
        ),
        color: "#4299e1",
      },
      {
        name: "Community",
        data: data.map(
          (item) => item[`community_${type}` as keyof HistoryData] as number
        ),
        color: "#f56565",
      },
    ];
    return { xAxisData, seriesData };
  }

  function formatUsdNoZero(n: string | number) {
    const number = Number(n || 0);
    if (number === 0) return "$0";
    if (number > 0 && number < 0.0001) return "<$0.0001";
    if (number < 0 && number > -0.0001) return ">-$0.0001";
    if (number < 0) return "-$" + Math.abs(number).toFixed(4);
    return "$" + number.toFixed(4);
  }

  // if (loading) {
  //   return <BeatLoading />;
  // }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      {/* Real-time Data Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3">Real-time Data</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-dark-200 bg-opacity-50 px-5 py-0 rounded-xl flex flex-col justify-center min-h-[110px] shadow">
            <h3 className="text-base font-semibold mb-4">
              Main Regular Pending
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-2xl font-bold">
                {dashboardData?.main_regular_tobe_liquidated_count || 0}{" "}
                <span className="text-base font-normal text-gray-400">
                  items
                </span>
              </span>
              <span className="text-2xl font-bold">
                {formatUsdNoZero(
                  dashboardData?.main_regular_tobe_liquidated_value || 0
                )} {" "}
                <span className="text-base font-normal text-gray-400">
                  value
                </span>
              </span>
            </div>
          </div>
          <div className="bg-dark-200 bg-opacity-50 px-5 py-0 rounded-xl flex flex-col justify-center min-h-[110px] shadow">
            <h3 className="text-base font-semibold mb-4">
              Main Margin Pending
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-2xl font-bold">
                {dashboardData?.main_margin_tobe_liquidated_count || 0}{" "}
                <span className="text-base font-normal text-gray-400">
                  items
                </span>
              </span>
              <span className="text-2xl font-bold">
                {formatUsdNoZero(
                  dashboardData?.main_margin_tobe_liquidated_value || 0
                )} {" "}
                <span className="text-base font-normal text-gray-400">
                  value
                </span>
              </span>
            </div>
          </div>
          <div className="bg-dark-200 bg-opacity-50 px-5 py-0 rounded-xl flex flex-col justify-center min-h-[110px] shadow">
            <h3 className="text-base font-semibold mb-4">
              Main Margin Force Close
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-2xl font-bold">
                {dashboardData?.main_margin_tobe_forced_count || 0}{" "}
                <span className="text-base font-normal text-gray-400">
                  items
                </span>
              </span>
              <span className="text-2xl font-bold">
                {formatUsdNoZero(dashboardData?.main_margin_tobe_forced_value || 0)}{" "}
                <span className="text-base font-normal text-gray-400">
                  value
                </span>
              </span>
            </div>
          </div>
          <div className="bg-dark-200 bg-opacity-50 px-5 py-0 rounded-xl flex flex-col justify-center min-h-[110px] shadow">
            <h3 className="text-base font-semibold mb-1">
              Meme Regular Pending
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-2xl font-bold">
                {dashboardData?.meme_regular_tobe_liquidated_count || 0}{" "}
                <span className="text-base font-normal text-gray-400">
                  items
                </span>
              </span>
              <span className="text-2xl font-bold">
                {formatUsdNoZero(
                  dashboardData?.meme_regular_tobe_liquidated_value || 0
                )} {" "}
                <span className="text-base font-normal text-gray-400">
                  value
                </span>
              </span>
            </div>
          </div>
          <div className="bg-dark-200 bg-opacity-50 px-5 py-0 rounded-xl flex flex-col justify-center min-h-[110px] shadow">
            <h3 className="text-base font-semibold mb-4">
              Meme Margin Pending
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-2xl font-bold">
                {dashboardData?.meme_margin_tobe_liquidated_count || 0}{" "}
                <span className="text-base font-normal text-gray-400">
                  items
                </span>
              </span>
              <span className="text-2xl font-bold">
                {formatUsdNoZero(
                  dashboardData?.meme_margin_tobe_liquidated_value || 0
                )} {" "}
                <span className="text-base font-normal text-gray-400">
                  value
                </span>
              </span>
            </div>
          </div>
          <div className="bg-dark-200 bg-opacity-50 px-5 py-0 rounded-xl flex flex-col justify-center min-h-[110px] shadow">
            <h3 className="text-base font-semibold mb-4">
              Meme Margin Force Close
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-2xl font-bold">
                {dashboardData?.meme_margin_tobe_forced_count || 0}{" "}
                <span className="text-base font-normal text-gray-400">
                  items
                </span>
              </span>
              <span className="text-2xl font-bold">
                {formatUsdNoZero(dashboardData?.meme_margin_tobe_forced_value || 0)}{" "}
                <span className="text-base font-normal text-gray-400">
                  value
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Data Section */}
      {/* <div>
        <h2 className="text-3xl font-extrabold text-white mb-6">Historical Data</h2>
        <div className="space-y-14">
          <div>
            <h3 className="text-2xl font-bold text-gray-100 mt-6 mb-2 pb-2 border-b-2 border-[#353657]">Main Regular</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashBoardEChart
                title="Liquidation Count"
                {...getEChartData(historyData, "liquidation_count", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Liquidation Value"
                {...getEChartData(historyData, "liquidation_value", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Force Close Count"
                {...getEChartData(historyData, "force_count", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Force Close Value"
                {...getEChartData(historyData, "force_value", "day")}
                timeUnit="day"
              />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-100 mt-6 mb-2 pb-2 border-b-2 border-[#353657]">Main Margin</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashBoardEChart
                title="Liquidation Count"
                {...getEChartData(historyData, "liquidation_count", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Liquidation Value"
                {...getEChartData(historyData, "liquidation_value", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Liquidator Profit"
                {...getEChartData(historyData, "liquidator_profit", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Protocol Profit"
                {...getEChartData(historyData, "protocol_liquidation_profit", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Force Close Count"
                {...getEChartData(historyData, "force_count", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Force Close Value"
                {...getEChartData(historyData, "force_value", "day")}
                timeUnit="day"
              />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-100 mt-6 mb-2 pb-2 border-b-2 border-[#353657]">Meme Regular</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashBoardEChart
                title="Liquidation Count"
                {...getEChartData(historyData, "liquidation_count", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Liquidation Value"
                {...getEChartData(historyData, "liquidation_value", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Force Close Count"
                {...getEChartData(historyData, "force_count", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Force Close Value"
                {...getEChartData(historyData, "force_value", "day")}
                timeUnit="day"
              />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-100 mt-6 mb-2 pb-2 border-b-2 border-[#353657]">Meme Margin</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashBoardEChart
                title="Liquidation Count"
                {...getEChartData(historyData, "liquidation_count", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Liquidation Value"
                {...getEChartData(historyData, "liquidation_value", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Liquidator Profit"
                {...getEChartData(historyData, "liquidator_profit", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Protocol Profit"
                {...getEChartData(historyData, "protocol_liquidation_profit", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Force Close Count"
                {...getEChartData(historyData, "force_count", "day")}
                timeUnit="day"
              />
              <DashBoardEChart
                title="Force Close Value"
                {...getEChartData(historyData, "force_value", "day")}
                timeUnit="day"
              />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
