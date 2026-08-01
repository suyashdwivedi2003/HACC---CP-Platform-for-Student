import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore.js";
import { useFirebase } from "../context Api/Firebase.jsx";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

const SignupPage = () => {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    branch: "",
    year: "",
    college: "",
    ccId: "",
    cfId: "",
    leetId: "",
  });

  const { signup, isSigninUp, oauthData } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullname.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    console.log("inside handle submit in frontend signup page");
    e.preventDefault();

    const success = validateForm();
    if (!success) return;

    console.log("before trimmedData in frontend signup page");
    const trimmedData = {
      ...formData,
      ccId: formData.ccId.trim(),
      cfId: formData.cfId.trim(),
      leetId: formData.leetId.trim(),
    };

    console.log(trimmedData);

    await signup(trimmedData);
    // navigate('/');
  };

  useEffect(() => {
    onAuthStateChanged(firebase.firebaseAuth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, [onAuthStateChanged]);

  useEffect(() => {
    if (user) {
      oauthData(user);
      navigate("/oauth-form");
    }
  }, [user, navigate]);

  if (isSigninUp) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="bg-white/10 backdrop-blur-lg p-12 rounded-2xl shadow-2xl flex flex-col items-center border border-white/20">
          <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold text-white">
            Creating your account...
          </h1>
          <p className="text-blue-200 mt-2">This will just take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient
                id="Gradient1"
                cx="50%"
                cy="50%"
                fx="0.441602%"
                fy="50%"
                r=".5"
              >
                <animate
                  attributeName="fx"
                  dur="34s"
                  values="0%;3%;0%"
                  repeatCount="indefinite"
                ></animate>
                <stop offset="0%" stopColor="#7B61FF"></stop>
                <stop offset="100%" stopColor="#00FFFF" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient
                id="Gradient2"
                cx="50%"
                cy="50%"
                fx="2.68147%"
                fy="50%"
                r=".5"
              >
                <animate
                  attributeName="fx"
                  dur="23.5s"
                  values="0%;3%;0%"
                  repeatCount="indefinite"
                ></animate>
                <stop offset="0%" stopColor="#0061FF"></stop>
                <stop offset="100%" stopColor="#60EFFF" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient
                id="Gradient3"
                cx="50%"
                cy="50%"
                fx="0.836536%"
                fy="50%"
                r=".5"
              >
                <animate
                  attributeName="fx"
                  dur="21.5s"
                  values="0%;3%;0%"
                  repeatCount="indefinite"
                ></animate>
                <stop offset="0%" stopColor="#FF00E5"></stop>
                <stop offset="100%" stopColor="#AA00FF" stopOpacity="0"></stop>
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient1)">
              <animate
                attributeName="x"
                dur="20s"
                values="25%;0%;25%"
                repeatCount="indefinite"
              />
              <animate
                attributeName="y"
                dur="21s"
                values="0%;25%;0%"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="17s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient2)">
              <animate
                attributeName="x"
                dur="23s"
                values="-25%;0%;-25%"
                repeatCount="indefinite"
              />
              <animate
                attributeName="y"
                dur="24s"
                values="0%;50%;0%"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="18s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient3)">
              <animate
                attributeName="x"
                dur="25s"
                values="0%;25%;0%"
                repeatCount="indefinite"
              />
              <animate
                attributeName="y"
                dur="26s"
                values="0%;25%;0%"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 50 50"
                to="0 50 50"
                dur="19s"
                repeatCount="indefinite"
              />
            </rect>
          </svg>
        </div>
      </div>

      <div className="mt-35 relative z-10 max-w-7xl w-full flex flex-col md:flex-row bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        {/* Left side - Welcome/OAuth */}
        <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-blue-500/30 to-purple-600/30">
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                <img
                  src="https://i.postimg.cc/CLVqQmwX/HACC.jpg"
                  className=""
                />
              </div>
              <h1 className="text-3xl font-bold">HACC</h1>
            </div>

            <h2 className="text-4xl font-bold mb-6">
              Join our coding community
            </h2>
            <p className="text-blue-100 mb-8">
              Connect with fellow programmers, track your progress, and improve
              your coding skills.
            </p>
          </div>

          <div className="space-y-5">
            <h3 className="text-xl font-semibold mb-4">Quick signup with</h3>

            <button
              onClick={() => {
                firebase.signInWithGoogle();
              }}
              className="w-full py-4 px-6 bg-white text-gray-800 font-medium rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center space-x-3 transition-all transform hover:scale-105"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => {
                firebase.signInWithGithub();
              }}
              className="w-full py-4 px-6 bg-gray-900 text-white font-medium rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-700 flex items-center justify-center space-x-3 transition-all transform hover:scale-105"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span>Continue with GitHub</span>
            </button>

            <div className="pt-6 text-center">
              <p className="text-blue-100">Already have an account?</p>
              <Link
                to="/login"
                className="block mt-2 font-medium text-white hover:underline"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <h2 className="text-3xl font-bold mb-8">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-500/20 p-2 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="fullname"
                    className="block text-sm font-medium mb-1 text-blue-100"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1 text-blue-100"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1 text-blue-100"
                  >
                    Password
                  </label>
                  <input
                    type="text"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/50 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-purple-500/20 p-2 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </span>
                Academic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="branch"
                    className="block text-sm font-medium mb-1 text-blue-100"
                  >
                    Branch
                  </label>
                  <select
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    required
                  >
                    <option
                      value=""
                      disabled
                      className="bg-gray-800 text-white"
                    >
                      Select Branch
                    </option>
                    <option value="ECE" className="bg-gray-800 text-white">
                      ECE
                    </option>
                    <option value="IT" className="bg-gray-800 text-white">
                      IT
                    </option>
                    <option value="CSE" className="bg-gray-800 text-white">
                      CSE
                    </option>
                    <option value="EE" className="bg-gray-800 text-white">
                      EE
                    </option>
                    <option value="MECH" className="bg-gray-800 text-white">
                      MECH
                    </option>
                    <option value="CIVIL" className="bg-gray-800 text-white">
                      CIVIL
                    </option>
                    <option value="META" className="bg-gray-800 text-white">
                      META
                    </option>
                    <option value="MINING" className="bg-gray-800 text-white">
                      MINING
                    </option>
                    <option value="BIOTECH" className="bg-gray-800 text-white">
                      BIOTECH
                    </option>
                    <option value="BME" className="bg-gray-800 text-white">
                      BME
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium mb-1 text-blue-100"
                  >
                    Year
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    required
                  >
                    <option
                      value=""
                      disabled
                      className="bg-gray-800 text-white"
                    >
                      Select Year
                    </option>
                    <option value="1" className="bg-gray-800 text-white">
                      1
                    </option>
                    <option value="2" className="bg-gray-800 text-white">
                      2
                    </option>
                    <option value="3" className="bg-gray-800 text-white">
                      3
                    </option>
                    <option value="4" className="bg-gray-800 text-white">
                      4
                    </option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="college"
                  className="block text-sm font-medium mb-1 text-blue-100"
                >
                  College
                </label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Your Institution"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Coding Profiles Section */}
            <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-indigo-500/20 p-2 rounded-lg mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Coding Profiles (leave it, if dont wants to share)
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="ccId"
                    className="block text-sm font-medium mb-1 text-blue-100"
                  >
                    CodeChef Username
                  </label>
                  <input
                    type="text"
                    id="ccId"
                    name="ccId"
                    value={formData.ccId}
                    onChange={handleChange}
                    placeholder="Your CodeChef username"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="cfId"
                    className="block text-sm font-medium mb-1 text-blue-100"
                  >
                    CodeForces Username
                  </label>
                  <input
                    type="tel"
                    id="cfId"
                    name="cfId"
                    value={formData.cfId}
                    onChange={handleChange}
                    placeholder="Your CodeForces username"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="leetId"
                    className="block text-sm font-medium mb-1 text-blue-100"
                  >
                    LeetCode Username
                  </label>
                  <input
                    type="text"
                    id="leetId"
                    name="leetId"
                    value={formData.leetId}
                    onChange={handleChange}
                    placeholder="Your LeetCode username"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/50 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transform transition-all hover:scale-105 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
