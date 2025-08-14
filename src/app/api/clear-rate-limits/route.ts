// src/app/api/clear-rate-limits/route.ts
// API route to clear rate limits for development/testing

import { NextResponse } from 'next/server';
import { RateLimiter } from '../../../lib/validation';

export async function POST() {
  try {
    // Clear all rate limits
    RateLimiter.clearAllRateLimits();
    
    return NextResponse.json({
      success: true,
      message: 'Rate limits cleared successfully'
    });
  } catch (error) {
    console.error('Failed to clear rate limits:', error);
    return NextResponse.json(
      { error: 'Failed to clear rate limits' },
      { status: 500 }
    );
  }
}

