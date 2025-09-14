"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from 'next/image';
import ScreenshotComment from './ScreenshotComment';
import { 
  EyeIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  UserIcon,
  HeartIcon,
  XMarkIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface VersionHistoryProps {
  versions: ProjectVersion[];
  onDeleteVersion: (versionId: string) => void;
  onViewVersion: (versionId: string) => void;
  onCreateNewVersion: (parentProject: ProjectVersion) => void;
  deleteLoading?: string | null;
  versionLoading?: string | null;
}

interface ProjectVersion {
  _id: string;
  projectName: string;
  projectReference: string;
  projectType: string;
  country: string;
  city: string;
  stage: string;
  currentStep: number;
  lastSaved: string;
  status: string;
  formData: Record<string, string>;
  version?: string;
  lifecyclePhase?: string;
  parentProjectId?: string;
  isLatestVersion?: boolean;
  totalVersions?: number;
  comments?: Comment[];
}

interface Comment {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  drawing?: string; // Base64 encoded drawing data
  timestamp: string;
  likes: string[];
  replies?: Comment[];
}

interface DrawingCanvasProps {
  onSave: (drawing: string) => void;
  onCancel: () => void;
}

// Drawing Canvas Component
const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onSave, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#3B82F6';

    if (currentPath.length > 0) {
      const lastPoint = currentPath[currentPath.length - 1];
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    setCurrentPath(prev => [...prev, { x, y }]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL();
    onSave(dataURL);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900">Draw or Write</h4>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
      
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="border border-gray-300 rounded-lg cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={clearCanvas}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={saveDrawing}
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Comment Component
const CommentComponent: React.FC<{
  comment: Comment;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
}> = ({ comment, onLike, onReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const currentUserId = 'current-user'; // This should come from auth context

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment._id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        {comment.userAvatar ? (
          <Image
            src={comment.userAvatar}
            alt={comment.userName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-900">{comment.userName}</span>
            <span className="text-xs text-gray-500">
              {new Date(comment.timestamp).toLocaleDateString()}
            </span>
          </div>
          
          {comment.content && (
            <p className="text-sm text-gray-800">{comment.content}</p>
          )}
          
          {comment.drawing && (
            <div className="mt-2">
              <Image
                src={comment.drawing}
                alt="Drawing"
                width={400}
                height={300}
                className="max-w-full h-auto rounded border border-gray-200"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4 mt-1">
          <button
            onClick={() => onLike(comment._id)}
            className={`flex items-center space-x-1 text-xs ${
              comment.likes.includes(currentUserId)
                ? 'text-red-600'
                : 'text-gray-500 hover:text-red-600'
            }`}
          >
            {comment.likes.includes(currentUserId) ? (
              <HeartSolidIcon className="w-3 h-3" />
            ) : (
              <HeartIcon className="w-3 h-3" />
            )}
            <span>{comment.likes.length}</span>
          </button>
          
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Reply
          </button>
        </div>
        
        {isReplying && (
          <div className="mt-2 flex space-x-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 text-sm border border-gray-300 rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleReply()}
            />
            <button
              onClick={handleReply}
              className="text-blue-600 hover:text-blue-700"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 ml-4 space-y-2">
            {comment.replies.map((reply) => (
              <CommentComponent
                key={reply._id}
                comment={reply}
                onLike={onLike}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function LifecycleVersionHistory({
  versions,
  onDeleteVersion,
  onViewVersion,
  onCreateNewVersion,
  deleteLoading,
  versionLoading
}: VersionHistoryProps) {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showDrawing, setShowDrawing] = useState<{ [key: string]: boolean }>({});
  const [versionComments, setVersionComments] = useState<{ [key: string]: Comment[] }>({});

  // Load comments from localStorage on component mount
  useEffect(() => {
    const savedComments = localStorage.getItem('versionComments');
    console.log('Loading saved comments from localStorage:', savedComments);
    if (savedComments) {
      try {
        const parsed = JSON.parse(savedComments);
        console.log('Parsed comments:', parsed);
        setVersionComments(parsed);
      } catch (error) {
        console.error('Error loading saved comments:', error);
      }
    }
  }, []);

  // Check for pending screenshots
  useEffect(() => {
    const checkPendingScreenshot = () => {
      const pendingScreenshot = localStorage.getItem('pendingScreenshot');
      if (pendingScreenshot) {
        try {
          const screenshotData = JSON.parse(pendingScreenshot);
          // Show screenshot in the first available comment section
          const firstVersionId = versions[0]?._id;
          if (firstVersionId) {
            setShowDrawing(prev => ({ ...prev, [firstVersionId]: true }));
            // You can also auto-populate the drawing with the screenshot
            console.log('Pending screenshot detected:', screenshotData);
          }
        } catch (error) {
          console.error('Error parsing pending screenshot:', error);
        }
      }
    };

    checkPendingScreenshot();
    
    // Check every second for pending screenshots
    const interval = setInterval(checkPendingScreenshot, 1000);
    return () => clearInterval(interval);
  }, [versions]);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(versionComments).length > 0) {
      localStorage.setItem('versionComments', JSON.stringify(versionComments));
    }
  }, [versionComments]);

  // Group versions into rows of 3
  const groupedVersions = [];
  for (let i = 0; i < versions.length; i += 3) {
    groupedVersions.push(versions.slice(i, i + 3));
  }

  const toggleComments = (versionId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(versionId)) {
        newSet.delete(versionId);
      } else {
        newSet.add(versionId);
      }
      return newSet;
    });
  };

  const handleScreenshotComment = (versionId: string, screenshot: string, annotations?: string) => {
    const newCommentObj: Comment = {
      _id: Date.now().toString(),
      userId: 'anonymous-user',
      userName: 'Super Admin',
      userAvatar: undefined,
              content: 'Screenshot added',
        drawing: annotations || screenshot, // Store annotations if available, otherwise screenshot
      timestamp: new Date().toISOString(),
      likes: [],
      replies: []
    };

    // Add to local state immediately for instant feedback
    setVersionComments(prev => {
      const updated = {
        ...prev,
        [versionId]: [...(prev[versionId] || []), newCommentObj]
      };
      console.log('Adding screenshot comment, updated state:', updated);
      return updated;
    });
  };

  const handleAddComment = async (versionId: string, content?: string, drawing?: string) => {
    // Create notification for comment
    if (content || drawing) {
      const { createNotification, notificationTemplates } = await import('@/lib/notifications');
      const notificationData = notificationTemplates.commentAdded(
        'Project Name',
        content || 'Drawing comment',
        versionId
      );
      
      await createNotification(
        'superadmin',
        notificationData.type,
        notificationData.title,
        notificationData.message,
        notificationData.reference,
        notificationData.relatedId,
        'medium',
        notificationData.actionUrl
      );
    }
    try {
      const response = await fetch('/api/projects/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionId,
          content,
          drawing
        })
      });

      if (response.ok) {
        // Reset form
        if (content) {
          setNewComment(prev => ({ ...prev, [versionId]: '' }));
        }
        if (drawing) {
          setShowDrawing(prev => ({ ...prev, [versionId]: false }));
        }
        
        // Don't refresh - just update local state for instant feedback
        const newCommentObj: Comment = {
          _id: Date.now().toString(),
          userId: 'anonymous-user',
          userName: 'Super Admin',
          userAvatar: undefined,
          content: content || '',
          drawing: drawing || undefined,
          timestamp: new Date().toISOString(),
          likes: [],
          replies: []
        };

        // Add to local state immediately for instant feedback
        setVersionComments(prev => {
          const updated = {
            ...prev,
            [versionId]: [...(prev[versionId] || []), newCommentObj]
          };
          console.log('Adding comment, updated state:', updated);
          return updated;
        });
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const response = await fetch('/api/projects/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          action: 'like'
        })
      });

      if (response.ok) {
        // Update likes locally for instant feedback
        setVersionComments(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(versionId => {
            updated[versionId] = updated[versionId].map(comment => {
              if (comment._id === commentId) {
                const isLiked = comment.likes.includes('anonymous-user');
                return {
                  ...comment,
                  likes: isLiked 
                    ? comment.likes.filter(id => id !== 'anonymous-user')
                    : [...comment.likes, 'anonymous-user']
                };
              }
              return comment;
            });
          });
          return updated;
        });
      } else {
        console.error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleReplyToComment = async (commentId: string, content: string) => {
    try {
      const response = await fetch('/api/projects/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionId: commentId, // This will be updated to use proper parent logic
          content,
          parentCommentId: commentId
        })
      });

      if (response.ok) {
        // Refresh to show new reply
        window.location.reload();
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return (
    <div className="space-y-8">
      {groupedVersions.map((versionGroup, groupIndex) => (
        <div key={groupIndex} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Version Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {versionGroup.map((version) => (
              <div key={version._id} className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                {/* Version Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      v{version.version || version.formData?.version || '1.0'}
                    </div>
                    {version.isLatestVersion && (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Latest
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onViewVersion(version._id)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="View Version"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    
                    {version.status === 'completed' && version.isLatestVersion && (
                      <button
                        onClick={() => onCreateNewVersion(version)}
                        disabled={versionLoading === version._id}
                        className="p-1 text-orange-600 hover:bg-orange-50 rounded disabled:opacity-50"
                        title="Create New Version"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                    )}
                    
                    {version.status === 'draft' && (
                      <button
                        onClick={() => onDeleteVersion(version._id)}
                        disabled={deleteLoading === version._id}
                        className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                        title="Delete Version"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Version Info */}
                <div className="space-y-2 mb-4">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {version.projectName || 'Untitled Project'}
                  </h3>
                  
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <CalendarIcon className="w-3 h-3" />
                    <span>{new Date(version.lastSaved).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium text-gray-900">
                      {Math.round(((version.currentStep + 1) / 13) * 100)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(((version.currentStep + 1) / 13) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Comments Toggle */}
                <button
                  onClick={() => toggleComments(version._id)}
                  className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  <span>
                    {expandedComments.has(version._id) ? 'Hide' : 'Show'} Comments
                    {versionComments[version._id] && versionComments[version._id].length > 0 && (
                      <span className="ml-1">({versionComments[version._id].length})</span>
                    )}
                  </span>
                </button>
                
                {/* Comments Section */}
                {expandedComments.has(version._id) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {/* Screenshot Comment */}
                    <ScreenshotComment
                      versionId={version._id}
                      onScreenshotSubmit={handleScreenshotComment}
                    />

                    {/* Add Comment Form */}
                    <div className="mb-4">
                      <div className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          value={newComment[version._id] || ''}
                          onChange={(e) => setNewComment(prev => ({ ...prev, [version._id]: e.target.value }))}
                          placeholder="Write a comment..."
                          className="flex-1 text-sm border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && newComment[version._id]?.trim()) {
                              handleAddComment(version._id, newComment[version._id]);
                            }
                          }}
                        />
                        <button
                          onClick={() => setShowDrawing(prev => ({ ...prev, [version._id]: !prev[version._id] }))}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                          title="Add Drawing"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => newComment[version._id]?.trim() && handleAddComment(version._id, newComment[version._id])}
                          disabled={!newComment[version._id]?.trim()}
                          className="p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <PaperAirplaneIcon className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Drawing Canvas */}
                      {showDrawing[version._id] && (
                        <div className="mt-2">
                          <DrawingCanvas
                            onSave={(drawing) => handleAddComment(version._id, undefined, drawing)}
                            onCancel={() => setShowDrawing(prev => ({ ...prev, [version._id]: false }))}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Comments List */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {versionComments[version._id] && versionComments[version._id].length > 0 ? (
                        versionComments[version._id].map((comment) => (
                          <CommentComponent
                            key={comment._id}
                            comment={comment}
                            onLike={handleLikeComment}
                            onReply={handleReplyToComment}
                          />
                        ))
                                             ) : (
                         <div className="text-center py-4">
                           <p className="text-sm text-gray-500">
                             No comments yet. Be the first to comment!
                           </p>
                         </div>
                       )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {versions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <DocumentDuplicateIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No versions found</h3>
          <p className="text-gray-600">No project versions have been created yet.</p>
        </div>
      )}
    </div>
  );
}
