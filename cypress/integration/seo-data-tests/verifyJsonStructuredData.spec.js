/// <reference types="cypress" />

let jsonStructuredDataUrls = ['../../../ADUHELM® (aducanumab-avwa) _ For Healthcare Professionals _ Biogen®.html', '../../../unsubscribe.html', '../../../unsubscribe-confirmation.html', '../../../isi.html', '../../../404.html', '../../../en_us/home/contact-us.html', '../../../formsignup.html', '../../../thank-you.html']

describe("testing jsonLD structured data for each page on bcp-aduhelmhcp.biogen-support.com", function() {
    Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        }),
        it("Verify jsonLD structured data - simple", () => {
            jsonStructuredDataUrls.forEach((jsonStructuredDataUrl) => {
                cy.visit(jsonStructuredDataUrl, { failOnStatusCode: false })
                cy.document()
                    .then((doc) => {
                        // Query the script tag with type application/ld+json]
                        cy.wrap("script[type='application/ld+json']").then((scriptTag) => {
                            // we need to parse the JSON LD from text to a JSON to easily test it
                            const jsonLD = JSON.parse(scriptTag.text());
                            cy.writeFile('meta.json', jsonLD)
                            cy.readFile('meta.json').then((json) => {
                                expect(json["@context"]).equal("https://schema.org");
                                // Cross referencing SEO data between the page title and the headline
                                // in the jsonLD data, great for dynamic data
                                cy.title().then((currentPageTitle) => {
                                    expect(currentPageTitle).to.include('ADUHELM®');
                                });
                            });
                        });
                    });
            })
        })
})