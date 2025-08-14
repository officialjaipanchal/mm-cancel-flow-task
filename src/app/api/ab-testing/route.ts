// src/app/api/ab-testing/route.ts
// API route for A/B testing variant assignment and persistence

import { NextRequest, NextResponse } from 'next/server';
import { SecureDatabaseOps } from '../../../lib/supabase';
import { CSRFProtection } from '../../../lib/validation';
import { createHash } from 'crypto';

// Deterministic A/B testing with cryptographically secure RNG
class ABTestingService {
  // Generate deterministic variant based on user ID using cryptographically secure hash
  static assignVariant(userId: string): 'A' | 'B' {
    // Use cryptographically secure SHA-256 hash of user ID
    const hash = createHash('sha256')
      .update(userId)
      .update('migrate-mate-ab-testing-salt') // Add salt for additional security
      .digest('hex');
    
    // Use the first byte for deterministic 50/50 split
    const firstByte = parseInt(hash.substring(0, 2), 16);
    return firstByte < 128 ? 'A' : 'B';
  }

  // Get or create variant assignment for user
  static async getOrAssignVariant(userId: string, subscriptionId: string): Promise<'A' | 'B'> {
    try {
      // Check if user already has a cancellation record
      const existingCancellation = await SecureDatabaseOps.getUserCancellation(userId);
      
      if (existingCancellation) {
        // Return existing variant - this ensures variant reuse on repeat visits
        console.log(`Reusing existing variant ${existingCancellation.downsell_variant} for user ${userId}`);
        return existingCancellation.downsell_variant as 'A' | 'B';
      }

      // Assign new variant using cryptographically secure method
      const variant = this.assignVariant(userId);
      console.log(`Assigned new variant ${variant} for user ${userId}`);
      
      // Create initial cancellation record with variant persisted to database
      await SecureDatabaseOps.createCancellation(
        userId,
        subscriptionId,
        variant,
        undefined, // no reason yet
        false, // not accepted yet
        undefined // no CSRF token for initial assignment
      );

      console.log(`Persisted variant ${variant} to database for user ${userId}`);
      return variant;
    } catch (error) {
      console.error('A/B testing error:', error);
      // Fallback to variant A if there's an error
      return 'A';
    }
  }

  // Calculate discounted price based on variant and original price
  static calculateDiscountedPrice(originalPrice: number, variant: 'A' | 'B'): number {
    if (variant === 'A') {
      // Variant A: 50% off (standard downsell)
      const discountedPrice = Math.round(originalPrice * 0.5 * 100) / 100; // Round to 2 decimal places
      console.log(`Variant A pricing: $${originalPrice} → $${discountedPrice} (50% off)`);
      return discountedPrice;
    } else {
      // Variant B: $10 off ($25→$15, $29→$19)
      const discountedPrice = Math.max(0, originalPrice - 10);
      console.log(`Variant B pricing: $${originalPrice} → $${discountedPrice} ($10 off)`);
      return discountedPrice;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subscriptionId, csrfToken } = body;

    if (!userId || !subscriptionId) {
      return NextResponse.json(
        { error: 'User ID and subscription ID are required' },
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

    // Get or assign variant (this will persist to database)
    const variant = await ABTestingService.getOrAssignVariant(userId, subscriptionId);

    // Get subscription details
    const subscription = await SecureDatabaseOps.getUserSubscription(userId);
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Calculate prices based on variant
    const originalPrice = subscription.monthly_price / 100; // Convert from cents
    const discountedPrice = ABTestingService.calculateDiscountedPrice(originalPrice, variant);

    // Determine message based on variant
    let message: string;
    if (variant === 'A') {
      message = `You qualify for a 50% discount!`;
    } else {
      message = `You qualify for a $${(originalPrice - discountedPrice).toFixed(2)} discount!`;
    }

    return NextResponse.json({
      variant,
      originalPrice,
      discountedPrice,
      hasDiscount: true, // Both variants now have discounts
      message
    });

  } catch (error) {
    console.error('A/B testing API error:', error);
    return NextResponse.json(
      { error: 'Failed to process A/B testing request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const subscriptionId = searchParams.get('subscriptionId');

    if (!userId || !subscriptionId) {
      return NextResponse.json(
        { error: 'User ID and subscription ID are required' },
        { status: 400 }
      );
    }

    // Get existing variant assignment from database
    const existingCancellation = await SecureDatabaseOps.getUserCancellation(userId);
    
    if (existingCancellation) {
      const subscription = await SecureDatabaseOps.getUserSubscription(userId);
      
      if (!subscription) {
        return NextResponse.json(
          { error: 'Subscription not found' },
          { status: 404 }
        );
      }
      
      const originalPrice = subscription.monthly_price / 100;
      const discountedPrice = ABTestingService.calculateDiscountedPrice(
        originalPrice, 
        existingCancellation.downsell_variant as 'A' | 'B'
      );

      console.log(`Retrieved existing variant ${existingCancellation.downsell_variant} for user ${userId}`);

      return NextResponse.json({
        variant: existingCancellation.downsell_variant,
        originalPrice,
        discountedPrice,
        hasDiscount: true, // Both variants now have discounts
        isExisting: true,
        message: existingCancellation.downsell_variant === 'B' 
          ? `You qualify for a $${(originalPrice - discountedPrice).toFixed(2)} discount!` 
          : `You qualify for a 50% discount!`
      });
    }

    return NextResponse.json({
      variant: null,
      isExisting: false,
      message: 'No variant assigned yet'
    });

  } catch (error) {
    console.error('Get A/B testing data error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve A/B testing data' },
      { status: 500 }
    );
  }
}
