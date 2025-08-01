import {
  TokenHolder,
  AllPagesDataResponse,
  ChartDataPoint,
  TokenType,
  TopCount,
  RankingDataPoint,
  UserRanking,
  AllPagesConversionDataResponse,
  ConversionChartDataPoint,
  ConversionRecord,
  LockUnlockChartDataPoint,
} from "../interface/types";
import { ftGetTokenMetadata } from "../services/near";
import { toReadableNumber } from "./number";
import Big from "big.js";

// Token ID mapping based on actual API response
const TOKEN_IDS = {
  REF: "token.v2.ref-finance.near",
  BRRR: "token.burrow.near",
  RHEA: "token.rhealab.near",
  xREF: "xtoken.ref-finance.near",
  xRHEA: "xtoken.rhealab.near",
};

// Token type to ID mapping
const TOKEN_TYPE_TO_ID: Record<TokenType, string> = {
  ref: TOKEN_IDS.REF,
  brrr: TOKEN_IDS.BRRR,
  rhea: TOKEN_IDS.RHEA,
  xref: TOKEN_IDS.xREF,
  xrhea: TOKEN_IDS.xRHEA,
};

// Cache for token metadata
const tokenMetadataCache = new Map<
  string,
  { decimals: number; symbol: string }
>();

// Get token metadata with caching
const getTokenMetadata = async (tokenId: string) => {
  if (tokenMetadataCache.has(tokenId)) {
    return tokenMetadataCache.get(tokenId)!;
  }

  try {
    const metadata = await ftGetTokenMetadata(tokenId);
    const result = { decimals: metadata.decimals, symbol: metadata.symbol };
    tokenMetadataCache.set(tokenId, result);
    return result;
  } catch (error) {
    console.error(`Failed to get metadata for ${tokenId}:`, error);
    // Fallback to default decimals
    return { decimals: 24, symbol: "UNKNOWN" };
  }
};

// Parse balance with proper decimals
const parseBalance = async (
  balance: string,
  tokenId: string
): Promise<number> => {
  try {
    const metadata = await getTokenMetadata(tokenId);
    const readableBalance = toReadableNumber(metadata.decimals, balance);
    return parseFloat(readableBalance);
  } catch (error) {
    console.error(`Error parsing balance for ${tokenId}:`, error);
    return 0;
  }
};

// Calculate total balance of Top100 for specific token
const getTop100TotalBalance = async (
  holders: TokenHolder[],
  tokenId: string
): Promise<number> => {
  const filteredHolders = holders
    .filter((holder) => holder.token_id === tokenId)
    .filter((holder) => holder.rank <= 100)
    .sort((a, b) => a.rank - b.rank);

  console.log(`Found ${filteredHolders.length} holders for ${tokenId}`);

  let total = 0;
  for (const holder of filteredHolders) {
    const balance = await parseBalance(holder.balance, tokenId);
    total += balance;
  }

  return total;
};

