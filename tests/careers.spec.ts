import { test, expect } from '@playwright/test';
import { CareersPage } from '../pages/CareersPage';

// add base test calss and extend current test from base test
test('Checks if the job titles contains Quality', async ({ page }) => {
  //instead of creating each page object manually in the base test, use page factory
  const careers = new CareersPage(page);

  //test can have tags to group them by feature, sanity, regression etc
  //create property files to saupport multiple environments and use properties in open method
  await careers.open();

  const jobs = await careers.getJobs();
  console.log(`Number of jobs: ${jobs.length}`);
  console.log(jobs);

  const keyword = 'Quality';
  const hasKeyword = await careers.hasKeywordInJobs(keyword);

  //make screenshot on failure
  //custom assertion should be used from utils
  expect(hasKeyword, 'No job title contains '+keyword).toBe(true);
  //use reporting tools like allure to log steps, attach screenshots, logs etc
});