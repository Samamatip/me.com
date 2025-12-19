import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/api/lib/mongodb';
import { authenticateRequest } from '@/app/api/lib/auth';

// GET profile (public)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio');
    const profile = await db.collection('profile').findOne({});

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE profile (requires auth)
export async function PUT(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updates = await request.json();
    const client = await clientPromise;
    const db = client.db('portfolio');

    const result = await db.collection('profile').updateOne(
      {},
      { $set: updates },
      { upsert: true }
    );

    return NextResponse.json({
      message: 'Profile updated successfully',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
