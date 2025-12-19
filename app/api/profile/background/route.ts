import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { authenticateRequest } from '@/app/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { background } = await request.json();
    const client = await clientPromise;
    const db = client.db('portfolio');

    await db.collection('profile').updateOne({}, { $set: { background } }, { upsert: true });

    return NextResponse.json({ message: 'Background updated successfully' });
  } catch (error) {
    console.error('Update background error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
