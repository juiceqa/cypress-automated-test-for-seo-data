/* eslint-disable no-unused-vars */
/// <reference types="cypress"/>

const urlsAduAltTests = ['../../../ADUHELM® (aducanumab-avwa) _ For Healthcare Professionals _ Biogen®.html', '../../../unsubscribe.html', '../../../unsubscribe-confirmation.html', '../../../isi.html', '../../../404.html', '../../../en_us/home/contact-us.html', '../../../formsignup.html', '../../../thank-you.html']

let scrollToBottom = require("scroll-to-bottomjs");

describe("testing the image paths and alt text for each page on bcp-aduhelmhcp.biogen-support.com", function() {
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
    })

    it('**tests alt text for images on bcp-aduhelmhcp.biogen-support.com', () => {
        urlsAduAltTests.forEach((urlsAduAltTest) => {


            cy.visit(urlsAduAltTest, { failOnStatusCode: false })
            cy.log('**testing** ' + '' + urlsAduAltTest)
            cy.writeFile('adu2.5-staging-alt-text-img-paths.txt', '\n' + '*====================*' + '\n' + 'urlsAduAltTest' + ': ' + urlsAduAltTest + ':' + '\n' + '*====================*' + '\n' + '\n' + '\n', { log: false, flag: 'a+' })
            cy.window().then(cyWindow => scrollToBottom({ remoteWindow: cyWindow }));
            cy.get('div.image, img').each(($el, index) => {
                cy.wrap($el).invoke('attr', 'src').then(($src) => {
                    if ($src == 'data:image/gif;base64') {
                        cy.writeFile('adu2.5-staging-alt-text-img-paths.txt', `${index}` + 'Image Path: ' + `${$el.parent().attr('data-cmp-src')}` + '\n' + 'ALT TEXT: ' + `${$el.attr('alt')}` + '\n' + '---------------------------------------' + '\n' + '\n', { flag: 'a+' })
                    } else {
                        cy.writeFile('adu2.5-staging-alt-text-img-paths.txt', `${index}` + 'Image Path: ' + `${$el.attr('src')}` + '\n' + 'ALT TEXT: ' + `${$el.attr('alt')}` + '\n' + '---------------------------------------' + '\n' + '\n', { flag: 'a+' })
                    }
                })
            })
        })
    })
})