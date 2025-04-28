import React, { useEffect, useState } from "react";
import { getPendingMemeData } from "../services/api";
import { formatTimestamp } from "@/utils/time";
import { BeatLoading } from "./Loading";

interface PendingMemeData {
  debt_ratio: string;
  debt: {
    token_id: string;
    amount: string;
  };
  collateral: {
    token_id: string;
    amount: string;
  };
  position: {
    token_id: string;
    amount: string;
  };
  "liq profit/fc loss": string;
  safty_buffer: string;
  type: string;
}

function shortId(id: string) {
  if (!id) return "-";
  if (id.length <= 12) return id;
  return id.slice(0, 6) + "..." + id.slice(-4);
}

export default function PendingMeme() {
  const [data, setData] = useState<PendingMemeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPendingMemeData();
        setData(result);
        setTimestamp(Date.now());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

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
        Pending Meme Liquidation (Total: {data.length})
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
            {data.map((item, index) => (
              <tr key={index}>
                <td className="w-[200px]">{item.position.token_id}</td>
                <td>{parseFloat(item.debt_ratio).toFixed(4)}</td>
                <td className="w-[200px]">{shortId(item.debt.token_id)}</td>
                <td className="w-[200px]">
                  {shortId(item.collateral.token_id)}
                </td>
                <td>{parseFloat(item["liq profit/fc loss"]).toFixed(4)}</td>
                <td>{item.safty_buffer}</td>
                <td>{item.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
