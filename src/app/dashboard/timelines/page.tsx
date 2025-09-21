'use client';

import React, { useState } from 'react';
import RouteProtection from "@/components/RouteProtection";
import DashboardLayout from "@/components/DashboardLayout";
import TimelineInputs from "@/components/TimelineInputs";
import TimelineGenerator from "@/components/TimelineGenerator";

export default function TimelinesPage() {
  const [timelineInputs, setTimelineInputs] = useState<any>({});
  const [generatedTimelines, setGeneratedTimelines] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputsChange = (inputs: any) => {
    setTimelineInputs(inputs);
  };

  const handleGenerateTimelines = async () => {
    setIsGenerating(true);
    try {
      console.log('Sending timeline inputs:', timelineInputs);
      
      // Call backend API to generate timelines
      const response = await fetch('/api/timelines/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timelineInputs),
      });
      
      if (response.ok) {
        const timelines = await response.json();
        console.log('Received timelines:', timelines);
        setGeneratedTimelines(timelines);
      } else {
        const errorData = await response.json();
        console.error('Failed to generate timelines:', response.status, errorData);
        alert(`Failed to generate timelines: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error generating timelines:', error);
      alert(`Error generating timelines: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <RouteProtection requireAuth={true}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Project Timelines</h1>
            <p className="mt-2 text-gray-600">
              Configure timeline assumptions and generate monthly, quarterly, semi-annual, and annual timelines
            </p>
          </div>

          <div className="space-y-8">
            {/* Timeline Inputs Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Timeline Inputs</h2>
                <p className="text-sm text-gray-600">Enter project timeline assumptions</p>
              </div>
              <div className="p-6">
                <TimelineInputs 
                  inputs={timelineInputs}
                  onChange={handleInputsChange}
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="text-center">
              <button
                onClick={handleGenerateTimelines}
                disabled={isGenerating || Object.keys(timelineInputs).length === 0}
                className={`px-8 py-3 rounded-lg text-white font-medium ${
                  isGenerating || Object.keys(timelineInputs).length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Timelines...
                  </div>
                ) : (
                  'Generate Timelines'
                )}
              </button>
            </div>

            {/* Generated Timelines Display */}
            {generatedTimelines && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Generated Timelines</h2>
                  <p className="text-sm text-gray-600">Monthly, quarterly, semi-annual, and annual timelines</p>
                </div>
                <div className="p-6">
                  <TimelineGenerator timelines={generatedTimelines} />
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </RouteProtection>
  );
}
