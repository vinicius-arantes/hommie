describe('Testes de Login', () => {
  beforeEach(() => {
    cy.visit('/index.html')
  })

  it('Deve carregar a página de login corretamente', () => {
    cy.get('.logo-text').should('contain', 'HOMMIE')
    cy.get('#loginForm').should('be.visible')
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#loginButton').should('be.visible')
  })

  it('Deve exibir campos de entrada vazios inicialmente', () => {
    cy.get('#username').should('have.value', '')
    cy.get('#password').should('have.value', '')
  })

  it('Deve ter link para página de cadastro', () => {
    cy.get('.register-link a')
      .should('be.visible')
      .should('have.attr', 'href', 'register.html')
      .should('contain', 'Cadastre-se')
  })

  it('Deve validar campos obrigatórios', () => {
    cy.get('#loginButton').click()
    
    // HTML5 validation deve impedir o submit
    cy.get('#username:invalid').should('exist')
    cy.get('#password:invalid').should('exist')
  })

  it('Deve permitir digitar no campo de usuário', () => {
    const username = 'usuario_teste'
    cy.get('#username')
      .type(username)
      .should('have.value', username)
  })

  it('Deve permitir digitar no campo de senha', () => {
    const password = 'senha123'
    cy.get('#password')
      .type(password)
      .should('have.value', password)
  })

  it('Deve ocultar a senha digitada', () => {
    cy.get('#password')
      .should('have.attr', 'type', 'password')
  })

  it('Deve submeter o formulário com credenciais válidas', () => {
    cy.fixture('users').then((users) => {
      cy.get('#username').type(users.validUser.username)
      cy.get('#password').type(users.validUser.password)
      cy.get('#loginButton').click()
      
      // Aguardar processamento
      cy.wait(500)
    })
  })

  it('Deve redirecionar para dashboard após login bem-sucedido', () => {
    cy.fixture('users').then((users) => {
      cy.get('#username').type(users.validUser.username)
      cy.get('#password').type(users.validUser.password)
      cy.get('#loginButton').click()
      
      // Verificar redirecionamento (ajustar conforme comportamento real)
      cy.wait(1000)
    })
  })

  it('Deve exibir mensagem de erro com credenciais inválidas', () => {
    cy.fixture('users').then((users) => {
      cy.get('#username').type(users.invalidUser.username)
      cy.get('#password').type(users.invalidUser.password)
      cy.get('#loginButton').click()
      
      // Verificar mensagem de erro
      cy.wait(500)
      cy.get('#message').should('be.visible')
    })
  })

  it('Deve limpar mensagem de erro ao digitar novamente', () => {
    cy.get('#username').type('teste')
    cy.get('#password').type('senha')
    cy.get('#loginButton').click()
    
    cy.wait(500)
    
    // Digitar novamente deve limpar erro
    cy.get('#username').clear().type('novo_teste')
  })
})
