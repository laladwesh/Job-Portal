/* eslint-disable react/prop-types */

// Icon imports
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
// UI component imports for card and button
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
// Custom data-fetching hook
import useFetch from "@/hooks/use-fetch";
// API functions for deleting and saving jobs
import { deleteJob, saveJob } from "@/api/apiJobs";
// Clerk hook for user
import { useUser } from "@clerk/clerk-react";
// React hooks for state and effects
import { useEffect, useState } from "react";
// Loader for async actions
import { BarLoader } from "react-spinners";

/**
 * JobCard - displays job info, company, location, description, and actions.
 * Props:
 *   job:         Job object to display.
 *   savedInit:   Is job already saved? (for saved jobs page)
 *   onJobAction: Callback after save/delete (for parent to refresh list).
 *   isMyJob:     If true, show delete button (for "my jobs" page).
 */
const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  // Track if job is saved (affects heart icon state)
  const [saved, setSaved] = useState(savedInit);

  // Get user info
  const { user } = useUser();

  // Hook for deleting job (for recruiters/my jobs)
  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  // Hook for saving/unsaving job (for candidates)
  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  // Handle "save job" button click (toggles save status)
  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobAction(); // Notify parent to refetch if needed
  };

  // Handle "delete job" (for recruiter/my jobs page)
  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction(); // Notify parent to refetch
  };

  // Update saved state based on API response
  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  return (
    <Card className="flex flex-col">
      {/* Loader for delete job action */}
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      {/* Job Title and delete (if recruiter) */}
      <CardHeader className="flex">
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>
      {/* Job content: company logo, location, and brief description */}
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {job.company && <img src={job.company.logo_url} className="h-6" />}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr />
        {/* Show only first sentence of description */}
        {job.description.substring(0, job.description.indexOf("."))}.
      </CardContent>
      {/* Footer: more details and save/unsave or delete */}
      <CardFooter className="flex gap-2">
        {/* Link to job details */}
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
        {/* Save/Unsave Heart button, only if not "my job" */}
        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={20} fill="red" stroke="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
