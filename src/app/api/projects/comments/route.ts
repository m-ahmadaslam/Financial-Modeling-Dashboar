import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface CommentData {
  versionId: string;
  content?: string;
  drawing?: string;
  parentCommentId?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Remove session verification - allow anonymous comments
    const { versionId, content, drawing, parentCommentId }: CommentData = await request.json();

    if (!versionId || (!content && !drawing)) {
      return NextResponse.json({ error: 'Version ID and content or drawing are required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const newComment = {
      _id: new ObjectId(),
      userId: 'anonymous-user',
      userName: 'Super Admin',
      userAvatar: null,
      content: content || '',
      drawing: drawing || null,
      timestamp: new Date().toISOString(),
      likes: [],
      replies: []
    };

    if (parentCommentId) {
      // This is a reply to an existing comment
      const result = await (db.collection('project_drafts') as any).updateOne(
        { 
          _id: new ObjectId(versionId),
          'comments._id': new ObjectId(parentCommentId)
        },
        {
          $push: {
            'comments.$.replies': newComment
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Version or parent comment not found' }, { status: 404 });
      }
    } else {
      // This is a new top-level comment
      const result = await (db.collection('project_drafts') as any).updateOne(
        { _id: new ObjectId(versionId) },
        {
          $push: {
            comments: newComment
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Version not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      comment: newComment 
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Remove session verification - allow anonymous likes
    const { commentId, action } = await request.json();

    if (!commentId || !action) {
      return NextResponse.json({ error: 'Comment ID and action are required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    if (action === 'like') {
      // Toggle like on comment
      const userId = 'anonymous-user';
      
      // First try to find and update top-level comments
      let result = await (db.collection('project_drafts') as any).updateOne(
        { 
          'comments._id': new ObjectId(commentId),
          'comments.likes': { $ne: userId }
        },
        {
          $push: {
            'comments.$.likes': userId
          }
        }
      );

      // If no top-level comment was found, try replies
      if (result.matchedCount === 0) {
        result = await (db.collection('project_drafts') as any).updateOne(
          { 
            'comments.replies._id': new ObjectId(commentId),
            'comments.replies.likes': { $ne: userId }
          },
          {
            $push: {
              'comments.$[].replies.$[reply].likes': userId
            }
          },
          {
            arrayFilters: [
              { 'reply._id': new ObjectId(commentId) }
            ]
          }
        );
      }

      // If still no match, user might be trying to unlike
      if (result.matchedCount === 0) {
        result = await (db.collection('project_drafts') as any).updateOne(
          { 
            'comments._id': new ObjectId(commentId),
            'comments.likes': userId
          },
          {
            $pull: {
              'comments.$.likes': userId
            }
          }
        );

        // Try replies for unlike
        if (result.matchedCount === 0) {
          result = await (db.collection('project_drafts') as any).updateOne(
            { 
              'comments.replies._id': new ObjectId(commentId),
              'comments.replies.likes': userId
            },
            {
              $pull: {
                'comments.$[].replies.$[reply].likes': userId
              }
            },
            {
              arrayFilters: [
                { 'reply._id': new ObjectId(commentId) }
              ]
            }
          );
        }
      }

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const versionId = searchParams.get('versionId');

    if (!versionId) {
      return NextResponse.json({ error: 'Version ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const project = await db.collection('project_drafts').findOne(
      { _id: new ObjectId(versionId) },
      { projection: { comments: 1 } }
    );

    if (!project) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      comments: project.comments || [] 
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
