/// <reference types="cypress" />

let aduStagingUrls = ['https://bcp-aduhelmhcp.biogen-support.com/en_us/home.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/unsubscribe.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/unsubscribe-confirmation.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/full-important-safety-information-isi.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/404.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/home/contact-us.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/home.html#formSignUp', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/home/thank-you-for-registering.html']
describe("testing meta tags and values for each page on bcp-aduhelmhcp.biogen-support.com", function() {

    before(() => {

        const altTextImgPath = './alttextimgpath.json'
        const fs = require('fs')
        cy.readFile(altTextImgPath, "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            try {
                const alttextimgpath = JSON.parse(jsonString);
                console.log("Img Path:", alttextimgpath.img_path); // => "Customer address is: Infinity Loop Drive"
            } catch (err) {
                console.log("Error parsing JSON string:", err);
            }
        });
    })
    it('loops through every page and inspects img elements outputting the path and the alt text', () => {
        aduStagingUrls.forEach((aduStagingUrl) => {
                cy.restoreState('myLogin').then(() => {
                    cy.document()
                    cy.log(`testing page: ${aduStagingUrl}`)
                    cy.visit(aduStagingUrl, { failOnStatusCode: false })
                        /*         cy.get('img')
                                     .getAttributes('alt')
                                     .then((alts) => {
                                             cy.log(alts);
                                         }
                                         cy.get('img')
                                         .getAttributes('src')
                                         .then((srcs) => {
                                             cy.log(srcs); // logs an array of strings that represent ids
                                         }).then((alts, srcs => {
                                                 cy.writeFile('alts-imgpaths', [alts, srcs])
                                             })
                                         })
                             })
                             // logs an array of strings that represent ids */
                    cy.contains("Accept All Cookies").click({ force: true })
                    cy.contains("YES, I'M A US HEALTHCARE PROFESSIONAL").click({ force: true })
                    cy.get('img').each($el => {
                        cy.wrap($el).should('have.attr', 'alt')
                    })
                    cy.get('img').then($els => {
                        // const path = Array.from($els, el => $el.attr('src'));
                        // const altText = Array.from($els, el => $el.attr('aria-label'))
                        // const ariaLabelAlt = Array.from($els, el => $el.attr('alt'))
                        if ($els.attr('alt') == null) {
                            const asObject = [...$els].reduce((obj, el) => {
                                const $el = Cypress.$(el)
                                obj[$el.attr('aria-label')] = $el.attr('aria-label'),
                                    obj[$el.attr('href')] = $el.attr('href')
                                return obj;
                            }, {});
                            cy.writeFile(altTextImgPath, asObject);

                        } else {
                            const asObject = [...$els].reduce((obj, el) => {
                                const $el = Cypress.$(el)
                                obj[$el.attr('alt')] = $el.attr('alt'),
                                    obj[$el.attr('src')] = $el.attr('src')
                                return obj;
                            }, {});

                            cy.writeFile(altTextImgPath, asObject);
                        }
                    })
                })
            })
            .text().each(($srcText, $index) => {
                cy.readFile(alttextfile).should('be.an', 'array')
                cy.writeFile(alttextfile, [{ id: $index, src: $srcText }])
                cy.readFile(alttextfile).then(alttextimg => {
                    altextimg.push()
                    alttextimg.imgPath = `${$srcText}`
                    cy.readFile(alttextfile).should('deep.equal', {
                        id: `${$index}`,
                        imgPath: `${$srcText}`
                    })
                })
            })
    })
})
it('loops through every page and inspects img elements outputting the path and the alt text', () => {


    cy.get("img").then($els => {

        cy.wrap($el).to('array')
            /*     .attribute('alt').text().each(($altText, $index) => {
                     cy.readFile(alttextfile).then(alttextimg => {
                         altText = `${$altText}`
                         cy.writeFile(alttextfile, alttextimg)
                     })
                     cy.readFile(alttextfile).should('deep.equal', {
                         id: `${$index}`,
                         imgPath: `${$text}`,
                         altText: `${$altText}`
                     })
                 }) */
    })
})