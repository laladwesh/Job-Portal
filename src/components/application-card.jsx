// Icon imports for visual details
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
// UI card components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
// UI select (dropdown) components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
// API function to update application status
import { updateApplicationStatus } from "@/api/apiApplication";
// Custom hook for API calls
import useFetch from "@/hooks/use-fetch";
// Loader for async operations
import { BarLoader } from "react-spinners";

// Card component to show job application details
const ApplicationCard = ({ application, isCandidate = false }) => {
  // Download resume handler
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  // Setup fetch hook for updating application status
  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  );

  // Handler for changing status (recruiter only)
  const handleStatusChange = (status) => {
    fnHiringStatus(status).then(() => fnHiringStatus());
  };

  return (
    <Card>
      {/* Loader while status is updating */}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {/* Display job title/company for candidates, name for recruiters */}
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}
          {/* Download Resume Icon */}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Experience row */}
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} /> {application?.experience} years of
            experience
          </div>
          {/* Education row */}
          <div className="flex gap-2 items-center">
            <School size={15} />
            {application?.education}
          </div>
          {/* Skills row */}
          <div className="flex gap-2 items-center">
            <Boxes size={15} /> Skills: {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* Application creation date */}
        <span>{new Date(application?.created_at).toLocaleString()}</span>
        {/* Show status as text for candidate, dropdown for recruiter */}
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status: {application.status}
          </span>
        ) : (
          // Recruiter: Status select dropdown
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
