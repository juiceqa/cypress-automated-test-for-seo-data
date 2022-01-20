describe("save cookies to local storage", function() {

    it('loops through every page and inspects img elements outputting the path and the alt text', () => {
        cy.visit('/', { failOnStatusCode: false }).then(() => {
            cy.saveState('myLogin')
        })
    })
})