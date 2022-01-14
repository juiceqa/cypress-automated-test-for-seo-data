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
    cy.intercept('/libs/granite/csrf/*', {
        method: 'GET',
        response: {
            status: 200,
            body: {
                "token": "token",
                "username": "aduhelmhcp",
                "password": "ga0JB7QQrcYEwyRQoSaR"
            }
        }
    })
})