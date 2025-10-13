import React, { useState, useEffect, useMemo } from "react";
import {
  getLiquidations,
  getHistoryData,
  getMemeLiquidateRecordPage,
  getMarginLiquidateLog,
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

interface MarginLiquidationData {
  type: string;
  debt: {
    value: string;
  };
}

const TEAM_ACCOUNTS = [
  "burrow-liquidation-bot-01.ref-labs.near",
  "burrow-liquidation-bot-02.ref-labs.near",
  "burrow-liquidation-bot-03.ref-labs.near",
  "burrow-liquidation-bot-04.ref-labs.near",
  "closenook7417.near",
  "liqbot.near",
  "meme-lqdb.ref-labs.near"
];

function groupBy<T>(arr: T[], fn: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc: Record<string, T[]>, item: T) => {
    const key = fn(item);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
}

export default function DashBoard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [memeMargin, setMemeMargin] = useState<any[]>([]);
  const [tokenMetas, setTokenMetas] = useState<Record<string, any>>({});
  const [tokenPrices, setTokenPrices] = useState<Record<string, any>>({});
  const [historyType, setHistoryType] = useState<"day" | "week">("day");
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyAgg, setHistoryAgg] = useState<any[]>([]);
  const [mainMarginHistoryAgg, setMainMarginHistoryAgg] = useState<any[]>([]);
  const [memeRegularHistoryAgg, setMemeRegularHistoryAgg] = useState<any[]>([]);
  const [memeMarginHistoryAgg, setMemeMarginHistoryAgg] = useState<any[]>([]);
  const [allTokenMetadatas, setAllTokenMetadatas] = useState<
    Record<string, any>
  >({});
  const [allTokenPrices, setAllTokenPrices] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchHistoryAgg();
  }, [historyType]);

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

      const tokenIds = new Set<string>();
      memeMargin.data.forEach((item: any) => {
        if (item.debt?.token_id) tokenIds.add(item.debt.token_id);
      });
      const [metas, prices] = await Promise.all([
        Promise.all(Array.from(tokenIds).map((id) => ftGetTokenMetadata(id))),
        getPerice(),
      ]);
      const metaMap: Record<string, any> = {};
      Array.from(tokenIds).forEach((id, idx) => (metaMap[id] = metas[idx]));
      setMemeMargin(memeMargin.data);
      setTokenMetas(metaMap);
      setTokenPrices(prices);
      if (
        memeMargin.data.length &&
        Object.keys(metaMap).length &&
        Object.keys(prices).length
      ) {
        const memeMarginValue = memeMargin.data.reduce(
          (sum: number, item: any) => {
            const tokenId = item.debt?.token_id;
            const meta = metaMap[tokenId] || {};
            const price = prices[tokenId]?.price || 0;
            const decimals = meta.decimals || 24;
            const amount = toReadableDecimalsNumber(
              decimals,
              String(item.debt?.amount || "0")
            );
            return sum + parseFloat(amount) * price;
          },
          0
        );
        // Meme Margin Force Close
        const memeMarginForceList = memeMargin.data.filter(
          (item: any) => item.pos_type === "Foreclose"
        );
        const memeMarginForceValue = memeMarginForceList.reduce((sum: number, item: any) => {
          if (!item.debt) return sum;
          return (
            sum +
            Object.entries(item.debt).reduce((s, [token, amount]) => {
              const meta = metaMap[token] || {};
              const price = prices[token]?.price || 0;
              const readable = parseFloat(
                toReadableDecimalsNumber(meta.decimals || 24, String(amount))
              );
              return s + readable * price;
            }, 0)
          );
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
          meme_margin_tobe_forced_count: memeMarginForceList.length,
          meme_margin_tobe_forced_value: memeMarginForceValue,
        };

        setDashboardData(data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  async function fetchHistoryAgg() {
    setHistoryLoading(true);
    const days = historyType === "day" ? 7 : 49;
    const [regularRes, mainMarginRes, memeRegularRes, memeMarginRes] =
      await Promise.all([
        getHistoryData(1, 1000, "timestamp", "desc", "all", days),
        getMarginLiquidateLog(
          1,
          1000,
          "block_timestamp",
          "desc",
          "contract.main.burrow.near",
          days
        ),
        getMemeLiquidateRecordPage(1, 1000, "timestamp", "desc", "all", days),
        getMarginLiquidateLog(
          1,
          1000,
          "block_timestamp",
          "desc",
          "meme-burrow.ref-labs.near",
          days
        ),
      ]);
    const regularRecords: any[] = regularRes?.data?.record_list || [];
    const mainMarginRecords: any[] = mainMarginRes?.data?.record_list || [];
    const memeRegularRecords: any[] = memeRegularRes?.data?.record_list || [];
    const memeMarginRecords: any[] = memeMarginRes?.data?.record_list || [];
    
    const tokenIds = new Set<string>();

    [
      ...regularRecords,
      ...mainMarginRecords,
      ...memeRegularRecords,
      ...memeMarginRecords,
    ].forEach((record) => {
      (record.LiquidatedAssets || []).forEach((asset: any) => {
        if (asset && asset.token_id) tokenIds.add(asset.token_id);
      });
    });

    const [metas, prices] = await Promise.all([
      Promise.all(Array.from(tokenIds).map((id) => ftGetTokenMetadata(id))),
      getPerice(),
    ]);
    const metaMap: Record<string, any> = {};
    Array.from(tokenIds).forEach((id, idx) => (metaMap[id] = metas[idx]));
    setAllTokenMetadatas(metaMap);
    setAllTokenPrices(prices);

    // main regular
    const byDay = groupBy<any>(regularRecords, (r: any) => {
      const date = new Date(r.createdAt * 1000);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    });

    // main margin
    const mainMarginByDay = groupBy<any>(mainMarginRecords, (r: any) => {
      const date = new Date(r.block_timestamp * 1000);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    });

    // meme regular
    const memeRegularByDay = groupBy<any>(memeRegularRecords, (r: any) => {
      const date = new Date(r.createdAt * 1000);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    });

    // meme margin
    const memeMarginByDay = groupBy<any>(memeMarginRecords, (r: any) => {
      if (!r.block_timestamp) return "-";
      const milliseconds = Math.floor(Number(r.block_timestamp) / 1_000_000);
      const date = new Date(milliseconds);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    });

    let dayAgg = Object.entries(byDay).map(([date, items]) => {
      const itemsArr = items as any[];
      let total_liquidation_count = itemsArr.length;
      let team_liquidation_count = itemsArr.filter((i) =>
        TEAM_ACCOUNTS.includes(i.account_id)
      ).length;
      let community_liquidation_count =
        total_liquidation_count - team_liquidation_count;
      let total_liquidation_value = itemsArr.reduce(
        (sum, i) =>
          sum +
          (i.LiquidatedAssets || []).reduce((s: number, a: any) => {
        const meta = metaMap[a.token_id] || {};
        const price = prices[a.token_id]?.price || 0;
            const amount = toReadableDecimalsNumber(
              meta.decimals || 0,
              a.amount
            );
        return s + parseFloat(amount) * price;
          }, 0),
        0
      );
      let team_liquidation_value = itemsArr
        .filter((i) => TEAM_ACCOUNTS.includes(i.account_id))
        .reduce(
          (sum, i) =>
            sum +
            (i.LiquidatedAssets || []).reduce((s: number, a: any) => {
        const meta = metaMap[a.token_id] || {};
        const price = prices[a.token_id]?.price || 0;
              const amount = toReadableDecimalsNumber(
                meta.decimals || 0,
                a.amount
              );
        return s + parseFloat(amount) * price;
            }, 0),
          0
        );
      let community_liquidation_value =
        total_liquidation_value - team_liquidation_value;
      let total_force_count = itemsArr.filter(
        (i) => i.liquidation_type === "force_close"
      ).length;
      let total_force_value = itemsArr
        .filter((i) => i.liquidation_type === "force_close")
        .reduce(
          (sum, i) =>
            sum +
            (i.LiquidatedAssets || []).reduce((s: number, a: any) => {
        const meta = metaMap[a.token_id] || {};
        const price = prices[a.token_id]?.price || 0;
              const amount = toReadableDecimalsNumber(
                meta.decimals || 0,
                a.amount
              );
        return s + parseFloat(amount) * price;
            }, 0),
          0
        );
      return {
        date,
        total_liquidation_count,
        team_liquidation_count,
        community_liquidation_count,
        total_liquidation_value,
        team_liquidation_value,
        community_liquidation_value,
        total_force_count,
        total_force_value,
      };
    });
    let marginDayAgg = Object.entries(mainMarginByDay).map(([date, items]) => {
      const itemsArr = items as any[];
      let total_liquidation_count = itemsArr.length;
      let team_liquidation_count = itemsArr.filter((i) =>
        TEAM_ACCOUNTS.includes(i.liquidation_account_id)
      ).length;
      let community_liquidation_count =
        total_liquidation_count - team_liquidation_count;
      let total_liquidation_value = itemsArr.reduce(
        (sum, i) =>
          sum +
          (i.LiquidatedAssets || []).reduce((s: number, a: any) => {
            const meta = metaMap[a.token_id] || {};
            const price = prices[a.token_id]?.price || 0;
            const amount = toReadableDecimalsNumber(
              meta.decimals || 0,
              a.amount
            );
            return s + parseFloat(amount) * price;
          }, 0),
        0
      );
      let team_liquidation_value = itemsArr
        .filter((i) => TEAM_ACCOUNTS.includes(i.liquidation_account_id))
        .reduce(
          (sum, i) =>
            sum +
            (i.LiquidatedAssets || []).reduce((s: number, a: any) => {
              const meta = metaMap[a.token_id] || {};
              const price = prices[a.token_id]?.price || 0;
              const amount = toReadableDecimalsNumber(
                meta.decimals || 0,
                a.amount
              );
              return s + parseFloat(amount) * price;
            }, 0),
          0
        );
      let community_liquidation_value =
        total_liquidation_value - team_liquidation_value;
      let total_liquidator_profit = itemsArr.reduce(
        (sum, i) => sum + parseFloat(i.liquidator_profit || "0"),
        0
      );
      let team_liquidator_profit = itemsArr
        .filter((i) => TEAM_ACCOUNTS.includes(i.liquidation_account_id))
        .reduce((sum, i) => sum + parseFloat(i.liquidator_profit || "0"), 0);
      let community_liquidator_profit =
        total_liquidator_profit - team_liquidator_profit;
      let protocol_liquidation_profit = itemsArr.reduce(
        (sum, i) => sum + parseFloat(i.protocol_profit || "0"),
        0
      );
      let total_force_count = itemsArr.filter(
        (i) => i.liquidation_type === "force_close"
      ).length;
      let team_force_count = itemsArr.filter(
        (i) =>
          i.liquidation_type === "force_close" &&
          TEAM_ACCOUNTS.includes(i.liquidation_account_id)
      ).length;
      let community_force_count = total_force_count - team_force_count;
      let total_force_value = itemsArr
        .filter((i) => i.liquidation_type === "force_close")
        .reduce(
          (sum, i) =>
            sum +
            (i.LiquidatedAssets || []).reduce((s: number, a: any) => {
              const meta = metaMap[a.token_id] || {};
              const price = prices[a.token_id]?.price || 0;
              const amount = toReadableDecimalsNumber(
                meta.decimals || 0,
                a.amount
              );
              return s + parseFloat(amount) * price;
            }, 0),
          0
        );
      let team_force_value = itemsArr
        .filter(
          (i) =>
            i.liquidation_type === "force_close" &&
            TEAM_ACCOUNTS.includes(i.liquidation_account_id)
        )
        .reduce(
          (sum, i) =>
            sum +
            (i.LiquidatedAssets || []).reduce((s: number, a: any) => {
              const meta = metaMap[a.token_id] || {};
              const price = prices[a.token_id]?.price || 0;
              const amount = toReadableDecimalsNumber(
                meta.decimals || 0,
                a.amount
              );
              return s + parseFloat(amount) * price;
            }, 0),
          0
        );
      let community_force_value = total_force_value - team_force_value;
      return {
        date,
        total_liquidation_count,
        team_liquidation_count,
        community_liquidation_count,
        total_liquidation_value,
        team_liquidation_value,
        community_liquidation_value,
        total_liquidator_profit,
        team_liquidator_profit,
        community_liquidator_profit,
        protocol_liquidation_profit,
        total_force_count,
        team_force_count,
        community_force_count,
        total_force_value,
        team_force_value,
        community_force_value,
      };
    });

    // meme regular
    let memeRegularDayAgg = Object.entries(memeRegularByDay).map(
      ([date, items]) => {
        const itemsArr = items as any[];
        let total_liquidation_count = itemsArr.length;
        let team_liquidation_count = itemsArr.filter((i) =>
          TEAM_ACCOUNTS.includes(i.liquidation_account_id)
        ).length;
        let community_liquidation_count =
          total_liquidation_count - team_liquidation_count;
        let total_liquidation_value = itemsArr.reduce(
          (sum, i) =>
            sum +
            (i.LiquidatedAssets || []).reduce((s: number, a: any) => {
              const meta = metaMap[a.token_id] || {};
              const price = prices[a.token_id]?.price || 0;
              const amount = toReadableDecimalsNumber(
                meta.decimals || 0,
                a.amount
              );
              return s + parseFloat(amount) * price;
            }, 0),
          0
        );
        let team_liquidation_value = itemsArr
          .filter((i) => TEAM_ACCOUNTS.includes(i.liquidation_account_id))
          .reduce(
            (sum, i) =>
              sum +
              (i.LiquidatedAssets || []).reduce((s: number, a: any) => {
                const meta = metaMap[a.token_id] || {};
                const price = prices[a.token_id]?.price || 0;
                const amount = toReadableDecimalsNumber(
                  meta.decimals || 0,
                  a.amount
                );
                return s + parseFloat(amount) * price;
              }, 0),
            0
          );
        let community_liquidation_value =
          total_liquidation_value - team_liquidation_value;
        let total_force_count = itemsArr.filter(
          (i) => i.liquidation_type === "force_close"
        ).length;
        let total_force_value = itemsArr
          .filter((i) => i.liquidation_type === "force_close")
          .reduce(
            (sum, i) =>
              sum +
              (i.LiquidatedAssets || []).reduce((s: number, a: any) => {
                const meta = metaMap[a.token_id] || {};
                const price = prices[a.token_id]?.price || 0;
                const amount = toReadableDecimalsNumber(
                  meta.decimals || 0,
                  a.amount
                );
                return s + parseFloat(amount) * price;
              }, 0),
            0
          );
        return {
          date,
          total_liquidation_count,
          team_liquidation_count,
          community_liquidation_count,
          total_liquidation_value,
          team_liquidation_value,
          community_liquidation_value,
          total_force_count,
          total_force_value,
        };
      }
    );

    // meme margin
    let memeMarginDayAgg = Object.entries(memeMarginByDay).map(
      ([date, items]) => {
        const itemsArr = items as any[];
        let total_liquidation_count = itemsArr.length;
        let team_liquidation_count = itemsArr.filter((i) =>
          TEAM_ACCOUNTS.includes(i.liquidator_id)
        ).length;
        let community_liquidation_count =
          total_liquidation_count - team_liquidation_count;

        let total_liquidation_value = itemsArr.reduce((sum, i) => {
          if (!i.debt) return sum;
          return (
            sum +
            Object.entries(i.debt).reduce((s, [token, amount]) => {
              const meta = metaMap[token] || {};
              const price = prices[token]?.price || 0;
              const readable = parseFloat(
                toReadableDecimalsNumber(meta.decimals || 24, String(amount))
              );
              return s + readable * price;
            }, 0)
          );
        }, 0);

        let team_liquidation_value = itemsArr
          .filter((i) => TEAM_ACCOUNTS.includes(i.liquidator_id))
          .reduce((sum, i) => {
            if (!i.debt) return sum;
            return (
              sum +
              Object.entries(i.debt).reduce((s, [token, amount]) => {
                const meta = metaMap[token] || {};
                const price = prices[token]?.price || 0;
                const readable = parseFloat(
                  toReadableDecimalsNumber(meta.decimals || 24, String(amount))
                );
                return s + readable * price;
              }, 0)
            );
          }, 0);

        let community_liquidation_value =
          total_liquidation_value - team_liquidation_value;

        // liquidator profit
        let total_liquidator_profit = itemsArr.reduce((sum, i) => {
          if (!i.liquidator_profit) return sum;
          return (
            sum +
            Object.entries(i.liquidator_profit).reduce((s, [token, amount]) => {
              const meta = metaMap[token] || {};
              const price = prices[token]?.price || 0;
              const readable = parseFloat(
                toReadableDecimalsNumber(meta.decimals || 24, String(amount))
              );
              return s + readable * price;
            }, 0)
          );
        }, 0);

        let team_liquidator_profit = itemsArr
          .filter((i) => TEAM_ACCOUNTS.includes(i.liquidator_id))
          .reduce((sum, i) => {
            if (!i.liquidator_profit) return sum;
            return (
              sum +
              Object.entries(i.liquidator_profit).reduce(
                (s, [token, amount]) => {
                  const meta = metaMap[token] || {};
                  const price = prices[token]?.price || 0;
                  const readable = parseFloat(
                    toReadableDecimalsNumber(
                      meta.decimals || 24,
                      String(amount)
                    )
                  );
                  return s + readable * price;
                },
                0
              )
            );
          }, 0);

        let community_liquidator_profit =
          total_liquidator_profit - team_liquidator_profit;

        // protocol profit
        let protocol_liquidation_profit = itemsArr.reduce((sum, i) => {
          if (!i.protocol_profit) return sum;
          return (
            sum +
            Object.entries(i.protocol_profit).reduce((s, [token, amount]) => {
              const meta = metaMap[token] || {};
              const price = prices[token]?.price || 0;
              const readable = parseFloat(
                toReadableDecimalsNumber(meta.decimals || 24, String(amount))
              );
              return s + readable * price;
            }, 0)
          );
        }, 0);

        // Force Close
        let total_force_count = itemsArr.filter(
          (i) => i.pos_type === "Foreclose"
        ).length;
        let team_force_count = itemsArr.filter(
          (i) =>
            i.pos_type === "Foreclose" &&
            TEAM_ACCOUNTS.includes(i.liquidator_id)
        ).length;
        let community_force_count = total_force_count - team_force_count;

        let total_force_value = itemsArr
          .filter((i) => i.pos_type === "Foreclose")
          .reduce((sum, i) => {
            if (!i.debt) return sum;
            return (
              sum +
              Object.entries(i.debt).reduce((s, [token, amount]) => {
                const meta = metaMap[token] || {};
                const price = prices[token]?.price || 0;
                const readable = parseFloat(
                  toReadableDecimalsNumber(meta.decimals || 24, String(amount))
                );
                return s + readable * price;
              }, 0)
            );
          }, 0);

        let team_force_value = itemsArr
          .filter(
            (i) =>
              i.pos_type === "Foreclose" &&
              TEAM_ACCOUNTS.includes(i.liquidator_id)
          )
          .reduce((sum, i) => {
            if (!i.debt) return sum;
            return (
              sum +
              Object.entries(i.debt).reduce((s, [token, amount]) => {
                const meta = metaMap[token] || {};
                const price = prices[token]?.price || 0;
                const readable = parseFloat(
                  toReadableDecimalsNumber(meta.decimals || 24, String(amount))
                );
                return s + readable * price;
              }, 0)
            );
          }, 0);

        let community_force_value = total_force_value - team_force_value;

        return {
          date,
          total_liquidation_count,
          team_liquidation_count,
          community_liquidation_count,
          total_liquidation_value,
          team_liquidation_value,
          community_liquidation_value,
          total_liquidator_profit,
          team_liquidator_profit,
          community_liquidator_profit,
          protocol_liquidation_profit,
          total_force_count,
          team_force_count,
          community_force_count,
          total_force_value,
          team_force_value,
          community_force_value,
        };
      }
    );

    dayAgg = dayAgg.sort((a, b) => a.date.localeCompare(b.date));
    marginDayAgg = marginDayAgg.sort((a, b) => a.date.localeCompare(b.date));
    memeRegularDayAgg = memeRegularDayAgg.sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    memeMarginDayAgg = memeMarginDayAgg.sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    let agg = dayAgg;
    let marginAgg = marginDayAgg;
    let memeRegularAgg = memeRegularDayAgg;
    let memeMarginAgg = memeMarginDayAgg;
    if (historyType === "week") {
      agg = [];
      marginAgg = [];
      memeRegularAgg = [];
      memeMarginAgg = [];
      for (let i = 0; i < dayAgg.length; i += 7) {
        const week = dayAgg.slice(i, i + 7);
        agg.push({
          date: week[0]?.date + " ~ " + week[week.length - 1]?.date,
          total_liquidation_count: week.reduce(
            (s, d) => s + d.total_liquidation_count,
            0
          ),
          team_liquidation_count: week.reduce(
            (s, d) => s + d.team_liquidation_count,
            0
          ),
          community_liquidation_count: week.reduce(
            (s, d) => s + d.community_liquidation_count,
            0
          ),
          total_liquidation_value: week.reduce(
            (s, d) => s + d.total_liquidation_value,
            0
          ),
          team_liquidation_value: week.reduce(
            (s, d) => s + d.team_liquidation_value,
            0
          ),
          community_liquidation_value: week.reduce(
            (s, d) => s + d.community_liquidation_value,
            0
          ),
          total_force_count: week.reduce((s, d) => s + d.total_force_count, 0),
          total_force_value: week.reduce((s, d) => s + d.total_force_value, 0),
        });
      }
      for (let i = 0; i < marginDayAgg.length; i += 7) {
        const week = marginDayAgg.slice(i, i + 7);
        marginAgg.push({
          date: week[0]?.date + " ~ " + week[week.length - 1]?.date,
          total_liquidation_count: week.reduce(
            (s, d) => s + d.total_liquidation_count,
            0
          ),
          team_liquidation_count: week.reduce(
            (s, d) => s + d.team_liquidation_count,
            0
          ),
          community_liquidation_count: week.reduce(
            (s, d) => s + d.community_liquidation_count,
            0
          ),
          total_liquidation_value: week.reduce(
            (s, d) => s + d.total_liquidation_value,
            0
          ),
          team_liquidation_value: week.reduce(
            (s, d) => s + d.team_liquidation_value,
            0
          ),
          community_liquidation_value: week.reduce(
            (s, d) => s + d.community_liquidation_value,
            0
          ),
          total_liquidator_profit: week.reduce(
            (s, d) => s + d.total_liquidator_profit,
            0
          ),
          team_liquidator_profit: week.reduce(
            (s, d) => s + d.team_liquidator_profit,
            0
          ),
          community_liquidator_profit: week.reduce(
            (s, d) => s + d.community_liquidator_profit,
            0
          ),
          protocol_liquidation_profit: week.reduce(
            (s, d) => s + d.protocol_liquidation_profit,
            0
          ),
          total_force_count: week.reduce((s, d) => s + d.total_force_count, 0),
          team_force_count: week.reduce((s, d) => s + d.team_force_count, 0),
          community_force_count: week.reduce(
            (s, d) => s + d.community_force_count,
            0
          ),
          total_force_value: week.reduce((s, d) => s + d.total_force_value, 0),
          team_force_value: week.reduce((s, d) => s + d.team_force_value, 0),
          community_force_value: week.reduce(
            (s, d) => s + d.community_force_value,
            0
          ),
        });
      }
      for (let i = 0; i < memeRegularDayAgg.length; i += 7) {
        const week = memeRegularDayAgg.slice(i, i + 7);
        memeRegularAgg.push({
          date: week[0]?.date + " ~ " + week[week.length - 1]?.date,
          total_liquidation_count: week.reduce(
            (s, d) => s + d.total_liquidation_count,
            0
          ),
          team_liquidation_count: week.reduce(
            (s, d) => s + d.team_liquidation_count,
            0
          ),
          community_liquidation_count: week.reduce(
            (s, d) => s + d.community_liquidation_count,
            0
          ),
          total_liquidation_value: week.reduce(
            (s, d) => s + d.total_liquidation_value,
            0
          ),
          team_liquidation_value: week.reduce(
            (s, d) => s + d.team_liquidation_value,
            0
          ),
          community_liquidation_value: week.reduce(
            (s, d) => s + d.community_liquidation_value,
            0
          ),
          total_force_count: week.reduce((s, d) => s + d.total_force_count, 0),
          total_force_value: week.reduce((s, d) => s + d.total_force_value, 0),
        });
      }
      for (let i = 0; i < memeMarginDayAgg.length; i += 7) {
        const week = memeMarginDayAgg.slice(i, i + 7);
        memeMarginAgg.push({
          date: week[0]?.date + " ~ " + week[week.length - 1]?.date,
          total_liquidation_count: week.reduce(
            (s, d) => s + d.total_liquidation_count,
            0
          ),
          team_liquidation_count: week.reduce(
            (s, d) => s + d.team_liquidation_count,
            0
          ),
          community_liquidation_count: week.reduce(
            (s, d) => s + d.community_liquidation_count,
            0
          ),
          total_liquidation_value: week.reduce(
            (s, d) => s + d.total_liquidation_value,
            0
          ),
          team_liquidation_value: week.reduce(
            (s, d) => s + d.team_liquidation_value,
            0
          ),
          community_liquidation_value: week.reduce(
            (s, d) => s + d.community_liquidation_value,
            0
          ),
          total_liquidator_profit: week.reduce(
            (s, d) => s + d.total_liquidator_profit,
            0
          ),
          team_liquidator_profit: week.reduce(
            (s, d) => s + d.team_liquidator_profit,
            0
          ),
          community_liquidator_profit: week.reduce(
            (s, d) => s + d.community_liquidator_profit,
            0
          ),
          protocol_liquidation_profit: week.reduce(
            (s, d) => s + d.protocol_liquidation_profit,
            0
          ),
          total_force_count: week.reduce((s, d) => s + d.total_force_count, 0),
          team_force_count: week.reduce((s, d) => s + d.team_force_count, 0),
          community_force_count: week.reduce(
            (s, d) => s + d.community_force_count,
            0
          ),
          total_force_value: week.reduce((s, d) => s + d.total_force_value, 0),
          team_force_value: week.reduce((s, d) => s + d.team_force_value, 0),
          community_force_value: week.reduce(
            (s, d) => s + d.community_force_value,
            0
          ),
        });
      }
      agg = agg.slice(-7);
      marginAgg = marginAgg.slice(-7);
      memeRegularAgg = memeRegularAgg.slice(-7);
      memeMarginAgg = memeMarginAgg.slice(-7);
    }
    if (historyType === "day") {
      agg = dayAgg.slice(-7);
      marginAgg = marginDayAgg.slice(-7);
      memeRegularAgg = memeRegularDayAgg.slice(-7);
      memeMarginAgg = memeMarginDayAgg.slice(-7);
    }
    setHistoryAgg(agg);
    setMainMarginHistoryAgg(marginAgg);
    setMemeRegularHistoryAgg(memeRegularAgg);
    setMemeMarginHistoryAgg(memeMarginAgg);
    setHistoryLoading(false);
  }

  function formatUsdNoZero(n: string | number) {
    const number = Number(n || 0);
    if (number === 0) return "$0";
    if (number > 0 && number < 0.0001) return "<$0.0001";
    if (number < 0 && number > -0.0001) return ">-$0.0001";
    if (number < 0) return "-$" + Math.abs(number).toFixed(4);
    return "$" + number.toFixed(4);
  }

  if (loading) {
    return <BeatLoading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      {/* Real-time Data Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold">Real-time Data</h2>
        </div>
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
                )}{" "}
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
                )}{" "}
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
                {formatUsdNoZero(
                  dashboardData?.main_margin_tobe_forced_value || 0
                )}{" "}
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
                )}{" "}
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
                )}{" "}
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
                {formatUsdNoZero(
                  dashboardData?.meme_margin_tobe_forced_value || 0
                )}{" "}
                <span className="text-base font-normal text-gray-400">
                  value
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Historical Data (Aggregated Chart) Section */}
      <div className="mb-6 mt-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold">Historical Data</h2>
          <div>
            <button
              className={`px-4 py-2 rounded-l ${
                historyType === "day"
                  ? "bg-yellow-300 text-black"
                  : "bg-dark-200 text-gray-400 "
              } font-semibold`}
              onClick={() => {
                setHistoryLoading(true);
                setHistoryType("day");
              }}
            >
              Daily (7 days)
            </button>
            <button
              className={`px-4 py-2 rounded-r ${
                historyType === "week"
                  ? "bg-yellow-300 text-black"
                  : "bg-dark-200 text-gray-400 "
              } font-semibold`}
              onClick={() => {
                setHistoryLoading(true);
                setHistoryType("week");
              }}
            >
              Weekly (7 weeks)
            </button>
          </div>
        </div>
        {/* Chart Area */}
        <div className="grid grid-cols-2 gap-6">
          {historyLoading ? (
            <div className="col-span-2 flex items-center justify-center h-[320px] text-gray-400 text-lg">
              Loading...
            </div>
          ) : (
            <>
              {/* Main Regular Charts */}
              <div className="col-span-2">
                <h3 className="text-xl font-bold mb-4">Main Regular</h3>
                <div className="grid grid-cols-2 gap-6">
          <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
            <DashBoardEChart
                      xAxisData={historyAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
              seriesData={[
                        {
                          name: "Total",
                          data: historyAgg.map(
                            (d) => d.total_liquidation_count
                          ),
                          color: "#F6C768",
                        },
                        {
                          name: "Team",
                          data: historyAgg.map((d) => d.team_liquidation_count),
                          color: "#6D8BFF",
                        },
                        {
                          name: "Community",
                          data: historyAgg.map(
                            (d) => d.community_liquidation_count
                          ),
                          color: "#7EE8FA",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
              title="Liquidation Count"
              type="bar"
              stack={false}
            />
          </div>
          <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
            <DashBoardEChart
                      xAxisData={historyAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
              seriesData={[
                        {
                          name: "Total",
                          data: historyAgg.map(
                            (d) => d.total_liquidation_value
                          ),
                          color: "#F6C768",
                        },
                        {
                          name: "Team",
                          data: historyAgg.map((d) => d.team_liquidation_value),
                          color: "#6D8BFF",
                        },
                        {
                          name: "Community",
                          data: historyAgg.map(
                            (d) => d.community_liquidation_value
                          ),
                          color: "#7EE8FA",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
              title="Liquidation Value (USD)"
              type="bar"
              stack={false}
            />
          </div>
          <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
            <DashBoardEChart
                      xAxisData={historyAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
              seriesData={[
                        {
                          name: "Force Close Count",
                          data: historyAgg.map((d) => d.total_force_count),
                          color: "#F6C768",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
              title="Force Close Count"
              type="bar"
              singleBar={true}
            />
          </div>
          <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
            <DashBoardEChart
                      xAxisData={historyAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
              seriesData={[
                        {
                          name: "Force Close Value",
                          data: historyAgg.map((d) => d.total_force_value),
                          color: "#F6C768",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
              title="Force Close Value (USD)"
              type="bar"
              singleBar={true}
            />
          </div>
                </div>
              </div>

              {/* Main Margin Charts */}
              <div className="col-span-2 mt-8">
                <h3 className="text-xl font-bold mb-4">Main Margin</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={mainMarginHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Total",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.total_liquidation_count
                          ),
                          color: "#F6C768",
                        },
                        {
                          name: "Team",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.team_liquidation_count
                          ),
                          color: "#6D8BFF",
                        },
                        {
                          name: "Community",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.community_liquidation_count
                          ),
                          color: "#7EE8FA",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Liquidation Count"
                      type="bar"
                      stack={false}
                    />
                  </div>
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={mainMarginHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Total",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.total_liquidation_value
                          ),
                          color: "#F6C768",
                        },
                        {
                          name: "Team",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.team_liquidation_value
                          ),
                          color: "#6D8BFF",
                        },
                        {
                          name: "Community",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.community_liquidation_value
                          ),
                          color: "#7EE8FA",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Liquidation Value (USD)"
                      type="bar"
                      stack={false}
                    />
                  </div>
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={mainMarginHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Total",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.total_liquidator_profit
                          ),
                          color: "#F6C768",
                        },
                        {
                          name: "Team",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.team_liquidator_profit
                          ),
                          color: "#6D8BFF",
                        },
                        {
                          name: "Community",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.community_liquidator_profit
                          ),
                          color: "#7EE8FA",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Liquidator Profit (USD)"
                      type="bar"
                      stack={false}
                    />
                  </div>
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={mainMarginHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Protocol Profit",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.protocol_liquidation_profit
                          ),
                          color: "#F6C768",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Protocol Profit (USD)"
                      type="bar"
                      singleBar={true}
                    />
                  </div>
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={mainMarginHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Total",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.total_force_count
                          ),
                          color: "#F6C768",
                        },
                        {
                          name: "Team",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.team_force_count
                          ),
                          color: "#6D8BFF",
                        },
                        {
                          name: "Community",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.community_force_count
                          ),
                          color: "#7EE8FA",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Force Close Count"
                      type="bar"
                      stack={false}
                    />
                  </div>
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={mainMarginHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Total",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.total_force_value
                          ),
                          color: "#F6C768",
                        },
                        {
                          name: "Team",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.team_force_value
                          ),
                          color: "#6D8BFF",
                        },
                        {
                          name: "Community",
                          data: mainMarginHistoryAgg.map(
                            (d) => d.community_force_value
                          ),
                          color: "#7EE8FA",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Force Close Value (USD)"
                      type="bar"
                      stack={false}
                    />
                  </div>
                </div>
              </div>

              {/* Meme Regular Charts */}
              <div className="col-span-2 mt-8">
                <h3 className="text-xl font-bold mb-4">Meme Regular</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={memeRegularHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Total",
                          data: memeRegularHistoryAgg.map(
                            (d) => d.total_liquidation_count
                          ),
                          color: "#F6C768",
                        },
                        {
                          name: "Team",
                          data: memeRegularHistoryAgg.map(
                            (d) => d.team_liquidation_count
                          ),
                          color: "#6D8BFF",
                        },
                        {
                          name: "Community",
                          data: memeRegularHistoryAgg.map(
                            (d) => d.community_liquidation_count
                          ),
                          color: "#7EE8FA",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Liquidation Count"
                      type="bar"
                      stack={false}
                    />
                  </div>
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={memeRegularHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Total",
                          data: memeRegularHistoryAgg.map(
                            (d) => d.total_liquidation_value
                          ),
                          color: "#F6C768",
                        },
                        {
                          name: "Team",
                          data: memeRegularHistoryAgg.map(
                            (d) => d.team_liquidation_value
                          ),
                          color: "#6D8BFF",
                        },
                        {
                          name: "Community",
                          data: memeRegularHistoryAgg.map(
                            (d) => d.community_liquidation_value
                          ),
                          color: "#7EE8FA",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Liquidation Value (USD)"
                      type="bar"
                      stack={false}
                    />
                  </div>
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={memeRegularHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Force Close Count",
                          data: memeRegularHistoryAgg.map(
                            (d) => d.total_force_count
                          ),
                          color: "#F6C768",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Force Close Count"
                      type="bar"
                      singleBar={true}
                    />
                  </div>
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={memeRegularHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Force Close Value",
                          data: memeRegularHistoryAgg.map(
                            (d) => d.total_force_value
                          ),
                          color: "#F6C768",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Force Close Value (USD)"
                      type="bar"
                      singleBar={true}
                    />
                  </div>
                </div>
              </div>

              {/* Meme Margin Charts */}
              <div className="col-span-2 mt-8">
                <h3 className="text-xl font-bold mb-4">Meme Margin</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={memeMarginHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Total",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.total_liquidation_count
                          ),
                          color: "#F6C768",
                        },
                        {
                          name: "Team",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.team_liquidation_count
                          ),
                          color: "#6D8BFF",
                        },
                        {
                          name: "Community",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.community_liquidation_count
                          ),
                          color: "#7EE8FA",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Liquidation Count"
                      type="bar"
                      stack={false}
                    />
                  </div>
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={memeMarginHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Total",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.total_liquidation_value
                          ),
                          color: "#F6C768",
                        },
                        {
                          name: "Team",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.team_liquidation_value
                          ),
                          color: "#6D8BFF",
                        },
                        {
                          name: "Community",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.community_liquidation_value
                          ),
                          color: "#7EE8FA",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Liquidation Value (USD)"
                      type="bar"
                      stack={false}
                    />
                  </div>
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={memeMarginHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Total",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.total_liquidator_profit
                          ),
                          color: "#F6C768",
                        },
                        {
                          name: "Team",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.team_liquidator_profit
                          ),
                          color: "#6D8BFF",
                        },
                        {
                          name: "Community",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.community_liquidator_profit
                          ),
                          color: "#7EE8FA",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Liquidator Profit (USD)"
                      type="bar"
                      stack={false}
                    />
                  </div>
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={memeMarginHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Protocol Profit",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.protocol_liquidation_profit
                          ),
                          color: "#F6C768",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Protocol Profit (USD)"
                      type="bar"
                      singleBar={true}
                    />
                  </div>
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={memeMarginHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Total",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.total_force_count
                          ),
                          color: "#F6C768",
                        },
                        {
                          name: "Team",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.team_force_count
                          ),
                          color: "#6D8BFF",
                        },
                        {
                          name: "Community",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.community_force_count
                          ),
                          color: "#7EE8FA",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Force Close Count"
                      type="bar"
                      stack={false}
                    />
                  </div>
                  <div className="bg-dark-200 bg-opacity-50 p-5 rounded-xl min-h-[320px]">
                    <DashBoardEChart
                      xAxisData={memeMarginHistoryAgg.map(
                        (d) => (() => {
                          const dateStr = d.date.split(" ~ ")[0];
                          const date = new Date(dateStr + "T00:00:00");
                          return date.getTime() / 1000;
                        })()
                      )}
                      seriesData={[
                        {
                          name: "Total",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.total_force_value
                          ),
                          color: "#F6C768",
                        },
                        {
                          name: "Team",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.team_force_value
                          ),
                          color: "#6D8BFF",
                        },
                        {
                          name: "Community",
                          data: memeMarginHistoryAgg.map(
                            (d) => d.community_force_value
                          ),
                          color: "#7EE8FA",
                        },
                      ]}
                      timeUnit={historyType === "day" ? "day" : "week"}
                      title="Force Close Value (USD)"
                      type="bar"
                      stack={false}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
