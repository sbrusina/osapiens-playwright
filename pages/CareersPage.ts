import { Locator, Page } from '@playwright/test';

export interface JobInfo {
  title: string;
  location: string | null;
  team: string | null;
}

//page should extend base page calss for common methods like open, close, waitForLoad etc
export class CareersPage {

  readonly page: Page;

  //selectors should be isolated as locators
  readonly jobTitleLocator = "//a[@class='hide-sm-block text-bold']";
  readonly jobLocationLocator = "//div[@role='rowgroup']//div[@data-location]";
  readonly jobTeamLocator = "//div[@role='rowgroup']//div[@data-structure-custom-group]";

  constructor(page: Page) {
    this.page = page;
  }

  async open(path = '/'): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  async getJobCount(): Promise<number> {
    const jobTitles: Locator = this.page.locator(this.jobTitleLocator);
    await jobTitles.first().waitFor({ state: 'visible' });
    return await jobTitles.count();
  }

  async getJobs(): Promise<JobInfo[]> {
    const count = await this.page.locator(this.jobTitleLocator).count();
    const jobs: JobInfo[] = [];

    for (let i = 0; i < count; i++) {
      const job: JobInfo = {
        title: await this.page.locator(this.jobTitleLocator).nth(i).innerText(),
        location: await this.page.locator(this.jobLocationLocator).nth(i).getAttribute('data-location'),
        team: await this.page.locator(this.jobTeamLocator).nth(i).getAttribute('data-structure-custom-group'),
      };

      jobs.push(job);
    }

    return jobs;
  }

  async hasKeywordInJobs(keyword: string): Promise<boolean> {
    const jobs = await this.getJobs();

    if (!jobs || jobs.length === 0) {
      console.warn("No jobs found on the page.");
      return false;
    }
    
    let count = 0;

    for (const job of jobs) {
      const titleText = (job.title ?? '').toLowerCase();
      if (titleText.includes(keyword.toLowerCase())) {
        console.log('Matched job title:', job.title);
        count++;
      }
    }

    return count > 0;
  }
}
