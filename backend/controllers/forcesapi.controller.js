import axios from "axios";

export const forcesDataFetch = async (username) => {
  let userInfo = null;
  let contests = null;

  const response = await axios.get(
    `https://codeforces.com/api/user.info?handles=${username}&checkHistoricHandles=false`
  );
  userInfo = response.data;

  const response1 = await axios.get(
    `https://codeforces.com/api/user.rating?handle=${username}`
  );
  contests = response1.data.result.length;

  const bigresponse = await axios.get(
    `https://codeforces.com/api/user.status?handle=${username}&from=1`
  );

  const submissionDetails = bigresponse.data;
  const submissions = submissionDetails.result;

  const uniqueProblems = new Set();
  const solvedByRating = {};

  submissions.forEach((sub) => {
    if (sub.verdict === "OK") {
      const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
      const rating = sub.problem.rating || "Unrated"; // Handle missing ratings
      if (!uniqueProblems.has(problemId)) {
        uniqueProblems.add(problemId);
        solvedByRating[rating] = (solvedByRating[rating] || 0) + 1;
      }
    }
  });

  const updatedForcesData = {
    totalUniqueSubmissions: uniqueProblems.size,
    forcesRating: userInfo.result[0].rating,
    forcesRank: userInfo.result[0].rank,
    forcesMaxRating: userInfo.result[0].maxRating,
    forcesMaxRank: userInfo.result[0].maxRank,
    forcesContestCount: contests,
    forcesTotalProblemSolved: uniqueProblems.size,
    forcesTotalProblemsolvedByRating: solvedByRating,
  };

  return updatedForcesData;
};

export const forcesContestDataFetch = async () => {
  const response = await axios.get("https://codeforces.com/api/contest.list?gym=false");
  const contestData = response.data.result;
  const contests = [];

  if (response.status === 200) {
    for (const data of contestData) {
      const title = data["name"];
      const url = `https://codeforces.com/contests/${data["id"]}`;
      const start_time_seconds = data["startTimeSeconds"];
      const start_time_milliseconds = start_time_seconds * 1000;
      const duration_seconds = data["durationSeconds"];
      const duration_milliseconds = duration_seconds * 1000;
      const phase = data["phase"];
  
      if (phase !== "BEFORE") break; // Stop iteration if phase is not "BEFORE" // for each loop me break nhi hota.

      contests.push({
          title,
          platform: "Codeforces",
          url,
          raw_start_time: start_time_milliseconds,
          raw_duration: duration_milliseconds,
      });
    }
  }

  return contests;
};
 