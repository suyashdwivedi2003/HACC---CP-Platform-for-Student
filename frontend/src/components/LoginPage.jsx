import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useFirebase } from "../context Api/Firebase.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { FaGoogle, FaGithub } from "react-icons/fa";

const Signin = () => {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const [user, setUser] = useState(null);
  const [genOtpForm, setgenOtpForm] = useState(false);
  const [otp, setOtp] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    OTP: "",
  });

  const { login, isLoggingIn, oAuthLogin, loginWithOTP, generateOTP, isSendingOtp } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
    navigate("/");
  };

  const handleOTP = async (e) => {
    e.preventDefault();
    console.log(formData.OTP);
    await loginWithOTP(formData);
    navigate("/");
  };

  const genOTP = async (e) => {
    e.preventDefault();
    await generateOTP(formData);
    setOtp(true);
  };

  const handleForgotPassword = async () => {
    await forgotPassword();
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
      oAuthLogin(user, navigate);
    }
  }, [user, navigate]);

  if (isLoggingIn) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="bg-white/10 backdrop-blur-lg p-12 rounded-2xl shadow-2xl flex flex-col items-center border border-white/20">
          <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold text-white">Logging into your account...</h1>
          <p className="text-blue-200 mt-2">This will just take a moment</p>
        </div>
      </div>
    );
  }

  if (isSendingOtp) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="bg-white/10 backdrop-blur-lg p-12 rounded-2xl shadow-2xl flex flex-col items-center border border-white/20">
          <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold text-white">Sending OTP to your email...</h1>
          <p className="text-blue-200 mt-2">Please check your inbox shortly</p>
        </div>
      </div>
    );
  }

  return !genOtpForm ? (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="Gradient1" cx="50%" cy="50%" fx="0.441602%" fy="50%" r=".5">
                <animate attributeName="fx" dur="34s" values="0%;3%;0%" repeatCount="indefinite"></animate>
                <stop offset="0%" stopColor="#7B61FF"></stop>
                <stop offset="100%" stopColor="#00FFFF" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient id="Gradient2" cx="50%" cy="50%" fx="2.68147%" fy="50%" r=".5">
                <animate attributeName="fx" dur="23.5s" values="0%;3%;0%" repeatCount="indefinite"></animate>
                <stop offset="0%" stopColor="#0061FF"></stop>
                <stop offset="100%" stopColor="#60EFFF" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient id="Gradient3" cx="50%" cy="50%" fx="0.836536%" fy="50%" r=".5">
                <animate attributeName="fx" dur="21.5s" values="0%;3%;0%" repeatCount="indefinite"></animate>
                <stop offset="0%" stopColor="#FF00E5"></stop>
                <stop offset="100%" stopColor="#AA00FF" stopOpacity="0"></stop>
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient1)">
              <animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite" />
              <animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="17s" repeatCount="indefinite"/>
            </rect>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient2)">
              <animate attributeName="x" dur="23s" values="-25%;0%;-25%" repeatCount="indefinite" />
              <animate attributeName="y" dur="24s" values="0%;50%;0%" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="18s" repeatCount="indefinite"/>
            </rect>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient3)">
              <animate attributeName="x" dur="25s" values="0%;25%;0%" repeatCount="indefinite" />
              <animate attributeName="y" dur="26s" values="0%;25%;0%" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="19s" repeatCount="indefinite"/>
            </rect>
          </svg>
        </div>
      </div>

      <div className="relative z-0 max-w-5xl w-full flex flex-col md:flex-row bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 mt-16">
        {/* Left side - Welcome/OAuth */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-blue-500/30 to-purple-600/30">
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">H</span>
              </div>
              <h1 className="text-3xl font-bold">HACC</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6">Welcome back</h2>
            <p className="text-blue-100 mb-8">
              Log in to continue your coding journey, track progress, and connect with your fellow programmers.
            </p>
          </div>

          <div className="space-y-5">
            <h3 className="text-xl font-semibold mb-4">Quick sign in with</h3>
            
            <button
              onClick={() => firebase.signInWithGoogle()}
              className="w-full py-4 px-6 bg-white text-gray-800 font-medium rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center space-x-3 transition-all transform hover:scale-105"
            >
              <FaGoogle className="text-red-500" /> <span className="ml-2">Continue with Google</span>
            </button>
            
            <button
              onClick={() => firebase.signInWithGithub()}
              className="w-full py-4 px-6 bg-gray-900 text-white font-medium rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-700 flex items-center justify-center space-x-3 transition-all transform hover:scale-105"
            >
              <FaGithub /> <span className="ml-2">Continue with GitHub</span>
            </button>

            <button
              onClick={() => setgenOtpForm(true)}
              className="w-full py-4 px-6 bg-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center space-x-3 transition-all transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-2">Sign in with OTP</span>
            </button>

            <div className="pt-6 text-center">
              <p className="text-blue-100">Don't have an account?</p>
              <Link to="/signup" className="block mt-2 font-medium text-white hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8">Sign In</h2>
          
          <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="bg-blue-500/20 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
              Account Credentials
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-blue-100">
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
                <label htmlFor="password" className="block text-sm font-medium mb-1 text-blue-100">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/50 transition-all"
                  required
                />
              </div>

              <div className="flex items-end justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-300 hover:text-white transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transform transition-all hover:scale-105 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="Gradient1" cx="50%" cy="50%" fx="0.441602%" fy="50%" r=".5">
                <animate attributeName="fx" dur="34s" values="0%;3%;0%" repeatCount="indefinite"></animate>
                <stop offset="0%" stopColor="#7B61FF"></stop>
                <stop offset="100%" stopColor="#00FFFF" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient id="Gradient2" cx="50%" cy="50%" fx="2.68147%" fy="50%" r=".5">
                <animate attributeName="fx" dur="23.5s" values="0%;3%;0%" repeatCount="indefinite"></animate>
                <stop offset="0%" stopColor="#0061FF"></stop>
                <stop offset="100%" stopColor="#60EFFF" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient id="Gradient3" cx="50%" cy="50%" fx="0.836536%" fy="50%" r=".5">
                <animate attributeName="fx" dur="21.5s" values="0%;3%;0%" repeatCount="indefinite"></animate>
                <stop offset="0%" stopColor="#FF00E5"></stop>
                <stop offset="100%" stopColor="#AA00FF" stopOpacity="0"></stop>
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient1)">
              <animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite" />
              <animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="17s" repeatCount="indefinite"/>
            </rect>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient2)">
              <animate attributeName="x" dur="23s" values="-25%;0%;-25%" repeatCount="indefinite" />
              <animate attributeName="y" dur="24s" values="0%;50%;0%" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="18s" repeatCount="indefinite"/>
            </rect>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient3)">
              <animate attributeName="x" dur="25s" values="0%;25%;0%" repeatCount="indefinite" />
              <animate attributeName="y" dur="26s" values="0%;25%;0%" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="19s" repeatCount="indefinite"/>
            </rect>
          </svg>
        </div>
      </div>

      <div className="relative z-0 max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8 md:p-10">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold">H</span>
            </div>
            <h1 className="text-3xl font-bold">HACC</h1>
          </div>

          <h2 className="text-3xl font-bold mb-8">OTP Verification</h2>
          
          <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="bg-purple-500/20 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              Email Verification
            </h3>

            {!otp ? (
              <form onSubmit={genOTP} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-blue-100">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/50 transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transform transition-all hover:scale-105 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Get OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleOTP} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium mb-1 text-blue-100">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="OTP"
                    value={formData.OTP}
                    onChange={handleChange}
                    placeholder="Enter the OTP sent to your email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-white/50 transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transform transition-all hover:scale-105 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Verify OTP
                </button>
              </form>
            )}
          </div>

          <button
            onClick={() => setgenOtpForm(false)}
            className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;