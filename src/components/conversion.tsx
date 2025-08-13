import React, { useState, useEffect } from "react";
import { ftGetTokenMetadata } from "../services/near";
import { toReadableNumber } from "../utils/number";

interface ConversionRecord {
  token_id: string;
  account_id: string;
  balance: string;
  index_number: number;
  rank: number;
  target_amount: string;
  locking_duration: number;
  type: string;
  timestamp: number;
}

interface ApiResponse {
  record_list: ConversionRecord[];
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

interface UserConversionData {
  account_id: string;
  conversions: {
    [date: string]: {
      rank: number;
      target_amount: string;
      timestamp: number;
      locking_duration: number;
      type: string;
    };
  };
}

const TOKENS: TokenMetadata[] = [
  { id: "token.v2.ref-finance.near", name: "Ref" },
  { id: "token.burrow.near", name: "Brrr" },
];

const TIME_PERIODS = [
  { label: "1 Week", days: 7 },
  { label: "2 Weeks", days: 14 },
  { label: "3 Weeks", days: 21 },
  { label: "4 Weeks", days: 28 },
];

const LOCKING_DURATIONS = [
  { label: "0 Week", value: 0 },
  { label: "5 Weeks", value: 5 },
  { label: "10 Weeks", value: 10 },
  { label: "20 Weeks", value: 20 },
];

const CONVERSION_TYPES = [
  { label: "Lock", value: "Lock" },
  { label: "NoLock", value: "unLock" },
];

const ConversionPage: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<TokenMetadata>(TOKENS[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7);
  const [selectedLockingDuration, setSelectedLockingDuration] =
    useState<number>(5);
  const [selectedType, setSelectedType] = useState<string>("Lock");
  const [allConversionRecords, setAllConversionRecords] = useState<
    ConversionRecord[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenMetadata, setTokenMetadata] = useState<{ [key: string]: any }>(
    {}
  );
  const [sortByDate, setSortByDate] = useState<string>("");
  const [userConversionData, setUserConversionData] = useState<
    UserConversionData[]
  >([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // 获取token metadata（使用全局缓存）
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
      // 保持metadata为null，让应用自然降级
    }
  };

  // 获取所有页面的转换数据
  const fetchAllConversionRecords = async () => {
    setLoading(true);
    try {
      // 根据选择的Time Period计算number参数
      const numberParam = selectedPeriod;

      // 先获取第一页来确定总页数
      const firstPageResponse = await fetch(
        `https://api.ref.finance/conversion_token_data?number=${numberParam}&page_number=1&page_size=1000`
      );
      const firstPageData: ApiResponse = await firstPageResponse.json();
      const totalPages = firstPageData.total_page;

      // 并行请求所有页面
      const pagePromises = [];
      for (let page = 1; page <= totalPages; page++) {
        pagePromises.push(
          fetch(
            `https://api.ref.finance/conversion_token_data?number=${numberParam}&page_number=${page}&page_size=1000`
          ).then((res) => res.json())
        );
      }

      const allPagesData: ApiResponse[] = await Promise.all(pagePromises);

      // 整合所有数据
      const allData: ConversionRecord[] = [];
      allPagesData.forEach((pageData) => {
        allData.push(...pageData.record_list);
      });

      setAllConversionRecords(allData);

      // 获取所有token的metadata（全局缓存会自动处理重复请求）
      TOKENS.forEach((token) => {
        fetchTokenMetadata(token.id);
      });
    } catch (error) {
      console.error("Failed to fetch conversion data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 处理数据，按用户分组并按时间组织
  useEffect(() => {
    if (allConversionRecords.length > 0) {
      // 根据筛选条件过滤数据
      const filtered = allConversionRecords.filter((record) => {
        const tokenMatch = record.token_id === selectedToken.id;
        const durationMatch =
          record.locking_duration === selectedLockingDuration;
        const typeMatch = record.type === selectedType;
        return tokenMatch && durationMatch && typeMatch;
      });

      // 按时间分组
      const dateGroups: { [key: string]: ConversionRecord[] } = {};
      const dates: string[] = [];

      filtered.forEach((record) => {
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

      // 按排名排序每个日期的数据
      dates.forEach((date) => {
        dateGroups[date].sort((a, b) => a.rank - b.rank);
      });

      // 按时间排序 - 倒序，最新的在前面
      dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      setAvailableDates(dates);

      // 构建用户转换数据
      const userData: { [key: string]: UserConversionData } = {};

      dates.forEach((date) => {
        // 移除100条限制，展示所有数据
        dateGroups[date].forEach((record) => {
          if (!userData[record.account_id]) {
            userData[record.account_id] = {
              account_id: record.account_id,
              conversions: {},
            };
          }
          userData[record.account_id].conversions[date] = {
            rank: record.rank,
            target_amount: record.target_amount,
            timestamp: record.timestamp,
            locking_duration: record.locking_duration,
            type: record.type,
          };
        });
      });

      const userConversionArray = Object.values(userData);
      setUserConversionData(userConversionArray);

      // 设置默认排序日期为第一个日期（最新的日期）
      if (dates.length > 0 && !sortByDate) {
        setSortByDate(dates[0]);
      }
    }
  }, [
    selectedToken,
    selectedLockingDuration,
    selectedType,
    allConversionRecords,
    sortByDate,
  ]);

  // 初始加载所有数据
  useEffect(() => {
    fetchAllConversionRecords();
  }, []);

  // 当Time Period改变时重新获取数据
  useEffect(() => {
    if (allConversionRecords.length > 0) {
      fetchAllConversionRecords();
    }
  }, [selectedPeriod]);

  const handleTokenChange = (token: TokenMetadata) => {
    setSelectedToken(token);
    setSortByDate("");
  };

  const handlePeriodChange = (days: number) => {
    setSelectedPeriod(days);
  };

  const handleLockingDurationChange = (duration: number) => {
    setSelectedLockingDuration(duration);
    setSortByDate("");
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSortByDate("");
  };

  const handleDateSort = (date: string) => {
    setSortByDate(date);
  };

  const formatTargetAmount = (targetAmount: string, tokenId: string) => {
    const metadata = tokenMetadata[tokenId];

    // 添加调试信息
    console.log(`Formatting target amount for token ${tokenId}:`, {
      targetAmount,
      metadata,
      hasDecimals: metadata?.decimals !== undefined,
    });

    if (metadata && metadata.decimals !== undefined) {
      try {
        const readableNumber = toReadableNumber(
          metadata.decimals,
          targetAmount
        );
        const num = parseFloat(readableNumber);
        console.log(
          `Converted target amount: ${targetAmount} -> ${readableNumber} -> ${num}`
        );
        return formatNumberWithSuffix(num);
      } catch (error) {
        console.error(`Error formatting target amount with decimals:`, error);
      }
    }

    // Fallback to original formatting with better handling
    try {
      const num = parseFloat(targetAmount);
      if (isNaN(num)) {
        console.warn(`Invalid target amount value: ${targetAmount}`);
        return "0";
      }
      console.log(`Using fallback formatting: ${targetAmount} -> ${num}`);
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
    if (!sortByDate || userConversionData.length === 0)
      return userConversionData;

    return [...userConversionData].sort((a, b) => {
      const aRank = a.conversions[sortByDate]?.rank || 999999;
      const bRank = b.conversions[sortByDate]?.rank || 999999;
      return aRank - bRank;
    });
  };

  // 计算当前token的总target_amount
  const getTotalTargetAmount = () => {
    if (!sortByDate || userConversionData.length === 0) return 0;

    let total = 0;
    getSortedUserData().forEach((user) => {
      const conversionData = user.conversions[sortByDate];
      if (conversionData) {
        const metadata = tokenMetadata[selectedToken.id];
        if (metadata && metadata.decimals !== undefined) {
          const readableNumber = toReadableNumber(
            metadata.decimals,
            conversionData.target_amount
          );
          total += parseFloat(readableNumber);
        } else {
          total += parseFloat(conversionData.target_amount);
        }
      }
    });
    return total;
  };

  // 计算每个日期的总target_amount
  const getDateTotalTargetAmount = (date: string) => {
    let total = 0;
    userConversionData.forEach((user) => {
      const conversionData = user.conversions[date];
      if (conversionData) {
        const metadata = tokenMetadata[selectedToken.id];
        if (metadata && metadata.decimals !== undefined) {
          const readableNumber = toReadableNumber(
            metadata.decimals,
            conversionData.target_amount
          );
          total += parseFloat(readableNumber);
        } else {
          total += parseFloat(conversionData.target_amount);
        }
      }
    });
    return total;
  };

  // 计算target_amount变化
  const getTargetAmountChange = (
    currentAmount: string,
    todayAmount: string,
    tokenId: string
  ) => {
    const metadata = tokenMetadata[tokenId];
    let currentNum = 0;
    let todayNum = 0;

    if (metadata && metadata.decimals !== undefined) {
      currentNum = parseFloat(
        toReadableNumber(metadata.decimals, currentAmount)
      );
      todayNum = parseFloat(toReadableNumber(metadata.decimals, todayAmount));
    } else {
      currentNum = parseFloat(currentAmount);
      todayNum = parseFloat(todayAmount);
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
  const totalTargetAmount = getTotalTargetAmount();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center mb-2">
          <h1 className="text-3xl font-bold mb-4 text-white mr-3">
            Token Conversion Rankings
          </h1>
          <p className="text-gray-400 text-lg">
            View conversion rankings across different tokens and locking periods
          </p>
        </div>

        <div className="flex items-center gap-6 mb-6">
          {/* Token Selector */}
          <div>
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
          <div>
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

          {/* Locking Duration Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Locking Duration:
            </label>
            <div className="flex flex-wrap gap-2">
              {LOCKING_DURATIONS.map((duration) => (
                <button
                  key={duration.value}
                  onClick={() => handleLockingDurationChange(duration.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedLockingDuration === duration.value
                      ? "bg-[#00F7A5] text-[#14162B] shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  }`}
                >
                  {duration.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type:
            </label>
            <div className="flex flex-wrap gap-2">
              {CONVERSION_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeChange(type.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedType === type.value
                      ? "bg-[#00F7A5] text-[#14162B] shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Refresh Button */}
          <div className="ml-auto">
            <button
              onClick={fetchAllConversionRecords}
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
            <p className="mt-4 text-gray-400 text-lg">
              Loading conversion data...
            </p>
          </div>
        )}

        {/* Data Table */}
        {!loading && sortedUserData.length > 0 && filteredDates.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-[#303037]">
            <div className="px-6 py-4 border-b border-[#303037]">
              <h3 className="text-xl font-semibold text-white">
                {selectedToken.name} Total Target Amount -{" "}
                {formatNumberWithSuffix(totalTargetAmount)} ({sortByDate})
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
                      const dateTotal = getDateTotalTargetAmount(date);
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
                  {sortedUserData.map((user, index) => {
                    const todayDate = filteredDates[0]; // 最新日期作为今天
                    const todayData = user.conversions[todayDate];

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
                          const conversionData = user.conversions[date];
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
                              {conversionData ? (
                                <div className="space-y-1 text-left">
                                  <div className="text-white font-bold text-lg">
                                    #{conversionData.rank}
                                  </div>
                                  <div className="text-gray-400 text-xs font-mono flex items-center gap-1">
                                    {formatTargetAmount(
                                      conversionData.target_amount,
                                      selectedToken.id
                                    )}

                                    {!isToday && todayData && (
                                      <div className="text-xs">
                                        {(() => {
                                          const change = getTargetAmountChange(
                                            conversionData.target_amount,
                                            todayData.target_amount,
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
                                  <div className="text-xs text-gray-500">
                                    {conversionData.locking_duration}w{" "}
                                    {conversionData.type}
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
              <p className="text-gray-400 text-lg">
                No conversion data available for selected filters
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default ConversionPage;
