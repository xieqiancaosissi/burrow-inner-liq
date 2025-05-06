import React, { useEffect, useState } from "react";
import { getMarginLiquidateLog } from "@/services/api";
import ReactPaginate from "react-paginate";
import { formatTimestamp } from "@/utils/time";
import { getPerice } from "@/services/api";
import { ftGetTokenMetadata } from "@/services/near";
import { toReadableDecimalsNumber } from "@/utils/number";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CopyIcon, SortIcon } from "../Icons";
import { BeatLoading } from "../Loading";

function shortId(id: string) {
  if (!id) return "-";
  if (id.length <= 12) return id;
  return id.slice(0, 6) + "..." + id.slice(-4);
}

export default function MarginMemeHistory({
  contractId,
}: {
  contractId: string;
}) {
  const [data, setData] = useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [sizeCount, setSizeCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tokenMetas, setTokenMetas] = useState<any>({});
  const [tokenPrices, setTokenPrices] = useState<any>({});
  const [showCopyTooltip, setShowCopyTooltip] = useState<
    Record<string, boolean>
  >({});
  const [sortField, setSortField] = useState<string>("block_timestamp");
  const [sortDirection, setSortDirection] = useState<string>("desc");

  useEffect(() => {
    fetchData(currentPage + 1);
    // eslint-disable-next-line
  }, [currentPage, contractId, sortField, sortDirection]);

  useEffect(() => {
    async function fetchTokenInfo() {
      const tokenIds = new Set<string>();
      data.forEach((row) => {
        Object.keys(row.debt || {}).forEach((id) => tokenIds.add(id));
        Object.keys(row.collateral || {}).forEach((id) => tokenIds.add(id));
        Object.keys(row.liquidator_profit || {}).forEach((id) =>
          tokenIds.add(id)
        );
      });
      const metas = await Promise.all(
        Array.from(tokenIds).map((id) => ftGetTokenMetadata(id))
      );
      const metaMap: Record<string, any> = {};
      Array.from(tokenIds).forEach((id, idx) => (metaMap[id] = metas[idx]));
      setTokenMetas(metaMap);
      const prices = await getPerice();
      setTokenPrices(prices);
    }
    fetchTokenInfo();
  }, [data]);

  async function fetchData(page: number) {
    setLoading(true);
    const res = await getMarginLiquidateLog(
      page,
      10,
      sortField,
      sortDirection,
      contractId
    );
    if (res && res.data) {
      setData(res.data.record_list || []);
      setPageCount(res.data.total_page || 0);
      setSizeCount(res.data.total_size || 0);
    }
    setLoading(false);
  }

  const handlePageClick = (data: {
    selected: React.SetStateAction<number>;
  }) => {
    setCurrentPage(data.selected);
  };

  const handleCopy = (identifier: string) => {
    setShowCopyTooltip((prevState) => ({ ...prevState, [identifier]: true }));
    setTimeout(() => {
      setShowCopyTooltip((prevState) => ({
        ...prevState,
        [identifier]: false,
      }));
    }, 500);
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(0);
  };

  // Format the blockchain timestamp correctly
  const formatBlockTimestamp = (timestamp: number | string) => {
    if (!timestamp) return "-";

    let nanoseconds: number;
    if (typeof timestamp === "string") {
      nanoseconds = Number(timestamp);
    } else {
      nanoseconds = timestamp;
    }

    const milliseconds = Math.floor(nanoseconds / 1000000);
    const date = new Date(milliseconds);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Format asset display like in MarginMemeLiquidation
  const formatAsset = (
    token: string,
    amount: string,
    meta: any,
    price: number
  ) => {
    const decimals = meta.decimals || 24;
    const readable = parseFloat(
      toReadableDecimalsNumber(decimals, String(amount))
    ).toFixed(4);
    const value =
      price > 0 ? (parseFloat(readable) * price).toFixed(5) : "0.00000";
    const symbol = meta.symbol || shortId(token);

    return (
      <div key={token} className="whitespace-nowrap">
        <div>{symbol}</div>
        <div className="text-gray-400 text-sm">
          {readable} (${value})
        </div>
      </div>
    );
  };

  return (
    <div
      className="text-white bg-dark-200 rounded-lg"
      style={{ maxWidth: "76vw", margin: "30px auto 50px auto" }}
    >
      <div
        className="flex items-center border-b border-dark-100 px-6 text-purple-50 text-lg font-bold"
        style={{ height: "60px" }}
      >
        {contractId === "contract.main.burrow.near"
          ? "History Meme Liquidation"
          : "History Meme Margin Liquidation"}{" "}
        (Total: {sizeCount})
      </div>
      {loading ? (
        <BeatLoading />
      ) : (
        <div className="overflow-auto w-full" style={{ maxHeight: "84vh" }}>
          <table className="commonTable">
            <thead>
              <tr>
                <th>Account ID</th>
                <th>Liquidator</th>
                <th>Debt</th>
                <th>Collateral</th>
                <th>Liquidator Profit</th>
                <th>
                  <div
                    className="flex items-center gap-1.5 cursor-pointer"
                    onClick={() => handleSort("block_timestamp")}
                  >
                    Time
                    <SortComponent
                      keyName="block_timestamp"
                      sortKey={sortField}
                      sortDirection={sortDirection}
                    />
                  </div>
                </th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-dark-250 border-b border-dark-100"
                  >
                    <td className="w-[200px] whitespace-nowrap">
                      <div className="flex items-center relative cursor-pointer">
                        <div className="justify-self-start overflow-hidden w-32 whitespace-nowrap text-ellipsis">
                          <span>{row.account_id}</span>
                        </div>
                        <CopyToClipboard
                          text={row.account_id}
                          onCopy={() => handleCopy(`account_${idx}`)}
                        >
                          <CopyIcon />
                        </CopyToClipboard>
                        {showCopyTooltip[`account_${idx}`] && (
                          <span className="absolute -top-6 bg-black text-white text-xs py-1 px-2 rounded">
                            Copied!
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="w-[200px] whitespace-nowrap">
                      <div className="flex items-center relative cursor-pointer">
                        <div className="justify-self-start overflow-hidden w-32 whitespace-nowrap text-ellipsis">
                          <span>{row.liquidator_id}</span>
                        </div>
                        <CopyToClipboard
                          text={row.liquidator_id}
                          onCopy={() => handleCopy(`liquidator_${idx}`)}
                        >
                          <CopyIcon />
                        </CopyToClipboard>
                        {showCopyTooltip[`liquidator_${idx}`] && (
                          <span className="absolute -top-6 bg-black text-white text-xs py-1 px-2 rounded">
                            Copied!
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="w-[240px] whitespace-nowrap">
                      {row.debt && Object.entries(row.debt).length > 0 ? (
                        Object.entries(row.debt).map(([token, amount]) =>
                          formatAsset(
                            token,
                            String(amount),
                            tokenMetas[token] || {},
                            tokenPrices[token]?.price || 0
                          )
                        )
                      ) : (
                        <div className="text-gray-400">None</div>
                      )}
                    </td>
                    <td className="w-[240px] whitespace-nowrap">
                      {row.collateral &&
                      Object.entries(row.collateral).length > 0 ? (
                        Object.entries(row.collateral).map(([token, amount]) =>
                          formatAsset(
                            token,
                            String(amount),
                            tokenMetas[token] || {},
                            tokenPrices[token]?.price || 0
                          )
                        )
                      ) : (
                        <div className="text-gray-400">None</div>
                      )}
                    </td>
                    <td className="w-[260px] whitespace-nowrap">
                      {row.liquidator_profit &&
                      Object.entries(row.liquidator_profit).length > 0 ? (
                        Object.entries(row.liquidator_profit).map(
                          ([token, amount]) =>
                            formatAsset(
                              token,
                              String(amount),
                              tokenMetas[token] || {},
                              tokenPrices[token]?.price || 0
                            )
                        )
                      ) : (
                        <div className="text-gray-400">None</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {formatBlockTimestamp(row.block_timestamp)}
                    </td>
                    <td className="whitespace-nowrap">
                      <span
                        className={`${
                          row.pos_type === "Liquidate"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {row.pos_type}
                      </span>
                    </td>
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
      )}
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination-container"}
        activeClassName={"active-page"}
      />
    </div>
  );
}

function SortComponent(props: any) {
  const { sortKey, sortDirection, keyName } = props;
  if (keyName !== sortKey) {
    return <SortIcon className="text-white text-opacity-30" />;
  } else if (sortDirection === "asc") {
    return <SortIcon className="text-white transform rotate-180" />;
  } else {
    return <SortIcon className="text-white" />;
  }
}
