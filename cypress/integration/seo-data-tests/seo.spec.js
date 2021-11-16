/// <reference types="cypress" />
/// <reference types="cypress"/>

let urls = []

describe("testing the image paths for each page on trudhesa.com", function() {

    before(() => {
        cy.request({
                url: "https://trudhesa.com/page-sitemap.xml",
                headers: {
                    "Content-Type": "text/xml charset=utf-8",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
                    status: 200
                },
            })
            .as("sitemap")
            .then((response) => {
                urls = Cypress.$(response.body)
                    .find("loc")
                    .toArray()
                    .map((el) => el.innerText)
            })
    })

    it('looks inside the head content for meta name tags', () => {
        urls.forEach((url) => {

            cy.log(`testing page: ${url}`)
            cy.visit(url)
            cy.on('window:confirm', cy.stub().as('confirm'))
            Cypress.on('uncaught:exception', (err, runnable) => {
                // returning false here prevents Cypress from
                // failing the test
                return false
            })
            cy.title().should('include', 'Trudhesa')
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
                        cy.writeFile('metaNames.txt', '\n' + '-----------------' + '\n' + 'page: ' + url + '\n' + '-----------------' + '\n' + $el.prop('name') + '--> ' + '\n' + $el.attr('content') + '\n', { flag: 'a+' })
                    }
                })
            })
        })
    })

    it('looks inside the head content for meta property og tags', () => {
        urls.forEach((url) => {
            cy.log(`testing page: ${url}`)
            cy.visit(url)
            cy.on('window:confirm', cy.stub().as('confirm'))
            Cypress.on('uncaught:exception', (err, runnable) => {
                // returning false here prevents Cypress from
                // failing the test
                return false
            })
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
                        cy.writeFile('metaNames.txt', '\n' + '-----------------' + '\n' + 'page: ' + url + '\n' + '-----------------' + '\n' + $el.attr('property') + '--> ' + '\n' + $el.attr('content') + '\n', { flag: 'a+' })
                    }
                })
            })
        })
    })
    it("Verify jsonLD structured data - simple", () => {
        urls.forEach((url) => {
            cy.log(`testing page: ${url}`)
            cy.visit(url)
            cy.on('window:confirm', cy.stub().as('confirm'))
            Cypress.on('uncaught:exception', (err, runnable) => {
                    // returning false here prevents Cypress from
                    // failing the test
                    return false
                })
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
                        expect(currentPageTitle).to.include('Trudhesa');
                    });
                });
            });
        });
    })
})