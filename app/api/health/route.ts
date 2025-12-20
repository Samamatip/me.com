import { NextResponse } from 'next/server';
import { validateEnv } from '@/app/lib/env';

/**
 * Health check endpoint
 * Verifies that the application is running and all required environment variables are present
 */
export async function GET() {
  try {
    const envValidation = validateEnv();
    
    const health = {
      status: envValidation.isValid ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      checks: {
        environmentVariables: {
          status: envValidation.isValid ? 'pass' : 'fail',
          missing: envValidation.missing,
          warnings: envValidation.warnings,
        },
      },
    };

    if (!envValidation.isValid) {
      return NextResponse.json(
        {
          ...health,
          message: 'Required environment variables are missing. Please check your deployment configuration.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
