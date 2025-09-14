"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface ScreenshotCommentProps {
  versionId: string;
  onScreenshotSubmit: (versionId: string, screenshot: string, annotations?: string) => void;
}

const ScreenshotComment: React.FC<ScreenshotCommentProps> = ({
  versionId,
  onScreenshotSubmit
}) => {
  const [pendingScreenshot, setPendingScreenshot] = useState<string | null>(null);
  const [pendingAnnotations, setPendingAnnotations] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check for pending screenshot
    const checkPendingScreenshot = () => {
      const stored = localStorage.getItem('pendingScreenshot');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setPendingScreenshot(data.screenshot);
          setPendingAnnotations(data.annotations || null);
        } catch (error) {
          console.error('Error parsing screenshot data:', error);
        }
      }
    };

    checkPendingScreenshot();
    
    // Listen for storage changes
    window.addEventListener('storage', checkPendingScreenshot);
    
    return () => {
      window.removeEventListener('storage', checkPendingScreenshot);
    };
  }, []);

  const handleSubmitScreenshot = async () => {
    if (!pendingScreenshot) return;
    
    setIsSubmitting(true);
    
    try {
      // Save to database first
      const response = await fetch('/api/screenshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionId,
          screenshotData: pendingScreenshot,
          annotations: pendingAnnotations,
          userId: 'anonymous-user'
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Submit to comment system
          onScreenshotSubmit(versionId, pendingScreenshot, pendingAnnotations || undefined);
          
          // Clear the pending screenshot
          localStorage.removeItem('pendingScreenshot');
          setPendingScreenshot(null);
          setPendingAnnotations(null);
        } else {
          alert('Failed to save screenshot to database.');
        }
      } else {
        alert('Failed to save screenshot. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting screenshot:', error);
      alert('Error submitting screenshot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscardScreenshot = () => {
    localStorage.removeItem('pendingScreenshot');
    setPendingScreenshot(null);
    setPendingAnnotations(null);
  };

  if (!pendingScreenshot) return null;

  return (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Screenshot Ready
          </h4>
          
          <div className="mb-3">
            <Image
              src={pendingScreenshot}
              alt="Screenshot preview"
              width={400}
              height={300}
              className="max-w-xs max-h-32 border border-gray-300 rounded shadow-sm"
            />
            {pendingAnnotations && (
              <div className="mt-2 text-xs text-blue-600">
                ✓ Contains annotations
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSubmitScreenshot}
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add to Comments'}
            </button>
            <button
              onClick={handleDiscardScreenshot}
              disabled={isSubmitting}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm disabled:opacity-50"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenshotComment;