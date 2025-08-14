// src/app/api/cancellation/route.ts
// API route for cancellation operations with database integration

import { NextRequest, NextResponse } from 'next/server';
import { SecureDatabaseOps } from '../../../lib/supabase';
import { validateCancellationData, CSRFProtection } from '../../../lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      subscriptionId, 
      downsellVariant, 
      reason, 
      acceptedDownsell,
      csrfToken 
    } = body;

    // Validate input data
    const validationResult = validateCancellationData({
      reason,
      downsellVariant
    });

    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.errors },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!userId || !subscriptionId || !downsellVariant) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // CSRF validation
    if (csrfToken && !CSRFProtection.validateToken(csrfToken, csrfToken)) {
      return NextResponse.json(
        { error: 'Invalid security token' },
        { status: 403 }
      );
    }

    // Update subscription status to pending_cancellation
    await SecureDatabaseOps.updateSubscriptionStatus(
      userId,
      subscriptionId,
      'pending_cancellation',
      csrfToken
    );

    // Check if cancellation record already exists
    const existingCancellation = await SecureDatabaseOps.getUserCancellation(userId);
    
    let cancellation;
    if (existingCancellation) {
      // Update existing cancellation record
      cancellation = await SecureDatabaseOps.updateCancellation(
        userId,
        subscriptionId,
        downsellVariant as 'A' | 'B',
        reason,
        acceptedDownsell || false,
        csrfToken
      );
    } else {
      // Create new cancellation record
      cancellation = await SecureDatabaseOps.createCancellation(
        userId,
        subscriptionId,
        downsellVariant as 'A' | 'B',
        reason,
        acceptedDownsell || false,
        csrfToken
      );
    }

    console.log(`Cancellation processed for user ${userId}:`, {
      variant: downsellVariant,
      acceptedDownsell,
      reason: reason || 'Not provided'
    });

    return NextResponse.json({
      success: true,
      cancellation,
      message: 'Cancellation processed successfully'
    });

  } catch (error) {
    console.error('Cancellation API error:', error);
    return NextResponse.json(
      { error: 'Failed to process cancellation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's subscription
    const subscription = await SecureDatabaseOps.getUserSubscription(userId);
    
    // Get user's cancellation record if exists
    const cancellation = await SecureDatabaseOps.getUserCancellation(userId);

    return NextResponse.json({
      subscription,
      cancellation,
      hasExistingCancellation: !!cancellation
    });

  } catch (error) {
    console.error('Get cancellation data error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve cancellation data' },
      { status: 500 }
    );
  }
}
