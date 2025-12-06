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
  cy.wait(1000)
})
