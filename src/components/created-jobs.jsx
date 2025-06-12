// API function to fetch jobs created by the recruiter
import { getMyJobs } from "@/api/apiJobs";
// Custom hook for handling async data fetching
import useFetch from "@/hooks/use-fetch";
// Clerk hook to get the current user object
import { useUser } from "@clerk/clerk-react";
// Loader to display during async fetches
import { BarLoader } from "react-spinners";
// Card component to display each job
import JobCard from "./job-card";
// React's effect hook for lifecycle logic
import { useEffect } from "react";

// Shows all jobs posted by the current recruiter
const CreatedJobs = () => {
  // Get current user from Clerk
  const { user } = useUser();

  // Set up fetching logic for recruiter jobs using useFetch
  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id, // Pass recruiter ID to API
  });

  // On mount, fetch the recruiter's jobs
  useEffect(() => {
    fnCreatedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* If still loading, show loader; else, show jobs grid or fallback */}
      {loadingCreatedJobs ? (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdJobs?.length ? (
            // For each job, render a JobCard
            createdJobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  onJobAction={fnCreatedJobs} // Allow child to refetch on job action
                  isMyJob // Mark as "my job" for any special display logic
                />
              );
            })
          ) : (
            // If no jobs, show fallback message
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatedJobs;
