# Estrutura de Pastas do Projeto

Olá! Criei a seguinte estrutura de pastas para o nosso projeto, visando uma organização clara e escalável, seguindo boas práticas de desenvolvimento web com PHP.

```
projeto_web/
├── config/                 # Arquivos de configuração (ex: banco de dados)
│   ├── database.php
│   ├── properties.php      # Simulação de dados de imóveis (inclui função de busca por ID)
│   └── users.json          # Simulação de banco de dados (criado pelo database.php)
├── public/                 # Pasta pública, acessível pelo navegador
│   ├── css/                # Arquivos de estilo (CSS)
│   │   ├── style.css
│   │   └── dashboard.css   # Estilos para a página principal
│   ├── img/                # Imagens
│   ├── js/                 # Scripts (JavaScript, jQuery)
│   │   ├── main.js
│   │   ├── dashboard.js    # Lógica JavaScript para o dashboard (inclui redirecionamento para detalhes)
│   │   └── property.js     # Lógica JavaScript para a página de detalhes do imóvel
│   ├── index.html          # Página de login
│   ├── register.html       # Página de cadastro
│   ├── dashboard.html      # Página principal (Dashboard) pós-login
│   └── property.html       # Página de detalhes do imóvel
├── src/                    # Código-fonte da aplicação (PHP)
│   ├── controllers/        # Controladores (lógica de negócio)
│   │   ├── LoginController.php
│   │   ├── RegisterController.php  # Controlador para a lógica de cadastro
│   │   └── PropertyController.php  # Controlador para buscar detalhes de um imóvel por ID
│   │   └── DashboardController.php # Controlador para carregar dados do feed
│   ├── models/             # Modelos (interação com o banco de dados)
│   └── views/              # Arquivos de visualização (HTML com PHP)
│       └── login.php
├── vendor/                 # Dependências de terceiros (gerenciadas pelo Composer)
└── index.php               # Ponto de entrada principal da aplicação (roteador)
```

## Explicação das Pastas

- **`config/`**: Armazena todos os arquivos de configuração da sua aplicação. Por exemplo, as credenciais de acesso ao banco de dados ficarão em `database.php`. Manter a configuração separada do código ajuda a gerenciar diferentes ambientes (desenvolvimento, produção) com mais facilidade.

- **`public/`**: Esta é a única pasta que deve ser diretamente acessível pelo navegador. Todos os seus *assets* (CSS, JavaScript, imagens) e o `index.html` (ou `index.php` principal que renderiza as views) ficam aqui. Isso aumenta a segurança, pois impede o acesso direto aos arquivos de lógica de negócio e configuração.

- **`src/`**: Contém o coração da sua aplicação PHP. A estrutura interna segue uma organização baseada no padrão MVC (Model-View-Controller), que é uma prática comum para organizar o código:
    - **`controllers/`**: Os controladores recebem as requisições do usuário, processam os dados (com a ajuda dos modelos) e decidem qual resposta enviar. No nosso caso, o `LoginController.php` cuidará da lógica de autenticação.
    - **`models/`**: Os modelos são responsáveis pela interação com o banco de dados. Eles contêm a lógica para buscar, inserir, atualizar e deletar dados.
    - **`views/`**: As *views* são a camada de apresentação. Elas são, em sua maioria, arquivos HTML que exibem os dados preparados pelos controladores. O `login.php` é um exemplo.

- **`vendor/`**: Se você usar um gerenciador de dependências como o Composer (o que é altamente recomendado para projetos PHP modernos), esta pasta armazenará as bibliotecas de terceiros que seu projeto utiliza.

- **`index.php`**: Este é o ponto de entrada único para todas as requisições da sua aplicação. Ele intercepta a URL, decide qual controlador chamar e inicia o processo. Isso é conhecido como *Front Controller Pattern*.

A estrutura foi atualizada para incluir a funcionalidade de cadastro e a página principal (Dashboard). O `database.php` e `properties.php` simulam o armazenamento de usuários e imóveis, respectivamente. O `DashboardController.php` é responsável por fornecer os dados dos imóveis para o frontend.

## Configuração Docker

Para facilitar a execução do projeto, foram adicionados arquivos de configuração Docker:

```
projeto_web/
...
├── Dockerfile              # Define a imagem do container PHP-FPM
├── docker-compose.yml      # Orquestra os serviços (Nginx e PHP)
└── nginx.conf              # Configuração do servidor web Nginx
```

### Como Executar com Docker

1.  Certifique-se de ter o **Docker** e o **Docker Compose** instalados em sua máquina.
2.  Navegue até a pasta raiz do projeto (`projeto_web/`).
3.  Execute o comando para construir e iniciar os containers:
    ```bash
    docker-compose up --build -d
    ```
4.  O projeto estará acessível em seu navegador no endereço: `http://localhost:8080/index.html`
5.  Para parar os containers, execute:
    ```bash
    docker-compose down
    ```



CREATE TABLES

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(30) NOT NULL, 
    city VARCHAR(30) NULL,
    profession VARCHAR(30) NULL,
    interests VARCHAR(30) NULL,
    bio VARCHAR(100) NULL,
    reviews_count SMALLINT NULL,
    listings_count SMALLINT NULL,
    host_rating REAL NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE property (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    location VARCHAR(500) NULL,
    price VARCHAR(500) NULL,
    type VARCHAR(50) NULL,
    description VARCHAR(500) NULL,
    nearby VARCHAR(500) NULL,
    host_id SMALLINT NOT NULL,
    image VARCHAR(50) NULL,
    rating REAL NULL,
    host_rating REAL NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_favorite_properties (
    id SERIAL PRIMARY KEY,
    property_id SMALLINT NOT NULL,
    user_id SMALLINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE property_reviews (
    id SERIAL PRIMARY KEY,
    property_id SMALLINT NOT NULL,
    author_id SMALLINT NOT NULL,
    text VARCHAR(500) NOT NULL,
    rating REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE property_details (
    id SERIAL PRIMARY KEY,
    property_id SMALLINT NOT NULL,
    detail_name VARCHAR(30) NOT NULL,
    detail_value SMALLINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    property_id SMALLINT NOT NULL,
    user_id SMALLINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    chat_id SMALLINT NOT NULL,
    user_id SMALLINT NOT NULL,
    text VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE property_requests (
    id SERIAL PRIMARY KEY,
    property_id SMALLINT NOT NULL,
    user_id SMALLINT NOT NULL,
    status SMALLINT NOT NULL DEFAULT 0,
    request_type VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);