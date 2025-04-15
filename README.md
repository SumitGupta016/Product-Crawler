# 🕷️ Product Crawler

A robust NestJS-based web crawler that extracts product links from e-commerce sites using **Puppeteer** and **Cheerio**. Handles dynamic pages, infinite scroll, and domain-specific patterns.

---

## 🌐 Supported Domains

- Virgio
- TataCliq
- Nykaa Fashion
- Westside

---

## ⚙️ Features

- **Domain-Specific Configurations**: Base URLs, product URL patterns, optional custom Puppeteer functions.
- **Dynamic Content Handling**: Uses Puppeteer to render and scroll dynamic product listings.
- **Fallback Mechanism**: If Puppeteer fails, uses Cheerio to parse static HTML.
- **Modular Architecture**: Built with NestJS for maintainability and scalability.

---

## 📦 Tech Stack

| Tech         | Purpose                                     |
|--------------|---------------------------------------------|
| **NestJS**   | Backend architecture                        |
| **Puppeteer**| Headless browser for JavaScript rendering   |
| **Cheerio**  | Fast static HTML scraping                   |
| **TypeScript**| Modern type-safe code                      |

---

## 📁 Folder Structure

```
src/
├── crawler/
│   ├── crawler.service.ts       # Core crawling logic
│   ├── crawler.domain.ts        # Domain configurations
│   └── utils/
│       └── autoScroll.ts        # Infinite scroll helper
└── main.ts                      # App entrypoint
```

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/SumitGupta016/Product-Crawler.git
cd Product-Crawler
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run in development
```bash
npm run start:dev
```

### 4. Run in production
```bash
npm run start:prod
```

---

## 🧪 Example Usage

```ts
const links = await crawlerService.crawl('https://www.virgio.com/men/all');
console.log(links); // Array of product URLs
```

---

## 🔁 Auto Scroll Logic

```ts
export async function autoScroll(page: puppeteer.Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 500;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 300);
    });
  });
}
```

---

## 📄 License

MIT License

---

## 👨‍💻 Author

[Sumit Gupta](https://github.com/SumitGupta016)
