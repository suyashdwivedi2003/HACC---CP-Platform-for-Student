import axios from "axios";

export const codechefContestList = async () => {
    const response = await axios.get("https://www.codechef.com/api/list/contests/all");
    const presentContests = response.data.present_contests;
    const futureContests = response.data.future_contests;
    const pastContests = response.data.past_contests;
    const contests = [];
  
    if (response.status === 200) {
      // const contests_data = [...presentContests, ...futureContests, ...pastContests];
      futureContests.forEach((data) => {
        const title = data["contest_name"];
        const url = `https://www.codechef.com/${data["contest_code"]}`;
        const start_date = data["contest_start_date"];
        const dateObject = new Date(start_date);
        const start_date_millisecond = dateObject.getTime();
        const durationInMinutes = data["contest_duration"];
        const duration_millisecond = durationInMinutes*60*1000;

        contests.push({
          title,
          platform: "CodeChef",
          url,
          raw_start_time: start_date_millisecond,
          reg_participants: data["distinct_users"],
          raw_duration: duration_millisecond,
        });
      });
    }
    return contests;
  };
  