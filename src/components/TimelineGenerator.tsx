'use client';

import React, { useState } from 'react';

interface TimelineGeneratorProps {
  timelines: any;
}

export default function TimelineGenerator({ timelines }: TimelineGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'monthly' | 'quarterly' | 'semiannual' | 'annual'>('monthly');
  const [showAllColumns, setShowAllColumns] = useState(false);

  if (!timelines) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No timelines generated yet</p>
      </div>
    );
  }

  const tabs = [
    { key: 'monthly', label: 'Monthly', count: timelines.monthly?.columns?.length || 0 },
    { key: 'quarterly', label: 'Quarterly', count: timelines.quarterly?.columns?.length || 0 },
    { key: 'semiannual', label: 'Semi-Annual', count: timelines.semiannual?.columns?.length || 0 },
    { key: 'annual', label: 'Annual', count: timelines.annual?.columns?.length || 0 },
  ];

  const currentTimeline = timelines[activeTab];
  
  // Show limited columns initially for better performance
  const displayColumns = showAllColumns 
    ? currentTimeline?.columns || []
    : (currentTimeline?.columns || []).slice(0, 12);

  return (
    <div className="space-y-6">
      {/* Timeline Type Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Timeline Statistics */}
      {currentTimeline && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {currentTimeline.rows?.length || 0}
            </div>
            <div className="text-sm text-blue-800">Rows</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {currentTimeline.columns?.length || 0}
            </div>
            <div className="text-sm text-green-800">Columns</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {currentTimeline.start_date || 'N/A'}
            </div>
            <div className="text-sm text-purple-800">Start Date</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {currentTimeline.end_date || 'N/A'}
            </div>
            <div className="text-sm text-orange-800">End Date</div>
          </div>
        </div>
      )}

      {/* Column Display Toggle */}
      {currentTimeline?.columns && currentTimeline.columns.length > 12 && (
        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div>
            <p className="text-sm text-yellow-800">
              Showing {displayColumns.length} of {currentTimeline.columns.length} columns for better performance
            </p>
          </div>
          <button
            onClick={() => setShowAllColumns(!showAllColumns)}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded text-sm"
          >
            {showAllColumns ? 'Show Less' : 'Show All Columns'}
          </button>
        </div>
      )}

      {/* Timeline Table */}
      {currentTimeline && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="sticky left-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 z-10">
                    Field
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  {displayColumns.map((column: any, index: number) => (
                    <th key={index} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-24">
                      <div className="space-y-1">
                        <div>{column.period}</div>
                        <div className="text-gray-400">{column.date}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTimeline.rows?.map((row: any, rowIndex: number) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="sticky left-0 bg-inherit px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200 z-10">
                      {row.field_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        row.type === 'input' ? 'bg-blue-100 text-blue-800' :
                        row.type === 'calculated' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {row.unit || '-'}
                    </td>
                    {displayColumns.map((column: any, colIndex: number) => (
                      <td key={colIndex} className="px-3 py-4 text-sm text-gray-900 text-center">
                        <div className="max-w-24 truncate" title={row.values?.[colIndex]?.toString()}>
                          {row.values?.[colIndex] !== undefined && row.values[colIndex] !== null
                            ? typeof row.values[colIndex] === 'number'
                              ? row.values[colIndex].toLocaleString()
                              : row.values[colIndex]
                            : '-'
                          }
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export Options */}
      {currentTimeline && (
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              // Export to CSV logic
              console.log('Export to CSV');
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            Export to CSV
          </button>
          <button
            onClick={() => {
              // Export to Excel logic
              console.log('Export to Excel');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Export to Excel
          </button>
        </div>
      )}
    </div>
  );
}
