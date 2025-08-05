import React, { useState, useEffect } from "react";
import { ftGetTokenMetadata } from "../services/near";
import { toReadableNumber } from "../utils/number";

interface TokenHolder {
  token_id: string;
  account_id: string;
  balance: string;
  index_number: number;
  rank: number;
  timestamp: number;
}

interface ApiResponse {
  record_list: TokenHolder[];
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

interface UserRankData {
  account_id: string;
  ranks: {
    [date: string]: { rank: number; balance: string; timestamp: number };
  };
}

const TOKENS: TokenMetadata[] = [
  { id: "token.v2.ref-finance.near", name: "Ref" },
  { id: "token.burrow.near", name: "Brrr" },
  { id: "xtoken.ref-finance.near", name: "xRef" },
  { id: "token.rhealab.near", name: "Rhea" },
  { id: "xtoken.rhealab.near", name: "xRhea" },
];

// 硬编码的token metadata作为备用
const FALLBACK_TOKEN_METADATA: { [key: string]: any } = {
  "token.v2.ref-finance.near": { decimals: 24 },
  "token.burrow.near": { decimals: 24 },
  "xtoken.ref-finance.near": { decimals: 24 },
  "token.rhealab.near": { decimals: 24 },
  "xtoken.rhealab.near": { decimals: 24 },
};

const TIME_PERIODS = [
  { label: "1 Week", days: 7 },
  { label: "2 Weeks", days: 14 },
  { label: "3 Weeks", days: 21 },
  { label: "4 Weeks", days: 28 },
];

const HomePage: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<TokenMetadata>(TOKENS[0]);
  const [allTokenHolders, setAllTokenHolders] = useState<TokenHolder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenMetadata, setTokenMetadata] = useState<{ [key: string]: any }>(
    {}
  );
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7);
  const [sortByDate, setSortByDate] = useState<string>("");
  const [userRankData, setUserRankData] = useState<UserRankData[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // 获取token metadata
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
      // 使用备用metadata
      const fallbackMetadata = FALLBACK_TOKEN_METADATA[tokenId];
      if (fallbackMetadata) {
        console.log(`Using fallback metadata for ${tokenId}:`, fallbackMetadata);
        setTokenMetadata((prev) => ({
          ...prev,
          [tokenId]: fallbackMetadata,
        }));
      }
    }
  };

  // 初始化时设置备用metadata
  useEffect(() => {
    const initialMetadata: { [key: string]: any } = {};
    TOKENS.forEach((token) => {
      initialMetadata[token.id] = FALLBACK_TOKEN_METADATA[token.id];
    });
    setTokenMetadata(initialMetadata);
    console.log("Initialized with fallback metadata:", initialMetadata);
  }, []);

  // 获取所有页面的数据
  const fetchAllTokenHolders = async () => {
    setLoading(true);
    try {
      // 根据选择的Time Period计算number参数
      const numberParam = selectedPeriod;

      // 先获取第一页来确定总页数
      const firstPageResponse = await fetch(
        `https://mainnet-indexer.ref-finance.com/token_holders?number=${numberParam}&page_number=1&page_size=100`
      );
      const firstPageData: ApiResponse = await firstPageResponse.json();
      const totalPages = firstPageData.total_page;

      // 并行请求所有页面
      const pagePromises = [];
      for (let page = 1; page <= totalPages; page++) {
        pagePromises.push(
          fetch(
            `https://mainnet-indexer.ref-finance.com/token_holders?number=${numberParam}&page_number=${page}&page_size=100`
          ).then((res) => res.json())
        );
      }

      const allPagesData: ApiResponse[] = await Promise.all(pagePromises);

      // 整合所有数据
      const allData: TokenHolder[] = [];
      allPagesData.forEach((pageData) => {
        allData.push(...pageData.record_list);
      });

      setAllTokenHolders(allData);

      // 获取所有token的metadata
      TOKENS.forEach((token) => {
        fetchTokenMetadata(token.id);
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 处理数据，按用户分组并按时间组织
  useEffect(() => {
    if (allTokenHolders.length > 0) {
      const filtered = allTokenHolders.filter(
        (holder) => holder.token_id === selectedToken.id
      );

      // 按时间分组
      const dateGroups: { [key: string]: TokenHolder[] } = {};
      const dates: string[] = [];

      filtered.forEach((holder) => {
        const date = new Date(holder.timestamp * 1000).toLocaleDateString(
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
        dateGroups[date].push(holder);
      });

      // 按排名排序每个日期的数据
      dates.forEach((date) => {
        dateGroups[date].sort((a, b) => a.rank - b.rank);
      });

      // 按时间排序 - 倒序，最新的在前面
      dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      setAvailableDates(dates);

      // 构建用户排名数据
      const userData: { [key: string]: UserRankData } = {};

      dates.forEach((date) => {
        const top100 = dateGroups[date].slice(0, 100);
        top100.forEach((holder) => {
          if (!userData[holder.account_id]) {
            userData[holder.account_id] = {
              account_id: holder.account_id,
              ranks: {},
            };
          }
          userData[holder.account_id].ranks[date] = {
            rank: holder.rank,
            balance: holder.balance,
            timestamp: holder.timestamp,
          };
        });
      });

      const userRankArray = Object.values(userData);
      setUserRankData(userRankArray);

      // 设置默认排序日期为第一个日期（最新的日期）
      if (dates.length > 0 && !sortByDate) {
        setSortByDate(dates[0]);
      }
    }
  }, [selectedToken, allTokenHolders, sortByDate]);

  // 初始加载所有数据
  useEffect(() => {
    fetchAllTokenHolders();
  }, []);

  // 当Time Period改变时重新获取数据
  useEffect(() => {
    if (allTokenHolders.length > 0) {
      fetchAllTokenHolders();
    }
  }, [selectedPeriod]);

  const handleTokenChange = (token: TokenMetadata) => {
    setSelectedToken(token);
    setSortByDate("");
  };

  const handlePeriodChange = (days: number) => {
    setSelectedPeriod(days);
  };

  const handleDateSort = (date: string) => {
    setSortByDate(date);
  };

  const formatBalance = (balance: string, tokenId: string) => {
    const metadata = tokenMetadata[tokenId];
    
    // 添加调试信息
    console.log(`Formatting balance for token ${tokenId}:`, {
      balance,
      metadata,
      hasDecimals: metadata?.decimals !== undefined
    });
    
    if (metadata && metadata.decimals !== undefined) {
      try {
        const readableNumber = toReadableNumber(metadata.decimals, balance);
        const num = parseFloat(readableNumber);
        console.log(`Converted balance: ${balance} -> ${readableNumber} -> ${num}`);
        return formatNumberWithSuffix(num);
      } catch (error) {
        console.error(`Error formatting balance with decimals:`, error);
      }
    }

    // Fallback to original formatting with better handling
    try {
      const num = parseFloat(balance);
      if (isNaN(num)) {
        console.warn(`Invalid balance value: ${balance}`);
        return "0";
      }
      console.log(`Using fallback formatting: ${balance} -> ${num}`);
      return formatNumberWithSuffix(num);
    } catch (error) {
      console.error(`Error in fallback formatting:`, error);
      return "0";
    }
  };

  const formatNumberWithSuffix = (num: number): string => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + "B";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + "M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + "K";
    }
    return num.toFixed(2);
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  // 获取筛选后的日期
  const getFilteredDates = () => {
    if (availableDates.length === 0) return [];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - selectedPeriod);

    return availableDates.filter((date) => {
      const dateObj = new Date(date);
      return dateObj >= cutoffDate;
    });
  };

  // 获取排序后的用户数据
  const getSortedUserData = () => {
    if (!sortByDate || userRankData.length === 0) return userRankData;

    return [...userRankData].sort((a, b) => {
      const aRank = a.ranks[sortByDate]?.rank || 999999;
      const bRank = b.ranks[sortByDate]?.rank || 999999;
      return aRank - bRank;
    });
  };

  // 计算持仓变化
  const getBalanceChange = (
    currentBalance: string,
    todayBalance: string,
    tokenId: string
  ) => {
    const metadata = tokenMetadata[tokenId];
    let currentNum = 0;
    let todayNum = 0;

    if (metadata && metadata.decimals !== undefined) {
      currentNum = parseFloat(
        toReadableNumber(metadata.decimals, currentBalance)
      );
      todayNum = parseFloat(toReadableNumber(metadata.decimals, todayBalance));
    } else {
      currentNum = parseFloat(currentBalance);
      todayNum = parseFloat(todayBalance);
    }

    return {
      change: currentNum - todayNum,
      percentage: todayNum > 0 ? ((currentNum - todayNum) / todayNum) * 100 : 0,
    };
  };

  // 格式化变化显示
  const formatChange = (change: number) => {
    const absChange = Math.abs(change);
    if (absChange >= 1e9) {
      return (absChange / 1e9).toFixed(2) + "B";
    } else if (absChange >= 1e6) {
      return (absChange / 1e6).toFixed(2) + "M";
    } else if (absChange >= 1e3) {
      return (absChange / 1e3).toFixed(2) + "K";
    }
    return absChange.toFixed(2);
  };

  const filteredDates = getFilteredDates();
  const sortedUserData = getSortedUserData();

  // 计算当前token的top100总数量
  const getTop100TotalBalance = () => {
    if (!sortByDate || sortedUserData.length === 0) return 0;

    let total = 0;
    sortedUserData.slice(0, 100).forEach((user) => {
      const rankData = user.ranks[sortByDate];
      if (rankData) {
        const metadata = tokenMetadata[selectedToken.id];
        if (metadata && metadata.decimals !== undefined) {
          const readableNumber = toReadableNumber(
            metadata.decimals,
            rankData.balance
          );
          total += parseFloat(readableNumber);
        } else {
          total += parseFloat(rankData.balance);
        }
      }
    });
    return total;
  };

  const top100Total = getTop100TotalBalance();

  // 计算每个日期的总数量
  const getDateTotalBalance = (date: string) => {
    let total = 0;
    userRankData.forEach((user) => {
      const rankData = user.ranks[date];
      if (rankData) {
        const metadata = tokenMetadata[selectedToken.id];
        if (metadata && metadata.decimals !== undefined) {
          const readableNumber = toReadableNumber(
            metadata.decimals,
            rankData.balance
          );
          total += parseFloat(readableNumber);
        } else {
          total += parseFloat(rankData.balance);
        }
      }
    });
    return total;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Token Holder Rankings
          </h1>
          <p className="text-gray-400 text-lg">
            View user rankings across different time periods
          </p>
        </div>

        <div className="flex items-center gap-10">
          {/* Token Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Token:
            </label>
            <div className="flex flex-wrap gap-2">
              {TOKENS.map((token) => (
                <button
                  key={token.id}
                  onClick={() => handleTokenChange(token)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedToken.id === token.id
                      ? "bg-[#00F7A5] text-[#14162B] shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  }`}
                >
                  {token.name}
                </button>
              ))}
            </div>
          </div>

          {/* Time Period Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time Period:
            </label>
            <div className="flex flex-wrap gap-2">
              {TIME_PERIODS.map((period) => (
                <button
                  key={period.days}
                  onClick={() => handlePeriodChange(period.days)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPeriod === period.days
                      ? "bg-[#00F7A5] text-[#14162B] shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Refresh Button */}
          <div className="ml-auto">
            <button
              onClick={fetchAllTokenHolders}
              disabled={loading}
              className="px-8 py-3 bg-[#00F7A5] text-[#14162B] rounded-lg hover:bg-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-lg"
            >
              {loading ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-400 text-lg">Loading all data...</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && sortedUserData.length > 0 && filteredDates.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-[#303037]">
            <div className="px-6 py-4 border-b border-[#303037]">
              <h3 className="text-xl font-semibold text-white">
                {selectedToken.name} Total -{" "}
                {formatNumberWithSuffix(top100Total)} ({sortByDate})
                <span className="text-sm text-gray-400 ml-4">
                  Showing {sortedUserData.length} users across{" "}
                  {filteredDates.length} days
                </span>
              </h3>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider sticky left-0 z-10 bg-black min-w-[200px]">
                      User
                    </th>
                    {filteredDates.map((date, index) => {
                      const dateTotal = getDateTotalBalance(date);
                      return (
                        <th
                          key={date}
                          className={`px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer transition-colors ${
                            index === 0
                              ? "sticky left-[200px] z-10 bg-black min-w-[150px]"
                              : "min-w-[200px]"
                          }`}
                          onClick={() => handleDateSort(date)}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span>{date}</span>
                              {sortByDate === date && (
                                <span className="text-green-400 text-lg">
                                  ↓
                                </span>
                              )}
                              {formatNumberWithSuffix(dateTotal)}
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="bg-black divide-y divide-gray-800">
                  {sortedUserData.slice(0, 100).map((user, index) => {
                    const todayDate = filteredDates[0]; // 最新日期作为今天
                    const todayData = user.ranks[todayDate];

                    return (
                      <tr
                        key={user.account_id}
                        className="hover:bg-[#25252C] hover:border-opacity-70 transition-colors min-w-[200px]"
                      >
                        <td className="px-6 py-2 whitespace-nowrap text-sm sticky left-0 bg-black z-10 min-w-[200px]">
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
                        {filteredDates.map((date, dateIndex) => {
                          const rankData = user.ranks[date];
                          const isToday = date === todayDate;

                          return (
                            <td
                              key={date}
                              className={`px-6 py-2 whitespace-nowrap text-sm ${
                                dateIndex === 0
                                  ? "sticky left-[200px] bg-black z-10 min-w-[150px]"
                                  : "min-w-[200px]"
                              }`}
                            >
                              {rankData ? (
                                <div className="space-y-1 text-left">
                                  <div className="text-white font-bold text-lg">
                                    #{rankData.rank}
                                  </div>
                                  <div className="text-gray-400 text-xs font-mono flex items-center gap-1">
                                    {formatBalance(
                                      rankData.balance,
                                      selectedToken.id
                                    )}

                                    {!isToday && todayData && (
                                      <div className="text-xs">
                                        {(() => {
                                          const change = getBalanceChange(
                                            rankData.balance,
                                            todayData.balance,
                                            selectedToken.id
                                          );
                                          if (change.change > 0) {
                                            return (
                                              <div className="text-red-400 flex items-center gap-1">
                                                <span>↓</span>
                                                <span>
                                                  +{formatChange(change.change)}
                                                </span>
                                              </div>
                                            );
                                          } else if (change.change < 0) {
                                            return (
                                              <div className="text-green-400 flex items-center gap-1">
                                                <span>↑</span>
                                                <span>
                                                  -{formatChange(change.change)}
                                                </span>
                                              </div>
                                            );
                                          } else {
                                            return (
                                              <div className="text-gray-400 flex items-center gap-1">
                                                <span>→</span>
                                                <span>0</span>
                                              </div>
                                            );
                                          }
                                        })()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-600">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!loading &&
          (sortedUserData.length === 0 || filteredDates.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No data available</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default HomePage;
