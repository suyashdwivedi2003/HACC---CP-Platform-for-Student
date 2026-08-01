import React, { useEffect, useState } from "react";
import { useContestStore } from "../stores/useContestStore";

const Ratings = () => {
  // State for filtering options
  const [viewMode, setViewMode] = useState("college"); // "college" or "year"
  const [platform, setPlatform] = useState("codeforces"); // "codeforces", "codechef", or "leetcode"
  const [selectedYear, setSelectedYear] = useState(null); // null, 1, 2, 3, or 4

  // Get data from store
  const { fetchRatingsData, RatingsData } = useContestStore();

  useEffect(() => {
    fetchRatingsData();
  }, [fetchRatingsData]);

  const [previewSrc, setPreviewSrc] = useState(null);

  const handleCodingProfile = (user) => {
    if(platform==="codeforces"){
      window.open(`https://codeforces.com/profile/${user.codeforcesId}`,"_blank");
    } else if(platform==="codechef"){
     window.open(`https://www.codechef.com/users/${user.codechefId}`,"_blank");
     }else{
      window.open(`https://leetcode.com/u/${user.leetcodeId}/`,"_blank");
     }
  }

  const handleImageClick = (src) => {
    setPreviewSrc(src);
  };
  const handleClosePreview = () => {
    setPreviewSrc(null);
  };

  // Handle button clicks for view mode
  const handleViewMode = (mode) => {
    setViewMode(mode);
    if (mode === "college") {
      setSelectedYear(null);
    } else if (mode === "year" && selectedYear === null) {
      // If switching to year view and no year is selected, select 3rd year by default
      setSelectedYear(3);
    }
  };

  // Handle button clicks for platform
  const handlePlatform = (platform) => {
    setPlatform(platform);
  };

  // Handle button clicks for year selection
  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };

  // Console log to debug the state values
  useEffect(() => {
    console.log("Current state:", {
      viewMode,
      platform,
      selectedYear,
      dataLength: RatingsData ? RatingsData.length : 0,
    });

    if (RatingsData && RatingsData.length > 0) {
      // Log the year values present in the data
      const years = RatingsData.map((user) => user.year);
      const uniqueYears = [...new Set(years)];
      console.log("Years in data:", uniqueYears);

      // Check if we have data for the selected year
      if (selectedYear) {
        const matchingUsers = RatingsData.filter(
          (user) =>
            // Match by both number and string representation
            user.year === selectedYear || user.year === String(selectedYear)
        );
        console.log(`Users with year ${selectedYear}:`, matchingUsers.length);
      }
    }
  }, [viewMode, platform, selectedYear, RatingsData]);

  // Filter data based on the selected filters
  const getFilteredData = () => {
    if (!RatingsData || RatingsData.length === 0) {
      return [];
    }

    let filteredData = [...RatingsData];

    // Filter by year if in year-wise mode and a year is selected
    if (viewMode === "year" && selectedYear !== null) {
      filteredData = filteredData.filter((user) => {
        // Compare as both number and string to handle possible type mismatches
        const userYear = user.year;
        return (
          userYear === selectedYear ||
          userYear === String(selectedYear) ||
          String(userYear) === String(selectedYear)
        );
      });

      // Debug log
      console.log(`After year filter (${selectedYear}):`, filteredData.length);
    }

    // Sort data by the selected platform's rating (in descending order)
    return filteredData.sort((a, b) => {
      let ratingA = 0;
      let ratingB = 0;

      switch (platform) {
        case "codeforces":
          ratingA = a.forcesRating || 0;
          ratingB = b.forcesRating || 0;
          break;
        case "codechef":
          ratingA = a.chefRating || 0;
          ratingB = b.chefRating || 0;
          break;
        case "leetcode":
          ratingA = a.leetRating || 0;
          ratingB = b.leetRating || 0;
          break;
        default:
          break;
      }

      return ratingB - ratingA; // Descending order
    });
  };

  // Get the appropriate handle and rating based on the selected platform
  const getUserPlatformData = (user) => {
    switch (platform) {
      case "codeforces":
        return {
          handle: user.codeforcesId || "N/A",
          rating: user.forcesRating || "N/A",
        };
      case "codechef":
        return {
          handle: user.codechefId || "N/A",
          rating: user.chefRating || "N/A",
        };
      case "leetcode":
        return {
          handle: user.leetcodeId || "N/A",
          rating: user.leetRating || "N/A",
        };
      default:
        return { handle: "N/A", rating: "N/A" };
    }
  };

  // Get platform-specific styling for the rating
  const getRatingColorClass = (rating) => {
    // Convert rating to number if it's not already
    const numRating =
      typeof rating === "number" ? rating : parseInt(rating) || 0;

    if (platform === "codeforces") {
      if (numRating >= 2400) return "text-red-600";
      if (numRating >= 2100) return "text-orange-500";
      if (numRating >= 1900) return "text-purple-600";
      if (numRating >= 1600) return "text-blue-500";
      if (numRating >= 1400) return "text-cyan-500";
      if (numRating >= 1200) return "text-green-500";
      return "text-gray-500";
    } else if (platform === "codechef") {
      if (numRating >= 2500) return "text-red-600";
      if (numRating >= 2200) return "text-orange-500";
      if (numRating >= 2000) return "text-purple-600";
      if (numRating >= 1800) return "text-blue-500";
      if (numRating >= 1600) return "text-green-500";
      return "text-gray-500";
    } else if (platform === "leetcode") {
      if (numRating >= 2400) return "text-red-600";
      if (numRating >= 2000) return "text-orange-500";
      if (numRating >= 1600) return "text-yellow-500";
      return "text-gray-500";
    }
    return "text-gray-500";
  };

  const filteredData = getFilteredData();

  return (
    <div className="relative w-full">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/bgvideo2.mp4" type="video/mp4" />
      </video>

      <div className="p-4 max-w-4xl mx-auto text-gray-800 mt-20">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text animate-fadeIn opacity-0 animation-delay-300">
          Competitive Programming Ratings
        </h1>

        {/* Filter Controls */}
        <div className="mb-8">
          {/* View Mode Buttons */}
          <div className="flex justify-center mb-4 space-x-4">
            <button
              onClick={() => handleViewMode("college")}
              className={`px-4 py-2 rounded-md ${
                viewMode === "college"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              College Wise
            </button>
            <button
              onClick={() => handleViewMode("year")}
              className={`px-4 py-2 rounded-md ${
                viewMode === "year"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              Year Wise
            </button>
          </div>

          {/* Platform Buttons */}
          <div className="flex justify-center mb-4 space-x-4">
            <button
              onClick={() => handlePlatform("codeforces")}
              className={`px-4 py-2 rounded-md ${
                platform === "codeforces"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              Codeforces
            </button>
            <button
              onClick={() => handlePlatform("codechef")}
              className={`px-4 py-2 rounded-md ${
                platform === "codechef"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              CodeChef
            </button>
            <button
              onClick={() => handlePlatform("leetcode")}
              className={`px-4 py-2 rounded-md ${
                platform === "leetcode"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              LeetCode
            </button>
          </div>

          {/* Year Buttons (only shown when Year Wise is selected) */}
          {viewMode === "year" && (
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4].map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`px-4 py-2 rounded-md ${
                    selectedYear === year
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  {year}
                  {year === 1
                    ? "st"
                    : year === 2
                    ? "nd"
                    : year === 3
                    ? "rd"
                    : "th"}{" "}
                  Year
                </button>
              ))}
            </div>
          )}
        </div>

        {previewSrc && (
          <div
            onClick={handleClosePreview}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <img
              src={previewSrc}
              alt="preview"
              style={{
                maxHeight: "90%",
                maxWidth: "90%",
                borderRadius: "10px",
              }}
            />
          </div>
        )}

        {/* Display the filtered data */}
        
<div className="overflow-x-auto rounded-lg border border-gray-300 shadow-md">
  <div className="min-w-[600px]">
    {/* Table Header */}
    <div className="grid grid-cols-12 bg-gray-700 text-white py-3 px-4 font-semibold border-b text-sm sm:text-base">
      <div className="col-span-1">#</div>
      <div className="col-span-1">Profile</div>
      <div className="col-span-3">Full Name</div>
      <div className="col-span-3">Handle</div>
      <div className="col-span-2">College</div>

      <div className="col-span-1 text-right">Rating</div>
    </div>

    {/* Table Content */}
    {filteredData.length > 0 ? (
      filteredData.map((user, index) => {
        const platformData = getUserPlatformData(user);
        if (platformData.handle === '.') return null; 
        return (
          <div
            key={index}
            className="grid grid-cols-12 py-3 px-4 border-b border-gray-600 hover:bg-gray-700 hover:bg-opacity-20 transition-colors duration-150 items-center text-sm sm:text-base"
          >
            <div onClick={()=>handleCodingProfile(user)} className="col-span-1 text-white">{index + 1}</div>
            <div className="col-span-1">
              <img
                src={user.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                onClick={() =>
                  handleImageClick(user.profilePic || "/avatar.png")
                }
              />
            </div>
            <div onClick={()=>handleCodingProfile(user)} className="col-span-3 text-white truncate">
              {user.fullname || "N/A"}
            </div>
            <div onClick={()=>handleCodingProfile(user)} className="col-span-3 text-white truncate">
              {platformData.handle}
            </div>
            <div onClick={()=>handleCodingProfile(user)} className="col-span-2 text-white truncate">
              {user.college || "N/A"}
            </div>
            
            <div onClick={()=>handleCodingProfile(user)}
              className={`col-span-1 text-right font-medium ${getRatingColorClass(
                platformData.rating
              )}`}
            >
              {platformData.rating}
            </div>
          </div>  
        );
      })
    ) : (
      <div className="py-6 text-center text-gray-400">
        {RatingsData && RatingsData.length > 0
          ? "No data matches your filters"
          : "Loading ratings data..."}
      </div>
    )}
  </div>
</div>

      </div>
    </div>
  );
};

export default Ratings;
