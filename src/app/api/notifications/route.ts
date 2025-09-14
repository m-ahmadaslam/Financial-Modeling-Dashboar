import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
// import { Notification } from '@/types/notifications';

// Create notification
export async function POST(request: NextRequest) {
  try {
    const { userId, type, title, message, reference, relatedId, priority = 'medium', actionUrl, metadata } = await request.json();

    if (!userId || !type || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const notification = {
      userId,
      type,
      title,
      message,
      reference,
      relatedId,
      timestamp: new Date(),
      isRead: false,
      priority,
      actionUrl,
      metadata
    };

    const result = await db.collection('notifications').insertOne(notification);

    return NextResponse.json({ 
      success: true, 
      notification: { ...notification, _id: result.insertedId } 
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get notifications for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const query: Record<string, unknown> = { userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await db.collection('notifications')
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    // Get counts
    const totalCount = await db.collection('notifications').countDocuments({ userId });
    const unreadCount = await db.collection('notifications').countDocuments({ userId, isRead: false });

    return NextResponse.json({ 
      notifications,
      counts: {
        total: totalCount,
        unread: unreadCount
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const { notificationIds, markAllAsRead } = await request.json();

    const { db } = await connectToDatabase();

    if (markAllAsRead) {
      // Mark all notifications as read for the user
      const { userId } = await request.json();
      await db.collection('notifications').updateMany(
        { userId },
        { $set: { isRead: true } }
      );
    } else if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      await db.collection('notifications').updateMany(
        { _id: { $in: notificationIds.map((id: string) => new ObjectId(id)) } },
        { $set: { isRead: true } }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete notification
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    await db.collection('notifications').deleteOne({ _id: new ObjectId(notificationId) });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
