import express from 'express';
import puppeteer from 'puppeteer';
import commandLineArgs from 'command-line-args';

// Routes
import { test } from './functions/test.js'
import { ssr } from './functions/ssr.js'

const app = express();

const params = commandLineArgs([
	{ name: 'port', alias: 'p', type: Number },
	{ name: 'datadir', type: String },
])

console.log(process.argv)

const port = params.port || 3000;
const datadir = params.datadir || null;
const launchOptions = {};
if (datadir) {
	launchOptions.userDataDir = datadir;
}
app.listen(port, () => console.log(`I listen on http://localhost:${port}`))

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.get('/test', test);

let browserWSEndpoint = null;
app.get('/ssr', async (req, res, next) => {

	const { url, width=540, height=960, waitms=2000 } = req.query;

	if (!url) {
		return res.status(400).send('Invalid url param: Example: ?url=https://binge.app');
	}

	// console.time(`URL_START:${url}`)
	// console.log(`browserWSEndpoint is::${(browserWSEndpoint)}`)
	// Spin new instance if we dont have an active one
	if (!browserWSEndpoint) {
		const browser = await puppeteer.launch(launchOptions);
		browserWSEndpoint = await browser.wsEndpoint();
	}

	const screenSize = { width, height };

	const { html, status } = await ssr(url, browserWSEndpoint, {screenSize, waitMs: waitms});
	// console.timeEnd(`URL_START:${url}`)
	return res.status(status).send(html);
})
