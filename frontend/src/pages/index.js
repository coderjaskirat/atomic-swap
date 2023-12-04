import HomeSection from "@/components/HomeSection";
import SwapPage from "@/components/SwapPage";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <div className="h-full min-h-screen w-full flex flex-col items-center justify-center">
        <HomeSection />
      </div>
      <div className="bg-black" id="swap">
        <SwapPage /> 
        {/* User 1 */}
      </div>
    </div>
  );
};

export default HomePage;
