import React, { useState, useEffect } from "react";
import { ftGetTokenMetadata } from "../services/near";
import { toReadableNumber } from "../utils/number";

interface AirdropRecord {
  account_id: string;
  airdrop_balance: string;
  rhea_balance: string;
  stake_rhea_balance: string;
  lp_balance: string;
  lock_boost_balance: string;
  lending_balance: string;
  index_number: number;
  timestamp: number;
}

interface ApiResponse {
  record_list: AirdropRecord[];
  page_number: number;
  page_size: number;
  total_page: number;
  total_size: number;
}

interface TokenMetadata {
  id: string;
  name: string;
  decimals?: number;
}

interface UserAirdropData {
  account_id: string;
  airdrop_balance: string;
  timeSeriesData: {
    [date: string]: {
      rhea_balance: string;
      stake_rhea_balance: string;
      lp_balance: string;
      lock_boost_balance: string;
      lending_balance: string;
      total_balance: string;
      timestamp: number;
    };
  };
}

const TIME_PERIODS = [
  { label: "1 Week", days: 7 },
  { label: "2 Weeks", days: 14 },
  { label: "3 Weeks", days: 21 },
  { label: "4 Weeks", days: 28 },
];

const AirdropPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7);
  const [allAirdropRecords, setAllAirdropRecords] = useState<AirdropRecord[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenMetadata, setTokenMetadata] = useState<{ [key: string]: any }>(
    {}
  );
  const [userAirdropData, setUserAirdropData] = useState<UserAirdropData[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [totalAirdropAmount, setTotalAirdropAmount] = useState<string>("0");
  // 添加排序状态
  const [airdropSortOrder, setAirdropSortOrder] = useState<"asc" | "desc">(
    "desc"
  );

  // Fetch token metadata
  const fetchTokenMetadata = async (tokenId: string) => {
    try {
      const metadata = await ftGetTokenMetadata(tokenId);
      console.log(`Successfully fetched metadata for ${tokenId}:`, metadata);
      setTokenMetadata((prev) => ({
        ...prev,
        [tokenId]: metadata,
      }));
    } catch (error) {
      console.error(`Failed to fetch metadata for ${tokenId}:`, error);
    }
  };

  // Fetch all airdrop data with pagination
  const fetchAllAirdropData = async () => {
    setLoading(true);
    try {
      let allRecords: AirdropRecord[] = [];
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await fetch(
          `https://api.ref.finance/rhea_token_data?page_number=${currentPage}&page_size=1000`
        );
        const data: ApiResponse = await response.json();

        allRecords = [...allRecords, ...data.record_list];

        if (currentPage >= data.total_page) {
          hasMorePages = false;
        } else {
          currentPage++;
        }
      }

      setAllAirdropRecords(allRecords);

      // Fetch Rhea token metadata first
      await fetchTokenMetadata("token.rhealab.near");
    } catch (error) {
      console.error("Failed to fetch airdrop data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Process data and organize by time
  useEffect(() => {
    if (allAirdropRecords.length > 0) {
      // Group by date based on actual data, not fixed time period
      const dateGroups: { [key: string]: AirdropRecord[] } = {};
      const dates: string[] = [];

      allAirdropRecords.forEach((record) => {
        const date = new Date(record.timestamp * 1000).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }
        );
        if (!dateGroups[date]) {
          dateGroups[date] = [];
          dates.push(date);
        }
        dateGroups[date].push(record);
      });

      // Sort dates (newest first)
      dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      setAvailableDates(dates);

      console.log("Date groups:", {
        dates,
        sampleDateGroup: dateGroups[dates[0]]?.slice(0, 3), // 显示第一个日期的前3条记录
      });

      // Build user airdrop data
      const userData: { [key: string]: UserAirdropData } = {};

      // First, get all unique users from airdrop records
      allAirdropRecords.forEach((record) => {
        if (!userData[record.account_id]) {
          userData[record.account_id] = {
            account_id: record.account_id,
            airdrop_balance: record.airdrop_balance,
            timeSeriesData: {},
          };
        }
      });

      // Then, populate time series data for each date
      dates.forEach((date) => {
        const dateRecords = dateGroups[date];
        dateRecords.forEach((record) => {
          if (userData[record.account_id]) {
            // 使用 toReadableNumber 根据 decimals 转换为可读数字
            const metadata = tokenMetadata["token.rhealab.near"];
            let rheaNum = 0,
              stakedNum = 0,
              lpNum = 0,
              lockNum = 0,
              lendingNum = 0;

            if (metadata && metadata.decimals !== undefined) {
              try {
                rheaNum = parseFloat(
                  toReadableNumber(
                    metadata.decimals,
                    record.rhea_balance || "0"
                  )
                );
                stakedNum = parseFloat(
                  toReadableNumber(
                    metadata.decimals,
                    record.stake_rhea_balance || "0"
                  )
                );
                lpNum = parseFloat(
                  toReadableNumber(metadata.decimals, record.lp_balance || "0")
                );
                lockNum = parseFloat(
                  toReadableNumber(
                    metadata.decimals,
                    record.lock_boost_balance || "0"
                  )
                );
                lendingNum = parseFloat(
                  toReadableNumber(
                    metadata.decimals,
                    record.lending_balance || "0"
                  )
                );
              } catch (error) {
                console.error("Error converting to readable number:", error);
              }
            } else {
              rheaNum = parseFloat(record.rhea_balance || "0");
              stakedNum = parseFloat(record.stake_rhea_balance || "0");
              lpNum = parseFloat(record.lp_balance || "0");
              lockNum = parseFloat(record.lock_boost_balance || "0");
              lendingNum = parseFloat(record.lending_balance || "0");
            }
            const totalBalance =
              rheaNum + stakedNum + lpNum + lockNum + lendingNum;
            let formattedTotalBalance = totalBalance.toString();
            if (formattedTotalBalance.includes("e")) {
              const num = parseFloat(formattedTotalBalance);
              if (num < 0.01 && num > 0) {
                formattedTotalBalance = "0.00";
              } else if (num === 0) {
                formattedTotalBalance = "0.00";
              } else {
                formattedTotalBalance = num.toFixed(4);
              }
            } else {
              formattedTotalBalance = parseFloat(
                totalBalance.toFixed(2)
              ).toString();
            }
            userData[record.account_id].timeSeriesData[date] = {
              rhea_balance: record.rhea_balance || "0",
              stake_rhea_balance: record.stake_rhea_balance || "0",
              lp_balance: record.lp_balance || "0",
              lock_boost_balance: record.lock_boost_balance || "0",
              lending_balance: record.lending_balance || "0",
              total_balance: formattedTotalBalance,
              timestamp: record.timestamp,
            };
          }
        });
      });

      const userDataArray = Object.values(userData);
      
      // 数据加载完成后立即应用排序
      const sortedData = sortUserAirdropData(userDataArray, airdropSortOrder);
      setUserAirdropData(sortedData);
      
      if (userDataArray.length > 0) {
        console.log("First user complete data:", userDataArray[0]);
      }
    }
  }, [allAirdropRecords, tokenMetadata, airdropSortOrder]);

  // 单独计算 Total Airdrop Amount
  useEffect(() => {
    if (allAirdropRecords.length > 0 && tokenMetadata["token.rhealab.near"]) {
      const metadata = tokenMetadata["token.rhealab.near"];
      let totalAmount = 0;

      if (metadata.decimals !== undefined) {
        // 添加调试信息
        console.log("Calculating total airdrop amount with metadata:", {
          decimals: metadata.decimals,
          totalRecords: allAirdropRecords.length,
          sampleRecords: allAirdropRecords.slice(0, 3).map((r) => ({
            account_id: r.account_id,
            airdrop_balance: r.airdrop_balance,
            readable: toReadableNumber(
              metadata.decimals,
              r.airdrop_balance || "0"
            ),
          })),
        });

        totalAmount = allAirdropRecords.reduce((sum, record) => {
          try {
            const readableNumber = parseFloat(
              toReadableNumber(metadata.decimals, record.airdrop_balance || "0")
            );
            console.log(
              `User ${record.account_id}: ${record.airdrop_balance} -> ${readableNumber}`
            );
            return sum + readableNumber;
          } catch (error) {
            console.error("Error calculating total airdrop amount:", error);
            return sum;
          }
        }, 0);
      }

      console.log("Final total airdrop amount:", {
        totalAmount,
        decimals: metadata.decimals,
        formatted: formatNumberWithSuffix(totalAmount),
      });

      setTotalAirdropAmount(totalAmount.toString());
    }
  }, [allAirdropRecords, tokenMetadata]);

  // 排序函数
  const sortUserAirdropData = (
    data: UserAirdropData[],
    order: "asc" | "desc"
  ) => {
    return [...data].sort((a, b) => {
      const airdropA = parseFloat(
        toReadableNumber(
          tokenMetadata["token.rhealab.near"]?.decimals || 18,
          a.airdrop_balance || "0"
        )
      );
      const airdropB = parseFloat(
        toReadableNumber(
          tokenMetadata["token.rhealab.near"]?.decimals || 18,
          b.airdrop_balance || "0"
        )
      );

      if (order === "asc") {
        return airdropA - airdropB; // 正序：从小到大
      } else {
        return airdropB - airdropA; // 倒序：从大到小
      }
    });
  };

  // 处理排序变化
  const handleAirdropSort = () => {
    const newOrder = airdropSortOrder === "asc" ? "desc" : "asc";
    setAirdropSortOrder(newOrder);

    // 重新排序数据
    const sortedData = sortUserAirdropData(userAirdropData, newOrder);
    setUserAirdropData(sortedData);
  };

  // Format balance using metadata
  const formatBalance = (
    balance: string,
    tokenId: string = "token.rhealab.near"
  ) => {
    const metadata = tokenMetadata[tokenId];

    if (metadata && metadata.decimals !== undefined) {
      try {
        const readableNumber = toReadableNumber(metadata.decimals, balance);
        const num = parseFloat(readableNumber);
        return formatNumberWithSuffix(num);
      } catch (error) {
        console.error(`Error formatting balance with decimals:`, error);
      }
    }

    // Fallback to original formatting
    try {
      const num = parseFloat(balance);
      if (isNaN(num)) return "-";
      return formatNumberWithSuffix(num);
    } catch (error) {
      console.error(`Error in fallback formatting:`, error);
      return "-";
    }
  };

  // Format number with suffix
  const formatNumberWithSuffix = (num: number): string => {
    if (num === 0) return "0";
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + "B";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + "M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + "K";
    }
    return num.toFixed(2);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllAirdropData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6 w-full">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Airdrop Token Flow Tracking
          </h1>
          <p className="text-gray-400">
            Track the flow and distribution of airdropped Rhea tokens across
            user accounts over time
          </p>
        </div>

        {/* Controls and Statistics */}
        <div className="flex items-center justify-between gap-6 mb-6">
          {/* Time Period Selector */}
          <div className="flex items-center gap-4">
            <label className="text-gray-300 text-sm font-medium">
              Time Period:
            </label>
            <div className="flex gap-2">
              {TIME_PERIODS.map((period) => (
                <button
                  key={period.days}
                  onClick={() => setSelectedPeriod(period.days)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPeriod === period.days
                      ? "bg-[#00F7A5] text-[#14162B] shadow-lg"
                      : "bg-[#25252C] text-gray-300 hover:bg-[#303037] border border-[#303037]"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Total Airdrop Amount */}
          <div className="">
            <div className="text-gray-400 text-sm mb-1">
              Total Airdrop Amount
            </div>
            <div className="text-2xl font-bold text-[#00F7A5]">32.43M</div>
          </div>

          {/* Claimed Airdrop  */}

          <div className="">
            <div className="text-gray-400 text-sm mb-1">
              Claimed Airdrop Amount
            </div>
            <div className="text-2xl font-bold text-[#00F7A5]">
              {(() => {
                const num = parseFloat(totalAirdropAmount);
                if (isNaN(num)) return "0";
                return formatNumberWithSuffix(num);
              })()}
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchAllAirdropData}
            disabled={loading}
            className="px-6 py-3 bg-[#00F7A5] text-[#14162B] rounded-lg hover:bg-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-lg"
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F7A5]"></div>
            <p className="mt-4 text-gray-400 text-lg">Loading data...</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && userAirdropData.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-[#303037]">
            <div className="px-6 py-4 border-b border-[#303037]">
              <h3 className="text-xl font-semibold text-white">
                Airdrop vs Time Series Data Comparison
                <span className="text-sm text-gray-400 ml-4">
                  Showing {userAirdropData.length} users over{" "}
                  {availableDates.length} days
                </span>
              </h3>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
              <table className="w-full">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-[#1A1A1F]">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 tracking-wider sticky left-0 z-30 bg-[#1A1A1F] min-w-[200px]">
                      User ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 tracking-wider sticky left-[200px] z-30 bg-[#1A1A1F] min-w-[160px]">
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                        onClick={handleAirdropSort}
                      >
                        <span>Airdrop</span>
                        <div className="flex flex-col text-[10px]">
                          <span
                            className={`${
                              airdropSortOrder === "asc"
                                ? "text-[#00F7A5]"
                                : "text-gray-500"
                            }`}
                          >
                            ▲
                          </span>
                          <span
                            className={`${
                              airdropSortOrder === "desc"
                                ? "text-[#00F7A5]"
                                : "text-gray-500"
                            }`}
                            style={{ marginTop: "-4px" }}
                          >
                            ▼
                          </span>
                        </div>
                      </div>
                    </th>
                    {availableDates.map((date, index) => (
                      <th
                        key={date}
                        className={`px-6 py-4 text-left text-xs font-medium text-gray-300 tracking-wider min-w-[200px] bg-[#1A1A1F] ${
                          index === 0 ? "sticky left-[350px] z-30" : ""
                        }`}
                      >
                        <div className="font-medium">{date}</div>
                        <div className="text-xs text-gray-400">
                          Total:{" "}
                          {(() => {
                            // 计算该日期所有用户的总和
                            const metadata =
                              tokenMetadata["token.rhealab.near"];
                            if (metadata && metadata.decimals !== undefined) {
                              try {
                                let dateTotal = 0;
                                userAirdropData.forEach((user) => {
                                  const dateData = user.timeSeriesData[date];
                                  if (dateData) {
                                    // 重新计算每个用户在该日期的总和
                                    const rheaNum = parseFloat(
                                      toReadableNumber(
                                        metadata.decimals,
                                        dateData.rhea_balance || "0"
                                      )
                                    );
                                    const stakedNum = parseFloat(
                                      toReadableNumber(
                                        metadata.decimals,
                                        dateData.stake_rhea_balance || "0"
                                      )
                                    );
                                    const lpNum = parseFloat(
                                      toReadableNumber(
                                        metadata.decimals,
                                        dateData.lp_balance || "0"
                                      )
                                    );
                                    const lockNum = parseFloat(
                                      toReadableNumber(
                                        metadata.decimals,
                                        dateData.lock_boost_balance || "0"
                                      )
                                    );
                                    const lendingNum = parseFloat(
                                      toReadableNumber(
                                        metadata.decimals,
                                        dateData.lending_balance || "0"
                                      )
                                    );
                                    dateTotal +=
                                      rheaNum +
                                      stakedNum +
                                      lpNum +
                                      lockNum +
                                      lendingNum;
                                  }
                                });

                                console.log(`Date ${date} total calculation:`, {
                                  date,
                                  dateTotal,
                                  userCount: userAirdropData.filter(
                                    (u) => u.timeSeriesData[date]
                                  ).length,
                                });

                                return formatNumberWithSuffix(dateTotal);
                              } catch (error) {
                                console.error(
                                  `Error calculating date total for ${date}:`,
                                  error
                                );
                                return "0";
                              }
                            } else {
                              return "0";
                            }
                          })()}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-black divide-y divide-gray-800">
                  {userAirdropData.map((user, index) => (
                    <tr
                      key={`${user.account_id}-${index}`}
                      className="hover:bg-[#25252C] hover:border-opacity-70 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm sticky left-0 bg-black z-10 min-w-[200px]">
                        <span className="font-mono text-xs">
                          {user.account_id.length > 30
                            ? `${user.account_id.substring(
                                0,
                                20
                              )}...${user.account_id.substring(
                                user.account_id.length - 10
                              )}`
                            : user.account_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm sticky left-[200px] bg-black z-10 min-w-[150px]">
                        <span className="text-[#00F7A5] font-medium">
                          {formatBalance(user.airdrop_balance)}
                        </span>
                      </td>
                      {availableDates.map((date, dateIndex) => {
                        const dateData = user.timeSeriesData[date];
                        return (
                          <td
                            key={date}
                            className={`px-6 py-4 whitespace-nowrap text-sm sticky left-[250px] bg-black z-10 min-w-[320px] ${
                              dateIndex === 0
                                ? "sticky left-[350px] bg-black z-10"
                                : ""
                            }`}
                          >
                            {dateData ? (
                              <div className="space-y-2">
                                {/* 主要数值 */}
                                <div
                                  className={`font-medium flex gap-2 items-center ${
                                    parseFloat(dateData.total_balance) > 0
                                      ? "text-white"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {formatNumberWithSuffix(
                                    parseFloat(dateData.total_balance)
                                  )}
                                  {(() => {
                                    const airdropNum = parseFloat(
                                      toReadableNumber(
                                        tokenMetadata["token.rhealab.near"]
                                          ?.decimals || 18,
                                        user.airdrop_balance || "0"
                                      )
                                    );
                                    const currentNum = parseFloat(
                                      dateData.total_balance
                                    );
                                    const change = currentNum - airdropNum;
                                    const changePercent =
                                      airdropNum > 0
                                        ? (change / airdropNum) * 100
                                        : 0;

                                    if (Math.abs(change) < 0.01) {
                                      return (
                                        <div className="text-gray-400 text-xs">
                                          <span>→</span> <span>No change</span>
                                        </div>
                                      );
                                    }

                                    const isIncrease = change > 0;
                                    const arrow = isIncrease ? "↗" : "↘";
                                    const changeColor = isIncrease
                                      ? "text-green-400"
                                      : "text-red-400";
                                    const changeText = isIncrease ? "+" : "";

                                    return (
                                      <div
                                        className={`${changeColor} text-xs flex gap-1`}
                                      >
                                        <span>{arrow}</span>
                                        <span>
                                          {changeText}
                                          {formatNumberWithSuffix(
                                            Math.abs(change)
                                          )}
                                        </span>
                                        <span className="text-gray-400">
                                          ({changeText}
                                          {changePercent.toFixed(1)}%)
                                        </span>
                                      </div>
                                    );
                                  })()}
                                </div>
                                <div className="text-xs flex items-center gap-2 text-gray-400">
                                  <span>
                                    Rhea:{formatBalance(dateData.rhea_balance)}
                                  </span>
                                  <span>
                                    Staked:
                                    {formatBalance(dateData.stake_rhea_balance)}
                                  </span>
                                  <span>
                                    LP:{formatBalance(dateData.lp_balance)}
                                  </span>
                                  <span>
                                    Lock:
                                    {formatBalance(dateData.lock_boost_balance)}
                                  </span>
                                  <span>
                                    Lend:
                                    {formatBalance(dateData.lending_balance)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!loading && userAirdropData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirdropPage;
