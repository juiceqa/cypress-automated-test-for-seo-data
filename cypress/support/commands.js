// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('blockUnwantedRequests', () => {
    blockDomain('platform.linkedin.com');
    blockDomain('.*doubleclick.net');
    blockDomain('ka-p.fontawesome.com');
    blockDomain('use.typekit.net');
});

function blockDomain(domain) {
    let regex = new RegExp('https://' + domain + '.*', 'is');
    cy.intercept(regex, '');
}

function blockPath(path) {
    let regex = new RegExp('.*' + path + '.*', 'is');
    cy.intercept(regex, '');
}

Cypress.Commands.add('setBaseurl', (baseurl) => {
    Cypress.config('baseUrl', baseurl);
    const html = `<!DOCTYPE html><html><body><h1>Initialise Cypress to ${baseurl}</h1></body></html>`;
    cy.intercept('GET', '/initialise_cypress_session.html', html);
    cy.visit('/initialise_cypress_session.html');
});

const addContext = require('mochawesome/addContext');
Cypress.Commands.add('requestAndReport', (request) => {
    let url;
    let duration;
    let responseBody;
    let responseHeaders;
    let requestHeaders;

    Cypress.on('test:after:run', (test, runnable) => {
        if (url) {
            addContext({ test }, { title: 'Request url', value: url });
            addContext({ test }, { title: 'Duration', value: duration });
            addContext({ test }, { title: 'Request headers', value: requestHeaders });
            addContext({ test }, { title: 'Response headers', value: responseHeaders });
            addContext({ test }, { title: 'Response body', value: responseBody });
        }

        // To stop spurious reporting for other tests in the same file
        url = '';
        duration = '';
        requestHeaders = {};
        responseHeaders = {};
        responseBody = {};
    });

    let requestOptions = request;
    if (typeof request === 'string') {
        requestOptions = { url: request };
    }
    url = requestOptions.url;

    cy.request(requestOptions).then(function(response) {
        duration = response.duration;
        responseBody = response.body;
        responseHeaders = response.headers;
        requestHeaders = response.requestHeaders;
        return response;
    });
});

Cypress.Commands.add('report', (text) => {
    let comment;

    Cypress.on('test:after:run', (test, runnable) => {
        if (comment) {
            addContext({ test }, { title: 'Comment', value: comment });
        }

        comment = ''; // To stop spurious reporting for other tests in the same file
    });

    comment = text;
    cy.log(comment);
});

Cypress.Commands.add('getLocalStorage', (key) => {
    let value = localStorage.getItem(key);
    return value;
});

Cypress.Commands.add('setCookiesOnDomain', (cookies, domain) => {
    cookies.map((cookie) => {
        cy.setCookie(cookie.name, cookie.value, {
            domain: domain,
        });
    });
});
Cypress.Commands.add('compareCookiesWithStash', (name = 'default') => {
    cy.report(`Comparing cookies with stash ${name}`);
    const stashCookies = JSON.parse(localStorage.getItem(`${name}_CookiesStash`));
    cy.getCookies().then((cookies) => {
        for (let i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            if (!cookieExists(cookie, stashCookies)) {
                cy.report(`Found new cookie ${cookie.name}`);
            }
        }
    });
    cy.log();
});

function cookieExists(targetCookie, cookies) {
    let cookieFound = false;
    for (let i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        if (cookie.name === targetCookie.name) {
            cookieFound = true;
            break;
        }
    }
    return cookieFound;
}

Cypress.Commands.add('savePersistentCookies', function(handle) {
    cy.log('Saving cookies ...');
    cy.getCookies().then((cookies) => {
        let persistentCookies = [];
        for (let i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            if (cookie.expiry) {
                persistentCookies.push(cookie);
                cy.dumpCookie(cookie);
            }
        }
        const date = new Date();
        const utc = date.toISOString();
        cy.writeFile(`cookies/${handle}.json`, { date: utc, persistentCookies }, 'utf8');
    });
    cy.log('Done saving cookies.');
});

