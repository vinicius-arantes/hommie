// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Comando customizado para realizar login na aplicação
 * @param {string} username - Nome de usuário
 * @param {string} password - Senha
 */
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/index.html')
  cy.get('#username').type(username)
  cy.get('#password').type(password)
  cy.get('#loginButton').click()
})

/**
 * Comando customizado para fazer logout
 */
Cypress.Commands.add('logout', () => {
  cy.get('.logout-button').click()
})

/**
 * Comando customizado para verificar se está na página de dashboard
 */
Cypress.Commands.add('shouldBeOnDashboard', () => {
  cy.url().should('include', '/dashboard.html')
})

/**
 * Comando customizado para verificar se está na página de login
 */
Cypress.Commands.add('shouldBeOnLogin', () => {
  cy.url().should('include', '/index.html')
})
