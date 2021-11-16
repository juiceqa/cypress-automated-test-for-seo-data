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
                    cy.writeFile('metaNames.txt', '\n' + $el.prop('name') + '--> ' + '\n' + $el.attr('content') + '\n', { flag: 'a+' })
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
                    cy.writeFile('metaNames.txt', '\n' + $el.attr('property') + '--> ' + '\n' + $el.attr('content') + '\n', { flag: 'a+' })
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
                // Cross referencing SEO data between the page title and the headline
                // in the jsonLD data, great for dynamic data
                cy.title().then((currentPageTitle) => {
                    expect(currentPageTitle).to.match(/^Trudhesa™/);
                });
            });
        });
    });
})