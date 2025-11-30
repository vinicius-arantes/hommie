describe('Testes de Propriedades', () => {
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

  describe('Criação de Propriedade', () => {
    beforeEach(() => {
      cy.visit('/create_property.html')
    })

    it('Deve carregar página de criação de propriedade', () => {
      cy.url().should('include', '/create_property.html')
    })

    it('Deve exibir formulário de criação', () => {
      cy.get('form').should('be.visible')
    })

    it('Deve ter campo de preço', () => {
      cy.get('input[name*="price"], input[name*="preco"], input[name*="valor"]')
        .should('be.visible')
    })

    it('Deve ter campo de localização', () => {
      cy.get('input[name*="location"], input[name*="localizacao"]')
        .should('be.visible')
    })

    it('Deve ter campo de descrição', () => {
      cy.get('textarea[name*="description"], textarea[name*="descricao"]')
        .should('be.visible')
    })

    it('Deve ter campo de tipo de propriedade', () => {
      cy.get('.property-type-section')
        .should('be.visible')
    })

    it('Deve validar campos obrigatórios', () => {
      cy.get('button[type="submit"]').click()
      
      // Verificar validação
      cy.get('input:invalid, textarea:invalid').should('exist')
    })

    it('Deve permitir preencher formulário completo', () => {
      cy.get('.type-btn[data-type="Venda"]')
        .click()
      
      cy.get('input[name*="price"]')
        .type('R$500000')
      
      cy.get('textarea[name*="description"]')
        .type('Apartamento com 3 quartos, 2 banheiros, sala ampla e cozinha moderna.')

      cy.get('input[name*="location"]')
        .type('São Paulo, SP')

      cy.get('input[name*="nearby"]')
        .type('Museu do Amanhã')

      cy.get('input[name*="area"]')
        .type(57)
      
      cy.get('#vagas').select('2')

      cy.get('#quartos').select('3')

      cy.get('#banheiros').select('1')

      cy.get('input[type="checkbox"]').check()


      // Verificar se campos foram preenchidos
      cy.get('.type-btn[data-type="Venda"]').should('have.class', 'active')

      cy.get('input[name*="price"]')
        .should('have.value', 'R$500000')

      cy.get('textarea[name*="description"]')
        .should('have.value', 'Apartamento com 3 quartos, 2 banheiros, sala ampla e cozinha moderna.')

      cy.get('input[name*="location"]')
        .should('have.value', 'São Paulo, SP')

      cy.get('input[name*="nearby"]')
        .should('have.value', 'Museu do Amanhã')

      cy.get('input[name*="area"]')
        .should('have.value', 57)
      
      cy.get('#vagas').should('have.value', '2')

      cy.get('#quartos').should('have.value', '3')

      cy.get('#banheiros').should('have.value', '1')

      cy.get('input[type="checkbox"]').should('be.checked')
      
    })

    it('Deve permitir fazer upload de imagem', () => {
      cy.get('#uploadBtn').should('exist')
    })

    it('Deve submeter formulário com dados válidos', () => {
      cy.get('.type-btn[data-type="Venda"]')
        .click()
      
      cy.get('input[name*="price"]')
        .type('R$500000')
      
      cy.get('textarea[name*="description"]')
        .type('Apartamento com 3 quartos, 2 banheiros, sala ampla e cozinha moderna.')

      cy.get('input[name*="location"]')
        .type('São Paulo, SP')

      cy.get('input[name*="nearby"]')
        .type('Museu do Amanhã')

      cy.get('input[name*="area"]')
        .type(57)
      
      cy.get('#vagas').select('2')

      cy.get('#quartos').select('3')

      cy.get('#banheiros').select('1')

      cy.get('input[type="checkbox"]').check()

      cy.get('button[type="submit"]').click()
      
      cy.wait(1000)
    })
  })

  describe('Visualização de Propriedade', () => {
    it('Deve carregar página de detalhes da propriedade', () => {
      cy.visit('/property.html?id=1')
      cy.url().should('include', '/property.html')
    })

    it('Deve exibir título da propriedade', () => {
      cy.visit('/property.html?id=1')
      cy.wait(1000)
      
      cy.get('h1, h2, .property-title, [class*="title"]')
        .should('be.visible')
        .and('not.be.empty')
    })

    it('Deve exibir preço da propriedade', () => {
      cy.visit('/property.html?id=1')
      cy.wait(1000)
      
      cy.get('.price, [class*="price"], [class*="valor"]')
        .should('be.visible')
    })

    it('Deve exibir localização da propriedade', () => {
      cy.visit('/property.html?id=1')
      cy.wait(1000)
      
      cy.get('.location, [class*="location"], [class*="localizacao"]')
        .should('be.visible')
    })

    it('Deve exibir descrição da propriedade', () => {
      cy.visit('/property.html?id=1')
      cy.wait(1000)
      
      cy.get('.description, [class*="description"], [class*="descricao"]')
        .should('be.visible')
    })

    it('Deve exibir imagem da propriedade', () => {
      cy.visit('/property.html?id=1')
      cy.wait(1000)
      
      cy.get('.image-gallery')
        .should('be.visible')
    })

    it('Deve exibir informações do anfitrião', () => {
      cy.visit('/property.html?id=1')
      cy.wait(1000)
      
      cy.get('.host-info, [class*="host"], [class*="anfitriao"]')
        .should('exist')
    })

    it('Deve exibir histórico da propriedade', () => {
      cy.visit('/property.html?id=1')
      cy.wait(1000)
      
      cy.get('.reviews-section')
        .should('exist')
    })

    it('Deve permitir criação de solicitação', () => {
      cy.visit('/property.html?id=1')
      cy.wait(1000)
      
      cy.get('.open-request-button')
        .should('exist').click()

      cy.get('.request-modal-overlay select[name="type_select"]')
        .select("Compra")

      cy.get('.request-modal-overlay button[type="submit"]')
        .click()
    })
  })

  describe('Edição de Propriedade', () => {
    it('Deve carregar página de edição de propriedade', () => {
      cy.visit('/edit_property.html?id=1')
      cy.url().should('include', '/edit_property.html')
    })

    it('Deve pré-preencher formulário com dados existentes', () => {
      cy.visit('/edit_property.html?id=1')
      cy.wait(1000)
      
      cy.get('input')
        .should('not.have.value', '')
    })

    it('Deve permitir editar campos', () => {
      cy.visit('/edit_property.html?id=1')
      cy.wait(1000)
      
      cy.get('textarea[name*="description"]')
        .clear()
        .type('Descrição Atualizada')
        .should('have.value', 'Descrição Atualizada')
    })

    it('Deve salvar alterações', () => {
      cy.visit('/edit_property.html?id=1')
      cy.wait(1000)
      
      cy.get('textarea[name*="description"]')
        .clear()
        .type('Propriedade Editada')
      
      cy.get('button[type="submit"]').click()
      
      cy.wait(1000)
    })
  })

  describe('Interações com Propriedade', () => {
    beforeEach(() => {
      cy.visit('/property.html?id=1')
      cy.wait(1000)
    })

    it('Deve permitir entrar em contato com anfitrião', () => {
      cy.contains('button, a', /contato|mensagem|chat/i)
        .should('exist')
    })

    it('Deve permitir fazer solicitação de visita', () => {
      cy.contains('button, a', /solicitação|visita|agendar/i)
        .should('exist')
    })
  })
})
