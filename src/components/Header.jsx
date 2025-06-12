import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";

// Header component for the top navigation bar
const Header = () => {
  // State for showing/hiding sign-in modal
  const [showSignIn, setShowSignIn] = useState(false);

  // Search params from URL (for sign-in modal trigger)
  const [search, setSearch] = useSearchParams();
  // Clerk user object
  const { user } = useUser();

  // Effect: Open sign-in modal if "?sign-in" param present in URL
  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  // Handler for closing the modal overlay (when clicked outside)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="py-4 flex justify-between items-center">
        {/* Logo (link to homepage) */}
        <Link to="/">
          <img src="/logo.png" className="h-20" alt="Hirrd Logo" />
        </Link>

        {/* Right section: Auth and actions */}
        <div className="flex gap-8">
          {/* Show Login button only when signed out */}
          <SignedOut>
            <Button variant="outline" onClick={() => setShowSignIn(true)}>
              Login
            </Button>
          </SignedOut>
          {/* Show recruiter actions & user menu when signed in */}
          <SignedIn>
            {/* If recruiter, show 'Post a Job' button */}
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            )}
            {/* User dropdown menu (Clerk UI) */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10", // Custom avatar size
                },
              }}
            >
              {/* Custom menu items for user profile dropdown */}
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
                {/* Built-in account management */}
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {/* Clerk sign-in modal (shows on login click or "?sign-in" URL param) */}
      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding" // Go to onboarding after signup
            fallbackRedirectUrl="/onboarding"    // Fallback redirect
          />
        </div>
      )}
    </>
  );
};

export default Header;
