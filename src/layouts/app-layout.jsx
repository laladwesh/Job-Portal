/**
 * AppLayout Component
 * Main layout wrapper that provides the common structure for all pages
 * Includes the header and footer, with the main content rendered through Outlet
 */
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      {/* Main content wrapper with padding */}
      <div className="px-8">
        {/* Background grid pattern */}
        <div className="grid-background"></div>
        
        {/* Main content area with minimum height of screen */}
        <main className="min-h-screen container">
          {/* Header component */}
          <Header/>
          {/* Dynamic content rendered through React Router */}
          <Outlet />
        </main>
      </div>

      {/* Footer section */}
      <div className="p-10 text-center bg-gray-800 mt-10">
        Made with 💗 by chholekulche_
      </div>
    </div>
  );
};

export default AppLayout;