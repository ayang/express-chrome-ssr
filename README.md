# express-chrome-ssr
# Server side rendering with puppeteer / headless chrome

Read the Medium story - https://medium.com/p/6d007158ff15

This repo is meant to be an example of implementing nodejs, expressjs, and puppeteer for server side rendering using headless chrome.

To boost performance, the same chrome instance is reused on sequential loads.

### Packages used

Open source projects:

* [Express] - Serving the requests
* [Puppeteer] - Headless Chrome Node.js API
* [PM2] - Node.js Production Process Manager with a built-in Load Balancer

### Installation

[Node.js 8+](https://nodejs.org/) is required to run.

Install from github (not published on npm yet):
```sh
$ npm install https://github.com/dblazeski/express-chrome-ssr.git
or
$ yarn add https://github.com/dblazeski/express-chrome-ssr.git
```

Install the dependencies and devDependencies and start the server.

Install dependencies of chromium on ubuntu

```
sudo apt-get install libx11-xcb1 libxcomposite1 libasound2 libatk1.0-0 libatk-bridge2.0-0 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6
```

```sh
$ git clone https://github.com/dblazeski/express-chrome-ssr.git
$ cd express-chrome-ssr
$ npm install (or yarn install)
$ npm run dev (or yarn dev)
```

For production environments...

```sh
$ git clone https://github.com/dblazeski/express-chrome-ssr.git
$ cd express-chrome-ssr
$ npm install (or yarn install)
$ npm run start_production_server (or yarn start_production_server)
```

### Usage

Specifying a port is optional, the default one is 3000
```sh
$ yarn start_production_server
```

Run by pm2
```sh
npm -g install pm2
pm2 start ./dist/index.js -i 5 -n ssr -- --datadir=/data/dir --port=3000

```
* Start the server (locally or on production)
* Visit /ssr and add your url in the url param

The script has two url's (you can replace localhost with your domain if running it on server or virtual box)

* `http://localhost:3000/test` - To make sure the server is running
* `http://localhost:3000/ssr?url=THE_URL_TO_RENDER` - Will return server side rendered html of the url

### Development

Want to contribute? Great!
Open your favorite Terminal and run these commands.

Go to the project folder and run:

```sh
$ npm run dev (or yarn dev)
```

A server will be spawned accesible on [localhost:3000](http://localhost:3000) with live reload when changes are done.

#### Building for source
For production release:
```sh
$ npm run build (or yarn build)
```
To start the pm2 server:
```sh
$ npm run start_production_server (or yarn start_production_server)
```

To kill the pm2 server:
```sh
$ npm run kill_production_server (or yarn kill_production_server)
```

License
----

MIT License


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [express]: <http://expressjs.com>
   [puppeteer]: <https://pptr.dev>
   [pm2]: <https://github.com/Unitech/pm2>

