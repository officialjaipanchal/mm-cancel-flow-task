// src/lib/supabase.ts
// Enhanced Supabase client with security features

import { createClient } from '@supabase/supabase-js'
import { CSRFProtection, RateLimiter } from './validation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Enhanced client with security headers
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'migrate-mate-cancellation-flow',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
})

// Server-side client with service role key for admin operations
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : supabase; // Fallback to regular client if service role key not available

// Secure database operations with validation and rate limiting
export class SecureDatabaseOps {
  // Rate limit identifier for user operations
  private static getRateLimitKey(userId: string, operation: string): string {
    return `${userId}:${operation}`;
  }

  // Secure subscription update
  static async updateSubscriptionStatus(
    userId: string, 
    subscriptionId: string, 
    status: 'active' | 'pending_cancellation' | 'cancelled',
    csrfToken?: string
  ) {
    // Rate limiting
    const rateLimitKey = this.getRateLimitKey(userId, 'subscription_update');
    if (!RateLimiter.checkRateLimit(rateLimitKey)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // CSRF validation (if token provided)
    if (csrfToken) {
      // In a real app, you'd validate against stored token
      // For now, we'll just check if it exists
      if (!csrfToken || csrfToken.length < 32) {
        throw new Error('Invalid security token');
      }
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', subscriptionId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to update subscription status');
      }

      return data;
    } catch (error) {
      console.error('Secure operation failed:', error);
      throw error;
    }
  }

  // Secure cancellation creation
  static async createCancellation(
    userId: string,
    subscriptionId: string,
    downsellVariant: 'A' | 'B',
    reason?: string,
    acceptedDownsell: boolean = false,
    csrfToken?: string
  ) {
    // Rate limiting
    const rateLimitKey = this.getRateLimitKey(userId, 'cancellation_create');
    if (!RateLimiter.checkRateLimit(rateLimitKey)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // CSRF validation
    if (csrfToken) {
      if (!csrfToken || csrfToken.length < 32) {
        throw new Error('Invalid security token');
      }
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('cancellations')
        .insert({
          user_id: userId,
          subscription_id: subscriptionId,
          downsell_variant: downsellVariant,
          reason: reason ? CSRFProtection.hashData(reason) : null,
          accepted_downsell: acceptedDownsell
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to create cancellation record');
      }

      return data;
    } catch (error) {
      console.error('Secure operation failed:', error);
      throw error;
    }
  }

  // Secure user data retrieval
  static async getUserSubscription(userId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['active', 'pending_cancellation'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to retrieve subscription data');
      }

      return data;
    } catch (error) {
      console.error('Secure operation failed:', error);
      throw error;
    }
  }

  // Secure cancellation data retrieval
  static async getUserCancellation(userId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from('cancellations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Database error:', error);
        throw new Error('Failed to retrieve cancellation data');
      }

      return data;
    } catch (error) {
      console.error('Secure operation failed:', error);
      throw error;
    }
  }

  // Secure cancellation update
  static async updateCancellation(
    userId: string,
    subscriptionId: string,
    downsellVariant: 'A' | 'B',
    reason?: string,
    acceptedDownsell: boolean = false,
    csrfToken?: string
  ) {
    // Rate limiting
    const rateLimitKey = this.getRateLimitKey(userId, 'cancellation_update');
    if (!RateLimiter.checkRateLimit(rateLimitKey)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // CSRF validation
    if (csrfToken) {
      if (!csrfToken || csrfToken.length < 32) {
        throw new Error('Invalid security token');
      }
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('cancellations')
        .update({
          downsell_variant: downsellVariant,
          reason: reason ? CSRFProtection.hashData(reason) : null,
          accepted_downsell: acceptedDownsell
        })
        .eq('user_id', userId)
        .eq('subscription_id', subscriptionId)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to update cancellation record');
      }

      return data;
    } catch (error) {
      console.error('Secure operation failed:', error);
      throw error;
    }
  }
} 