import React, { useState } from 'react';

interface ChartConfig {
  id: string;
  title: string;
  component: React.ReactNode;
  description: string;
}

interface DashboardLayoutProps {
  charts: ChartConfig[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ charts }) => {
  const [layout, setLayout] = useState<'grid' | 'list' | 'tabs'>('grid');
  const [activeTab, setActiveTab] = useState(0);

  const renderGridLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {charts.map((chart, index) => (
        <div key={chart.id} className="bg-dark-card rounded-xl shadow-lg p-6 border border-gray-800">
          {chart.component}
        </div>
      ))}
    </div>
  );

  const renderListLayout = () => (
    <div className="space-y-6">
      {charts.map((chart, index) => (
        <div key={chart.id} className="bg-dark-card rounded-xl shadow-lg p-6 border border-gray-800">
          {chart.component}
        </div>
      ))}
    </div>
  );

  const renderTabsLayout = () => (
    <div className="bg-dark-card rounded-xl shadow-lg border border-gray-800">
      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <nav className="flex flex-wrap px-6" aria-label="Tabs">
          {charts.map((chart, index) => (
            <button
              key={chart.id}
              onClick={() => setActiveTab(index)}
              className={`py-4 px-3 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap ${
                activeTab === index
                  ? 'border-accent-green text-accent-green'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              {chart.title.length > 20 ? chart.title.substring(0, 20) + '...' : chart.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {charts[activeTab].component}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Layout Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setLayout('grid')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              layout === 'grid'
                ? 'bg-accent-green text-dark-bg shadow-lg'
                : 'bg-dark-card text-gray-300 hover:bg-gray-800 border border-gray-700'
            }`}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Grid View
          </button>
          <button
            onClick={() => setLayout('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              layout === 'list'
                ? 'bg-accent-green text-dark-bg shadow-lg'
                : 'bg-dark-card text-gray-300 hover:bg-gray-800 border border-gray-700'
            }`}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            List View
          </button>
          <button
            onClick={() => setLayout('tabs')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              layout === 'tabs'
                ? 'bg-accent-green text-dark-bg shadow-lg'
                : 'bg-dark-card text-gray-300 hover:bg-gray-800 border border-gray-700'
            }`}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Tab View
          </button>
        </div>
        
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10.414 13H12a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {charts.length} charts available
        </div>
      </div>

      {/* Chart Layout */}
      {layout === 'grid' && renderGridLayout()}
      {layout === 'list' && renderListLayout()}
      {layout === 'tabs' && renderTabsLayout()}
    </div>
  );
};

export default DashboardLayout; 