// Format timestamp
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Process data and generate chart data
export const processTokenHoldersData = async (
  data: AllPagesDataResponse
): Promise<ChartDataPoint[]> => {
  const { record_list } = data;

  // Debug: Check actual token_ids returned
  const tokenIds = [...new Set(record_list.map((record) => record.token_id))];
  console.log("Available token IDs in data:", tokenIds);

  // Check record count for each token
  tokenIds.forEach((tokenId) => {
    const count = record_list.filter(
      (record) => record.token_id === tokenId
    ).length;
    console.log(`Token ${tokenId}: ${count} records`);
  });

  // Group records by timestamp
  const groupedByTime = new Map<number, TokenHolder[]>();

  record_list.forEach((record) => {
    const timestamp = record.timestamp;
    if (!groupedByTime.has(timestamp)) {
      groupedByTime.set(timestamp, []);
    }
    groupedByTime.get(timestamp)!.push(record);
  });

  console.log("Grouped by time:", groupedByTime.size, "time points");

  const chartData: ChartDataPoint[] = [];

  // Process each time group
  for (const [timestamp, records] of groupedByTime) {
    // Calculate Top100 total for each token for this time point
    const refTotal = await getTop100TotalBalance(records, TOKEN_IDS.REF);
    const brrrTotal = await getTop100TotalBalance(records, TOKEN_IDS.BRRR);
    const rheaTotal = await getTop100TotalBalance(records, TOKEN_IDS.RHEA);
    const xrefTotal = await getTop100TotalBalance(records, TOKEN_IDS.xREF);
    const xrheaTotal = await getTop100TotalBalance(records, TOKEN_IDS.xRHEA);

    chartData.push({
      time: formatTimestamp(timestamp),
      ref: refTotal,
      brrr: brrrTotal,
      rhea: rheaTotal,
      xref: xrefTotal,
      xrhea: xrheaTotal,
    });
  }

  // Sort by timestamp
  chartData.sort((a, b) => {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();
    return timeA - timeB;
  });

  console.log("Processed data by timestamp:", chartData);
  return chartData;
};

// 新增：处理排名变化数据（根据实际数据天数）
export const processRankingData = async (
  data: AllPagesDataResponse,
  tokenType: TokenType,
  topCount: TopCount
): Promise<RankingDataPoint[]> => {
  const { record_list } = data;
  const tokenId = TOKEN_TYPE_TO_ID[tokenType];

  // Debug: 检查数据结构
  console.log(
    "Processing ranking data for token:",
    tokenType,
    "tokenId:",
    tokenId
  );
  console.log("Total records:", record_list.length);
  if (record_list.length > 0) {
    console.log("Sample record:", record_list[0]);
    console.log("Available token_ids:", [
      ...new Set(record_list.map((r) => r.token_id)),
    ]);
  }

  // Group records by timestamp
  const groupedByTime = new Map<number, TokenHolder[]>();

  record_list
    .filter((holder) => holder.token_id === tokenId)
    .filter((holder) => holder.rank <= topCount)
    .forEach((holder) => {
      const timestamp = holder.timestamp;
      if (!groupedByTime.has(timestamp)) {
        groupedByTime.set(timestamp, []);
      }
      groupedByTime.get(timestamp)!.push(holder);
    });

  console.log(
    `Processing ranking data for ${tokenType}: ${groupedByTime.size} time points`
  );

  const rankingDataPoints: RankingDataPoint[] = [];

  // Process each time group
  for (const [timestamp, holders] of groupedByTime) {
    const sortedHolders = holders.sort((a, b) => a.rank - b.rank);
    const userRankings: UserRanking[] = [];

    for (const holder of sortedHolders) {
      const balance = await parseBalance(holder.balance, tokenId);
      userRankings.push({
        account_id: holder.account_id,
        rank: holder.rank,
        balance: balance,
      });
    }

    rankingDataPoints.push({
      time: formatTimestamp(timestamp),
      userRankings: userRankings,
    });
  }

  // Sort by timestamp
  return rankingDataPoints.sort((a, b) => {
    const dateA = new Date(a.time).getTime();
    const dateB = new Date(b.time).getTime();
    return dateA - dateB;
  });
};

