describe('Testes de Chat', () => {
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

  describe('Novo Chat', () => {
    it('Deve permitir iniciar novo chat a partir de propriedade', () => {
      cy.visit('/property.html?id=1')
      cy.wait(1000)
      
      cy.contains('button, a', /contato|mensagem|chat/i)
        .click()
      
      cy.wait(500)
      
      // Verificar se foi redirecionado para chat
      cy.url().should('include', 'chat')
    })

    it('Deve criar nova conversa ao enviar primeira mensagem', () => {
      cy.visit('/property.html?id=1')
      cy.wait(1000)
      
      cy.get('.contact-button')
        .click()
      
      cy.wait(500)

      cy.url().should('include', '/chat_user.html')
      
      cy.get('input[type="text"]')
        .type('Olá, tenho interesse na propriedade{enter}')
      
      cy.wait(500)
      
      // Verificar se mensagem foi enviada
      cy.contains('tenho interesse').should('exist')
    })
  })

  describe('Lista de Chats', () => {
    beforeEach(() => {
      cy.visit('/chats.html')
    })

    it('Deve carregar página de chats', () => {
      cy.url().should('include', '/chats.html')
    })

    it('Deve exibir lista de conversas', () => {
      cy.wait(1000)
      cy.get('.chats-list')
        .should('exist')
    })

    it('Deve exibir informações de cada conversa', () => {
      cy.wait(1000)
      
      cy.get('.chat-item')
        .first()
        .within(() => {
          // Verificar nome do contato
          cy.get('[class*="chat-host-name"]').should('exist')
        })
    })

    it('Deve permitir clicar em uma conversa', () => {
      cy.wait(1000)
      
      cy.get('.chat-item, [class*="chat-item"], .conversation-item')
        .first()
        .click()
      
      cy.wait(500)
    })

    it('Deve exibir indicador de mensagens não lidas', () => {
      cy.wait(1000)
      
      // Verificar se há badge ou indicador
      cy.get('.unread, [class*="unread"], .badge')
        .should('exist')
    })
  })

  describe('Conversa Individual', () => {
    beforeEach(() => {
      cy.visit('/chats.html')
      cy.get('.chat-item').first().click()
    })

    it('Deve carregar página de conversa individual', () => {
      cy.url().should('include', '/chat_user.html')
    })

    it('Deve exibir nome do contato', () => {
      cy.wait(1000)
      
      cy.get('.contact-name, [class*="contact-name"], header')
        .should('be.visible')
    })

    it('Deve exibir histórico de mensagens', () => {
      cy.wait(1000)
      
      cy.get('.messages, [class*="message-list"], .chat-messages')
        .should('exist')
    })

    it('Deve exibir mensagens enviadas e recebidas', () => {
      cy.wait(1000)
      
      cy.get('.message, [class*="message-item"]')
        .should('have.length.greaterThan', 0)
    })

    it('Deve ter campo para digitar mensagem', () => {
      cy.get('input[type="text"], textarea')
        .should('be.visible')
    })

    it('Deve ter botão de enviar mensagem', () => {
      cy.get('button[type="submit"], button[class*="send"]')
        .should('be.visible')
    })

    it('Deve permitir digitar mensagem', () => {
      const message = 'Olá, tudo bem?'
      
      cy.get('input[type="text"], textarea')
        .type(message)
        .should('have.value', message)
    })

    it('Deve enviar mensagem ao clicar no botão', () => {
      const message = 'Mensagem de teste'
      
      cy.get('input[type="text"], textarea')
        .type(message)
      
      cy.get('button[type="submit"], button[class*="send"]')
        .click()
      
      cy.wait(500)
      
      // Verificar se mensagem apareceu na lista
      cy.contains(message).should('exist')
    })

    it('Deve enviar mensagem ao pressionar Enter', () => {
      const message = 'Teste com Enter'
      
      cy.get('input[type="text"], textarea')
        .type(message)
        .type('{enter}')
      
      cy.wait(500)
      
      // Verificar se mensagem foi enviada
      cy.contains(message).should('exist')
    })

    it('Deve limpar campo após enviar mensagem', () => {
      const message = 'Mensagem para limpar'
      
      cy.get('input[type="text"], textarea')
        .type(message)
      
      cy.get('button[type="submit"], button[class*="send"]')
        .click()
      
      cy.wait(500)
      
      cy.get('input[type="text"], textarea')
        .should('have.value', '')
    })

    it('Deve exibir timestamp das mensagens', () => {
      cy.wait(1000)
      
      cy.get('.message-time, [class*="time"], [class*="timestamp"]')
        .should('exist')
    })

    it('Deve rolar automaticamente para última mensagem', () => {
      cy.wait(1000)
      
      // Enviar várias mensagens
      for (let i = 1; i <= 3; i++) {
        cy.get('input[type="text"], textarea')
          .type(`Mensagem ${i}{enter}`)
        cy.wait(300)
      }
      
      // Verificar se última mensagem está visível
      cy.contains('Mensagem 3').should('be.visible')
    })

    it('Deve permitir voltar para lista de chats', () => {
      cy.get('a[href*="chats"], button[class*="back"]')
        .should('exist')
        .click()
      
      cy.wait(500)
      cy.url().should('include', '/chats.html')
    })
  })
})
