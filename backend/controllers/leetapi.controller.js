import axios from "axios";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core/core.cjs";

export const leetDataFetch = async (username) => {

  const query = `
    query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      contributions {
        points
      }
      profile {
        reputation
        ranking
      }
      submitStats {
        acSubmissionNum {
                difficulty
                count
                submissions
            }
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
      badge {
        name
      }
    }
  }`;

  const variables = { username : username };  

  const response = await axios.post(
    `https://leetcode.com/graphql`,
    { query, variables },
    { headers: { "Content-Type": "application/json" } }
  );

  const data = response.data.data;

  const totalQuestions = {

    All: data.allQuestionsCount.find((q) => q.difficulty === "All")?.count || 0,
    Easy: data.allQuestionsCount.find((q) => q.difficulty === "Easy")?.count || 0,
    Medium: data.allQuestionsCount.find((q) => q.difficulty === "Medium")?.count || 0,
    Hard: data.allQuestionsCount.find((q) => q.difficulty === "Hard")?.count || 0,
  };

  const solvedQuestions = {
    All: data.matchedUser.submitStats.acSubmissionNum.find((q) => q.difficulty === "All")?.count || 0,
    Easy: data.matchedUser.submitStats.acSubmissionNum.find((q) => q.difficulty === "Easy")?.count || 0,
    Medium: data.matchedUser.submitStats.acSubmissionNum.find((q) => q.difficulty === "Medium")?.count || 0,
    Hard: data.matchedUser.submitStats.acSubmissionNum.find((q) => q.difficulty === "Hard")?.count || 0,
  };

  const profile = {
    reputaiton: data.matchedUser.profile.reputation || 0,
    ranking: data.matchedUser.profile.ranking || 0,
  };

  const contestDetails = data.userContestRanking || {};

  const attendedContestsCount = contestDetails.attendedContestsCount;
  const rating = contestDetails.rating;
  const globalRanking = contestDetails.globalRanking;
  const totalParticipants = contestDetails.totalParticipants;
  const topPercentage = contestDetails.topPercentage;
  const badge = contestDetails.badge;

  const updatedLeetData = {
    totalLeetQuestions: totalQuestions.All,
    easyLeetQuestions: totalQuestions.Easy,
    mediumLeetQuestions: totalQuestions.Medium,
    hardLeetQuestions: totalQuestions.Hard,
    totalSolvedLeetQuestions: solvedQuestions.All,
    easySolvedLeetQuestions: solvedQuestions.Easy,
    mediumSolvedLeetQuestions: solvedQuestions.Medium,
    hardSolvedLeetQuestions: solvedQuestions.Hard,
    leetReputation: profile.reputaiton,
    leetRanking: profile.ranking,
    leetContestCount: attendedContestsCount,
    leetRating: rating,
    leetGlobalRanking: globalRanking,
    leetTotalParticipants: totalParticipants,
    leetTopPercentage: topPercentage,
    leetBadges: badge,
  };

  return updatedLeetData;
};

export const leetCodeContestList = async () => {
  const client = new ApolloClient({
    uri: "https://leetcode.com/graphql",
    cache: new InMemoryCache(),
    headers: {
      "content-type": "application/json",
    },
  });

  const fetchContestsList = async () => {
    try {
      const response = await client.query({
        query: gql`
          query {
            allContests {
              title
              titleSlug
              startTime
              duration
            }
          }
        `,
      });

      const contests = [];
      const currentTime = new Date();
      const contestsData = response.data.allContests;

      for(const data of contestsData){
        const title = data.title;
        const url = `https://leetcode.com/contest/${data.titleSlug}`;
        const start_time_millisecond = data.startTime * 1000;
        const duration_time_millisecond = data.duration * 1000;
        const current_time_millisecond = Date.now();

        if(current_time_millisecond>start_time_millisecond){
          console.log(current_time_millisecond," , ",start_time_millisecond);
          break;
        }

        contests.push({
          platform: "LeetCode",
          title,
          url,
          raw_start_time: start_time_millisecond,
          raw_duration: duration_time_millisecond, 
        });

      }

      return contests;

    } catch (error) {
      console.error("Error fetching contests:", error);
      return [];
    }
  };

  return fetchContestsList();
};

