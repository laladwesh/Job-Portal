// API imports for fetching and posting jobs/companies
import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
// UI component imports
import AddCompanyDrawer from "@/components/add-company-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// Custom hook for API calls
import useFetch from "@/hooks/use-fetch";
// Clerk user for authentication
import { useUser } from "@clerk/clerk-react";
// Validation resolver for react-hook-form + zod
import { zodResolver } from "@hookform/resolvers/zod";
// Markdown editor
import MDEditor from "@uiw/react-md-editor";
// For state dropdown (India)
import { State } from "country-state-city";
// React core hooks/utilities
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
// Navigation
import { Navigate, useNavigate } from "react-router-dom";
// Loader
import { BarLoader } from "react-spinners";
// Schema validation library
import { z } from "zod";

// ------------------------
// Form validation schema using zod
// ------------------------
const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

// ------------------------
// Main Component
// ------------------------
const PostJobPage = () => {
  // Get current user and loading status
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  // react-hook-form setup (with zod validation)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  // Setup for create job API call (with useFetch)
  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  // Form submission handler
  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id, // Attach recruiter ID
      isOpen: true, // Jobs are open by default
    });
  };

  // Redirect after successful job creation
  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [loadingCreateJob]);

  // Setup for companies dropdown (API call)
  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  // Fetch companies once user is loaded
  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Loader while loading user or companies
  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  // Redirect candidates or other roles (only recruiters allowed)
  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  // ------------------------
  // JSX for the form
  // ------------------------
  return (
    <div>
      {/* Page Title */}
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      {/* Job Post Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        {/* Job Title */}
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        {/* Job Description */}
        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        {/* Location and Company Selection */}
        <div className="flex gap-4 items-center">
          {/* Job Location Dropdown (using Controller for controlled component) */}
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* List all Indian states */}
                    {State.getStatesOfCountry("IN").map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {/* Company Dropdown (controlled) */}
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* List all companies */}
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={name} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {/* Button/Drawer to add a new company */}
          <AddCompanyDrawer fetchCompanies={fnCompanies} />
        </div>
        {/* Validation errors for location or company */}
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        {/* Requirements field with Markdown editor */}
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}

        {/* Errors and loading states for job creation */}
        {errors.errorCreateJob && (
          <p className="text-red-500">{errors?.errorCreateJob?.message}</p>
        )}
        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
        )}
        {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}

        {/* Submit button */}
        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJobPage;
