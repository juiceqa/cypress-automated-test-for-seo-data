/// <reference types="cypress" />

let metaUrls = ['https://bcp-aduhelmhcp.biogen-support.com/en_us/home.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/unsubscribe.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/unsubscribe-confirmation.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/full-important-safety-information-isi.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/404.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/home/contact-us.html', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/home.html#formSignUp', 'https://bcp-aduhelmhcp.biogen-support.com/en_us/home/thank-you-for-registering.html']

describe("testing meta tags and values for each page on bcp-aduhelmhcp.biogen-support.com", function() {

    it('looks inside the head content for meta name tags', () => {
        metaUrls.forEach((metaUrl) => {
            const filename = 'metadata.json'
            cy.document()
            cy.log(`testing page: ${metaUrl}`)
            cy.visit(metaUrl, { failOnStatusCode: false })
            cy.title().should('include', 'ADUHELM®')
            cy.readFile(filename).then((metaurl) => {
                metaurl = metaUrl
                cy.writeFile(filename, { metaurl })
            })
            cy.on('window:confirm', cy.stub().as('confirm'))
            Cypress.on('uncaught:exception', (err, runnable) => {
                // returning false here prevents Cypress from
                // failing the test
                return false
            })
            cy.get('meta').find('name').each((meta, name => {
                cy.wrap(meta, name).text().then((meta, text) => {
                    cy.readFile(filename).then(metaname => {
                        metaname.id = `${meta}=${text}`
                        cy.writeFile(filename, { metaname })
                    })
                })
            }))
        })

        cy.get('meta[name]').find('content').attribute().text().to('array').each(($text) => {
            cy.get($text).to('string').then((text) => {
                cy.readFile(filename).then(metacontent => {
                    metacontent = text
                    cy.writeFile(filename, metacontent)
                })
            })
        })

        cy.get('meta').attribute('property', { strict: false }).text().to('array').each(($text) => {
            cy.get($text).to('string').then((text) => {
                cy.readFile(filename).then(metaproperty => {
                    metaproperty = text
                    cy.writeFile(filename, { metaproperty })
                })
            })
        })

        cy.get('meta[property]').find('content').attribute().text().to('array').each(($text) => {
            cy.get($text).to('string').then((text) => {
                cy.readFile(filename).then(metaOgContent => {
                    metaOgContent = text
                    cy.writeFile(filename, metaOgContent)
                })
            })
        })
    })
})