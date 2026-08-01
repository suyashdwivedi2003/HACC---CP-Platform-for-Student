import React, { useState, useEffect } from "react";
import { useContestStore } from "../stores/useContestStore.js";
import { useAuthStore } from "../stores/useAuthStore.js";

const ContestCards = ({ contest, isBookmarked }) => {
  const { addBookmark, removeBookmark, sendNoti } = useContestStore();
  const { authUser } = useAuthStore();
  const [timeLeft, setTimeLeft] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  // const [msgSent, setMsgSent] = useState(false);


  const calendarOptions = ["Google", "Outlook", "Apple"];
  const [calendarDropdown, setCalendarDropdown] = useState(false);
  const handleAddToCalendar = (calendarType) => {
    const startDate = new Date(contest.rawStartTime)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(contest.rawStartTime + contest.rawDuration)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");
    let calendarUrl;
    switch (calendarType) {
      case "google":
        calendarUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(
          contest.platform + " - " + contest.title
        )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
          "Find more info at " + contest.url
        )}&location=Online&sf=true&output=xml`;
        break;
      case "outlook":
        calendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
          contest.platform + " - " + contest.title
        )}&startdt=${startDate}&enddt=${endDate}&body=${encodeURIComponent(
          "Find more info at " + contest.url
        )}&location=Online`;
        break;
      case "apple":
        const icsContent = `
     BEGIN:VCALENDAR
     VERSION:2.0
     BEGIN:VEVENT
     DTSTART:${startDate}
     DTEND:${endDate}
     SUMMARY:${contest.platform + " - " + contest.title}
     DESCRIPTION:Find more info at ${contest.url}
     LOCATION:Online
     END:VEVENT
     END:VCALENDAR
    `.trim();
        const blob = new Blob([icsContent], { type: "text/calendar" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${contest.platform} contest ${contest.title}.ics`;
        link.click();
        return;
      default:
        return;
    }
    window.open(calendarUrl, "_blank");
  };

  let msgSent = false;

  // Calculate the time left for upcoming contests
  useEffect(() => {
    if (contest.status !== "finished" && contest.rawStartTime > Date.now()) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = contest.rawStartTime - now;

        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft({ expired: true });
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });


        if ((!msgSent) && (days === 0 && hours === 2 && (minutes === 16 || minutes === 14) && seconds <= 20)) {
          msgSent = true;
          console.log("Inside if condition");
          console.log(msgSent);
          sendNoti({ title: contest.title, rawStartTime: contest.rawStartTime });
        }

        if (days === 0 && hours === 2 && minutes === 15 && seconds <= 20) {
          msgSent = false;
        }
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setTimeLeft({ expired: true });
    }
  }, [contest.rawStartTime, contest.status]);

  const handleBookmark = async (e) => {
    e.preventDefault();

    if (!authUser) {
      alert("Please login to bookmark contests");
      return;
    }

    const data = { contestId: contest._id, userId: authUser._id };
    await addBookmark(data);
  };

  const handleRemoveBookmark = async (e) => {
    e.preventDefault();

    const data = { contestId: contest._id, userId: authUser._id };
    await removeBookmark(data);
  };

  // Get platform-specific styling
  const getPlatformStyle = () => {
    switch (contest.platform.toLowerCase()) {
      case "codechef":
        return {
          gradient: "from-amber-500 to-orange-600",
          lightBg: "bg-amber-100",
          textColor: "text-amber-900",
          icon: "👨‍🍳",
        };
      case "codeforces":
        return {
          gradient: "from-purple-500 to-purple-700",
          lightBg: "bg-purple-100",
          textColor: "text-purple-900",
          icon: "🏆",
        };
      case "leetcode":
        return {
          gradient: "from-yellow-400 to-yellow-600",
          lightBg: "bg-yellow-100",
          textColor: "text-yellow-900",
          icon: "📝",
        };
      default:
        return {
          gradient: "from-blue-500 to-blue-700",
          lightBg: "bg-blue-100",
          textColor: "text-blue-900",
          icon: "💻",
        };
    }
  };

  const platformStyle = getPlatformStyle();
  const isUpcoming = contest.rawStartTime > Date.now();

  return (
    <div
      className={`relative rounded-2xl overflow-hidden transition-all duration-500 transform ${isHovered ? "shadow-xl shadow-blue-500/20" : "shadow-lg"
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top colored bar */}
      <div className={`h-2 bg-gradient-to-r ${platformStyle.gradient}`}></div>
      {/* Card content */}
      <div className=" opacity-70 bg-gray-800 p-6">
        {/* Platform badge */}
        <div className="flex justify-between items-start mb-3">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${platformStyle.gradient} text-white`}
          >
            {platformStyle.icon} {contest.platform}
          </div>
          {/* Bookmark button */}
          <button
            onClick={isBookmarked ? handleRemoveBookmark : handleBookmark}
            className="text-gray-300 hover:text-yellow-400 transition-colors cursor-pointer"
          >
            <svg
              className={`w-6 h-6 ${isBookmarked ? "text-yellow-400 fill-current" : "text-gray-400"
                }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </div>
        {/* Contest title */}
        <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2 h-14">
          {contest.title}
        </h2>
        {/* Status indicator */}
        <div className="flex items-center mb-3">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${isUpcoming ? "bg-green-500 animate-pulse" : "bg-gray-500"
              }`}
          ></div>
          <span
            className={`text-sm ${isUpcoming ? "text-green-400" : "text-gray-400"
              }`}
          >
            {isUpcoming ? "Upcoming" : "Finished"}
          </span>
        </div>
        {/* Countdown timer for upcoming contests */}
        {isUpcoming && !timeLeft.expired && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-1">Starts in:</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-gray-900 rounded-lg p-2">
                <div className="text-xl font-bold text-white">
                  {timeLeft.days || "0"}
                </div>
                <div className="text-xs text-gray-400">Days</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-2">
                <div className="text-xl font-bold text-white">
                  {timeLeft.hours || "0"}
                </div>
                <div className="text-xs text-gray-400">Hours</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-2">
                <div className="text-xl font-bold text-white">
                  {timeLeft.minutes || "0"}
                </div>
                <div className="text-xs text-gray-400">Mins</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-2">
                <div className="text-xl font-bold text-white">
                  {timeLeft.seconds || "0"}
                </div>
                <div className="text-xs text-gray-400">Secs</div>
              </div>
            </div>
          </div>
        )}
        {/* Contest details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="text-gray-300">
              {new Date(contest.rawStartTime).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-gray-300">
              Duration: {Math.floor(contest.rawDuration / 3600000)} hours
            </span>
          </div>
        </div>


        {/* Add to calendar section */}
        {
          isUpcoming
            ?
            <div className="relative mb-4 z-50">
              <button
                onClick={() => setCalendarDropdown(!calendarDropdown)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Add to Calendar
              </button>
              {calendarDropdown && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 rounded-lg border border-gray-600 shadow-2xl overflow-hidden z-50 backdrop-blur-sm transform transition-all duration-200 ease-out animate-in slide-in-from-bottom-2">
                  {calendarOptions.map((option, index) => (
                    <div
                      key={option}
                      onClick={() => handleAddToCalendar(option.toLowerCase())}
                      className={`px-4 py-3 hover:bg-gray-700 cursor-pointer text-center text-gray-200 hover:text-white transition-all duration-200 ${index !== calendarOptions.length - 1 ? 'border-b border-gray-700' : ''
                        }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            : ""
        }

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <a
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-center rounded-lg transition-colors"
          >
            View Contest
          </a>
          {contest.solutionLink && (
            <a
              href={contest.solutionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-center rounded-lg transition-colors"
            >
              View Solution
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestCards;