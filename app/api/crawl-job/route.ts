import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import * as cheerio from 'cheerio';

const unwantedSelectors = [
  'header',
  'footer',
  'nav',
  'aside',
  'form',
  'script',
  'style',
  'noscript',
  '.ads',
  '.sidebar',
  '.ad',
  '[class*="advert"]',
  '[id*="advert"]',
];

export async function scrapeWithPuppeteer(url: string) {
  let browser = null;
  try {
    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_KEY}`,
    });

    const page = await browser.newPage();

    // Navigate with timeout and wait for network to be idle
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    const html = await page.content();

    const cheerioApi = cheerio.load(html);
    unwantedSelectors.forEach((selector) => cheerioApi(selector).remove());

    const relevantText: string[] = [];
    cheerioApi('h1, h2, h3, p, div, span').each((index, element) => {
      const el = cheerioApi(element);
      const trimmedText = el.text().trim();
      if (trimmedText.length) {
        relevantText.push(trimmedText);
      }
    });

    const uniqueText = Array.from(
      new Set(relevantText.filter((text) => text.length > 0))
    );

    let cleanText = uniqueText.join(' ');

    if (cleanText) {
      cleanText = cleanText.replace(/\s{2,}/g, '\n').trim();
    }

    await page.close();

    return cleanText;
  } catch (error) {
    console.error('Puppeteer scraping failed:', error);
    throw error;
  } finally {
    if (browser) {
      browser.close();
    }
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'Missing URL parameter' },
      { status: 400 }
    );
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json(
      { error: 'Invalid URL parameter' },
      { status: 400 }
    );
  }

  try {
    const text = await scrapeWithPuppeteer(url);

    if (!text) {
      return NextResponse.json(
        { error: 'No readable text found on the page.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      content: text,
      length: text.length,
    });
  } catch (error: any) {
    console.error('Error fetching URL:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch or parse the webpage',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
