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
  dimension: "d" | "w" | "m";
}

export interface AllTokenHoldersResponse {
  record_list: TokenHolder[];
  total_size: number;
  dimension: "d" | "w" | "m";
}

export interface MultiDayTokenHoldersResponse {
  record_list: TokenHolder[];
  total_size: number;
  dimension: "d" | "w" | "m";
  days: number;
}

export type TimeDimension = "d" | "w" | "m";

export interface ChartDataPoint {
  time: string;
  ref: number;
  brrr: number;
  rhea: number;
  xref: number;
  xrhea: number;
}

// New: ranking change related interfaces
export type TokenType = "ref" | "brrr" | "rhea" | "xref" | "xrhea";

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

// Conversion data interfaces
export interface ConversionRecord {
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

export interface ConversionDataResponse {
  record_list: ConversionRecord[];
  page_number: number;
  page_size: number;
  total_page: number;
  total_size: number;
}

export interface AllPagesConversionDataResponse {
  record_list: ConversionRecord[];
  total_size: number;
  dimension: "d" | "w" | "m";
}

export interface ConversionChartDataPoint {
  time: string;
  ref_0week: number;
  ref_5weeks: number;
  ref_10weeks: number;
  ref_20weeks: number;
  brrr_0week: number;
  brrr_5weeks: number;
  brrr_10weeks: number;
  brrr_20weeks: number;
}

// Lock/unLock chart related interfaces
export type WeekOption = 0 | 5 | 10 | 20;

export type ChartType = "lock" | "unlock";

export interface LockUnlockChartDataPoint {
  time: string;
  total: number;
  "0week": number;
  "5week": number;
  "10week": number;
  "20week": number;
}

export interface LockUnlockChartProps {
  data: LockUnlockChartDataPoint[];
  dimension: TimeDimension;
  selectedWeeks: WeekOption[];
  chartType: ChartType;
  onWeekSelectionChange: (weeks: WeekOption[]) => void;
  onChartTypeChange: (type: ChartType) => void;
}
