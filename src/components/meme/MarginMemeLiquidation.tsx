import React, { useEffect, useState } from "react";
import { formatTimestamp } from "@/utils/time";
import { getLiquidations, getPerice } from "@/services/api";
import { BeatLoading } from "../Loading";
import { toReadableDecimalsNumber } from "@/utils/number";
import { NEAR_META_DATA } from "../Icons";
import { ftGetTokenMetadata } from "@/services/near";
import { TokenMetadata } from "@/interface/common";

interface PendingMemeData {
  debt_ratio: string;
  debt: {
    token_id: string;
    amount: string;
    value?: string;
    decimals?: number;
    symbol?: string;
  };
  collateral: {
    token_id: string;
    amount: string;
    value?: string;
    decimals?: number;
    symbol?: string;
  };
  position: {
    token_id: string;
    amount: string;
    value?: string;
    decimals?: number;
    symbol?: string;
  };
  "liq profit/fc loss": string;
  safty_buffer: string;
  type: string;
}

interface TokenPrice {
  price: number;
}

function shortId(id: string) {
  if (!id) return "-";
  if (id.length <= 12) return id;
  return id.slice(0, 6) + "..." + id.slice(-4);
}

export default function MarginMemeLiquidation() {
  const [data, setData] = useState<PendingMemeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [allTokenPrices, setAllTokenPrices] = useState<
    Record<string, TokenPrice>
  >({});
  const [allTokenMetadatas, setAllTokenMetadatas] = useState<
    Record<string, TokenMetadata>
  >({});

  useEffect(() => {
    get_allPerice_data();
  }, []);

  const get_allPerice_data = async () => {
    const prices = await getPerice();
    setAllTokenPrices(prices);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLiquidations(
          "LiquidatableMarginPositions",
          "meme-burrow.ref-labs.near"
        );

        const tokenIds = new Set<string>();
        result.data.forEach((item: any) => {
          tokenIds.add(item.debt.token_id);
          tokenIds.add(item.collateral.token_id);
          tokenIds.add(item.position.token_id);
        });

        const metadataPromises = Array.from(tokenIds).map(async (tokenId) => {
          return ftGetTokenMetadata(tokenId);
        });
        const metadatas = await Promise.all(metadataPromises);
        const metadataMap = metadatas.reduce<Record<string, TokenMetadata>>(
          (acc, metadata, index) => {
            const tokenId = Array.from(tokenIds)[index];
            if (tokenId) {
              acc[tokenId] = metadata;
            }
            return acc;
          },
          {}
        );
        setAllTokenMetadatas(metadataMap);

        const marginData = result.data.map((item: any) => {
          const processAsset = (asset: any) => {
            const tokenMetadata =
              asset.token_id === "wrap.near"
                ? NEAR_META_DATA
                : metadataMap[asset.token_id] || {};
            const tokenPrice = allTokenPrices[asset.token_id];
            const decimals = tokenMetadata?.decimals || 24;
            const amount = toReadableDecimalsNumber(decimals, asset.amount);
            const value = tokenPrice
              ? (parseFloat(amount) * tokenPrice.price).toFixed(5)
              : "0.00000";

            return {
              ...asset,
              amount: parseFloat(amount).toFixed(4),
              value,
              decimals,
              symbol: tokenMetadata?.symbol || shortId(asset.token_id),
            };
          };

          return {
            debt_ratio: item.debt_ratio,
            debt: processAsset(item.debt),
            collateral: processAsset(item.collateral),
            position: processAsset(item.position),
            "liq profit/fc loss": item["liq profit/fc loss"],
            safty_buffer: item.safty_buffer,
            type: item.type,
          };
        });
        setData(marginData);
        setTimestamp(result.timestamp);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [allTokenPrices]);

  if (loading) {
    return <BeatLoading />;
  }

  return (
    <div
      className="text-white bg-dark-200 rounded-lg"
      style={{ maxWidth: "60vw", margin: "30px auto 50px auto" }}
    >
      <div
        className="flex items-center border-b border-dark-100 px-6 text-purple-50 text-lg font-bold"
        style={{ height: "60px" }}
      >
        Pending Meme Margin Liquidation (Total: {data.length})
        <p className="ml-2">
          {timestamp !== null ? formatTimestamp(timestamp) : ""}
        </p>
      </div>
      <div className="overflow-auto w-full" style={{ maxHeight: "84vh" }}>
        <table className="commonTable">
          <thead>
            <tr>
              <th>Position</th>
              <th>Debt Ratio</th>
              <th>Debt</th>
              <th>Collateral</th>
              <th>Liq Profit/FC Loss</th>
              <th>Safety Buffer</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td className="w-[300px] whitespace-nowrap">
                    <div>{item.position.symbol}</div>
                    <div className="text-gray-400 text-sm">
                      {item.position.amount} (${item.position.value})
                    </div>
                  </td>
                  <td className="w-[100px] whitespace-nowrap">
                    {parseFloat(item.debt_ratio).toFixed(4)}
                  </td>
                  <td className="w-[200px] whitespace-nowrap">
                    <div>{item.debt.symbol}</div>
                    <div className="text-gray-400 text-sm">
                      {item.debt.amount} (${item.debt.value})
                    </div>
                  </td>
                  <td className="w-[200px] whitespace-nowrap">
                    <div>{item.collateral.symbol}</div>
                    <div className="text-gray-400 text-sm">
                      {item.collateral.amount} (${item.collateral.value})
                    </div>
                  </td>
                  <td className="w-[160px] whitespace-nowrap">
                    {parseFloat(item["liq profit/fc loss"]).toFixed(4)}
                  </td>
                  <td className="w-[120px] whitespace-nowrap">
                    {item.safty_buffer}
                  </td>
                  <td className="w-[100px] whitespace-nowrap">{item.type}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
