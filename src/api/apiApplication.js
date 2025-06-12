import supabaseClient, { supabaseUrl } from "@/utils/supabase";

/**
 * Apply to Job (candidate uploads resume & applies)
 * @param {string} token - Auth token for Supabase
 * @param {any} _ - (unused param for compat with hooks)
 * @param {object} jobData - Application data including candidate_id, resume (file), etc.
 * @returns {Promise<object[]>} - Inserted application data
 */
export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  // Generate a unique file name for the uploaded resume
  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  // Upload the resume file to Supabase Storage 'resumes' bucket
  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) throw new Error("Error uploading Resume");

  // Get public URL to the uploaded resume
  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  // Insert new application record with resume URL
  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Application");
  }

  return data;
}

/**
 * Edit Application Status (recruiter)
 * @param {string} token - Auth token
 * @param {object} param1 - { job_id }
 * @param {string} status - New status ("applied", "interviewing", "hired", "rejected")
 * @returns {Promise<object[]|null>} - Updated application(s) or null on error
 */
export async function updateApplicationStatus(token, { job_id }, status) {
  const supabase = await supabaseClient(token);
  // Update status for all applications with this job_id
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}

/**
 * Get all applications for a candidate (with job & company info)
 * @param {string} token - Auth token
 * @param {object} param1 - { user_id }
 * @returns {Promise<object[]|null>} - Applications with nested job and company info, or null on error
 */
export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);
  // Select all applications by candidate_id, with job title and company name included (nested)
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}
