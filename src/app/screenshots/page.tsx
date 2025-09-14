"use client";

import React, { useState, useEffect } from 'react';

interface ScreenshotData {
  id: string;
  dataUrl: string;
  timestamp: string;
  selection: {
    width: number;
    height: number;
  };
  isMock?: boolean;
}

const ScreenshotsPage = () => {
  const [screenshots, setScreenshots] = useState<ScreenshotData[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<ScreenshotData | null>(null);

  useEffect(() => {
    // Load saved screenshots from localStorage
    const savedScreenshots = JSON.parse(localStorage.getItem('savedScreenshots') || '[]');
    setScreenshots(savedScreenshots);
  }, []);

  const deleteScreenshot = (id: string) => {
    const updatedScreenshots = screenshots.filter(s => s.id !== id);
    setScreenshots(updatedScreenshots);
    localStorage.setItem('savedScreenshots', JSON.stringify(updatedScreenshots));
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Screenshot Gallery</h1>
          <p className="text-gray-600">View and manage your saved screenshots</p>
        </div>

        {screenshots.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📸</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No screenshots yet</h3>
            <p className="text-gray-600">Take some screenshots to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {screenshots.map((screenshot) => (
              <div
                key={screenshot.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedScreenshot(screenshot)}
              >
                <div className="relative">
                  <img
                    src={screenshot.dataUrl}
                    alt="Screenshot"
                    className="w-full h-48 object-cover"
                  />
                  {screenshot.isMock && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                      Mock
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      {screenshot.selection.width} x {screenshot.selection.height}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteScreenshot(screenshot.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatDate(screenshot.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for viewing screenshot */}
      {selectedScreenshot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Screenshot Details</h3>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              <img
                src={selectedScreenshot.dataUrl}
                alt="Screenshot"
                className="w-full h-auto border rounded"
              />
            </div>
            <div className="p-4 border-t bg-gray-50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Size:</span> {selectedScreenshot.selection.width} x {selectedScreenshot.selection.height}
                </div>
                <div>
                  <span className="font-medium">Date:</span> {formatDate(selectedScreenshot.timestamp)}
                </div>
                <div>
                  <span className="font-medium">ID:</span> {selectedScreenshot.id}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {selectedScreenshot.isMock ? 'Mock Screenshot' : 'Real Screenshot'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotsPage;
