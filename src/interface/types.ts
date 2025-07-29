export interface TokenHolder {
  token_id: string;
  account_id: string;
  balance: string;
  index_number: number;
  rank: number;
  timestamp: number;
  day?: number; // Optional day field for multi-day data
}

export interface TokenHoldersResponse {
  record_list: TokenHolder[];
  page_number: number;
  page_size: number;
  total_page: number;
  total_size: number;
}

export interface AllPagesDataResponse {
  record_list: TokenHolder[];
  total_size: number;
  dimension: 'd' | 'w' | 'm';
}

export interface AllTokenHoldersResponse {
  record_list: TokenHolder[];
  total_size: number;
  dimension: 'd' | 'w' | 'm';
}

export interface MultiDayTokenHoldersResponse {
  record_list: TokenHolder[];
  total_size: number;
  dimension: 'd' | 'w' | 'm';
  days: number;
}

export type TimeDimension = 'd' | 'w' | 'm';

export interface ChartDataPoint {
  time: string;
  ref: number;
  brrr: number;
  rhea: number;
  xref: number;
  xrhea: number;
}

// 新增排名变化相关接口
export type TokenType = 'ref' | 'brrr' | 'rhea' | 'xref' | 'xrhea';

export type TopCount = 10 | 20 | 50 | 100;

export interface RankingDataPoint {
  time: string;
  userRankings: UserRanking[];
}

export interface UserRanking {
  account_id: string;
  rank: number;
  balance: number;
}

export interface RankingChartData {
  [tokenType: string]: RankingDataPoint[];
} 