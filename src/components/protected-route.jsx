import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute ensures that:
 * - The user is signed in before accessing protected content
 * - If signed in but no role set, the user is redirected to onboarding (except on onboarding page itself)
 *
 * Usage: 
 * <ProtectedRoute>
 *   <SomeProtectedComponent />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children }) => {
  // Clerk hook: get sign-in status, user object, and loading state
  const { isSignedIn, user, isLoaded } = useUser();
  // React Router: get the current path for context
  const { pathname } = useLocation();

  // If auth is loaded but user is not signed in, redirect to home with sign-in modal
  if (isLoaded && !isSignedIn && isSignedIn !== undefined) { 
    return <Navigate to="/?sign-in=true" />;
  }
  // If user is signed in but has no role (and not already on onboarding), redirect to onboarding
  if (user !== undefined && !user.unsafeMetadata?.role && pathname !== "/onboarding") {
    return <Navigate to="/onboarding" />
  }
  // If signed in and has a role (or already on onboarding), allow access to child routes/components
  return children;
}

export default ProtectedRoute
