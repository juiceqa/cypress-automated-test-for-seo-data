/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
const { initPlugin } = require('cypress-plugin-snapshots/plugin');
const fs = require('fs');

module.exports = (on, config) => {
    on('before:browser:launch', (browser = {}, args) => {
        if (browser.name === 'chrome' || browser.name === 'chromium' || browser.name === 'canary') {
            args.push('--auto-open-devtools-for-tabs')

            return args
        }
    });
    on('task', {
        readFileMaybe({ filename, defaultContent }) {
            if (fs.existsSync(filename)) {
                return fs.readFileSync(filename, 'utf8');
            }

            return defaultContent;
        }
    })
    require('cyclope/plugin')(on, config)

    initPlugin(on, config);
    return config;
};
// `on` is used to hook into various events Cypress emits
// `config` is the resolved Cypress config