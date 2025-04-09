import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CrawlerService } from './crawler.service';

@Processor('crawler')
export class CrawlerProcessor {
  private readonly logger = new Logger(CrawlerProcessor.name);

  constructor(private readonly crawlerService: CrawlerService) {}

  @Process('crawl-job')
  async handleCrawl(job: Job<{ url: string }>): Promise<void> {
    const { url } = job.data;
    this.logger.log(`Starting crawl for: ${url}`);

    try {
      const productLinks = await this.crawlerService.crawl(url);

      if (productLinks.length > 0) {
        this.logger.log(`Found ${productLinks.length} product URLs.`);
        productLinks.forEach((link) => this.logger.verbose(link));
      } else {
        this.logger.warn(`No product URLs found for: ${url}`);
      }
    } catch (error) {
      this.logger.error(`Error crawling ${url}:`, error.stack || error.message);
    }

    this.logger.log(`Finished processing job for: ${url}`);
  }
}
