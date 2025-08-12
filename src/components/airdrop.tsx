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

const AirdropPage: React.FC = () => {
  const [airdropRecords, setAirdropRecords] = useState<AirdropRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [pageSize] = useState<number>(20);
  const [tokenMetadata, setTokenMetadata] = useState<{ [key: string]: any }>(
    {}
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

  // Fetch airdrop data
  const fetchAirdropData = async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://mainnet-indexer.ref-finance.com/rhea_token_data?page_number=${pageNumber}&page_size=${pageSize}`
      );
      const data: ApiResponse = await response.json();

      setAirdropRecords(data.record_list);
      setTotalPages(data.total_page);
      setTotalSize(data.total_size);
      setCurrentPage(pageNumber);

      // Fetch Rhea token metadata
      await fetchTokenMetadata("token.rhealab.near");
    } catch (error) {
      console.error("Failed to fetch airdrop data:", error);
    } finally {
      setLoading(false);
    }
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
      if (isNaN(num)) return "0";
      return formatNumberWithSuffix(num);
    } catch (error) {
      console.error(`Error in fallback formatting:`, error);
      return "0";
    }
  };

  // Format number with suffix
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

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchAirdropData(page);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAirdropData(1);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6 w-full">
        {/* Page Title */}
        <div className="mb-4 flex items-center gap-2">
          <h1 className="text-3xl font-bold text-white">
            Airdrop Token Flow Tracking
          </h1>
          <p className="text-gray-400">
            Track the flow and distribution of airdropped Rhea tokens across
            user accounts
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="w-full grid grid-cols-4 gap-4 bg-[#25252C] rounded-xl px-6 py-4 border border-[#303037]">
            <div className="">
              <div className="text-gray-400 text-sm mb-2">Total Users</div>
              <div className="text-2xl font-bold text-white">
                {totalSize.toLocaleString()}
              </div>
            </div>
            <div className="">
              <div className="text-gray-400 text-sm mb-2">Current Page</div>
              <div className="text-2xl font-bold text-white">
                {currentPage} / {totalPages}
              </div>
            </div>
            <div className="">
              <div className="text-gray-400 text-sm mb-2">Page Size</div>
              <div className="text-2xl font-bold text-white">{pageSize}</div>
            </div>
            <div className="">
              <div className="text-gray-400 text-sm mb-2">Last Updated</div>
              <div className="text-lg font-bold text-white">
                {airdropRecords.length > 0
                  ? formatTimestamp(airdropRecords[0].timestamp)
                  : "-"}
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-end mb-6 w-[220px]">
            <button
              onClick={() => fetchAirdropData(currentPage)}
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F7A5]"></div>
            <p className="mt-4 text-gray-400 text-lg">Loading data...</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && airdropRecords.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-[#303037]">
            <div className="px-6 py-4 border-b border-[#303037]">
              <h3 className="text-xl font-semibold text-white">
                Airdrop Token Flow Data
                <span className="text-sm text-gray-400 ml-4">
                  Showing page {currentPage} of {totalSize} total records
                </span>
              </h3>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
              <table className="w-full">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-[#1A1A1F]">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 tracking-wider sticky left-0 z-30 bg-[#1A1A1F] min-w-[200px]">
                      User ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 tracking-wider min-w-[150px] bg-[#1A1A1F]">
                      Airdrop
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 tracking-wider min-w-[150px] bg-[#1A1A1F]">
                      Rhea
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 tracking-wider min-w-[150px] bg-[#1A1A1F]">
                      Staked Rhea
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 tracking-wider min-w-[150px] bg-[#1A1A1F]">
                      LP
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 tracking-wider min-w-[150px] bg-[#1A1A1F]">
                      Lock Boost
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 tracking-wider min-w-[150px] bg-[#1A1A1F]">
                      Lending
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 tracking-wider min-w-[150px] bg-[#1A1A1F]">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-black divide-y divide-gray-800">
                  {airdropRecords.map((record, index) => (
                    <tr
                      key={`${record.account_id}-${index}`}
                      className="hover:bg-[#25252C] hover:border-opacity-70 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm sticky left-0 bg-black z-10 min-w-[200px]">
                        <span className="font-mono text-xs">
                          {record.account_id.length > 30
                            ? `${record.account_id.substring(
                                0,
                                20
                              )}...${record.account_id.substring(
                                record.account_id.length - 10
                              )}`
                            : record.account_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[150px]">
                        <span className="text-[#FAFF00] font-medium">
                          {formatBalance(record.airdrop_balance)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[150px]">
                        <span className="text-[#00F7A5] font-medium">
                          {formatBalance(record.rhea_balance)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[150px]">
                        <span className="text-[#A1FFE0] font-medium">
                          {formatBalance(record.stake_rhea_balance)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[150px]">
                        <span className="text-purple-400 font-medium">
                          {formatBalance(record.lp_balance)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[150px]">
                        <span className="text-[#9EFF00] font-medium">
                          {formatBalance(record.lock_boost_balance)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[150px]">
                        <span className="text-[#FF5F2A] font-medium">
                          {formatBalance(record.lending_balance)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[150px]">
                        <span className="text-gray-400 text-xs">
                          {formatTimestamp(record.timestamp)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#25252C] text-white rounded-lg hover:bg-[#303037] disabled:opacity-50 disabled:cursor-not-allowed border border-[#303037]"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-[#00F7A5] text-[#14162B] shadow-lg"
                        : "bg-[#25252C] text-gray-300 hover:bg-[#303037] border border-[#303037]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#25252C] text-white rounded-lg hover:bg-[#303037] disabled:opacity-50 disabled:cursor-not-allowed border border-[#303037]"
            >
              Next
            </button>
          </div>
        )}

        {/* No Data State */}
        {!loading && airdropRecords.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirdropPage;
