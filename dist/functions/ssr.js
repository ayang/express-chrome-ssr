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
var skippedResources = [// 'quantserve',
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

function ssr(_x, _x2, _x3) {
  return _ssr.apply(this, arguments);
}

function _ssr() {
  _ssr = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(url, browserWSEndpoint, _ref) {
    var screenSize, _ref$waitMs, waitMs, browser, page, response, html, _html;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            screenSize = _ref.screenSize, _ref$waitMs = _ref.waitMs, waitMs = _ref$waitMs === void 0 ? 1000 : _ref$waitMs;
            _context.next = 3;
            return _puppeteer["default"].connect({
              browserWSEndpoint: browserWSEndpoint
            });

          case 3:
            browser = _context.sent;
            _context.prev = 4;
            console.log('open page ' + url);
            _context.next = 8;
            return browser.newPage();

          case 8:
            page = _context.sent;
            _context.next = 11;
            return page.setRequestInterception(true);

          case 11:
            _context.next = 13;
            return page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) +Prerender');

          case 13:
            if (!screenSize) {
              _context.next = 16;
              break;
            }

            _context.next = 16;
            return page.setViewport({
              width: screenSize.width,
              height: screenSize.height,
              deviceScaleFactor: 1
            });

          case 16:
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
            _context.prev = 17;
            _context.next = 20;
            return page["goto"](url, {
              timeout: 25000,
              waitUntil: 'networkidle0'
            });

          case 20:
            response = _context.sent;
            _context.next = 23;
            return new Promise(function (resolve, reject) {
              return setTimeout(resolve, waitMs);
            });

          case 23:
            _context.next = 25;
            return page.evaluate(function (url) {
              var base = document.createElement('base');
              base.href = url; // Add to top of head, before all other resources.

              document.head.prepend(base);
            }, url);

          case 25:
            _context.next = 27;
            return page.evaluate(function () {
              var elements = document.querySelectorAll('script, link[rel="import"]');
              elements.forEach(function (e) {
                return e.remove();
              });
            });

          case 27:
            _context.next = 29;
            return page.content();

          case 29:
            html = _context.sent;
            return _context.abrupt("return", {
              html: html,
              status: response.status()
            });

          case 31:
            _context.prev = 31;
            _context.next = 34;
            return page.close();

          case 34:
            console.log('close page ' + url);
            return _context.finish(31);

          case 36:
            _context.next = 43;
            break;

          case 38:
            _context.prev = 38;
            _context.t0 = _context["catch"](4);
            _html = _context.t0.toString();
            console.warn({
              message: "URL: ".concat(url, " Failed with message: ").concat(_html)
            });
            return _context.abrupt("return", {
              html: _html,
              status: 500
            });

          case 43:
            _context.prev = 43;
            browser.disconnect();
            return _context.finish(43);

          case 46:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 38, 43, 46], [17,, 31, 36]]);
  }));
  return _ssr.apply(this, arguments);
}

;