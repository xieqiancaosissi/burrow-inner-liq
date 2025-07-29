import { TokenHolder, AllPagesDataResponse, ChartDataPoint, TokenType, TopCount, RankingDataPoint, UserRanking } from '../interface/types';
import { ftGetTokenMetadata } from '../services/near';
import { toReadableNumber } from './number';
import Big from 'big.js';

// Token ID mapping based on actual API response
const TOKEN_IDS = {
  REF: 'token.v2.ref-finance.near',
  BRRR: 'token.burrow.near', 
  RHEA: 'token.rhealab.near',
  xREF: 'xtoken.ref-finance.near',
  xRHEA: 'xtoken.rhealab.near',
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
const tokenMetadataCache = new Map<string, { decimals: number; symbol: string }>();

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
    return { decimals: 24, symbol: 'UNKNOWN' };
  }
};

// Parse balance with proper decimals
const parseBalance = async (balance: string, tokenId: string): Promise<number> => {
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
const getTop100TotalBalance = async (holders: TokenHolder[], tokenId: string): Promise<number> => {
  const filteredHolders = holders
    .filter(holder => holder.token_id === tokenId)
    .filter(holder => holder.rank <= 100)
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
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Process data and generate chart data
export const processTokenHoldersData = async (
  data: AllPagesDataResponse
): Promise<ChartDataPoint[]> => {
  const { record_list } = data;
  
  // Debug: Check actual token_ids returned
  const tokenIds = [...new Set(record_list.map(record => record.token_id))];
  console.log('Available token IDs in data:', tokenIds);
  
  // Check record count for each token
  tokenIds.forEach(tokenId => {
    const count = record_list.filter(record => record.token_id === tokenId).length;
    console.log(`Token ${tokenId}: ${count} records`);
  });

  // Calculate Top100 total for each token
  const refTotal = await getTop100TotalBalance(record_list, TOKEN_IDS.REF);
  const brrrTotal = await getTop100TotalBalance(record_list, TOKEN_IDS.BRRR);
  const rheaTotal = await getTop100TotalBalance(record_list, TOKEN_IDS.RHEA);
  const xrefTotal = await getTop100TotalBalance(record_list, TOKEN_IDS.xREF);
  const xrheaTotal = await getTop100TotalBalance(record_list, TOKEN_IDS.xRHEA);

  console.log('Calculated totals:', {
    ref: refTotal,
    brrr: brrrTotal,
    rhea: rheaTotal,
    xref: xrefTotal,
    xrhea: xrheaTotal
  });

  // Get timestamp
  const timestamp = record_list[0]?.timestamp || Date.now() / 1000;

  return [{
    time: formatTimestamp(timestamp),
    ref: refTotal,
    brrr: brrrTotal,
    rhea: rheaTotal,
    xref: xrefTotal,
    xrhea: xrheaTotal
  }];
};

// 新增：处理排名变化数据（根据实际数据天数）
export const processRankingData = async (
  data: AllPagesDataResponse,
  tokenType: TokenType,
  topCount: TopCount
): Promise<RankingDataPoint[]> => {
  const { record_list } = data;
  const tokenId = TOKEN_TYPE_TO_ID[tokenType];
  
  // 检查是否有day字段（多天数据）
  const hasMultiDayData = record_list.some(record => record.day !== undefined);
  
  if (hasMultiDayData) {
    // 处理多天数据
    return processMultiDayRankingData(data, tokenType, topCount);
  } else {
    // 处理单天数据
    return processSingleDayRankingData(data, tokenType, topCount);
  }
};

// 新增：处理多天排名变化数据
export const processMultiDayRankingData = async (
  data: AllPagesDataResponse,
  tokenType: TokenType,
  topCount: TopCount
): Promise<RankingDataPoint[]> => {
  const { record_list } = data;
  const tokenId = TOKEN_TYPE_TO_ID[tokenType];
  
  // 按天分组数据
  const dailyData = new Map<number, TokenHolder[]>();
  
  record_list
    .filter(holder => holder.token_id === tokenId)
    .filter(holder => holder.rank <= topCount)
    .forEach(holder => {
      const day = holder.day || 0;
      if (!dailyData.has(day)) {
        dailyData.set(day, []);
      }
      dailyData.get(day)!.push(holder);
    });

  console.log(`Processing multi-day ranking data for ${tokenType}: ${dailyData.size} days`);

  const rankingDataPoints: RankingDataPoint[] = [];
  
  // 按天处理数据
  for (const [day, holders] of dailyData) {
    const sortedHolders = holders.sort((a, b) => a.rank - b.rank);
    const userRankings: UserRanking[] = [];
    
    for (const holder of sortedHolders) {
      const balance = await parseBalance(holder.balance, tokenId);
      userRankings.push({
        account_id: holder.account_id,
        rank: holder.rank,
        balance: balance
      });
    }

    // 计算时间戳（假设每天间隔24小时）
    const baseTimestamp = record_list[0]?.timestamp || Date.now() / 1000;
    const dayTimestamp = baseTimestamp - (day * 24 * 60 * 60);

    rankingDataPoints.push({
      time: formatTimestamp(dayTimestamp),
      userRankings: userRankings
    });
  }

  // 按时间排序
  return rankingDataPoints.sort((a, b) => {
    const dateA = new Date(a.time);
    const dateB = new Date(b.time);
    return dateA.getTime() - dateB.getTime();
  });
};

// 新增：处理单天排名数据（当没有多天数据时使用）
export const processSingleDayRankingData = async (
  data: AllPagesDataResponse,
  tokenType: TokenType,
  topCount: TopCount
): Promise<RankingDataPoint[]> => {
  const { record_list } = data;
  const tokenId = TOKEN_TYPE_TO_ID[tokenType];
  
  // 过滤指定token的数据并按排名排序
  const tokenHolders = record_list
    .filter(holder => holder.token_id === tokenId)
    .filter(holder => holder.rank <= topCount)
    .sort((a, b) => a.rank - b.rank);

  console.log(`Processing single-day ranking data for ${tokenType}: ${tokenHolders.length} holders`);

  // 获取时间戳
  const timestamp = record_list[0]?.timestamp || Date.now() / 1000;
  
  // 处理用户排名数据
  const userRankings: UserRanking[] = [];
  
  for (const holder of tokenHolders) {
    const balance = await parseBalance(holder.balance, tokenId);
    userRankings.push({
      account_id: holder.account_id,
      rank: holder.rank,
      balance: balance
    });
  }

  return [{
    time: formatTimestamp(timestamp),
    userRankings: userRankings
  }];
}; 