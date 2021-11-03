import puppeteer from 'puppeteer';

// https://hackernoon.com/tips-and-tricks-for-web-scraping-with-puppeteer-ed391a63d952
// Dont download all resources, we just need the HTML
// Also, this is huge performance/response time boost
const blockedResourceTypes = [
	'image',
	'media',
	'font',
	'texttrack',
	'object',
	'beacon',
	'csp_report',
	'imageset',
];

const skippedResources = [
	// 'quantserve',
	// 'adzerk',
	// 'doubleclick',
	// 'adition',
	// 'exelator',
	// 'sharethrough',
	// 'cdn.api.twitter',
	// 'google-analytics',
	// 'googletagmanager',
	// 'google',
	// 'fontawesome',
	// 'facebook',
	// 'analytics',
	// 'optimizely',
	// 'clicktale',
	// 'mixpanel',
	// 'zedo',
	// 'clicksor',
	// 'tiqcdn',
];

/**
 * https://developers.google.com/web/tools/puppeteer/articles/ssr#reuseinstance
 * @param {string} url URL to prerender.
 * @param {string} browserWSEndpoint Optional remote debugging URL. If
 *     provided, Puppeteer's reconnects to the browser instance. Otherwise,
 *     a new browser instance is launched.
 */
export async function ssr(url, browserWSEndpoint, {screenSize, waitMs=1000}) {

	const browser = await puppeteer.connect({ browserWSEndpoint });

	try {
		console.log('open page ' + url);
		const page = await browser.newPage();
		await page.setRequestInterception(true);
		await page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) +Prerender')
		if (screenSize) {
			await page.setViewport({
				width: screenSize.width,
				height: screenSize.height,
				deviceScaleFactor: 1,
			});
		}

		page.on('request', request => {
			const requestUrl = request._url.split('?')[0].split('#')[0];
			if (
				blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
				skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
			) {
				request.abort();
			} else {
				request.continue();
			}
		})

		try {
			const response = await page.goto(url, {
				timeout: 25000,
				waitUntil: 'networkidle0'
			});
			await new Promise((resolve, reject) => setTimeout(resolve, waitMs));

			// Inject <base> on page to relative resources load properly.
			await page.evaluate(url => {
				const base = document.createElement('base');
				base.href = url;
				// Add to top of head, before all other resources.
				document.head.prepend(base);
			}, url);

			// Remove scripts and html imports. They've already executed.
			await page.evaluate(() => {
				const elements = document.querySelectorAll('script, link[rel="import"]');
				elements.forEach(e => e.remove());
			});

			const html = await page.content();

			// Close the page we opened here (not the browser).
			// await page.close();

			return { html, status: response.status() }
		}
		finally {
			await page.close();
			console.log('close page ' + url);
		}
	}
	catch (e) {
		const html = e.toString();
		console.warn({ message: `URL: ${url} Failed with message: ${html}` })
		return { html, status: 500 }
	}
	finally {
		browser.disconnect();
	}

};