// 新增：处理多天持仓数据（每个用户每一天的balance）
export const processMultiDayHoldingsData = async (
  data: AllPagesDataResponse,
  tokenType: TokenType,
  topCount: TopCount
): Promise<RankingDataPoint[]> => {
  const { record_list } = data;
  const tokenId = TOKEN_TYPE_TO_ID[tokenType];

  // Group records by timestamp
  const groupedByTime = new Map<number, TokenHolder[]>();
  record_list
    .filter((holder) => holder.token_id === tokenId)
    .filter((holder) => holder.rank <= topCount)
    .forEach((holder) => {
      const timestamp = holder.timestamp;
      if (!groupedByTime.has(timestamp)) {
        groupedByTime.set(timestamp, []);
      }
      groupedByTime.get(timestamp)!.push(holder);
    });

  const holdingsDataPoints: RankingDataPoint[] = [];
  for (const [timestamp, holders] of groupedByTime) {
    const sortedHolders = holders.sort((a, b) => a.rank - b.rank);
    const userRankings: UserRanking[] = [];
    for (const holder of sortedHolders) {
      const balance = await parseBalance(holder.balance, tokenId);
      userRankings.push({
        account_id: holder.account_id,
        rank: holder.rank,
        balance: balance,
      });
    }
    holdingsDataPoints.push({
      time: formatTimestamp(timestamp),
      userRankings: userRankings,
    });
  }
  return holdingsDataPoints.sort((a, b) => {
    const dateA = new Date(a.time).getTime();
    const dateB = new Date(b.time).getTime();
    return dateA - dateB;
  });
};

// Parse target_amount with proper decimals for conversion data
const parseTargetAmount = async (
  targetAmount: string,
  tokenId: string
): Promise<number> => {
  try {
    const metadata = await getTokenMetadata(tokenId);
    console.log(`Parsing target_amount for ${tokenId}:`, {
      targetAmount,
      decimals: metadata.decimals,
      symbol: metadata.symbol,
    });
    const readableAmount = toReadableNumber(metadata.decimals, targetAmount);
    const result = parseFloat(readableAmount);
    console.log(`Parsed result: ${readableAmount} -> ${result}`);
    return result;
  } catch (error) {
    console.error(`Error parsing target_amount for ${tokenId}:`, error);
    return 0;
  }
};

// Process conversion data for chart
export const processConversionData = async (
  data: AllPagesConversionDataResponse
): Promise<ConversionChartDataPoint[]> => {
  const { record_list } = data;

  if (!record_list || record_list.length === 0) {
    return [];
  }

  console.log("Processing conversion data:", record_list.length, "records");
  console.log("Sample record:", record_list[0]);

  // Group records by timestamp
  const groupedByTime = new Map<number, ConversionRecord[]>();

  record_list.forEach((record) => {
    const timestamp = record.timestamp;
    if (!groupedByTime.has(timestamp)) {
      groupedByTime.set(timestamp, []);
    }
    groupedByTime.get(timestamp)!.push(record);
  });

  console.log("Grouped by time:", groupedByTime.size, "time points");

  const chartData: ConversionChartDataPoint[] = [];

  // Process each time group
  for (const [timestamp, records] of groupedByTime) {
    // Initialize data structure for this time point
    const timeData: ConversionChartDataPoint = {
      time: formatTimestamp(timestamp),
      ref_0week: 0,
      ref_5weeks: 0,
      ref_10weeks: 0,
      ref_20weeks: 0,
      brrr_0week: 0,
      brrr_5weeks: 0,
      brrr_10weeks: 0,
      brrr_20weeks: 0,
    };

    console.log(
      `Processing ${records.length} records for timestamp ${timestamp}`
    );

    // Process each record
    for (const record of records) {
      // Determine if it's Ref or Brrr based on account_id pattern
      // Since all records have the same token_id, we need to use account_id pattern
      // Ref accounts typically have .near or .tg suffix, Brrr accounts are usually hex strings
      const accountId = record.account_id;
      const isRef = accountId.includes(".near") || accountId.includes(".tg");
      const isBrrr = !isRef; // Assume non-.near accounts are Brrr

      // Parse target_amount (Rhea quantity) using proper metadata
      const rheaQuantity = await parseTargetAmount(
        record.target_amount,
        TOKEN_IDS.RHEA
      );

      // Determine week category based on locking_duration
      const weekCategory = record.locking_duration;

      console.log(
        `Record: ${accountId}, isRef: ${isRef}, week: ${weekCategory}, target_amount: ${record.target_amount}, parsed: ${rheaQuantity}`
      );

      // Add to appropriate category
      if (isRef) {
        switch (weekCategory) {
          case 0:
            timeData.ref_0week += rheaQuantity;
            break;
          case 5:
            timeData.ref_5weeks += rheaQuantity;
            break;
          case 10:
            timeData.ref_10weeks += rheaQuantity;
            break;
          case 20:
            timeData.ref_20weeks += rheaQuantity;
            break;
          default:
            console.warn(
              `Unknown week category: ${weekCategory} for Ref account: ${accountId}`
            );
        }
      } else {
        switch (weekCategory) {
          case 0:
            timeData.brrr_0week += rheaQuantity;
            break;
          case 5:
            timeData.brrr_5weeks += rheaQuantity;
            break;
          case 10:
            timeData.brrr_10weeks += rheaQuantity;
            break;
          case 20:
            timeData.brrr_20weeks += rheaQuantity;
            break;
          default:
            console.warn(
              `Unknown week category: ${weekCategory} for Brrr account: ${accountId}`
            );
        }
      }
    }

    console.log("Time data result:", timeData);
    chartData.push(timeData);
  }

  // Sort by timestamp
  chartData.sort((a, b) => {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();
    return timeA - timeB;
  });

  console.log("Processed conversion data:", chartData);
  return chartData;
};

