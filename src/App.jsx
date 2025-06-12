import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layouts/app-layout";
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import Job from "./pages/JobPage";
import JobListing from "./pages/JobListingPage";
import PostJobPage from "./pages/PostJobPage";
import MyJobsPage from "./pages/MyJobsPage";
import SavedJobPage from "./pages/SavedJobPage";
import { ThemeProvider } from "./components/theme-provider";
import ProtectedRoute from "./components/protected-route";

/**
 * Main App Component:
 * - Sets up all routes (with protection where needed)
 * - Wraps with theme provider
 */
function App() {
  // Define the route structure for the entire app
  const router = createBrowserRouter([
    {
      // Use AppLayout for all pages (with <Outlet />)
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <LandingPage />, // Public landing page
        },
        {
          path: "/onboarding",
          // Onboarding (protected, must be signed in)
          element: (
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/jobs",
          // Job listing (protected)
          element: (
            <ProtectedRoute>
              <JobListing />
            </ProtectedRoute>
          ),
        },
        {
          path: "/job/:id",
          // Single job details (protected)
          element: (
            <ProtectedRoute>
              <Job />
            </ProtectedRoute>
          ),
        },
        {
          path: "/post-job",
          // Post a job (protected, recruiter only)
          element: (
            <ProtectedRoute>
              <PostJobPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/saved-jobs",
          // Saved jobs (protected, candidate only)
          element: (
            <ProtectedRoute>
              <SavedJobPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/my-jobs",
          // My jobs/applications (protected, user-dependent UI)
          element: (
            <ProtectedRoute>
              <MyJobsPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  // Provide the theme context and the router to the entire app
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
