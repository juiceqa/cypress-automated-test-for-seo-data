// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cyclope'
import 'cypress-plugin-snapshots/commands';
require('cypress-commands');


// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach(function() {
    cy.intercept(`${Cypress.config('baseUrl')}**`, req => {
        req.headers['Auth'] = Cypress.env('token')

        cy.intercept('GET', '/libs/granite/csrf/*', {
            statusCode: 200
        }).as('granite')

        cy.intercept('/socket.io/*', {
            method: 'GET',
            qs: {
                token: '9be0ccc30c2333679cf22355c9e82c590495aa7addb061298dcfc0d7aae3e621920e535e653d7889a2061cf1490e5694e6c9a729e7617be1c713980cf70834af&EIO=3&transport=polling&t=NvROvua&sid=ZnpX58X--jpNv60rAAAA'
            },
        }).as('socket')

        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false;
        });

        /* now any cookie with in the preserve array will not be cleared
        will not be cleared before each test runs */
        Cypress.Cookies.defaults({
            preserve: [
                'AGR_JWT_STRING_COOKIE',
                'AGR_PROJECT_COOKIE',
                'AGR_STRING_COOKIE',
                'PHPSESSID',
                'connect.sid'
            ]
        });

        /*******cookies added for php ********/

        Cypress.Cookies.defaults({
            preserve: ['AGR_JWT_STRING_COOKIE', 'AGR_STRING_COOKIE', '1P_JAR', 'CookieConsent', '_gcl_au', 'AMCVS_21097FBB541195770A4C98A4%40AdobeOrg', '_fbp', 'AMCV_21097FBB541195770A4C98A4', 'AMCVS_21097FBB541195770A4C98A4%40AdobeOrg', 'token']
        })

        // Cypress.Cookies.defaults({
        //   preserve: ['AGR_JWT_STRING_COOKIE', 'AGR_STRING_COOKIE']
        // })

        /***************end **********/


        // const project_name = 'Budgeting-automation' + Math.random().toFixed(4);
        // export const real_project_name = project_name;
        // localStorage.setItem('real_project', real_project_name);

        // localStorage.getItem('real_project')
        // export const real_project_name = 'Budgeting-automation' + Math.random().toFixed(4);

        const clear = Cypress.LocalStorage.clear

        Cypress.LocalStorage.clear = function(keys, ls, rs) {
            // do something with the keys here
            console.log('keys: ', keys);
            if (keys) {
                return clear.apply(this, arguments)
            }
        }

        let cachedLocalStorageAuth;
        let LOCAL_STORAGE_MEMORY = {};


        function restoreLocalStorageAuth() {
            if (cachedLocalStorageAuth) {
                localStorage.setItem('auth-token', cachedLocalStorageAuth);
                Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
                    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
                });
                // }
            }

            function cacheLocalStorageAuth() {
                cachedLocalStorageAuth = localStorage.getItem('auth-token');
                Object.keys(localStorage).forEach(key => {
                    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
                });
            }
        }
    });
})