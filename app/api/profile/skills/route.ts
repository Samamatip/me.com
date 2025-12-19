import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/api/lib/mongodb';
import { authenticateRequest } from '@/app/api/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { skills } = await request.json();
    const client = await clientPromise;
    const db = client.db('portfolio');

    await db.collection('profile').updateOne({}, { $set: { skills } }, { upsert: true });

    return NextResponse.json({ message: 'Skills updated successfully' });
  } catch (error) {
    console.error('Update skills error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
