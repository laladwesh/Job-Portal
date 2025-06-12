import supabaseClient, { supabaseUrl } from "@/utils/supabase";

/**
 * Fetch all companies from the database.
 * @param {string} token - Auth token for Supabase client
 * @returns {Promise<object[]|null>} Array of companies or null on error
 */
export async function getCompanies(token) {
  const supabase = await supabaseClient(token);

  // Select all fields from the "companies" table
  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error fetching Companies:", error);
    return null;
  }

  return data;
}

/**
 * Add a new company, uploading the logo to Supabase Storage.
 * @param {string} token - Auth token for Supabase client
 * @param {any} _ - (unused param for compat with hooks)
 * @param {object} companyData - Must include { name, logo (file) }
 * @returns {Promise<object[]>} - Inserted company data
 */
export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);

  // Generate a unique filename for the uploaded logo
  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  // Upload the logo file to Supabase Storage (bucket: company-logo)
  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo);

  if (storageError) throw new Error("Error uploading Company Logo");

  // Public URL for the uploaded logo
  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

  // Insert new company record with name and logo_url
  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url: logo_url,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Companys");
  }

  return data;
}
