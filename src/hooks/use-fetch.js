/**
 * Custom hook for handling data fetching with authentication and loading states
 * @param {Function} cb - Callback function that performs the actual data fetching
 * @param {Object} options - Additional options to be passed to the callback function
 * @returns {Object} Object containing data, loading state, error state, and fetch function
 */
import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
  // State management for data, loading, and error states
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  // Get the current session from Clerk authentication
  const { session } = useSession();

  /**
   * Main fetch function that handles the data fetching process
   * @param {...any} args - Additional arguments to be passed to the callback function
   */
  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      // Get Supabase access token from Clerk session
      const supabaseAccessToken = await session.getToken({
        template: "supabase",
      });
      // Execute the callback function with the access token and arguments
      const response = await cb(supabaseAccessToken, options, ...args);
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;