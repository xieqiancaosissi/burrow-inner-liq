import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { TimeDimension, TokenType, TopCount, RankingDataPoint } from '../interface/types';

interface RankingChartProps {
  data: RankingDataPoint[];
  dimension: TimeDimension;
  tokenType: TokenType;
  topCount: TopCount;
  onDimensionChange: (dimension: TimeDimension) => void;
  onTokenTypeChange: (tokenType: TokenType) => void;
  onTopCountChange: (topCount: TopCount) => void;
}

const RankingChart: React.FC<RankingChartProps> = ({ 
  data, 
  dimension, 
  tokenType,
  topCount,
  onDimensionChange, 
  onTokenTypeChange,
  onTopCountChange
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getDimensionLabel = (dim: TimeDimension) => {
    switch (dim) {
      case 'd': return 'Daily';
      case 'w': return 'Weekly';
      case 'm': return 'Monthly';
      default: return 'Daily';
    }
  };

  const getTokenLabel = (token: TokenType) => {
    switch (token) {
      case 'ref': return 'Ref';
      case 'brrr': return 'Brrr';
      case 'rhea': return 'Rhea';
      case 'xref': return 'xRef';
      case 'xrhea': return 'xRhea';
      default: return 'Ref';
    }
  };

  const getChartOption = (isFullscreenMode: boolean = false) => {
    if (!data || data.length === 0) {
      return {
        backgroundColor: 'transparent',
        title: {
          text: `No data available for ${getTokenLabel(tokenType)}`,
          left: 'center',
          top: 'center',
          textStyle: {
            fontSize: isFullscreenMode ? 24 : 18,
            color: '#A0A0A0'
          }
        }
      };
    }

    // 处理数据：每个用户一条线
    const timePoints = data.map(item => item.time);
    const userLines: any[] = [];
    
    // 获取所有用户（前topCount名）
    const allUsers = new Set<string>();
    data.forEach(point => {
      point.userRankings.forEach(user => {
        allUsers.add(user.account_id);
      });
    });
    
    // 为每个用户创建一条线
    Array.from(allUsers).forEach((userId, index) => {
      const userData = data.map(point => {
        const userRanking = point.userRankings.find(u => u.account_id === userId);
        return userRanking ? userRanking.rank : null;
      });

      userLines.push({
        name: `${userId.slice(0, 8)}...${userId.slice(-6)}`,
        type: 'line',
        data: userData,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2
        },
        itemStyle: {
          color: getRandomColor(index)
        },
        emphasis: {
          focus: 'series'
        }
      });
    });

    return {
      backgroundColor: 'transparent',
      title: {
        text: `${getTokenLabel(tokenType)} Top${topCount} Ranking Changes (${getDimensionLabel(dimension)})`,
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: isFullscreenMode ? 24 : 18,
          fontWeight: 'bold',
          color: '#FFFFFF'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        backgroundColor: 'rgba(22, 22, 27, 0.95)',
        borderColor: '#00F7A5',
        borderWidth: 1,
        textStyle: {
          color: '#FFFFFF'
        },
        formatter: function(params: any) {
          let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
          params.forEach((param: any) => {
            if (param.value !== null) {
              result += `<div style="margin: 4px 0;">
                <span style="display: inline-block; width: 12px; height: 12px; background: ${param.color}; margin-right: 8px; border-radius: 2px;"></span>
                <span style="font-weight: 500;">${param.seriesName}:</span> 
                <span style="float: right; font-weight: bold;">Rank #${param.value}</span>
              </div>`;
            }
          });
          return result;
        }
      },
      legend: {
        data: userLines.map(line => line.name),
        top: 60,
        textStyle: {
          fontSize: isFullscreenMode ? 12 : 10,
          color: '#FFFFFF'
        },
        itemGap: 10,
        pageButtonItemGap: 5,
        pageButtonGap: 5,
        pageButtonPosition: 'end',
        pageIconColor: '#FFFFFF',
        pageIconInactiveColor: '#666666',
        pageTextStyle: {
          color: '#FFFFFF'
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: isFullscreenMode ? '20%' : '25%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timePoints,
        axisLabel: {
          fontSize: isFullscreenMode ? 14 : 12,
          color: '#A0A0A0'
        },
        axisLine: {
          lineStyle: {
            color: '#333333'
          }
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        inverse: true, // 排名越小越好，所以反转Y轴
        min: 1,
        max: topCount,
        axisLabel: {
          fontSize: isFullscreenMode ? 14 : 12,
          color: '#A0A0A0'
        },
        axisLine: {
          lineStyle: {
            color: '#333333'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#222222',
            type: 'dashed'
          }
        }
      },
      series: userLines
    };
  };

  // 生成随机颜色
  const getRandomColor = (index: number) => {
    const colors = [
      '#00F7A5', '#FF6B6B', '#4ECDC4', '#9C27B0', '#FF9800',
      '#2196F3', '#4CAF50', '#FFC107', '#9E9E9E', '#E91E63',
      '#3F51B5', '#009688', '#FF5722', '#795548', '#607D8B',
      '#00BCD4', '#8BC34A', '#FFEB3B', '#9C27B0', '#FF5722'
    ];
    return colors[index % colors.length];
  };

  const chartStyle = isFullscreen ? {
    width: '100vw',
    height: '100vh',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    zIndex: 9999,
    backgroundColor: '#000000'
  } : {
    width: '100%',
    height: '500px'
  };

  return (
    <div className="w-full">
      {/* Control buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          {/* Token Type Selector */}
          <select
            value={tokenType}
            onChange={(e) => onTokenTypeChange(e.target.value as TokenType)}
            className="px-4 py-2 bg-dark-card text-white rounded-lg border border-gray-700 focus:border-accent-green focus:outline-none"
          >
            <option value="ref">Ref</option>
            <option value="brrr">Brrr</option>
            <option value="rhea">Rhea</option>
            <option value="xref">xRef</option>
            <option value="xrhea">xRhea</option>
          </select>

          {/* Top Count Selector */}
          <select
            value={topCount}
            onChange={(e) => onTopCountChange(parseInt(e.target.value) as TopCount)}
            className="px-4 py-2 bg-dark-card text-white rounded-lg border border-gray-700 focus:border-accent-green focus:outline-none"
          >
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
          </select>

          {/* Time Dimension Buttons */}
          <button
            onClick={() => onDimensionChange('d')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              dimension === 'd' 
                ? 'bg-accent-green text-dark-bg shadow-lg' 
                : 'bg-dark-card text-gray-300 hover:bg-gray-800 border border-gray-700'
            }`}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Daily
          </button>
          <button
            onClick={() => onDimensionChange('w')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              dimension === 'w' 
                ? 'bg-accent-green text-dark-bg shadow-lg' 
                : 'bg-dark-card text-gray-300 hover:bg-gray-800 border border-gray-700'
            }`}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Weekly
          </button>
          <button
            onClick={() => onDimensionChange('m')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              dimension === 'm' 
                ? 'bg-accent-green text-dark-bg shadow-lg' 
                : 'bg-dark-card text-gray-300 hover:bg-gray-800 border border-gray-700'
            }`}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Monthly
          </button>
        </div>
        
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="px-4 py-2 bg-accent-green text-dark-bg rounded-lg hover:bg-green-400 transition-all duration-200 font-medium shadow-md flex items-center gap-2"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      {/* Chart container */}
      <div style={chartStyle}>
        <ReactECharts
          option={getChartOption(isFullscreen)}
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      {/* Close button in fullscreen mode */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 z-[10000] px-4 py-2 bg-accent-green text-dark-bg rounded-lg hover:bg-green-400 transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Close
        </button>
      )}
    </div>
  );
};

export default RankingChart; 