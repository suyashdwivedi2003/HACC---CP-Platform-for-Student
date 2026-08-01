import React, { useState } from "react";

import {useAuthStore} from "../stores/useAuthStore"
import OldLaptop from "./OldLaptop.jsx";

const SettingPage = () => {
  const { authUser, updateProfile } = useAuthStore();

  const [formData, setFormData] = useState({
    objId: authUser._id,
    fullname: authUser.fullname || "",
    email: authUser.email || "",
    college: authUser.college || "",
    branch: authUser.branch || "",
    year: authUser.year || "",
  });

  const handleFormDataChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    
    <div className="max-w-6xl mx-auto mt-20 p-8 bg-white rounded-lg shadow-lg">
  {/* Heading */}
  <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Profile Settings</h2>

  {/* Two-column layout: Form and 3D Model */}
  <div className="flex flex-col md:flex-row gap-8">
    
    {/* Left: Form */}
    <div className="w-full md:w-1/2">
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleFormDataChange}
            placeholder="Full Name"
            className="w-full mt-1 p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleFormDataChange}
            placeholder="Email"
            className="w-full mt-1 p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />  
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">College</label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleFormDataChange}
            placeholder="College"
            className="w-full mt-1 p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Branch</label>
          <select
            id="branch"
            name="branch"
            value={formData.branch}
            onChange={handleFormDataChange}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          >
            <option value="" disabled>Select Branch</option>
            <option value="1">ECE</option>
            <option value="2">IT</option>
            <option value="3">CSE</option>
            <option value="4">EE</option>
            <option value="5">MECH</option>
            <option value="6">CIVIL</option>
            <option value="7">META</option>
            <option value="8">MINING</option>
            <option value="9">BIOTECH</option>
            <option value="10">BME</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleFormDataChange}
            placeholder="Year"
            className="w-full mt-1 p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>

    {/* Right: 3D Model Placeholder */}
    <div className="w-full md:w-1/2 flex items-center justify-center rounded-lg shadow-inner min-h-[400px]">
      <OldLaptop />
    </div>
  </div>
</div>

  
  );
};

export default SettingPage;
