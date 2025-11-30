describe('Testes de Perfil de Usuário', () => {
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

  // describe('Visualização de Perfil', () => {
  //   beforeEach(() => {
  //     cy.visit('/profile.html')
  //   })

  //   it('Deve carregar página de perfil', () => {
  //     cy.url().should('include', '/profile.html')
  //   })

  //   it('Deve exibir informações do usuário', () => {
  //     cy.wait(1000)
      
  //     cy.get('.profile, [class*="profile"]').should('exist')
  //   })

  //   it('Deve exibir nome do usuário', () => {
  //     cy.wait(1000)
      
  //     cy.get('.user-name, [class*="name"], h1, h2')
  //       .should('be.visible')
  //       .and('not.be.empty')
  //   })

  //   it('Deve exibir foto de perfil', () => {
  //     cy.wait(1000)
      
  //     cy.get('.profile-picture, [class*="avatar"], img[class*="profile"]')
  //       .should('exist')
  //   })

  //   it('Deve exibir cidade do usuário', () => {
  //     cy.wait(1000)
      
  //     cy.get('#profileCity')
  //       .should('exist')
  //   })

  //   it('Deve exibir profissão do usuário', () => {
  //     cy.wait(1000)
      
  //     cy.get('#profileProfession')
  //       .should('exist')
  //   })

  //   it('Deve exibir biografia do usuário', () => {
  //     cy.wait(1000)
      
  //     cy.get('#profileBio')
  //       .should('exist')
  //   })

  //   it('Deve ter botão de criar nova propriedade', () => {
  //     cy.get('#publishBtn')
  //       .should('be.visible')
  //   })

  //   it('Deve navegar para página de criação de propriedade', () => {
  //     cy.get('#publishBtn')
  //       .click()
      
  //     cy.wait(500)
  //     cy.url().should('include', 'create_property.html')
  //   })

  //   it('Deve exibir o histórico do usuário', () => {
  //     cy.wait(1000)
      
  //     cy.get('.history-section')
  //       .should('exist')
  //   })
  // })

  // describe('Edição de Perfil', () => {
  //   beforeEach(() => {
  //     cy.visit('/profile.html')
  //     cy.wait(1000)
  //   })

  //   it('Deve ter botão de editar perfil', () => {
  //     cy.contains('button, a', /editar|edit/i)
  //       .should('be.visible')
  //   })

  //   it('Deve abrir formulário de edição ao clicar em editar', () => {
  //     cy.contains('button, a', /editar|edit/i)
  //       .click()
      
  //     cy.wait(500)
      
  //     // Verificar se formulário apareceu
  //     cy.get('form, [class*="edit-form"]').should('be.visible')
  //   })

  //   it('Deve permitir editar nome', () => {
  //     cy.contains('button, a', /editar|edit/i).click()
  //     cy.wait(500)
      
  //     cy.get('input[name*="name"], input[name*="nome"]')
  //       .clear()
  //       .type('Nome Atualizado')
  //       .should('have.value', 'Nome Atualizado')
  //   })

  //   it('Deve permitir editar cidade', () => {
  //     cy.contains('button, a', /editar|edit/i).click()
  //     cy.wait(500)
      
  //     cy.get('input[name*="city"], input[name*="cidade"]')
  //       .clear()
  //       .type('Rio de Janeiro')
  //       .should('have.value', 'Rio de Janeiro')
  //   })

  //   it('Deve permitir editar profissão', () => {
  //     cy.contains('button, a', /editar|edit/i).click()
  //     cy.wait(500)
      
  //     cy.get('input[name*="profession"], input[name*="profissao"]')
  //       .clear()
  //       .type('Engenheiro')
  //       .should('have.value', 'Engenheiro')
  //   })

  //   it('Deve permitir editar biografia', () => {
  //     cy.contains('button, a', /editar|edit/i).click()
  //     cy.wait(500)
      
  //     cy.get('textarea[name*="bio"]')
  //       .clear()
  //       .type('Nova biografia do usuário')
  //       .should('have.value', 'Nova biografia do usuário')
  //   })

  //   it('Deve salvar alterações do perfil', () => {
  //     cy.contains('button, a', /editar|edit/i).click()
  //     cy.wait(500)
      
  //     cy.get('input[name*="name"], input[name*="nome"]')
  //       .clear()
  //       .type('Perfil Editado')
      
  //     cy.get('button[type="submit"]').click()
      
  //     cy.wait(2000)
      
  //     // Verificar se alteração foi salva
  //     cy.get('#profileName').should('have.text', 'Perfil Editado')

  //     //Voltando ao normal
  //     cy.contains('button, a', /editar|edit/i).click()
  //     cy.wait(500)
      
  //     cy.get('input[name*="name"], input[name*="nome"]')
  //       .clear()
  //       .type('Novo Usuário')
      
  //     cy.get('button[type="submit"]').click()
      
  //     cy.wait(2000)

  //     cy.get('#profileName').should('have.text', 'Novo Usuário')
  //   })

  //   it('Deve cancelar edição sem salvar', () => {
  //     cy.contains('button, a', /editar|edit/i).click()
  //     cy.wait(500)
      
  //     const originalName = 'Nome Original'
      
  //     cy.get('input[name*="name"], input[name*="nome"]')
  //       .clear()
  //       .type('Nome Temporário')
      
  //     cy.contains('button', /cancelar|cancel/i).click()
      
  //     cy.wait(500)
      
  //     // Verificar se voltou ao estado original
  //     cy.get('form, [class*="edit-form"]').should('not.be.visible')
  //   })
  // })

  // describe('Propriedades do Usuário', () => {
  //   beforeEach(() => {
  //     cy.visit('/profile.html')
  //     cy.wait(1000)
  //   })

  //   it('Deve exibir lista de propriedades do usuário', () => {
  //     cy.get('.accommodations-grid')
  //       .should('exist')
  //   })

  //   it('Deve permitir visualizar propriedade do perfil', () => {
  //     cy.get('.edit-accommodation-btn')
  //       .first()
  //       .click()
      
  //     cy.wait(500)
      
  //     cy.url().should('include', 'property.html')
  //   })
  // })

  // describe('Histórico do Usuário', () => {
  //   beforeEach(() => {
  //     cy.visit('/profile.html')
  //     cy.wait(1000)
  //   })

  //   it('Deve exibir o histórico', () => {
  //     cy.get('.history-section')
  //       .should('exist')
  //   })

  //   it('Deve exibir lista de interações (histórcio)', () => {
  //     cy.get('.review-card')
  //       .should('exist')
  //   })

  //   it('Deve exibir detalhes de cada avaliação', () => {
  //     cy.get('.review-card')
  //       .first()
  //       .within(() => {
  //         // Verificar autor, texto e nota
  //         cy.get('.building').should('exist')
  //       })
  //   })
  // })

  describe('Perfil de Outro Usuário', () => {
    beforeEach(() => {
      cy.visit('/dashboard.html')
      cy.wait(1000)
      cy.get('.property-card').first().click()
      cy.wait(1000)
      cy.get('.host-details').first().click()
      cy.wait(1000)
    })

    it('Deve carregar perfil de outro usuário', () => {
      cy.url().should('include', '/user.html')
    })

    it('Deve exibir informações do usuário visitado', () => {
      cy.get('#profileName')
        .should('be.visible')
    })

    it('Não deve exibir botão de editar em perfil de outro usuário', () => {
      cy.contains('button', /editar|edit/i).should('not.exist')
    })

    it('Deve permitir observar as acomodações do usuário', () => {
      cy.get('.accommodation-card')
        .should('exist')
    })

    it('Deve permitir acessar as acomodações do usuário', () => {
      cy.get('.accommodation-card')
        .should('exist').first().click()

      cy.url().should('include', '/property.html')
    })
  })
})
