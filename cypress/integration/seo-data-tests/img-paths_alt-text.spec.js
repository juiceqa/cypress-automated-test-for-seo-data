/* eslint-disable no-unused-vars */
/// <reference types="cypress"/>

let aduhelmStagingUrls = ['https://bcp-aduhelmhcp.biogen-support.com/en_us/home.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/unsubscribe.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/unsubscribe-confirmation.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/full-important-safety-information-isi.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/404.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/home/contact-us.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/home.html#formSignUp', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/home/thank-you-for-registering.html']

let scrollToBottom = require("scroll-to-bottomjs");

describe("testing the image paths and alt text for each page on bcp-aduhimgmhcp.biogen-support.com", function() {
            Cypress.on('uncaught:exception', (err, runnable) => {
                // returning false here prevents Cypress from
                // failing the test
                return false
            })

            it('**tests alt text for images on bcp-aduhimgmhcp.biogen-support.com', () => {
                aduhelmStagingUrls.forEach((aduhelmStagingUrl) => {
                    const altimgfilename = 'alttextimgpath.json'


                    cy.visit(aduhelmStagingUrl, { failOnStatusCode: false })
                    cy.log('**testing** ' + '' + aduhelmStagingUrl)
                    cy.window().then(cyWindow => scrollToBottom({ remoteWindow: cyWindow }));
                    cy.readFile(altimgfilename).then((url) => {
                        url.id = `${aduhelmStagingUrl}`
                        cy.writeFile(altimgfilename, url)
                    })
                    cy.get('*[data-cmp-hook-image], *[data-cypress-el], .hero-image').not('.hidden-lg').not('backToTop').each($el => {
                        cy.get($el).invoke('prop', 'innerText').then(($item => {
                                cy.readFile(altimgfilename).then((altimgpath) => {
                                    altimgpath.id = $item
                                    cy.writeFile(altimgfilename, altimgpath)
                                })
                                cy.get('attr', ['prop', 'src']).then(($src => {

                                    } else if ($item == /^data-image/) {
                                        cy.wrap($el).attribute('alt').text().to('array').then(($item) => {
                                            cy.get($item).to('string').then((item) => {
                                                cy.readFile(altimgfilename).then(altimgpath => {
                                                    altimgpath.id = item
                                                    cy.writeFile(altimgfilename, altimgpath)
                                                })
                                            })
                                        })
                                    }
                                })) cy.get('*[data-cmp-hook-image], *[data-cypress-el], .hero-image').not('.hidden-lg').not('backToTop').each($el => {
                                cy.wrap($el).attribute('src, alt').then(($item, i) => {
                                    cy.readFile(altimgfilename).then(altimgpath, alttext => {
                                        altimgpath.imgPath = $item[i],
                                            alttext.altText = $item[i],
                                            cy.writeFile(altimgfilename, altimgpath, altext)
                                    })
                                }).then(() => {
                                    cy.get('img').attribute('alt', { strict: false }).text().to('array').each(($item) => {
                                        cy.get($item).to('string').then((item) => {
                                            cy.readFile(altimgfilename).then(alttext => {
                                                alttext.id = item
                                                cy.writeFile(altimgfilename, alttext)
                                            })

                                        })

                                    })
                                })
                            })
                        })
                    })
                })
            })