/// <reference types="cypress" />
describe("automated-seo-tests", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000");
    });

    it('looks inside the head content', () => {
        cy.get('meta[property^="og"][content]').text().then(JSON.stringify).then(cy.log)

    })
    it("Verify page title", () => {
        cy.title().should("eq", "Trudhesa™ (dihydroergotamine mesylate) nasal spray | Official Website | Impel NeuroPharma®");
    });

    it("Verify page description", () => {
        cy.get('meta[name="description"]').should(
            "have.attr",
            "content",
            "Learn about Trudhesa™ (dihydroergotamine mesylate) nasal spray, a prescription medication. See how the advanced Precision Olfactory Delivery (POD®) technology delivers medication and how Trudhesa may help you. Please see Important Safety Information, Prescribing Information, including Boxed Warning, and Medication Guide.")
    });
    it("Verify page og:tags", () => {

        cy.get('meta[property^="og"]').each((el, index) => {
            cy.get(el).should('have.attr', 'content').then(JSON.stringify).then(cy.log)
            cy.writeFile('ogDescription.json', `${index}` + ': ' + JSON.stringify(`${content}`) + '\n', { log: false, flag: 'a+' })
        })
    })
    it("Verify page og:title", () => {
        cy.get('meta[property="og:title"]').should(
            "have.attr",
            "content",
            "Trudhesa™ (dihydroergotamine mesylate) nasal spray | Official Website | Impel NeuroPharma®")
    });
    it("Verify page og:type", () => {
        cy.get('meta[property="og:type"]').should(
            "have.attr",
            "content",
            "website")
    });
    it("Verify page og:url", () => {
        cy.get('meta[property="og:url"]').should("have.attr", "content", "https://www.trudhesa.com/")
    });
    it("Verify page og:image", () => {
        cy.get('meta[property="og:image"]').should("have.attr", "content", "https://www.trudhesa.com/wp-content/uploads/social_logo.jpg")
    });
    it("Verify page twitter:card", () => {
        cy.get('meta[name="twitter:card"]').should("have.attr", "content", "summary_large_image")
    });
    it("Verify page twitter:title", () => {
        cy.get('meta[name="twitter:title"]').should("have.attr", "content", "Trudhesa™ (dihydroergotamine mesylate) nasal spray | Official Website | Impel NeuroPharma®")
    });
    it("Verify page twitter:description", () => {
        cy.get('meta[name="twitter:description"]').should(
            "have.attr",
            "content",
            "Learn about Trudhesa™ (dihydroergotamine mesylate) nasal spray, a prescription medication. See how the advanced Precision Olfactory Delivery (POD®) technology delivers medication and how Trudhesa may help you. Please see Important Safety Information, Prescribing Information, including Boxed Warning, and Medication Guide.")
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