Cypress.Commands.add('restorePersistentCookies', function(handle) {
    cy.log('Restoring cookies ...');
    const filename = `cookies/${handle}.json`;
    const defaultContent = JSON.stringify({ persistentCookies: [] }); // must be string to match readfilesync
    cy.task('readFileMaybe', { filename, defaultContent }).then((rawContent) => {
        const contents = JSON.parse(rawContent);
        const persistentCookies = contents.persistentCookies;
        for (let i = 0; i < persistentCookies.length; i++) {
            var cookie = persistentCookies[i];
            cy.setCookie(cookie.name, cookie.value, {
                domain: cookie.domain,
                expiry: cookie.expiry,
                httpOnly: cookie.httpOnly,
                path: cookie.path,
                secure: cookie.secure,
            });
            cy.dumpCookie(cookie);
        }
    });
    cy.log('Done restoring cookies.');
});

Cypress.Commands.add('dumpCookies', () => {
    cy.getCookies().then((cookies) => {
        cy.log('Dumping session cookies').then(() => {
            for (let i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                if (!cookie.expiry) {
                    cy.dumpCookie(cookie);
                }
            }
        });
        cy.log();
        cy.log('Dumping persistent cookies').then(() => {
            for (let i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                if (cookie.expiry) {
                    cy.dumpCookie(cookie);
                }
            }
        });
        cy.log();
    });
});

Cypress.Commands.add('dumpCookie', (cookie) => {
    cy.log(
        `${cookie.name} ${cookie.value}`,
        `domain: ${cookie.domain} expiry: ${cookie.expiry} httpOnly: ${cookie.httpOnly} path: ${cookie.path} secure: ${cookie.secure}`,
    );
});

Cypress.Commands.add('saveAllCookies', function(handle) {
    cy.log(`Saving all cookies to ${handle}.json ...`);
    cy.getCookies().then((cookies) => {
        let allCookies = [];
        for (let i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            allCookies.push(cookie);
            cy.dumpCookie(cookie);
        }
        const date = new Date();
        const utc = date.toISOString();
        cy.writeFile(`state/${handle}.json`, { date: utc, allCookies }, 'utf8');
    });
    cy.log('Done saving cookies.');
});

Cypress.Commands.add('restoreAllCookies', function(handle) {
    cy.log(`Restoring all cookies from ${handle}.json ...`);
    const filename = `state/${handle}.json`;
    const defaultContent = JSON.stringify({ allCookies: [] }); // must be string to match readfilesync
    cy.task('readFileMaybe', { filename, defaultContent }).then((rawContent) => {
        const contents = JSON.parse(rawContent);
        const allCookies = contents.allCookies;
        for (let i = 0; i < allCookies.length; i++) {
            var cookie = allCookies[i];
            cy.setCookie(cookie.name, cookie.value, {
                domain: cookie.domain,
                expiry: cookie.expiry,
                httpOnly: cookie.httpOnly,
                path: cookie.path,
                secure: cookie.secure,
            });
            cy.dumpCookie(cookie);
        }
    });
    cy.log('Done restoring cookies.');
});

Cypress.Commands.add('saveAllLocalStorage', function(handle) {
    cy.log(`Saving all local storage to ${handle}.json ...`).then(() => {
        let allLocal = [];
        const keys = Object.keys(localStorage);
        let i = keys.length;

        while (i--) {
            allLocal.push({
                nameFriendly: keys[i],
                name: toBase64(keys[i]),
                value: toBase64(localStorage.getItem(keys[i])),
            });
            cy.log(keys[i]);
        }

        const date = new Date();
        const utc = date.toISOString();
        cy.writeFile(`state/${handle}.json`, { date: utc, allLocal }, 'utf8');
    });
    cy.log('Done saving all local storage.');
});

