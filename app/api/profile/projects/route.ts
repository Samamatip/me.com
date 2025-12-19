import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/api/lib/mongodb';
import { authenticateRequest } from '@/app/api/lib/auth';

// ADD project
export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await request.json();
    const client = await clientPromise;
    const db = client.db('portfolio');

    await db.collection('profile').updateOne(
      {},
      { $push: { projects: project } },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Project added successfully' });
  } catch (error) {
    console.error('Add project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
