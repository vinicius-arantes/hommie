<?php
// Inicia a sessão para gerenciamento de login
session_start();

// Inclui o arquivo de configuração que simula o banco de dados
require_once '../models/UserModel.model.php';

// Define o cabeçalho da resposta como JSON
header('Content-Type: application/json');

// Prepara a resposta padrão
$response = [
    'success' => false,
    'message' => 'Método de requisição inválido.'
];

// Verifica se o método da requisição é POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtém os dados do formulário
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    // Validação básica dos campos
    if (empty($username) || empty($password)) {
        $response['message'] = 'Por favor, preencha o usuário e a senha.';
    } else {
        // Busca o usuário no "banco de dados"
        $user = find_user($username);

        if ($user && $user['password'] === $password) {
            // Autenticação bem-sucedida
            // Em um projeto real, você usaria password_verify($password, $user['password'])
            $_SESSION['user'] = [
                'username' => $username,
                'name' => $user['name']
            ];

            $response['success'] = true;
            $response['message'] = 'Login realizado com sucesso! Bem-vindo, ' . $user['name'] . '.';
            $response['redirect'] = 'dashboard.html';
        } else {
            // Falha na autenticação
            $response['message'] = 'Usuário ou senha inválidos.';
        }
    }
}

// Retorna a resposta em formato JSON
echo json_encode($response);
?>
