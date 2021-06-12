"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ssr = ssr;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _puppeteer = _interopRequireDefault(require("puppeteer"));

// https://hackernoon.com/tips-and-tricks-for-web-scraping-with-puppeteer-ed391a63d952
// Dont download all resources, we just need the HTML
// Also, this is huge performance/response time boost
var blockedResourceTypes = ['image', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
var skippedResources = ['quantserve', 'adzerk', 'doubleclick', 'adition', 'exelator', 'sharethrough', 'cdn.api.twitter', 'google-analytics', 'googletagmanager', 'google', 'fontawesome', 'facebook', 'analytics', 'optimizely', 'clicktale', 'mixpanel', 'zedo', 'clicksor', 'tiqcdn'];
/**
 * https://developers.google.com/web/tools/puppeteer/articles/ssr#reuseinstance
 * @param {string} url URL to prerender.
 * @param {string} browserWSEndpoint Optional remote debugging URL. If
 *     provided, Puppeteer's reconnects to the browser instance. Otherwise,
 *     a new browser instance is launched.
 */

function ssr(_x, _x2, _x3) {
  return _ssr.apply(this, arguments);
}

function _ssr() {
  _ssr = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(url, browserWSEndpoint, screenSize) {
    var browser, page, response, html, _html;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _puppeteer["default"].connect({
              browserWSEndpoint: browserWSEndpoint
            });

          case 2:
            browser = _context.sent;
            _context.prev = 3;
            console.log('open page ' + url);
            _context.next = 7;
            return browser.newPage();

          case 7:
            page = _context.sent;
            _context.next = 10;
            return page.setRequestInterception(true);

          case 10:
            _context.next = 12;
            return page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) +Prerender');

          case 12:
            if (!screenSize) {
              _context.next = 15;
              break;
            }

            _context.next = 15;
            return page.setViewport({
              width: screenSize.width,
              height: screenSize.height,
              deviceScaleFactor: 1
            });

          case 15:
            page.on('request', function (request) {
              var requestUrl = request._url.split('?')[0].split('#')[0];

              if (blockedResourceTypes.indexOf(request.resourceType()) !== -1 || skippedResources.some(function (resource) {
                return requestUrl.indexOf(resource) !== -1;
              })) {
                request.abort();
              } else {
                request["continue"]();
              }
            });
            _context.prev = 16;
            _context.next = 19;
            return page["goto"](url, {
              timeout: 25000,
              waitUntil: 'networkidle0'
            });

          case 19:
            response = _context.sent;
            _context.next = 22;
            return new Promise(function (resolve, reject) {
              return setTimeout(resolve, 1000);
            });

          case 22:
            _context.next = 24;
            return page.evaluate(function (url) {
              var base = document.createElement('base');
              base.href = url; // Add to top of head, before all other resources.

              document.head.prepend(base);
            }, url);

          case 24:
            _context.next = 26;
            return page.evaluate(function () {
              var elements = document.querySelectorAll('script, link[rel="import"]');
              elements.forEach(function (e) {
                return e.remove();
              });
            });

          case 26:
            _context.next = 28;
            return page.content();

          case 28:
            html = _context.sent;
            return _context.abrupt("return", {
              html: html,
              status: response.status()
            });

          case 30:
            _context.prev = 30;
            _context.next = 33;
            return page.close();

          case 33:
            console.log('close page ' + url);
            return _context.finish(30);

          case 35:
            _context.next = 42;
            break;

          case 37:
            _context.prev = 37;
            _context.t0 = _context["catch"](3);
            _html = _context.t0.toString();
            console.warn({
              message: "URL: ".concat(url, " Failed with message: ").concat(_html)
            });
            return _context.abrupt("return", {
              html: _html,
              status: 500
            });

          case 42:
            _context.prev = 42;
            browser.disconnect();
            return _context.finish(42);

          case 45:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 37, 42, 45], [16,, 30, 35]]);
  }));
  return _ssr.apply(this, arguments);
}

;