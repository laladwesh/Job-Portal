// Import custom components for displaying created applications or jobs
import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";

// Import Clerk user hook for authentication state
import { useUser } from "@clerk/clerk-react";
// Import loader for showing loading state
import { BarLoader } from "react-spinners";

// Main component for "My Jobs" or "My Applications" page
const MyJobsPage = () => {
  // Get user info and loading status from Clerk
  const { user, isLoaded } = useUser();

  // Show loader until user information is ready
  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      {/* Page Title: Varies by user role */}
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        {user?.unsafeMetadata?.role === "candidate"
          ? "My Applications"
          : "My Jobs"}
      </h1>
      {/* Conditional rendering: 
            - Candidates see their job applications
            - Recruiters/others see their posted jobs */}
      {user?.unsafeMetadata?.role === "candidate" ? (
        <CreatedApplications />
      ) : (
        <CreatedJobs />
      )}
    </div>
  );
};

export default MyJobsPage;
