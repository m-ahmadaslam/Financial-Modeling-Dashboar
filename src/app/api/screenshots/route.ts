import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Create screenshot
export async function POST(request: NextRequest) {
  try {
    const { versionId, screenshotData, annotations, userId, metadata } = await request.json();

    if (!screenshotData) {
      return NextResponse.json({ error: 'Screenshot data is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const screenshot = {
      _id: new ObjectId(),
      versionId: versionId ? new ObjectId(versionId) : null,
      screenshotData,
      annotations: annotations || null,
      userId: userId || 'anonymous-user',
      metadata: metadata || {},
      timestamp: new Date(),
      status: 'active'
    };

    const result = await (db.collection('screenshots') as any).insertOne(screenshot);

    if (result.insertedId) {
      return NextResponse.json({
        success: true,
        screenshotId: result.insertedId,
        message: 'Screenshot saved successfully'
      });
    } else {
      return NextResponse.json({ error: 'Failed to save screenshot' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error saving screenshot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get screenshots for a version
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const versionId = searchParams.get('versionId');

    if (!versionId) {
      return NextResponse.json({ error: 'Version ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const screenshots = await (db.collection('screenshots') as any)
      .find({ 
        versionId: new ObjectId(versionId),
        status: 'active'
      })
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      screenshots
    });

  } catch (error) {
    console.error('Error fetching screenshots:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}