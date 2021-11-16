/// <reference types="cypress" />
describe("automated-seo-tests", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000");
        cy.on('window:confirm', cy.stub().as('confirm'))
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        })
    })
    it("Verify page title", () => {
        cy.title().should("eq", "Trudhesa™ (dihydroergotamine mesylate) nasal spray | Official Website | Impel NeuroPharma®");
    });
    it('looks inside the head content for meta name tags', () => {
        cy.get('meta[name]').each($el => {
            if ($el.prop('content').length > 0) {
                const metaContent = $el.text();
                expect($el, metaContent).to.have.attr("content").not.contain("undefined")
            }
        }).then(() => {
            cy.get('meta[name]').each($el => {
                if ($el.prop("name").length > 0) {
                    const metaName = $el.text();
                    expect($el, metaName).to.have.prop("name").not.contain("undefined")
                    cy.log($el.prop('name') + ': ' + $el.attr('content'))
                }
            })
        })
    })


    it('looks inside the head content for meta property og tags', () => {

        cy.get('meta[property^="og"]').each($el => {
            if ($el.prop('content').length > 0) {
                const metaPropertyOgTag = $el.text();
                expect($el, metaPropertyOgTag).to.have.attr("content").not.contain("undefined")
            }
        }).then(() => {
            cy.get('meta[property^="og"]').each($el => {
                if ($el.attr("property").length > 0) {
                    const metaPropertyOg = $el.text();
                    expect($el, metaPropertyOg).to.have.attr("property").not.contain("undefined")
                    cy.log($el.attr('property') + ': ' + $el.attr('content'))
                }
            })
        })
    })
    it("Verify jsonLD structured data - simple", () => {
        // Query the script tag with type application/ld+json
        cy.get("script[type='application/ld+json']").eq(0).then((scriptTag) => {
            // we need to parse the JSON LD from text to a JSON to easily test it
            const jsonLD = JSON.parse(scriptTag.text());
            cy.writeFile('meta.json', jsonLD)
            cy.readFile('meta.json').then((json) => {
                expect(json["@context"]).equal("https://schema.org");
                expect(json["@type"]).equal("WebSite");
                expect(json.description).equal("This page provides information to determine whether you will benefit from taking Trudhesa (dihydroergotamine mesylate) nasal spray and how to get a prescription. Please see Important Safety Information, Prescribing Information, including Boxed Warning, and Medication Guide.")

                // Cross referencing SEO data between the page title and the headline
                // in the jsonLD data, great for dynamic data
                cy.title().then((currentPageTitle) => {
                    expect(currentPageTitle).to.match(/^Trudhesa™/);
                });
            });
        });
    });
})