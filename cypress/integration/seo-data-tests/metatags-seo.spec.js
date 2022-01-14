/// <reference types="cypress" />

let metaUrls = ['https://bcp-aduhelmhcp.biogen-support.com/en_us/home.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/unsubscribe.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/unsubscribe-confirmation.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/full-important-safety-information-isi.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/404.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/home/contact-us.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/home.html#formSignUp', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/home/thank-you-for-registering.html']

describe("testing meta tags and values for each page on bcp-aduhelmhcp.biogen-support.com", function() {

    it('looks inside the head content for meta name tags', () => {
        metaUrls.forEach((metaUrl) => {
            cy.document()
            cy.log(`testing page: ${metaUrl}`)
            cy.visit(metaUrl, { failOnStatusCode: false })
            cy.writeFile('metaNames.txt', '\n' + '-----------------' + '\n' + 'page: ' + metaUrl + '\n' + '-----------------' + '\n', { flag: 'a+' })
            cy.on('window:confirm', cy.stub().as('confirm'))
            Cypress.on('uncaught:exception', (err, runnable) => {
                // returning false here prevents Cypress from
                // failing the test
                return false
            })
            cy.title().should('include', 'ADUHELM®')
            cy.get('head meta[name], meta[content]').each($el => {
                cy.writeFile('metaNames.txt', `${$el.attr('name')}` + ': ' + `${$el.attr('content')}` + '\n', { flag: 'a+' })
            })
        })
    })
})