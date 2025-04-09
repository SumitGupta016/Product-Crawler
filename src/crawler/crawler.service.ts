import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';
import { DomainConfig, SUPPORTED_DOMAINS } from './domains/crawler.domain';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  async crawl(url: string): Promise<string[]> {
    this.logger.log(`Crawling started for ${url}`);
    const domain = this.getDomainConfig(url);

    if (!domain) {
      this.logger.warn(`Domain not supported: ${url}`);
      return [];
    }

    const { html, pageLinks } = await this.fetchPageWithPuppeteer(url, domain);

    if (pageLinks.length > 0) {
      this.logger.log(
        `Found ${pageLinks.length} product links using Puppeteer`,
      );
      return pageLinks;
    }

    if (!html) {
      this.logger.warn(`No HTML content fetched from ${url}`);
      return [];
    }

    const cheerioLinks = this.extractProductLinks(html, domain);
    this.logger.log(
      `Found ${cheerioLinks.length} product links using Cheerio fallback`,
    );
    return cheerioLinks;
  }

  private async fetchPageWithPuppeteer(
    url: string,
    domain: DomainConfig,
  ): Promise<{ html: string; pageLinks: string[] }> {
    let browser: puppeteer.Browser | null = null;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      );

      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
      });

      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });

      await this.autoScroll(page);
      await page.evaluate(() => new Promise((res) => setTimeout(res, 5000)));

      const html = await page.content();
      this.logger.log(`Fetched HTML for ${url}`);

      const productLinks = await this.extractProductLinksFromPage(page, domain);
      return { html, pageLinks: productLinks };
    } catch (error) {
      this.logger.error(`Failed to fetch page with Puppeteer: ${url}`);
      this.logger.error(error.message || error);
      return { html: '', pageLinks: [] };
    } finally {
      if (browser) await browser.close();
    }
  }

  private async extractProductLinksFromPage(
    page: puppeteer.Page,
    domain: DomainConfig,
  ): Promise<string[]> {
    try {
      // Extract only <a> tags containing "/p-mp" (specific to product links)
      const links = await page.$$eval(
        'a[href*="/p-mp"]',
        (anchors) =>
          anchors
            .map((a) => (a as HTMLAnchorElement).href.split('?')[0])
            .filter((href, index, self) => self.indexOf(href) === index), // remove duplicates
      );

      const productLinks = links.filter((href) =>
        domain.productUrlPattern.test(href),
      );

      this.logger.log(
        `Found ${productLinks.length} product links using Puppeteer`,
      );

      return productLinks;
    } catch (error) {
      this.logger.error('Error extracting links from Puppeteer DOM:', error);
      return [];
    }
  }

  private extractProductLinks(html: string, domain: DomainConfig): string[] {
    const $ = cheerio.load(html);
    const links = new Set<string>();

    $('a[href]').each((_, element) => {
      let href = $(element).attr('href');
      if (!href) return;

      if (href.startsWith('/')) {
        href = domain.baseUrl + href;
      }

      if (!href.startsWith(domain.baseUrl)) return;

      if (domain.productUrlPattern.test(href)) {
        links.add(href.split('?')[0]);
      }
    });

    return Array.from(links);
  }

  private getDomainConfig(url: string): DomainConfig | undefined {
    return SUPPORTED_DOMAINS.find((d) => url.startsWith(d.baseUrl));
  }

  private async autoScroll(page: puppeteer.Page): Promise<void> {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 500;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 300);
      });
    });
  }
}
