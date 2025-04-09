import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { CrawlerProcessor } from './crawler.processor';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'crawler',
    }),
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService, CrawlerProcessor],
})
export class CrawlerModule {}
