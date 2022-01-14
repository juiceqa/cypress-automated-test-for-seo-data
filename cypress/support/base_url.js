export const baseUrl = Cypress.config().baseUrl.replace(
    /(http.:\/\/).*:.*@(.*)$/,
    "$1$2"
)

export default baseUrl