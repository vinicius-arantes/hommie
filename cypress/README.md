# Testes Automatizados com Cypress - HOMMIE

Este diretório contém todos os testes automatizados E2E (End-to-End) para a aplicação HOMMIE, implementados utilizando o framework Cypress.

## Estrutura de Pastas

```
cypress/
├── e2e/                    # Testes End-to-End
│   ├── login.cy.js        # Testes de autenticação e login
│   ├── register.cy.js     # Testes de cadastro de usuários
│   ├── dashboard.cy.js    # Testes da página principal
│   ├── property.cy.js     # Testes de propriedades (CRUD)
│   ├── chat.cy.js         # Testes de mensagens e chat
│   └── profile.cy.js      # Testes de perfil de usuário
├── fixtures/               # Dados de teste (mocks)
│   └── users.json         # Dados de usuários para testes
├── support/                # Arquivos de suporte
│   ├── commands.js        # Comandos customizados
│   └── e2e.js            # Configuração global dos testes
└── README.md              # Esta documentação
```

## Pré-requisitos

Antes de executar os testes, certifique-se de que:

1. **Node.js** está instalado (versão 14 ou superior)
2. **Dependências** estão instaladas:
   ```bash
   npm install
   ```
3. **Aplicação está rodando** em `http://localhost:8080`
   ```bash
   docker-compose up -d
   ```

## Como Executar os Testes

### Modo Interativo (Interface Gráfica)

Abre a interface do Cypress para executar e visualizar os testes:

```bash
npm run test:open
```

### Modo Headless (Linha de Comando)

Executa todos os testes sem interface gráfica:

```bash
npm test
```

ou

```bash
npm run test:headless
```

### Executar em Navegador Específico

**Chrome:**
```bash
npm run test:chrome
```

**Firefox:**
```bash
npm run test:firefox
```

### Executar Teste Específico

```bash
npx cypress run --spec "cypress/e2e/login.cy.js"
```

## Sequência de testes

### register
### login
### property
### dashboard
### chat
### profile

## Suítes de Teste

### 1. Login (`login.cy.js`)
Testa a funcionalidade de autenticação:
- Carregamento da página de login
- Validação de campos obrigatórios
- Login com credenciais válidas
- Login com credenciais inválidas
- Redirecionamento após login bem-sucedido
- Exibição de mensagens de erro

### 2. Cadastro (`register.cy.js`)
Testa o processo de registro de novos usuários:
- Carregamento do formulário de cadastro
- Validação de campos obrigatórios
- Validação de formato de e-mail
- Cadastro com dados válidos
- Prevenção de e-mails duplicados
- Redirecionamento após cadastro

### 3. Dashboard (`dashboard.cy.js`)
Testa a página principal da aplicação:
- Exibição de propriedades
- Funcionalidade de busca e filtros
- Navegação entre páginas
- Acesso a perfil e configurações
- Criação de nova propriedade
- Logout

### 4. Propriedades (`property.cy.js`)
Testa operações CRUD de propriedades:
- Visualização de detalhes da propriedade
- Criação de nova propriedade
- Edição de propriedade existente
- Upload de imagens
- Interações (favoritar, contatar)
- Validação de formulários

### 5. Chat (`chat.cy.js`)
Testa o sistema de mensagens:
- Lista de conversas
- Visualização de mensagens
- Envio de novas mensagens
- Criação de novas conversas
- Indicadores de mensagens não lidas
- Busca em conversas

### 6. Perfil (`profile.cy.js`)
Testa funcionalidades de perfil:
- Visualização de perfil próprio
- Visualização de perfil de outros usuários
- Edição de informações pessoais
- Upload de foto de perfil
- Exibição de propriedades do usuário
- Exibição de avaliações

## Comandos Customizados

O arquivo `cypress/support/commands.js` contém comandos customizados para facilitar os testes:

### `cy.login(username, password)`
Realiza login na aplicação:
```javascript
cy.login('testuser', 'testpass123')
```

### `cy.logout()`
Realiza logout da aplicação:
```javascript
cy.logout()
```

### `cy.shouldBeOnDashboard()`
Verifica se está na página de dashboard:
```javascript
cy.shouldBeOnDashboard()
```

### `cy.shouldBeOnLogin()`
Verifica se está na página de login:
```javascript
cy.shouldBeOnLogin()
```

## Fixtures (Dados de Teste)

Os dados de teste estão armazenados em `cypress/fixtures/users.json`:

```javascript
cy.fixture('users').then((users) => {
  cy.login(users.validUser.username, users.validUser.password)
})
```

## Configuração

A configuração do Cypress está em `cypress.config.js`:

- **baseUrl**: `http://localhost:8080`
- **viewportWidth**: 1280px
- **viewportHeight**: 720px
- **video**: Habilitado
- **screenshotOnRunFailure**: Habilitado

## Relatórios e Evidências

### Vídeos
Os vídeos das execuções são salvos em:
```
cypress/videos/
```

### Screenshots
Screenshots de falhas são salvos em:
```
cypress/screenshots/
```

## Boas Práticas

1. **Isolamento de Testes**: Cada teste deve ser independente
2. **Dados de Teste**: Use fixtures para dados reutilizáveis
3. **Comandos Customizados**: Crie comandos para ações repetitivas
4. **Esperas Inteligentes**: Use `cy.wait()` apenas quando necessário
5. **Seletores Estáveis**: Prefira IDs e data-attributes
6. **Limpeza**: Restaure estado após cada teste

## Troubleshooting

### Aplicação não está rodando
```bash
docker-compose up -d
```

### Porta 8080 ocupada
Altere a `baseUrl` em `cypress.config.js`

### Testes falhando intermitentemente
Aumente os timeouts ou adicione esperas explícitas

### Cypress não abre
```bash
npx cypress verify
npx cypress cache clear
npm install cypress --force
```

## Integração Contínua (CI/CD)

Para executar em pipelines CI/CD:

```yaml
# Exemplo GitHub Actions
- name: Run Cypress tests
  run: npm test
  
- name: Upload artifacts
  uses: actions/upload-artifact@v2
  with:
    name: cypress-videos
    path: cypress/videos
```

## Contribuindo

Ao adicionar novos testes:

1. Siga o padrão de nomenclatura: `*.cy.js`
2. Organize em suítes com `describe()`
3. Use nomes descritivos para testes
4. Adicione comentários quando necessário
5. Mantenha fixtures atualizadas

## Recursos Adicionais

- [Documentação Oficial do Cypress](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Reference](https://docs.cypress.io/api/table-of-contents)
- [Exemplos](https://github.com/cypress-io/cypress-example-recipes)

## Suporte

Para dúvidas ou problemas com os testes, consulte a documentação ou abra uma issue no repositório do projeto.
