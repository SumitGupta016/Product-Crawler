Product Crawler
A scalable, domain-aware product crawler built with NestJS, Puppeteer, and Cheerio. It extracts product links from supported e-commerce websites, handling dynamic content and infinite scrolling effectively.​

🧭 Supported Domains
Virgio

TataCliq

Nykaa Fashion

Westside

⚙️ Features
Domain-Specific Configurations: Each domain has tailored configurations, including base URLs, product URL patterns, and optional page handling functions.

Dynamic Content Handling: Utilizes Puppeteer to handle JavaScript-rendered content and infinite scrolling.

Fallback Mechanism: If Puppeteer fails to extract links, falls back to Cheerio for static HTML parsing.

Modular Architecture: Built with NestJS for a clean and maintainable codebase.​

🛠️ Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/SumitGupta016/Product-Crawler.git
cd Product-Crawler
Install dependencies:

bash
Copy
Edit
npm install
🚀 Running the Application
Development mode:

bash
Copy
Edit
npm run start:dev
Production mode:

bash
Copy
Edit
npm run start:prod
🧪 Testing
Run tests:

bash
Copy
Edit
npm run test
📁 Project Structure
bash
Copy
Edit
src/
├── crawler/
│ ├── crawler.service.ts # Core crawling logic
│ ├── domains/
│ │ └── crawler.domain.ts # Domain configurations
│ └── utils/
│ └── autoScroll.ts # Utility for auto-scrolling pages
├── app.module.ts # Root module
├── main.ts # Entry point
📦 Dependencies
@nestjs/common: Provides NestJS decorators and utilities.

cheerio: Fast, flexible, and lean implementation of core jQuery designed specifically for the server. Used for static HTML parsing.

puppeteer: Headless Chrome Node.js API. Used for rendering dynamic content and handling JavaScript-heavy pages.​

🧩 Domain Configuration
Each domain is configured with a DomainConfig interface:​

typescript
Copy
Edit
export interface DomainConfig {
baseUrl: string;
productUrlPattern: RegExp;
handlePage?: (page: puppeteer.Page) => Promise<void>;
}
This allows for domain-specific handling, such as waiting for certain selectors or performing auto-scrolling.​

🔧 AutoScroll Utility
The autoScroll function is used to simulate user scrolling on pages that load content dynamically as the user scrolls down. It's located in src/crawler/utils/autoScroll.ts.​

typescript
Copy
Edit
import puppeteer from 'puppeteer';

export const autoScroll = async (page: puppeteer.Page): Promise<void> => {
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
};
🧠 Application Flow
Input URL: The user provides a URL to crawl.

Domain Matching: The application checks if the URL matches any of the supported domains.

Puppeteer Crawling: If matched, Puppeteer is used to navigate to the page, perform any domain-specific handling (like scrolling), and extract product links.

Fallback to Cheerio: If Puppeteer fails to extract links, Cheerio is used to parse the static HTML and extract links.

Return Results: The extracted product links are returned.​

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.​
Medium

🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.​
Medium
