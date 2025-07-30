import React, { useState, useEffect } from "react";
import { getAllPagesData, getAllPagesConversionData } from "../services/api";
import {
  processTokenHoldersData,
  processRankingData,
  processMultiDayHoldingsData,
  processConversionData,
  processLockUnlockData,
} from "../utils/dataProcessor";
import {
  ChartDataPoint,
  TimeDimension,
  TokenType,
  TopCount,
  RankingDataPoint,
  ConversionChartDataPoint,
  LockUnlockChartDataPoint,
  WeekOption,
  ChartType,
} from "../interface/types";
import DashboardLayout from "../components/DashboardLayout";
import Loading from "../components/Loading";
import TokenHoldersChart from "../components/TokenHoldersChart";
import RankingChart from "../components/RankingChart";
import HoldingsChart from "@/components/HoldingsChart";
import ConversionChart from "../components/ConversionChart";
import LockUnlockChart from "../components/LockUnlockChart";
import TimeDimensionSelector from "../components/TimeDimensionSelector";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [rankingData, setRankingData] = useState<RankingDataPoint[]>([]);
  const [holdingsData, setHoldingsData] = useState<RankingDataPoint[]>([]);
  const [conversionData, setConversionData] = useState<ConversionChartDataPoint[]>([]);
  const [lockUnlockData, setLockUnlockData] = useState<LockUnlockChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [dimension, setDimension] = useState<TimeDimension>("d");
  const [selectedToken, setSelectedToken] = useState<TokenType>("ref");
  const [selectedTopCount, setSelectedTopCount] = useState<TopCount>(10);
  const [selectedWeeks, setSelectedWeeks] = useState<WeekOption[]>([0, 5, 10, 20]);
  const [chartType, setChartType] = useState<ChartType>("lock");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(`Fetching data for dimension: ${dimension}`);

        // Get all pages data
        const response = await getAllPagesData(dimension);
        console.log("API response:", response);

        // Get conversion data
        const conversionResponse = await getAllPagesConversionData(dimension);
        console.log("Conversion API response:", conversionResponse);

        if (response.record_list && response.record_list.length > 0) {
          // Process data for total changes chart
          const processedData = await processTokenHoldersData(response);
          console.log("Processed data:", processedData);
          setData(processedData);

          // Process data for ranking chart using the same data
          const processedRankingData = await processRankingData(
            response,
            selectedToken,
            selectedTopCount
          );
          console.log("Processed ranking data:", processedRankingData);
          setRankingData(processedRankingData);

          const processedHoldingsData = await processMultiDayHoldingsData(
            response,
            selectedToken,
            selectedTopCount
          );
          setHoldingsData(processedHoldingsData);
        } else {
          console.warn("No data received from API");
          setData([]);
          setRankingData([]);
          setHoldingsData([]);
        }

        // Process conversion data
        if (conversionResponse.record_list && conversionResponse.record_list.length > 0) {
          const processedConversionData = await processConversionData(conversionResponse);
          console.log("Processed conversion data:", processedConversionData);
          setConversionData(processedConversionData);

          // Process lock/unlock data using the same conversion data
          const processedLockUnlockData = await processLockUnlockData(conversionResponse, chartType);
          console.log("Processed lock/unlock data:", processedLockUnlockData);
          setLockUnlockData(processedLockUnlockData);
        } else {
          console.warn("No conversion data received from API");
          setConversionData([]);
          setLockUnlockData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
        setRankingData([]);
        setHoldingsData([]);
        setConversionData([]);
        setLockUnlockData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dimension, selectedToken, selectedTopCount, chartType]);

  if (loading) {
    return <Loading />;
  }

  const handleDimensionChange = (newDimension: TimeDimension) => {
    setDimension(newDimension);
  };

  const handleTokenTypeChange = (newTokenType: TokenType) => {
    setSelectedToken(newTokenType);
  };

  const handleTopCountChange = (newTopCount: TopCount) => {
    setSelectedTopCount(newTopCount);
  };

  const handleWeekSelectionChange = (weeks: WeekOption[]) => {
    setSelectedWeeks(weeks);
  };

  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
  };

  // Define chart configurations
  const charts = [
    {
      id: "total-changes",
      title: "Ref/Brrr/Rhea Top100 Total Changes",
      description:
        "Shows the total changes in Top100 holders for Ref, Brrr, and Rhea tokens over time.",
      component: (
        <div className="bg-dark-card rounded-lg p-4">
          {data.length > 0 ? (
            <TokenHoldersChart data={data} dimension={dimension} />
          ) : (
            <div className="text-center py-8 text-gray-400">
              No data available
            </div>
          )}
        </div>
      ),
    },
    {
      id: "ranking-changes",
      title: "Ref/Brrr/Rhea/xRef/xRhea Ranking Changes",
      description:
        "Shows ranking changes for Top holders. Each line represents a user.",
      component: (
        <div className="bg-dark-card rounded-lg p-4">
          {rankingData.length > 0 ? (
            <RankingChart
              data={rankingData}
              dimension={dimension}
              tokenType={selectedToken}
              topCount={selectedTopCount}
              onTokenTypeChange={handleTokenTypeChange}
              onTopCountChange={handleTopCountChange}
            />
          ) : (
            <div className="text-center py-8 text-gray-400">
              No data available
            </div>
          )}
        </div>
      ),
    },
    {
      id: "holdings",
      title: "Ref/Brrr/Rhea Holdings",
      description: "Shows holdings distribution for Top holders.",
      component: (
        <div className="bg-dark-card rounded-lg p-4 h-[600px] flex flex-col">
          {holdingsData.length > 0 ? (
            <HoldingsChart
              data={holdingsData}
              dimension={dimension}
              tokenType={selectedToken}
              topCount={selectedTopCount}
              onTokenTypeChange={handleTokenTypeChange}
              onTopCountChange={handleTopCountChange}
            />
          ) : (
            <div className="text-center py-8 text-gray-400">
              No data available
            </div>
          )}
        </div>
      ),
    },
    {
      id: "circulation",
      title: "Rhea/xRhea Circulation Changes",
      description:
        "Shows circulation quantity changes for Rhea and xRhea tokens.",
      component: (
        <div className="bg-dark-card rounded-lg p-4 h-[600px] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Rhea/xRhea Circulation Changes
          </h2>
        </div>
      ),
    },
    {
      id: "conversion",
      title: "Ref/Brrr Conversion Data",
      description: "Shows conversion data for Ref and Brrr tokens by locking duration.",
      component: (
        <div className="bg-dark-card rounded-lg p-4 h-[600px] flex flex-col">
          {conversionData.length > 0 ? (
            <ConversionChart
              data={conversionData}
              dimension={dimension}
            />
          ) : (
            <div className="text-center py-8 text-gray-400">
              No conversion data available
            </div>
          )}
        </div>
      ),
    },
    {
      id: "lock-unlock",
      title: "User Convert Lock/unLock Top100",
      description: "Shows lock/unlock data for Top100 users.",
      component: (
        <div className="bg-dark-card rounded-lg p-4 h-[600px] flex flex-col">
          <LockUnlockChart
            data={lockUnlockData}
            dimension={dimension}
            selectedWeeks={selectedWeeks}
            chartType={chartType}
            onWeekSelectionChange={handleWeekSelectionChange}
            onChartTypeChange={handleChartTypeChange}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Rhea Dashboard</h1>
          <p className="text-gray-400">Token Analytics & Insights</p>
        </div>
        <DashboardLayout charts={charts}>
          <TimeDimensionSelector
            dimension={dimension}
            onChange={handleDimensionChange}
          />
        </DashboardLayout>
      </div>
    </div>
  );
};

export default Dashboard;
