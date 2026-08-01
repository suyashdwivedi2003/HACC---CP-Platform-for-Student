import { React, useState, useEffect, useRef } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useChatStore } from "../stores/useChatStore";
import { CheckCircle, Camera } from "lucide-react";

import toast from "react-hot-toast";

const ProfilePage = () => {
  const { messages, subscribeToMessage, unsubscribeToMessage } = useChatStore();
  const {
    authUser,
    refreshRatings,
    updateCodingIds,
    updateImage,
    removeImage,
    isWorking,
  } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const divref = useRef();

  useEffect(() => {
    subscribeToMessage();
    return () => unsubscribeToMessage();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divref.current && !divref.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const timer = setTimeout(() => {
      console.log("5 seconds passed!");

      toast(
        "Please click on Refresh Ratings to Update your Ratings if not up to date.",
        {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }
      );
    }, 3000);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(timer);
    };
  }, []);

  const [progress, setProgress] = useState(100);
  const duration = 4800;

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;
    setProgress(100);

    const progressInterval = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      const percent = (remaining / duration) * 100;
      if (percent <= 0) {
        clearInterval(progressInterval);
        setProgress(0);
      } else {
        setProgress(percent);
      }
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isWorking]);

  const [image, setImage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    objId: authUser._id,
    ccId: authUser.codechefId || "",
    cfId: authUser.codeforcesId || "",
    leetId: authUser.leetcodeId || "",
  });

  const handleFormDataChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.ccId.trim()) return toast.error("ccId is required");
    if (!formData.cfId.trim()) return toast.error("cfId is required");
    if (!formData.leetId.trim()) return toast.error("leetId is required");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();
    if (!success) return;

    const trimmedData = {
      ...formData,
      ccId: formData.ccId.trim(),
      cfId: formData.cfId.trim(),
      leetId: formData.leetId.trim(),
    };
    console.log(trimmedData);

    updateCodingIds(trimmedData);
  };

  const handleFileChange = async (e) => {
    setImage(e.target.files[0]);
    console.log(image);
    const formData = new FormData();
    formData.append("objId", authUser._id);
    formData.append("image", e.target.files[0]);
    await updateImage(formData);
  };

  const handleRemoveImage = async () => {
    await removeImage({ objId: authUser._id });
  };

  const handleRefreshRatings = (e) => {
    e.preventDefault();
    const data = {
      objId: authUser._id,
      leetId: authUser.leetcodeId,
      ccId: authUser.codechefId,
      cfId: authUser.codeforcesId,
    };
    refreshRatings(data);
  };

  // LeetCode problem data
  const leetcodeProblemData = [
    {
      name: "Easy",
      total: authUser.easyLeetQuestions,
      solved: authUser.easySolvedLeetQuestions,
      fill: "#4CAF50",
    },
    {
      name: "Medium",
      total: authUser.mediumLeetQuestions,
      solved: authUser.mediumSolvedLeetQuestions,
      fill: "#FF9800",
    },
    {
      name: "Hard",
      total: authUser.hardLeetQuestions,
      solved: authUser.hardSolvedLeetQuestions,
      fill: "#F44336",
    },
  ];

  // Codeforces problems by rating
  const cfRatingData = Object.entries(
    authUser.forcesTotalProblemsolvedByRating || {}
  )
    .filter(([key]) => key !== "Unrated")
    .map(([key, value]) => ({ rating: key, count: value }))
    .sort((a, b) => parseInt(a.rating) - parseInt(b.rating));

  // Create pie chart data for each difficulty level
  const createPieData = (solved, total) => [
    { name: "Solved", value: solved, fill: "#4CAF50" },
    { name: "Unsolved", value: total - solved, fill: "#E0E0E0" },
  ];

  const easyPieData = createPieData(
    authUser.easySolvedLeetQuestions,
    authUser.easyLeetQuestions
  );
  const mediumPieData = createPieData(
    authUser.mediumSolvedLeetQuestions,
    authUser.mediumLeetQuestions
  );
  const hardPieData = createPieData(
    authUser.hardSolvedLeetQuestions,
    authUser.hardLeetQuestions
  );

  // Rating color mapping
  const getRatingColor = (platform, rating) => {
    if (platform === "codeforces") {
      if (rating < 1200) return "#808080"; // Gray (Newbie)
      if (rating < 1400) return "#008000"; // Green (Pupil)
      if (rating < 1600) return "#03A89E"; // Cyan (Specialist)
      if (rating < 1900) return "#0000FF"; // Blue (Expert)
      if (rating < 2100) return "#AA00AA"; // Purple (Candidate Master)
      if (rating < 2400) return "#FF8C00"; // Orange (Master)
      return "#FF0000"; // Red (Grandmaster+)
    } else if (platform === "codechef") {
      if (rating < 1400) return "#666666"; // Gray (1-2 stars)
      if (rating < 1600) return "#1E7D22"; // Green (3 stars)
      if (rating < 1800) return "#3366CC"; // Blue (4 stars)
      if (rating < 2000) return "#684273"; // Purple (5 stars)
      if (rating < 2200) return "#FFC100"; // Yellow (6 stars)
      return "#FF7F00"; // Orange (7 stars)
    } else if (platform === "leetcode") {
      if (rating < 1500) return "#9E9E9E"; // Gray
      if (rating < 1800) return "#43A047"; // Green
      if (rating < 2100) return "#0288D1"; // Blue
      if (rating < 2400) return "#9C27B0"; // Purple
      return "#FF8F00"; // Orange
    }
    return "#000000";
  };

  // Get rating color for each platform
  const cfColor = getRatingColor("codeforces", authUser.forcesRating);
  const chefColor = getRatingColor("codechef", authUser.chefRating);
  const leetColor = getRatingColor("leetcode", authUser.leetRating);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg text-black mt-20 mb-20">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/bgvideo2.mp4" type="video/mp4" />
      </video>

      {isWorking && (
        <div className="fixed bottom-4 left-4 bg-black text-white rounded shadow-lg px-4 py-3 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="text-green-500" size={20} />
            <span>Updating...</span>
          </div>
          <div className="bg-gray-800 h-1 w-full rounded-full">
            <div
              className="bg-green-500 h-1 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Your Form</h2>
            <div>
              <label>CodeChef ID</label>
              <input
                type="text"
                name="ccId"
                value={formData.ccId}
                onChange={handleFormDataChange}
                placeholder="ccId"
                className="w-full mb-4 p-2 border rounded"
              />

              <label>CodeForces ID</label>
              <input
                type="text"
                name="cfId"
                value={formData.cfId}
                onChange={handleFormDataChange}
                placeholder="cfId"
                className="w-full mb-4 p-2 border rounded"
              />

              <label>Leetcode ID</label>
              <input
                type="text"
                name="leetId"
                value={formData.leetId}
                onChange={handleFormDataChange}
                placeholder="leetId"
                className="w-full mb-4 p-2 border rounded"
              />

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>

            <button
              onClick={() => setShowForm(false)}
              className="mt-4 text-sm text-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Header with Profile Info */}
      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 border-b pb-8">
        <div className="relative">
          <img
            src={authUser.profilePic || "/avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border shadow-md object-cover"
          />
          <Camera
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute bottom-1 right-1 cursor-pointer w-7 h-7 text-base-200 bg-white rounded-full p-1 shadow"
          />

          {menuOpen && (
            <div
              ref={divref}
              className="absolute top-full w-48 bg-gray-800 rounded-md shadow-lg z-[9999]"
            >
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white">
                  <input
                    type="file"
                    accept="image/*"
                    ref={menuRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => menuRef.current?.click()}
                    className="text-white py-2 rounded"
                  >
                    📁 Upload photo
                  </button>
                </li>
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-red-400">
                  <button onClick={handleRemoveImage}>🗑 Remove photo</button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* here by making the menu div to be absolute and img div to be relative, it now anchors directly 
        to the img div otherwise in case of parent div containing z-index or overflow to be hidden lead to visibility issues */}

        {/* Profile Information */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {authUser.fullname}
              </h1>
              <p className="text-gray-600 mt-1">{authUser.email}</p>
            </div>
            <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md font-medium transition-colors"
                onClick={() => setShowForm(true)}
              >
                Update IDs
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md font-medium transition-colors"
                onClick={handleRefreshRatings}
              >
                Refresh Ratings
              </button>
            </div>
          </div>

          {/* User details with icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200 transition-all flex items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">College</p>
                <p className="font-semibold text-gray-800">
                  {authUser.college || "Not specified"}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200 transition-all flex items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">Branch</p>
                <p className="font-semibold text-gray-800">{authUser.branch}</p>
              </div>
            </div>
            <div className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200 transition-all flex items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">Year</p>
                <p className="font-semibold text-gray-800">
                  {authUser.year || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coding Platform Overview */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          Coding Platforms Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LeetCode Card */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <img
                className="w-9 h-9 rounded-full shadow-md"
                src="./leetcode.png"
              />
              <span
                className="text-sm px-2 py-1 rounded-full"
                style={{ backgroundColor: leetColor, color: "white" }}
              >
                {authUser.leetRating != null
                  ? authUser.leetRating.toFixed(0)
                  : "N/A"}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Global Rank:</span>
                <span className="font-medium">
                  {authUser.leetGlobalRanking?.toLocaleString() ?? "N/A"} /{" "}
                  {authUser.leetTotalParticipants?.toLocaleString() ?? "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Top:</span>
                <span className="font-medium">
                  {authUser.leetTopPercentage}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Contests:</span>
                <span className="font-medium">{authUser.leetContestCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Problems Solved:</span>
                <span className="font-medium">
                  {authUser.totalSolvedLeetQuestions} /{" "}
                  {authUser.totalLeetQuestions}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Visit Profile: </span>
                <a
                  href={`https://leetcode.com/${authUser.leetcodeId}`}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: leetColor }}
                  ></span>
                  LeetCode
                </a>
              </div>
            </div>
          </div>

          {/* CodeForces Card */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              {/*<h3 className="text-xl font-semibold">CodeForces</h3> */}
              <img className="w-10 h-10  shadow-md" src="./codeforces.png" />
              <span
                className="text-sm px-2 py-1 rounded-full"
                style={{ backgroundColor: cfColor, color: "white" }}
              >
                {authUser.forcesRating}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rank:</span>
                <span className="font-medium capitalize">
                  {authUser.forcesRank}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Max Rating:</span>
                <span className="font-medium">
                  {authUser.forcesMaxRating} ({authUser.forcesMaxRank})
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Contests:</span>
                <span className="font-medium">
                  {authUser.forcesContestCount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Problems Solved:</span>
                <span className="font-medium">
                  {authUser.forcesTotalProblemSolved}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Visit Profile: </span>
                <a
                  href={`https://codeforces.com/profile/${authUser.codeforcesId}`}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cfColor }}
                  ></span>
                  CodeForces
                </a>
              </div>
            </div>
          </div>

          {/* CodeChef Card */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              {/*<h3 className="text-xl font-semibold">CodeChef</h3>*/}
              <img
                className="w-10 h-10 rounded-full shadow-md"
                src="./codechef.png"
              />
              <span
                className="text-sm px-2 py-1 rounded-full"
                style={{ backgroundColor: chefColor, color: "white" }}
              >
                {authUser.chefRating}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stars:</span>
                <span className="font-medium">{authUser.chefStars}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Problems Solved:</span>
                <span className="font-medium">
                  {authUser.chefTotalProblemSolved}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Contests:</span>
                <span className="font-medium">{authUser.chefContestCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Visit Profile :</span>
                <a
                  href={`https://www.codechef.com/users/${authUser.codechefId}`}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: chefColor }}
                  ></span>
                  CodeChef
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6">Coding Analytics</h2>

        {/* LeetCode Pie Charts */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            LeetCode Problem Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Easy Problems Pie Chart */}
            <div className="flex flex-col items-center">
              <h4
                className="text-md font-medium mb-2"
                style={{ color: "#4CAF50" }}
              >
                Easy Problems
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={easyPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {easyPieData.map((entry, index) => (
                      <Cell key={`easy-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <p className="font-medium">
                  {authUser.easySolvedLeetQuestions} /{" "}
                  {authUser.easyLeetQuestions}
                </p>
              </div>
            </div>

            {/* Medium Problems Pie Chart */}
            <div className="flex flex-col items-center">
              <h4
                className="text-md font-medium mb-2"
                style={{ color: "#FF9800" }}
              >
                Medium Problems
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={mediumPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {mediumPieData.map((entry, index) => (
                      <Cell key={`medium-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <p className="font-medium">
                  {authUser.mediumSolvedLeetQuestions} /{" "}
                  {authUser.mediumLeetQuestions}
                </p>
              </div>
            </div>

            {/* Hard Problems Pie Chart */}
            <div className="flex flex-col items-center">
              <h4
                className="text-md font-medium mb-2"
                style={{ color: "#F44336" }}
              >
                Hard Problems
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={hardPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {hardPieData.map((entry, index) => (
                      <Cell key={`hard-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <p className="font-medium">
                  {authUser.hardSolvedLeetQuestions} /{" "}
                  {authUser.hardLeetQuestions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Codeforces Problems by Rating */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            CodeForces Problems by Difficulty
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={cfRatingData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} problems`, "Solved"]} />
              <Bar dataKey="count" name="Problems Solved" fill="#3366CC" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Card Section as replacement for Radar Chart */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            Coding Achievement Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Problems Solved Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <h4 className="text-md font-medium text-blue-700">
                Total Problems Solved
              </h4>
              <p className="text-3xl font-bold mt-2">
                {(
                  authUser.totalSolvedLeetQuestions +
                  authUser.forcesTotalProblemSolved +
                  authUser.chefTotalProblemSolved
                ).toLocaleString()}
              </p>
              <div className="mt-2 text-sm text-blue-700">
                <p>Across all platforms</p>
              </div>
            </div>

            {/* Total Contests Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <h4 className="text-md font-medium text-purple-700">
                Contest Participation
              </h4>
              <p className="text-3xl font-bold mt-2">
                {(
                  authUser.leetContestCount +
                  authUser.forcesContestCount +
                  authUser.chefContestCount
                ).toLocaleString()}
              </p>
              <div className="mt-2 text-sm text-purple-700">
                <p>Total contests joined</p>
              </div>
            </div>

            {/* LeetCode Completion Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <h4 className="text-md font-medium text-green-700">
                LeetCode Completion
              </h4>
              <p className="text-3xl font-bold mt-2">
                {Math.round(
                  (authUser.totalSolvedLeetQuestions /
                    authUser.totalLeetQuestions) *
                    100
                )}
                %
              </p>
              <div className="mt-2 text-sm text-green-700">
                <p>Of total available problems</p>
              </div>
            </div>

            {/* Consistency Score */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
              <h4 className="text-md font-medium text-red-700">
                Next Milestone
              </h4>
              <p className="text-xl font-bold mt-2">
                {(() => {
                  for (let i = 1200; i < 2300; i += 50) {
                    if (parseInt(authUser.leetRating) < i) {
                      return `Reach rating of ${i}`;
                    }
                  }
                })()}
              </p>
              <div className="mt-2 text-sm text-red-700">
                <p>Your next achievement target</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
              <h4 className="text-md font-medium text-amber-700">
                Next Milestone
              </h4>
              <p className="text-xl font-bold mt-2">
                {parseInt(authUser.chefStars) < 2
                  ? "Become 2* on CC"
                  : parseInt(authUser.chefStars) < 3
                  ? "Become 3* on CC"
                  : parseInt(authUser.chefStars) < 4
                  ? "Become 4* on CC"
                  : parseInt(authUser.chefStars) < 5
                  ? "Become 5* on CC"
                  : parseInt(authUser.chefStars) < 6
                  ? "Become 6* on CC"
                  : parseInt(authUser.chefStars) < 7
                  ? "Become 7* on CC"
                  : "You're already a legend!!!"}
              </p>
              <div className="mt-2 text-sm text-amber-700">
                <p>Your next achievement target</p>
              </div>
            </div>

            {/* Milestone Card */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg">
              <h4 className="text-md font-medium text-teal-700">
                Next Milestone
              </h4>
              <p className="text-xl font-bold mt-2">
                {authUser.forcesRating < 1200
                  ? "Reach Pupil on CF"
                  : authUser.forcesRating < 1400
                  ? "Reach Specialist on CF"
                  : authUser.forcesRating < 1600
                  ? "Reach Expert on CF"
                  : authUser.forcesRating < 1900
                  ? "Reach Candidate Master on CF"
                  : authUser.chefStars < 5
                  ? "Reach 5★ on CodeChef"
                  : authUser.leetTopPercentage > 5
                  ? "Top 5% on LeetCode"
                  : "Grandmaster Status"}
              </p>
              <div className="mt-2 text-sm text-teal-700">
                <p>Your next achievement target</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
