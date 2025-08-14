'use client';

import { useState, useEffect } from 'react';

// Available users for testing (matching seed.sql)
const availableUsers = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'john.doe@example.com',
    name: 'John Doe',
    subscriptionPrice: 25,
    subscriptionId: '550e8400-e29b-41d4-a716-446655440011'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'sarah.smith@example.com',
    name: 'Sarah Smith',
    subscriptionPrice: 29,
    subscriptionId: '550e8400-e29b-41d4-a716-446655440012'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'mike.johnson@example.com',
    name: 'Mike Johnson',
    subscriptionPrice: 25,
    subscriptionId: '550e8400-e29b-41d4-a716-446655440013'
  },
];

// Mock subscription data for UI display
const getMockSubscriptionData = (user: typeof availableUsers[0]) => ({
  status: 'active',
  isTrialSubscription: false,
  cancelAtPeriodEnd: false,
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  monthlyPrice: user.subscriptionPrice,
  subscriptionId: user.subscriptionId,
  isUCStudent: false,
  hasManagedAccess: false,
  managedOrganization: null,
  downsellAccepted: false
});

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<typeof availableUsers[0] | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleSignIn = (user: typeof availableUsers[0]) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setShowSignIn(false);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    // Simulate sign out delay
    setTimeout(() => {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      setIsSigningOut(false);
    }, 1000);
  };

  const handleClose = () => {
    console.log('Navigate to jobs');
  };

  // Show sign-in interface if no user is signed in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to Migrate Mate
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Select a user account to continue
            </p>
          </div>
          <div className="mt-8 space-y-4">
            {availableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSignIn(user)}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#8952fc] hover:bg-[#7b40fc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8952fc] transition-colors"
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs opacity-90">{user.email}</span>
                  <span className="text-xs opacity-75">${user.subscriptionPrice}/month</span>
                </div>
              </button>
            ))}
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">
              This is a demo environment. Select any user to test the cancellation flow.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const mockSubscriptionData = getMockSubscriptionData(currentUser);

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  <span className="sm:hidden">Profile</span>
                  <span className="hidden sm:inline">My Profile</span>
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Signed in as: {currentUser.email}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#8952fc] rounded-lg hover:bg-[#7b40fc] transition-colors"
                  aria-label="Back to jobs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="sm:hidden">Jobs</span>
                  <span className="hidden sm:inline">Back to jobs</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  disabled={isSigningOut}
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-md text-gray-900">{currentUser.email}</p>
              </div>
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900">Subscription status</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {mockSubscriptionData.status === 'active' && !mockSubscriptionData.isTrialSubscription && !mockSubscriptionData.cancelAtPeriodEnd && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {mockSubscriptionData.status === 'active' && !mockSubscriptionData.isTrialSubscription && !mockSubscriptionData.cancelAtPeriodEnd && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-900">Next payment</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {mockSubscriptionData.currentPeriodEnd && new Date(mockSubscriptionData.currentPeriodEnd).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Support Button */}
          <div className="px-6 py-6 border-b border-gray-200">
            <button
              onClick={() => {
                console.log('Support contact clicked');
              }}
              title="Send email to support"
              className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#8952fc] text-white rounded-lg hover:bg-[#7b40fc] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Contact support</span>
            </button>
          </div>

          {/* Settings Toggle Button */}
          <div className="px-6 py-6">
            <button
              onClick={() => {
                setShowAdvancedSettings(!showAdvancedSettings);
                console.log('Settings toggled:', !showAdvancedSettings);
              }}
              className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Manage Subscription</span>
              <svg 
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${showAdvancedSettings ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Collapsible Settings Content */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showAdvancedSettings ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        console.log('Update card clicked');
                      }}
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-sm font-medium">Update payment method</span>
                    </button>
                    <button
                      onClick={() => {
                        console.log('Invoice history clicked');
                      }}
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-sm font-medium">View billing history</span>
                    </button>
                    <button
                      onClick={() => {
                        window.location.href = '/cancel';
                      }}
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-sm font-medium">Cancel Migrate Mate</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}