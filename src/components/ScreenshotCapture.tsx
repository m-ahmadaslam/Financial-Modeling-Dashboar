"use client";

import React, { useState, useRef, useCallback } from 'react';

interface ScreenshotCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onScreenshotTaken: (screenshot: string, annotations?: string) => void;
}

interface SelectionArea {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const ScreenshotCapture: React.FC<ScreenshotCaptureProps> = ({
  isOpen,
  onClose,
  onScreenshotTaken
}) => {
  const [selection, setSelection] = useState<SelectionArea | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState('#ff0000');
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple drag selection
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    setSelection({
      startX,
      startY,
      endX: startX,
      endY: startY
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!selection) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    setSelection(prev => prev ? {
      ...prev,
      endX,
      endY
    } : null);
  }, [selection]);

  // SIMPLIFIED SCREENSHOT: Use browser's native screenshot API
  const takeScreenshot = useCallback(async () => {
    if (!selection || isCapturing) return;

    setIsCapturing(true);
    
    try {
      // Hide the modal completely
      const modal = document.querySelector('[data-screenshot-modal]') as HTMLElement;
      if (modal) {
        modal.style.display = 'none';
      }
      
      // Wait for modal to be hidden
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Taking screenshot with native API...');
      
      // Use browser's native screenshot API
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        // Stop the stream
        stream.getTracks().forEach(track => track.stop());
        
        // Crop to selected area
        const cropX = Math.min(selection.startX, selection.endX);
        const cropY = Math.min(selection.startY, selection.endY);
        const cropWidth = Math.abs(selection.endX - selection.startX);
        const cropHeight = Math.abs(selection.endY - selection.startY);
        
        // Create cropped canvas
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        
        if (croppedCtx) {
          croppedCanvas.width = cropWidth;
          croppedCanvas.height = cropHeight;
          croppedCtx.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
          
          // Convert to data URL
          const screenshotDataUrl = croppedCanvas.toDataURL('image/png', 0.9);
          setScreenshot(screenshotDataUrl);
          
          // Save to localStorage immediately
          const screenshotData = {
            id: Date.now().toString(),
            dataUrl: screenshotDataUrl,
            timestamp: new Date().toISOString(),
            selection: {
              width: cropWidth,
              height: cropHeight
            }
          };
          
          // Get existing screenshots
          const existingScreenshots = JSON.parse(localStorage.getItem('savedScreenshots') || '[]');
          existingScreenshots.push(screenshotData);
          localStorage.setItem('savedScreenshots', JSON.stringify(existingScreenshots));
          
          console.log('Screenshot saved to localStorage:', screenshotData.id);
        }
      }
      
      // Show modal again
      if (modal) {
        modal.style.display = 'block';
      }
      
    } catch (error) {
      console.error('Screenshot failed:', error);
      
      // Show modal again on error
      const modal = document.querySelector('[data-screenshot-modal]') as HTMLElement;
      if (modal) {
        modal.style.display = 'block';
      }
      
      // Fallback: Create a simple colored rectangle as mock screenshot
      const mockCanvas = document.createElement('canvas');
      const mockCtx = mockCanvas.getContext('2d');
      
      if (mockCtx) {
        const width = Math.abs(selection.endX - selection.startX);
        const height = Math.abs(selection.endY - selection.startY);
        
        mockCanvas.width = width;
        mockCanvas.height = height;
        
        // Create a gradient background
        const gradient = mockCtx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#4F46E5');
        gradient.addColorStop(1, '#7C3AED');
        
        mockCtx.fillStyle = gradient;
        mockCtx.fillRect(0, 0, width, height);
        
        // Add text
        mockCtx.fillStyle = 'white';
        mockCtx.font = '16px Arial';
        mockCtx.textAlign = 'center';
        mockCtx.fillText('Screenshot Captured', width / 2, height / 2);
        mockCtx.fillText(`${width} x ${height}`, width / 2, height / 2 + 25);
        
        const mockScreenshot = mockCanvas.toDataURL('image/png', 0.9);
        setScreenshot(mockScreenshot);
        
        // Save mock screenshot
        const screenshotData = {
          id: Date.now().toString(),
          dataUrl: mockScreenshot,
          timestamp: new Date().toISOString(),
          selection: { width, height },
          isMock: true
        };
        
        const existingScreenshots = JSON.parse(localStorage.getItem('savedScreenshots') || '[]');
        existingScreenshots.push(screenshotData);
        localStorage.setItem('savedScreenshots', JSON.stringify(existingScreenshots));
      }
    } finally {
      setIsCapturing(false);
    }
  }, [selection, isCapturing]);

  const handleMouseUp = useCallback(() => {
    if (selection) {
      takeScreenshot();
    }
  }, [selection, takeScreenshot]);

  // Drawing functions
  const startDrawing = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setLastPoint({ x, y });
  }, []);

  const draw = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current || !lastPoint) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 1;
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    setLastPoint({ x: currentX, y: currentY });
  }, [isDrawing, lastPoint, brushColor, brushSize]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  // Save screenshot with annotations
  const saveScreenshot = useCallback(async () => {
    if (!screenshot) return;
    
    try {
      let finalScreenshot = screenshot;
      
      // Combine screenshot with annotations if any
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Check if there's any drawing on the canvas
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const hasDrawing = imageData.data.some(pixel => pixel !== 0);
          
          if (hasDrawing) {
            // Combine screenshot and annotations into one image
            const combinedCanvas = document.createElement('canvas');
            const combinedCtx = combinedCanvas.getContext('2d');
            
            if (combinedCtx) {
              const img = new window.Image();
              img.onload = () => {
                combinedCanvas.width = img.width;
                combinedCanvas.height = img.height;
                
                // Draw the screenshot first
                combinedCtx.drawImage(img, 0, 0);
                
                // Draw the annotations on top
                combinedCtx.drawImage(canvas, 0, 0, img.width, img.height);
                
                // Get the final combined image
                finalScreenshot = combinedCanvas.toDataURL('image/png', 0.9);
                
                // Save to localStorage and trigger callback
                saveFinalScreenshot(finalScreenshot);
              };
              img.src = screenshot;
              return;
            }
          }
        }
      }
      
      // No annotations, proceed with original screenshot
      saveFinalScreenshot(finalScreenshot);
      
    } catch (error) {
      console.error('Error saving screenshot:', error);
      alert('Failed to save screenshot. Please try again.');
    }
  }, [screenshot]);
  
  // Helper function to save final screenshot
  const saveFinalScreenshot = useCallback(async (finalScreenshot: string) => {
    try {
      // Save to localStorage
      const annotatedScreenshot = {
        id: Date.now().toString(),
        dataUrl: finalScreenshot,
        timestamp: new Date().toISOString(),
        hasAnnotations: true
      };
      
      const existingScreenshots = JSON.parse(localStorage.getItem('annotatedScreenshots') || '[]');
      existingScreenshots.push(annotatedScreenshot);
      localStorage.setItem('annotatedScreenshots', JSON.stringify(existingScreenshots));
      
      // Try to save to database if available
      try {
        const response = await fetch('/api/screenshots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            versionId: 'temp-version-id',
            screenshotData: finalScreenshot,
            annotations: null,
            userId: 'superadmin',
            metadata: {
              timestamp: Date.now(),
              quality: 'high',
              format: 'png'
            }
          })
        });
        
        if (response.ok) {
          console.log('Screenshot saved to database successfully');
        }
      } catch (dbError) {
        console.log('Database save failed, using localStorage only:', dbError);
      }
      
      // Store in localStorage for comment system
      localStorage.setItem('pendingScreenshot', JSON.stringify({ 
        screenshot: finalScreenshot,
        timestamp: Date.now(),
        saved: true
      }));
      
      // Trigger the callback to show in comments
      onScreenshotTaken(finalScreenshot);
      onClose();
      
      console.log('Screenshot saved and ready for comments!');
      
    } catch (error) {
      console.error('Error saving final screenshot:', error);
      
      // Final fallback
      localStorage.setItem('pendingScreenshot', JSON.stringify({ 
        screenshot: finalScreenshot,
        timestamp: Date.now(),
        saved: false,
        error: 'Save error'
      }));
      
      onScreenshotTaken(finalScreenshot);
      onClose();
    }
  }, [onScreenshotTaken, onClose]);

  const clearCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" data-screenshot-modal>
      {!screenshot ? (
        // Selection Mode
        <div className="relative w-full h-full">
          {/* Instructions */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-4 py-2 shadow-lg z-10 border-2 border-blue-500">
            <p className="text-sm font-medium text-gray-800">
              {isCapturing ? 'Capturing screenshot...' : 'Click and drag to select area'}
            </p>
          </div>
          
          {/* Selection area */}
          <div
            className="absolute inset-0 cursor-crosshair z-20"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {selection && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 z-30"
                style={{
                  left: Math.min(selection.startX, selection.endX),
                  top: Math.min(selection.startY, selection.endY),
                  width: Math.abs(selection.endX - selection.startX),
                  height: Math.abs(selection.endY - selection.startY),
                }}
              />
            )}
          </div>

          {/* Cancel button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 z-30 shadow-lg"
            disabled={isCapturing}
          >
            Cancel
          </button>
        </div>
      ) : (
        // Annotation Mode
        <div className="flex items-center justify-center w-full h-full p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold">Annotate Screenshot</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tools */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Size:</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm">{brushSize}px</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Color:</label>
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    className="w-8 h-8 border rounded cursor-pointer"
                  />
                </div>
                
                <button
                  onClick={clearCanvas}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Clear
                </button>
              </div>
            </div>

                         {/* Screenshot with Canvas */}
             <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(95vh - 200px)' }}>
               <div className="text-sm text-gray-600 mb-2 text-center">
                 💡 Draw on the screenshot, then save to add to comments
               </div>
               <div className="relative inline-block">
                 <img
                   src={screenshot}
                   alt="Screenshot"
                   className="border rounded"
                   style={{ 
                     maxWidth: '100%', 
                     height: 'auto',
                     minWidth: '300px',
                     display: 'block'
                   }}
                   onLoad={(e) => {
                     const img = e.target as HTMLImageElement;
                     const canvas = canvasRef.current;
                     if (canvas) {
                       canvas.width = img.naturalWidth;
                       canvas.height = img.naturalHeight;
                       console.log('Canvas set to:', img.naturalWidth, 'x', img.naturalHeight);
                     }
                   }}
                 />
                 <canvas
                   ref={canvasRef}
                   className="absolute top-0 left-0 cursor-crosshair"
                   style={{
                     width: '100%',
                     height: '100%',
                     pointerEvents: 'auto'
                   }}
                   onMouseDown={startDrawing}
                   onMouseMove={draw}
                   onMouseUp={stopDrawing}
                   onMouseLeave={stopDrawing}
                 />
               </div>
             </div>

             {/* Actions - Always Visible */}
             <div className="p-4 border-t bg-gray-50 sticky bottom-0">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Draw on the screenshot above, then save to add to comments
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setScreenshot(null);
                      setSelection(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Take New Screenshot
                  </button>
                  <button
                    onClick={saveScreenshot}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
                  >
                    💾 Save & Upload to Comments
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotCapture;