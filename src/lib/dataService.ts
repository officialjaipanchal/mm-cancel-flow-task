// src/lib/dataService.ts
// Data service layer for UI components to interact with APIs

import { CSRFProtection } from './validation';

export interface SubscriptionData {
  id: string;
  user_id: string;
  monthly_price: number;
  status: 'active' | 'pending_cancellation' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CancellationData {
  id: string;
  user_id: string;
  subscription_id: string;
  downsell_variant: 'A' | 'B';
  reason?: string;
  accepted_downsell: boolean;
  created_at: string;
}

export interface ABTestingData {
  variant: 'A' | 'B';
  originalPrice: number;
  discountedPrice: number;
  hasDiscount: boolean;
  message: string;
  isExisting?: boolean;
}

export interface CancellationRequest {
  userId: string;
  subscriptionId: string;
  downsellVariant: 'A' | 'B';
  reason?: string;
  acceptedDownsell: boolean;
}

// Get current user from localStorage
const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error('Error parsing current user:', error);
    return null;
  }
};

// Data service class
export class DataService {
  private static baseUrl = '/api';
  private static csrfToken: string | null = null;

  // Initialize CSRF token
  static initializeCSRFToken(): void {
    if (typeof window === 'undefined') return; // avoid SSR differences
    if (this.csrfToken) return;
    // Generate a browser-safe CSRF token using Web Crypto API
    try {
      const bytes = new Uint8Array(32);
      window.crypto.getRandomValues(bytes);
      const hex = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      this.csrfToken = hex;
    } catch {
      // Fallback: simple pseudo-random (still only on client), better than nothing
      this.csrfToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    }
  }

  // Get CSRF token
  static getCSRFToken(): string | null {
    return this.csrfToken;
  }

  // Generic API call method
  private static async apiCall<T>(
    endpoint: string, 
    method: 'GET' | 'POST' = 'GET', 
    body?: Record<string, unknown>
  ): Promise<T> {
    // Ensure CSRF token exists on client prior to making calls
    if (typeof window !== 'undefined' && !this.csrfToken) {
      this.initializeCSRFToken();
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.csrfToken) {
      headers['X-CSRF-Token'] = this.csrfToken;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API call failed: ${response.status}`);
    }

    return response.json();
  }

  // Get user data (subscription and cancellation info)
  static async getUserData(userId?: string): Promise<{
    subscription: SubscriptionData | null;
    cancellation: CancellationData | null;
    hasExistingCancellation: boolean;
  }> {
    const currentUser = getCurrentUser();
    const targetUserId = userId || currentUser?.id;
    
    if (!targetUserId) {
      throw new Error('No user ID available. Please sign in first.');
    }

    return this.apiCall(`/cancellation?userId=${targetUserId}`);
  }

  // Get A/B testing data
  static async getABTestingData(userId?: string, subscriptionId?: string): Promise<ABTestingData> {
    const currentUser = getCurrentUser();
    const targetUserId = userId || currentUser?.id;
    const targetSubscriptionId = subscriptionId || currentUser?.subscriptionId;
    
    if (!targetUserId || !targetSubscriptionId) {
      throw new Error('No user ID or subscription ID available. Please sign in first.');
    }

    return this.apiCall(`/ab-testing?userId=${targetUserId}&subscriptionId=${targetSubscriptionId}`);
  }

  // Assign A/B testing variant
  static async assignABTestingVariant(userId?: string, subscriptionId?: string): Promise<ABTestingData> {
    const currentUser = getCurrentUser();
    const targetUserId = userId || currentUser?.id;
    const targetSubscriptionId = subscriptionId || currentUser?.subscriptionId;
    
    if (!targetUserId || !targetSubscriptionId) {
      throw new Error('No user ID or subscription ID available. Please sign in first.');
    }

    return this.apiCall('/ab-testing', 'POST', {
      userId: targetUserId,
      subscriptionId: targetSubscriptionId,
      csrfToken: this.getCSRFToken()
    });
  }

  // Process cancellation
  static async processCancellation(data: CancellationRequest): Promise<{
    subscription: SubscriptionData;
    cancellation: CancellationData;
    hasExistingCancellation: boolean;
  }> {
    const currentUser = getCurrentUser();
    const targetUserId = data.userId || currentUser?.id;
    const targetSubscriptionId = data.subscriptionId || currentUser?.subscriptionId;
    
    if (!targetUserId || !targetSubscriptionId) {
      throw new Error('No user ID or subscription ID available. Please sign in first.');
    }

    return this.apiCall('/cancellation', 'POST', {
      ...data,
      userId: targetUserId,
      subscriptionId: targetSubscriptionId,
      csrfToken: this.getCSRFToken()
    });
  }

  // Update subscription status
  static async updateSubscriptionStatus(
    userId: string, 
    subscriptionId: string, 
    status: 'active' | 'pending_cancellation' | 'cancelled'
  ): Promise<SubscriptionData> {
    return this.apiCall('/cancellation', 'POST', {
      userId,
      subscriptionId,
      status,
      csrfToken: this.getCSRFToken()
    });
  }

  // Get subscription details with pricing
  static async getSubscriptionWithPricing(
    userId?: string
  ): Promise<{
    subscription: SubscriptionData;
    abTesting: ABTestingData;
  }> {
    // First get user data to find the active subscription
    const userData = await this.getUserData(userId);
    
    if (!userData.subscription) {
      throw new Error('No active subscription found for user');
    }

    // Then get A/B testing data using the actual subscription ID
    const abTestingData = await this.getABTestingData(userId, userData.subscription.id);

    return {
      subscription: userData.subscription,
      abTesting: abTestingData
    };
  }
}

// Initialize CSRF token on module load
DataService.initializeCSRFToken();
