// API import for fetching saved jobs
import { getSavedJobs } from "@/api/apiJobs";
// Card component for rendering each job
import JobCard from "@/components/job-card";
// Custom hook for fetching data
import useFetch from "@/hooks/use-fetch";
// Clerk user hook for user/auth state
import { useUser } from "@clerk/clerk-react";
// React core hooks
import { useEffect } from "react";
// Loader for async states
import { BarLoader } from "react-spinners";

// Main Saved Jobs Page Component
const SavedJobsPage = () => {
  // Get user loading state
  const { isLoaded } = useUser();

  // Setup useFetch for saved jobs
  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  // Fetch saved jobs once user is loaded
  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Show loader while waiting for user or jobs data
  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      {/* Page Title */}
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {/* Show jobs or fallback message once data is loaded */}
      {loadingSavedJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs?.length ? (
            // Render each saved job using JobCard
            savedJobs?.map((saved) => {
              return (
                <JobCard
                  key={saved.id}
                  job={saved?.job}
                  onJobAction={fnSavedJobs} // To refresh the list after un-saving
                  savedInit={true}
                />
              );
            })
          ) : (
            // No jobs found
            <div>No Saved Jobs 👀</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