Cypress.Commands.add('restoreAllLocalStorage', function(handle) {
    cy.log(`Restoring all local storage from ${handle}.json ...`);
    const filename = `state/${handle}.json`;
    const defaultContent = JSON.stringify({ allLocal: [] }); // must be string to match readfilesync
    cy.task('readFileMaybe', { filename, defaultContent }).then((rawContent) => {
        const contents = JSON.parse(rawContent);
        const allLocal = contents.allLocal;
        for (let i = 0; i < allLocal.length; i++) {
            var item = allLocal[i];
            const name = fromBase64(item.name);
            const value = fromBase64(item.value);
            cy.log(name, value);
            localStorage.setItem(name, value);
        }
    });
    cy.log('Done restoring local storage.');
});

Cypress.Commands.add('saveAllSessionStorage', function(handle) {
    cy.log(`Saving all session storage to ${handle}.json ...`).then(() => {
        let allSession = [];
        const keys = Object.keys(sessionStorage);
        let i = keys.length;

        while (i--) {
            allSession.push({
                name: keys[i],
                value: toBase64(sessionStorage.getItem(keys[i])),
            });
            cy.log(keys[i]);
        }

        const date = new Date();
        const utc = date.toISOString();
        cy.writeFile(`state/${handle}.json`, { date: utc, allSession }, 'utf8');
    });
    cy.log('Done saving all session storage.');
});

Cypress.Commands.add('restoreAllSessionStorage', function(handle) {
    cy.log(`Restoring all session storage from ${handle}.json ...`);
    const filename = `state/${handle}.json`;
    const defaultContent = JSON.stringify({ allSession: [] }); // must be string to match readfilesync
    cy.task('readFileMaybe', { filename, defaultContent }).then((rawContent) => {
        const contents = JSON.parse(rawContent);
        const allSession = contents.allSession;
        for (let i = 0; i < allSession.length; i++) {
            var item = allSession[i];
            const value = fromBase64(item.value);
            cy.log(item.name, value);
            sessionStorage.setItem(item.name, value);
        }
    });
    cy.log('Done restoring session storage.');
});

function toBase64(text) {
    return Buffer.from(text, 'utf16le').toString('base64');
}

function fromBase64(text) {
    return Buffer.from(text, 'base64').toString('utf16le');
}

Cypress.Commands.add('saveState', function(handle) {
    cy.saveAllCookies(`${handle}_cookies`);
    cy.saveAllLocalStorage(`${handle}_localStorage`);
    cy.saveAllSessionStorage(`${handle}_sessionStorage`);
});

Cypress.Commands.add('clearState', function() {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.clearSessionStorage();
    cy.report('Cleared state.');
});

Cypress.Commands.add('clearSessionStorage', function() {
    cy.window().then((win) => {
        win.sessionStorage.clear();
    });
});

Cypress.Commands.add('restoreState', function(handle) {
    cy.clearState();
    cy.restoreAllCookies(`${handle}_cookies`);
    cy.restoreAllLocalStorage(`${handle}_localStorage`);
    cy.restoreAllSessionStorage(`${handle}_sessionStorage`);
});

const util = require('../util/util');

Cypress.Commands.add('reportScreenshot', (text = 'No description') => {
    let screenshotDescription;
    let base64Image;

    Cypress.on('test:after:run', (test, runnable) => {
        if (screenshotDescription) {
            addContext({ test }, {
                title: screenshotDescription,
                value: 'data:image/png;base64,' + base64Image,
            }, );
        }

        screenshotDescription = ''; // To stop spurious reporting for other tests in the same file
        base64Image = '';
    });

    screenshotDescription = text;
    const key = util.key();
    const screenshotPath = `${Cypress.config('screenshotsFolder')}/${Cypress.spec.name}/reportScreenshot_${key}.png`;
    cy.log(`Taking screenshot: ${screenshotDescription}`);
    cy.screenshot(`reportScreenshot_${key}`);
    cy.readFile(screenshotPath, 'base64').then((file) => {
        base64Image = file;
    });
});