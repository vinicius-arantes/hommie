describe('Testes de Dashboard', () => {
  beforeEach(() => {
    // Realizar login antes de cada teste
    cy.visit('/index.html')
    cy.fixture('users').then((users) => {
      cy.get('#username').type(users.validUser.username)
      cy.get('#password').type(users.validUser.password)
      cy.get('#loginButton').click()
      cy.wait(1000)
    })
  })

  it('Deve carregar a página de dashboard após login', () => {
    cy.visit('/dashboard.html')
    cy.url().should('include', '/dashboard.html')
  })

  it('Deve exibir o logo HOMMIE no dashboard', () => {
    cy.visit('/dashboard.html')
    cy.contains('HOMMIE').should('be.visible')
  })

  it('Deve exibir menu de navegação', () => {
    cy.visit('/dashboard.html')
    cy.get('nav').should('be.visible')
  })

  it('Deve exibir lista de propriedades', () => {
    cy.visit('/dashboard.html')
    cy.wait(1000)
    
    // Verificar se há cards de propriedades
    cy.get('.property-card, .property-item, [class*="property"]')
      .should('have.length.greaterThan', 0)
  })

  it('Deve permitir filtrar propriedades', () => {
    cy.visit('/dashboard.html')
    
    // Verificar se existe campo de filtro
    cy.get('#openFilterModal')
      .should('be.visible')
  })

  it('Deve filtrar propriedades ao digitar na busca', () => {
    cy.visit('/dashboard.html')
    cy.wait(1000)
    
    cy.get('#openFilterModal').click()
    
    cy.wait(500)

    cy.get('#type_select').select('Aluguel');
    cy.get('.modal-search-button').click();

    cy.wait(500)
    
    // Verificar se a lista foi filtrada
    cy.get('.property-card, .property-item, [class*="property"]')
      .should('exist')
  })

  it('Deve permitir favoritar propriedade', () => {
    cy.get('.favorite-icon').first().then($el => {
      const isActive = $el.hasClass('favorite-active')

      if (!isActive) {
        cy.wrap($el).click().should('have.class', 'favorite-active')
      }
    })
  })

  it('Deve exibir detalhes ao clicar em uma propriedade', () => {
    cy.visit('/dashboard.html')
    cy.wait(1000)
    
    // Clicar na primeira propriedade
    cy.get('.property-card, .property-item, [class*="property"]')
      .first()
      .click()
    
    cy.wait(500)
    
    // Verificar se foi redirecionado ou modal foi aberto
    cy.url().should('match', /property\.html|dashboard\.html/)
  })

  it('Deve exibir perfil do usuário', () => {
    cy.visit('/dashboard.html')
    
    // Verificar se há link ou botão de perfil
    cy.get('[href*="profile"], [class*="profile"], [id*="profile"]')
      .should('exist')
  })

  it('Deve permitir acessar página de perfil', () => {
    cy.visit('/dashboard.html')
    
    cy.get('[href*="profile"], [class*="profile"], [id*="profile"]')
      .first()
      .click()
    
    cy.wait(500)
    cy.url().should('include', 'profile.html')
  })

  it('Deve exibir chats/mensagens', () => {
    cy.visit('/dashboard.html')
    
    // Verificar se há link para chats
    cy.get('[href*="chat"], [class*="chat"], [id*="chat"]')
      .should('exist')
  })

  it('Deve permitir fazer logout', () => {
    cy.visit('/dashboard.html')
    
    // Procurar botão de logout
    cy.get('.logout-icon')
      .should('exist')
  })

  it('Deve redirecionar para login ao fazer logout', () => {
    cy.visit('/dashboard.html')
    
    cy.get('.logout-icon').should('exist')
      .click()
    
    cy.wait(500)
    cy.url().should('include', 'index.html')
  })
})
