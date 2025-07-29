import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { ChartDataPoint, TimeDimension } from '../interface/types';

interface TokenHoldersChartProps {
  data: ChartDataPoint[];
  dimension: TimeDimension;
  onDimensionChange: (dimension: TimeDimension) => void;
}

const TokenHoldersChart: React.FC<TokenHoldersChartProps> = ({ 
  data, 
  dimension, 
  onDimensionChange 
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

  const getChartOption = (isFullscreenMode: boolean = false) => {
    const times = data.map(item => item.time);
    const refData = data.map(item => item.ref);
    const brrrData = data.map(item => item.brrr);
    const rheaData = data.map(item => item.rhea);
    const xrefData = data.map(item => item.xref);
    const xrheaData = data.map(item => item.xrhea);

    return {
      backgroundColor: 'transparent',
      title: {
        text: `Ref/Brrr/Rhea/xRef/xRhea Top100 Total Changes (${getDimensionLabel(dimension)})`,
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
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0,0,0,0.1)'
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
            const value = param.value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
            result += `<div style="margin: 4px 0;">
              <span style="display: inline-block; width: 12px; height: 12px; background: ${param.color}; margin-right: 8px; border-radius: 2px;"></span>
              <span style="font-weight: 500;">${param.seriesName}:</span> 
              <span style="float: right; font-weight: bold;">${value}</span>
            </div>`;
          });
          return result;
        }
      },
      legend: {
        data: ['Ref', 'Brrr', 'Rhea', 'xRef', 'xRhea'],
        top: 60,
        textStyle: {
          fontSize: isFullscreenMode ? 16 : 14,
          color: '#FFFFFF'
        },
        itemGap: 20
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
        data: times,
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
        axisLabel: {
          fontSize: isFullscreenMode ? 14 : 12,
          color: '#A0A0A0',
          formatter: function(value: number) {
            if (value >= 1e9) {
              return (value / 1e9).toFixed(1) + 'B';
            } else if (value >= 1e6) {
              return (value / 1e6).toFixed(1) + 'M';
            } else if (value >= 1e3) {
              return (value / 1e3).toFixed(1) + 'K';
            }
            return value.toFixed(1);
          }
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
      series: [
        {
          name: 'Ref',
          type: 'bar',
          data: refData,
          barGap: '30%',
          barCategoryGap: '20%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#00F7A5' },
                { offset: 1, color: '#00D494' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#00D494' },
                  { offset: 1, color: '#00B283' }
                ]
              }
            }
          }
        },
        {
          name: 'Brrr',
          type: 'bar',
          data: brrrData,
          barGap: '30%',
          barCategoryGap: '20%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#FF6B6B' },
                { offset: 1, color: '#FF5252' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#FF5252' },
                  { offset: 1, color: '#D32F2F' }
                ]
              }
            }
          }
        },
        {
          name: 'Rhea',
          type: 'bar',
          data: rheaData,
          barGap: '30%',
          barCategoryGap: '20%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#4ECDC4' },
                { offset: 1, color: '#26A69A' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#26A69A' },
                  { offset: 1, color: '#00796B' }
                ]
              }
            }
          }
        },
        {
          name: 'xRef',
          type: 'bar',
          data: xrefData,
          barGap: '30%',
          barCategoryGap: '20%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#9C27B0' },
                { offset: 1, color: '#7B1FA2' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#7B1FA2' },
                  { offset: 1, color: '#4A148C' }
                ]
              }
            }
          }
        },
        {
          name: 'xRhea',
          type: 'bar',
          data: xrheaData,
          barGap: '30%',
          barCategoryGap: '20%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#FF9800' },
                { offset: 1, color: '#F57C00' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#F57C00' },
                  { offset: 1, color: '#E65100' }
                ]
              }
            }
          }
        }
      ]
    };
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

export default TokenHoldersChart; 