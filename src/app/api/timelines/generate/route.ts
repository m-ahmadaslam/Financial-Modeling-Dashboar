import { NextRequest, NextResponse } from 'next/server';

// Timeline generation endpoint
export async function POST(request: NextRequest) {
  try {
    const timelineInputs = await request.json();
    console.log('API Route - Received inputs:', timelineInputs);
    
    // Call backend FastAPI service for timeline generation
    const backendResponse = await fetch('http://localhost:8000/generate-timelines', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(timelineInputs),
    });

    console.log('Backend response status:', backendResponse.status);

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend error:', errorText);
      throw new Error(`Backend API error: ${backendResponse.status} - ${errorText}`);
    }

    const timelines = await backendResponse.json();
    console.log('API Route - Sending timelines:', Object.keys(timelines));
    
    return NextResponse.json(timelines);
  } catch (error) {
    console.error('Timeline generation error:', error);
    return NextResponse.json(
      { error: `Failed to generate timelines: ${error.message}` },
      { status: 500 }
    );
  }
}
