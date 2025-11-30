# Guia de Testes Automatizados - HOMMIE

Este documento fornece instruções rápidas para configurar e executar os testes automatizados com Cypress no projeto HOMMIE.

## Instalação Rápida

### 1. Instalar Dependências

```bash
npm install
```

Isso instalará o Cypress e todas as dependências necessárias.

### 2. Verificar Instalação

```bash
npx cypress verify
```

## Executando os Testes

### Opção 1: Interface Gráfica (Recomendado para Desenvolvimento)

```bash
npm run test:open
```

Isso abrirá a interface do Cypress onde você pode:
- Selecionar testes individuais para executar
- Ver os testes sendo executados em tempo real
- Depurar testes com ferramentas de desenvolvedor
- Visualizar snapshots de cada passo

### Opção 2: Linha de Comando (Recomendado para CI/CD)

```bash
npm test
```

Executa todos os testes em modo headless (sem interface gráfica).

### Opção 3: Navegador Específico

```bash
npm run test:chrome    # Executa no Chrome
npm run test:firefox   # Executa no Firefox
```

## Pré-requisitos Importantes

### ⚠️ A aplicação DEVE estar rodando

Antes de executar os testes, certifique-se de que a aplicação está rodando em `http://localhost:8080`:

```bash
docker-compose up -d
```

Para verificar se está rodando:
```bash
curl http://localhost:8080
```

## Estrutura dos Testes

Os testes estão organizados por funcionalidade:

```
cypress/e2e/
├── login.cy.js       → Testes de login e autenticação
├── register.cy.js    → Testes de cadastro de usuários
├── dashboard.cy.js   → Testes da página principal
├── property.cy.js    → Testes de propriedades (criar, editar, visualizar)
├── chat.cy.js        → Testes de mensagens e chat
└── profile.cy.js     → Testes de perfil de usuário
```

## Executar Teste Específico

Para executar apenas um arquivo de teste:

```bash
npx cypress run --spec "cypress/e2e/login.cy.js"
```

Para executar testes que correspondem a um padrão:

```bash
npx cypress run --spec "cypress/e2e/**/chat*.cy.js"
```

## Comandos NPM Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm test` | Executa todos os testes em modo headless |
| `npm run test:open` | Abre interface gráfica do Cypress |
| `npm run test:headless` | Executa testes sem interface gráfica |
| `npm run test:chrome` | Executa testes no navegador Chrome |
| `npm run test:firefox` | Executa testes no navegador Firefox |

## Visualizar Resultados

### Vídeos

Após executar os testes em modo headless, vídeos são salvos em:
```
cypress/videos/
```

### Screenshots

Screenshots de falhas são salvos em:
```
cypress/screenshots/
```

## Dados de Teste

Os dados de teste (usuários, propriedades, etc.) estão em:
```
cypress/fixtures/users.json
```

Você pode modificar esses dados conforme necessário para seus testes.

## Comandos Customizados

O projeto inclui comandos customizados para facilitar os testes:

```javascript
// Fazer login
cy.login('username', 'password')

// Fazer logout
cy.logout()

// Verificar se está no dashboard
cy.shouldBeOnDashboard()

// Verificar se está na página de login
cy.shouldBeOnLogin()
```

## Solução de Problemas Comuns

### Problema: "baseUrl is not configured"

**Solução:** Verifique se o arquivo `cypress.config.js` existe e contém:
```javascript
baseUrl: 'http://localhost:8080'
```

### Problema: Testes falham com timeout

**Solução:** 
1. Verifique se a aplicação está rodando
2. Verifique se a porta 8080 está acessível
3. Aumente o timeout no teste se necessário

### Problema: Cypress não abre

**Solução:**
```bash
npx cypress cache clear
npm install cypress --force
npx cypress verify
```

### Problema: Erro de permissão no Linux

**Solução:**
```bash
sudo chown -R $(whoami) ~/.cache/Cypress
```

## Integração com CI/CD

### GitHub Actions

Exemplo de workflow:

```yaml
name: Cypress Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Start application
        run: docker-compose up -d
      
      - name: Wait for app
        run: npx wait-on http://localhost:8080
      
      - name: Run Cypress tests
        run: npm test
      
      - name: Upload videos
        if: failure()
        uses: actions/upload-artifact@v2
        with:
          name: cypress-videos
          path: cypress/videos
```

### GitLab CI

Exemplo de `.gitlab-ci.yml`:

```yaml
test:
  image: cypress/base:latest
  script:
    - npm install
    - docker-compose up -d
    - npm test
  artifacts:
    when: on_failure
    paths:
      - cypress/videos
      - cypress/screenshots
```

## Boas Práticas

### ✅ Fazer

- Executar testes antes de fazer commit
- Manter dados de teste atualizados
- Adicionar testes para novas funcionalidades
- Usar comandos customizados para ações repetitivas
- Revisar vídeos de falhas para debugging

### ❌ Evitar

- Executar testes sem a aplicação rodando
- Hardcoded de dados sensíveis
- Testes dependentes de ordem de execução
- Seletores CSS frágeis (prefira IDs ou data-attributes)
- Esperas fixas desnecessárias (`cy.wait(5000)`)

## Próximos Passos

1. **Executar os testes pela primeira vez:**
   ```bash
   docker-compose up -d
   npm run test:open
   ```

2. **Explorar os testes existentes** para entender a estrutura

3. **Adicionar novos testes** conforme novas funcionalidades são desenvolvidas

4. **Configurar CI/CD** para executar testes automaticamente

## Recursos Úteis

- 📚 [Documentação Cypress](https://docs.cypress.io)
- 📖 [README dos Testes](./cypress/README.md)
- 🎓 [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- 💡 [Exemplos de Testes](https://github.com/cypress-io/cypress-example-recipes)

## Suporte

Para dúvidas ou problemas:
1. Consulte a [documentação completa](./cypress/README.md)
2. Verifique os [issues do Cypress](https://github.com/cypress-io/cypress/issues)
3. Abra uma issue no repositório do projeto

---

**Última atualização:** 29 de Novembro de 2025

**Versão do Cypress:** 15.7.0
