// Import Clerk user context to get the current user
import { useUser } from "@clerk/clerk-react";
// Card component for rendering individual applications
import ApplicationCard from "./application-card";
// React hook for side-effects (data fetching)
import { useEffect } from "react";
// API function to fetch applications for a user
import { getApplications } from "@/api/apiApplication";
// Custom hook for fetching data
import useFetch from "@/hooks/use-fetch";
// Loader for showing while fetching data
import { BarLoader } from "react-spinners";

// Component to show all applications created/submitted by the current candidate
const CreatedApplications = () => {
  // Get current user object from Clerk
  const { user } = useUser();

  // useFetch custom hook to handle fetching, state, and re-fetch
  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id, // Pass user ID as parameter to API
  });

  // Fetch applications on component mount
  useEffect(() => {
    fnApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loader while fetching applications
  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  // Render all application cards
  return (
    <div className="flex flex-col gap-2">
      {applications?.map((application) => {
        return (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true} // Flag so card shows status, not dropdown
          />
        );
      })}
    </div>
  );
};

export default CreatedApplications;
