<?php
// Inicia a sessão (necessário para o projeto)
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
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    $confirm_password = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';

    // Validação básica dos campos
    if (empty($name) || empty($username) || empty($password) || empty($confirm_password)) {
        $response['message'] = 'Por favor, preencha todos os campos.';
    } elseif ($password !== $confirm_password) {
        $response['message'] = 'As senhas não coincidem.';
    } elseif (strlen($password) < 6) {
        $response['message'] = 'A senha deve ter no mínimo 6 caracteres.';
    } else {
        // Tenta adicionar o usuário
        // Em um projeto real, você usaria password_hash($password, PASSWORD_DEFAULT)
        $registration_success = add_user($username, $password, $name);

        if ($registration_success) {
            $response['success'] = true;
            $response['message'] = 'Cadastro realizado com sucesso! Você já pode fazer login.';
            // Opcional: Logar o usuário automaticamente
            // $_SESSION['user'] = ['username' => $username, 'name' => $name];
        } else {
            $response['message'] = 'O nome de usuário "' . htmlspecialchars($username) . '" já está em uso.';
        }
    }
}

// Retorna a resposta em formato JSON
echo json_encode($response);
?>
