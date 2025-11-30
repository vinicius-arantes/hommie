describe('Testes de Cadastro', () => {
  beforeEach(() => {
    cy.visit('/register.html')
  })

  it('Deve carregar a página de cadastro corretamente', () => {
    cy.get('.logo-text').should('contain', 'HOMMIE')
    cy.get('#registerForm').should('be.visible')
  })

  it('Deve exibir todos os campos do formulário de cadastro', () => {
    // Verificar presença dos campos principais
    cy.get('input[name="name"]').should('be.visible')
    cy.get('input[name="username"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('input[name="confirm_password"]').should('be.visible')
  })

  it('Deve ter link para voltar ao login', () => {
    cy.get('#fazer-login').should('contain', "Fazer Login").should('be.visible')
  })

  it('Deve validar campos obrigatórios no cadastro', () => {
    cy.get('button[type="submit"]').click()
    
    // Verificar validação HTML5
    cy.get('input[name="name"]:invalid').should('exist')
    cy.get('input[name="username"]:invalid').should('exist')
    cy.get('input[name="password"]:invalid').should('exist')
    cy.get('input[name="confirm_password"]:invalid').should('exist')
  })

  it('Deve permitir preencher todos os campos', () => {
    cy.fixture('users').then((users) => {
      const newUser = users.newUser
      
      cy.get('input[name="name"]').type(newUser.name)
      cy.get('input[name="username"]').type(newUser.username)
      cy.get('input[name="password"]').type(newUser.password)
      cy.get('input[name="confirm_password"]').type(newUser.password)
      
      // Verificar se campos foram preenchidos
      cy.get('input[name="name"]').should('have.value', newUser.name)
      cy.get('input[name="username"]').should('have.value', newUser.username)
      cy.get('input[name="password"]').should('have.value', newUser.password)
      cy.get('input[name="confirm_password"]').should('have.value', newUser.password)
    })
  })

  it('Deve submeter formulário de cadastro com dados válidos', () => {
    cy.fixture('users').then((users) => {
      const newUser = users.newUser
      
      cy.get('input[name="name"]').type(newUser.name)
      cy.get('input[name="username"]').type(newUser.username)
      cy.get('input[name="password"]').type(newUser.password)
      cy.get('input[name="confirm_password"]').type(newUser.password)
      
      cy.get('button[type="submit"]').click()
      
      // Aguardar processamento
      cy.wait(500)

      cy.get('#message').should('contain', 'Cadastro realizado com sucesso! Você já pode fazer login.')
    })
  })

  it('Deve redirecionar para login após cadastro bem-sucedido', () => {
    cy.fixture('users').then((users) => {
      const newUser = users.secondUser
      
      cy.get('input[name="name"]').type(newUser.name)
      cy.get('input[name="username"]').type(newUser.username)
      cy.get('input[name="password"]').type(newUser.password)
      cy.get('input[name="confirm_password"]').type(newUser.password)
      
      cy.get('button[type="submit"]').click()
      
      // Verificar redirecionamento ou mensagem de sucesso
      cy.wait(2000)
      cy.url().should('include', '/index.html')
    })
  })

  it('A senha deve conter mais de 6 caracteres', () => {
    cy.fixture('users').then((users) => {
      const newUser = users.invalidUser
      
      cy.get('input[name="name"]').type(newUser.name)
      cy.get('input[name="username"]').type(newUser.username)
      cy.get('input[name="password"]').type(newUser.password)
      cy.get('input[name="confirm_password"]').type(newUser.password)
      
      cy.get('button[type="submit"]').click()

      // Aguardar processamento
      cy.wait(500)
      
      cy.get('#message').should('contain', 'A senha deve ter no mínimo 6 caracteres.')
    })
  })

  it('Deve navegar para página de login ao clicar no link', () => {
    cy.get('#fazer-login').should('contain', "Fazer Login").should('be.visible').click()
    cy.url().should('include', '/index.html')
  })
})
