import request from 'request-promise';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer-extra';
import StealtPlugin from 'puppeteer-extra-plugin-stealth';


export const scrapCodechefData = async (username) => {
  const url = `https://www.codechef.com/users/${username}`;

  const response = await request(url);
  let $ = cheerio.load(response);

  let currentRating = $('div[class="rating-number"]').text().trim().match(/^\d+/)[0];
  let stars = $('span[class="rating"]').text().trim();

  let contests = $('h3:contains("Contests")').text().match(/\d+/)?.[0] || "0";
  let totalProblemsSolved = $('h3:contains("Total Problems Solved")').text().match(/\d+/)?.[0] || "0";

  return { currentRating, stars, contests, totalProblemsSolved };
};


export const scrapCodeforcesRating = async(username) => {

    // Use the stealth plugin
    puppeteer.use(StealtPlugin());

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set headers and user-agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
    });

    // Navigate to the site
    await page.goto(`https://codeforces.com/profile/${username}`, { waitUntil: 'domcontentloaded' });

    const rating = await page.evaluate(() => {
        const userClassPattern = 'user-'; // Common prefix
        const allUserElements = Array.from(document.querySelectorAll(`[class^='${userClassPattern}']`));
        // console.log("alluserelements: ",allUserElements);
        const correctElement = allUserElements.find(el => /^\d+$/.test(el.innerText)); // Check for numeric text
        return correctElement ? correctElement.innerText.trim() : null; // Ensure proper extraction
    });

    await browser.close();

    return rating;
}


export const scrapLeetcodeRating =  async(username) => {
    // Use the stealth plugin to mask Puppeteer's behavior
    puppeteer.use(StealtPlugin());
  
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
  
    // Set headers and user-agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });
  
    // Navigate to the site
    await page.goto(`https://leetcode.com/u/${username}/`, {
      waitUntil: "networkidle0",
    });
  
    // Wait for the element containing the rating to appear
    await page.waitForSelector(".text-label-1.text-2xl");
  
    // Extract the Contest Rating
    const contestRating = await page.evaluate(() => {
      const element = document.querySelector(".text-label-1.text-2xl");
      return element ? element.textContent.trim() : null;
    });
  
    const contestRatingwithoutcomma = contestRating.replace(",", "");
  
  //   console.log("Contest Rating:", contestRatingwithoutcomma);
  
    await browser.close();
  
    return contestRatingwithoutcomma;
}
