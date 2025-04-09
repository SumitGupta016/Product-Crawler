import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Post } from '@nestjs/common';
import { Queue } from 'bull';

@Controller('crawl')
export class CrawlerController {
  constructor(@InjectQueue('crawler') private readonly crawlerQueue: Queue) {}

  @Post()
  async startCrawl(@Body() body: { url: string }) {
    const { url } = body;

    console.log('[POST /crawl] Received URL:', url);

    if (!url || !url.startsWith('http')) {
      return { success: false, message: 'Invalid URL' };
    }

    try {
      await this.crawlerQueue.add('crawl-job', { url });

      console.log('Job added to queue!');

      return {
        success: true,
        message: `Crawl job added to queue for ${url}`,
      };
    } catch (err) {
      console.error('Error adding job:', err);
      return {
        success: false,
        message: 'Failed to queue job',
      };
    }
  }
}
