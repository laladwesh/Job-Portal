// Import Clerk hook for user data
import { useUser } from "@clerk/clerk-react";
// Import custom button component
import { Button } from "@/components/ui/button";
// Import navigation hook from React Router
import { useNavigate } from "react-router-dom";
// useEffect for side-effects
import { useEffect } from "react";
// Loader for showing loading state
import { BarLoader } from "react-spinners";

// Main onboarding component
const Onboarding = () => {
  // Fetch user and loading state
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  // Helper function to navigate user based on role
  const navigateUser = (currRole) => {
    navigate(currRole === "recruiter" ? "/post-job" : "/jobs");
  };

  // Handler for when user selects a role
  const handleRoleSelection = async (role) => {
    await user
      .update({ unsafeMetadata: { role } }) // Update role in Clerk
      .then(() => {
        console.log(`Role updated to: ${role}`);
        navigateUser(role); // Navigate to relevant page
      })
      .catch((err) => {
        console.error("Error updating role:", err); // Log any error
      });
  };

  // Effect to auto-redirect if role already set
  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigateUser(user.unsafeMetadata.role); // Redirect if user already has a role
    }
  }, [user]);

  // Show loader while user info is loading
  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  // UI for role selection
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      {/* Title */}
      <h2 className="gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter">
        I am a...
      </h2>
      {/* Two big buttons for role selection */}
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
        <Button
          variant="blue"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        <Button
          variant="destructive"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
