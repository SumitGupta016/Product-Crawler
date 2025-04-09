export interface DomainConfig {
  baseUrl: string;
  productUrlPattern: RegExp;
}

export const SUPPORTED_DOMAINS: DomainConfig[] = [
  {
    baseUrl: 'https://www.virgio.com',
    productUrlPattern: /\/product\/[\w-]+/i,
  },
  {
    baseUrl: 'https://www.tatacliq.com',
    productUrlPattern: /^https:\/\/www\.tatacliq\.com\/.+\/p-mp[0-9]+$/,
  },
  {
    baseUrl: 'https://www.nykaafashion.com',
    productUrlPattern: /\/[a-zA-Z0-9-]+\/p\/[\w-]+/i,
  },
  {
    baseUrl: 'https://www.westside.com',
    productUrlPattern: /\/products\/[\w-]+/i,
  },
];
