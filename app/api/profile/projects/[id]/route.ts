import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/api/lib/mongodb';
import { authenticateRequest } from '@/app/api/lib/auth';

// UPDATE project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();
    const client = await clientPromise;
    const db = client.db('portfolio');

    await db.collection('profile').updateOne(
      { 'projects.id': id },
      { $set: { 'projects.$': { ...updates, id } } }
    );

    return NextResponse.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('portfolio');

    await db.collection('profile').updateOne(
      {},
      { $pull: { projects: { id } } } as any
    );

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
