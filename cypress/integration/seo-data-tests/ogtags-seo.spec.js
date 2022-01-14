/// <reference types="cypress" />

let ogUrls = ['../../../ADUHELM® (aducanumab-avwa) _ For Healthcare Professionals _ Biogen®.html', '../../../unsubscribe.html', '../../../unsubscribe-confirmation.html', '../../../isi.html', '../../../404.html', '../../../en_us/home/contact-us.html', '../../../formsignup.html', '../../../thank-you.html']

describe("testing og tags and values for each page on bcp-aduhelmhcp.biogen-support.com", function() {
    Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        }),

        it('looks inside the head content for meta property og tags', () => {
            ogUrls.forEach((ogUrl) => {
                cy.log(`testing page: ${ogUrl}`)
                cy.visit(ogUrl, { failOnStatusCode: false })
                cy.writeFile('ogMetaNames.txt', '\n' + '-----------------' + '\n' + 'page: ' + ogUrl + '\n' + '-----------------' + '\n', { flag: 'a+' })
                cy.get('meta[property^="og"]').each($el => {
                    if ($el.prop('content').length > 0) {
                        const metaPropertyOgTag = $el.text();
                    }
                }).then(() => {
                    cy.get('meta[property^="og"]').each($el => {
                        if ($el.attr("property").length > 0) {
                            const metaPropertyOg = $el.text();
                            cy.writeFile('ogMetaNames.txt', '\n' + $el.attr('property') + '--> ' + '\n' + $el.attr('content') + '\n', { flag: 'a+' })
                        }
                    })
                })
            })
        })
})