// Process lock/unlock data for chart
export const processLockUnlockData = async (
  data: AllPagesConversionDataResponse,
  chartType: "lock" | "unlock"
): Promise<LockUnlockChartDataPoint[]> => {
  const { record_list } = data;

  if (!record_list || record_list.length === 0) {
    return [];
  }

  console.log(`Processing ${chartType} data:`, record_list.length, "records");

  // Filter records by type (lock or unlock) - case insensitive
  const filteredRecords = record_list.filter(
    (record) => record.type.toLowerCase() === chartType.toLowerCase()
  );
  console.log(`Filtered ${chartType} records:`, filteredRecords.length);

  // Group records by timestamp
  const groupedByTime = new Map<number, ConversionRecord[]>();

  filteredRecords.forEach((record) => {
    const timestamp = record.timestamp;
    if (!groupedByTime.has(timestamp)) {
      groupedByTime.set(timestamp, []);
    }
    groupedByTime.get(timestamp)!.push(record);
  });

  console.log("Grouped by time:", groupedByTime.size, "time points");

  const chartData: LockUnlockChartDataPoint[] = [];

  // Process each time group
  for (const [timestamp, records] of groupedByTime) {
    // Initialize data structure for this time point
    const timeData: LockUnlockChartDataPoint = {
      time: formatTimestamp(timestamp),
      total: 0,
      "0week": 0,
      "5week": 0,
      "10week": 0,
      "20week": 0,
    };

    // Process each record
    for (const record of records) {
      // Parse target_amount (Rhea quantity) using proper metadata
      const rheaQuantity = await parseTargetAmount(
        record.target_amount,
        TOKEN_IDS.RHEA
      );

      // Determine week category based on locking_duration
      const weekCategory = record.locking_duration;

      // Add to appropriate category
      switch (weekCategory) {
        case 0:
          timeData["0week"] += rheaQuantity;
          break;
        case 5:
          timeData["5week"] += rheaQuantity;
          break;
        case 10:
          timeData["10week"] += rheaQuantity;
          break;
        case 20:
          timeData["20week"] += rheaQuantity;
          break;
        default:
          console.warn(
            `Unknown week category: ${weekCategory} for ${chartType} record: ${record.account_id}`
          );
      }

      // Add to total
      timeData.total += rheaQuantity;
    }

    chartData.push(timeData);
  }

  // Sort by timestamp
  chartData.sort((a, b) => {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();
    return timeA - timeB;
  });

  console.log(`Processed ${chartType} data:`, chartData);
  return chartData;
};
