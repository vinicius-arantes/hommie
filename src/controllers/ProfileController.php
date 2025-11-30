<?php
// Inicia a sessão
session_start();

// Inclui o arquivo de configuração do banco de dados
require_once '../models/UserModel.model.php';

// Define o cabeçalho da resposta como JSON
header('Content-Type: application/json');

// Verifica se o usuário está logado
if (!isset($_SESSION['user'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Acesso negado. Por favor, faça login.'
    ]);
    exit;
}

$username = $_SESSION['user']['username'] ?? $_SESSION['user'];
$method = $_SERVER['REQUEST_METHOD'];

// Verifica o método da requisição
if ($method === 'GET') {
    // Retorna o perfil do usuário
    $profile = get_user_profile($username);
    
    if ($profile) {
        echo json_encode([
            'success' => true,
            'profile' => $profile
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Perfil do usuário não encontrado.'
        ]);
    }
} elseif ($method === 'POST') {
    // Atualiza o perfil do usuário
    $data = json_decode(file_get_contents('php://input'), true);

    if(isset($_GET["action"])){

        switch ($_GET["action"]) {
            case 'get_user_profile':
                if(isset($data["username"])){
                    $profile = get_user_profile($data["username"]);
                    
                    if ($profile) {
                        $response = [
                            'success' => true,
                            'profile' => $profile
                        ];
                    } else {
                        $response = [
                            'success' => false,
                            'message' => 'Perfil do usuário não encontrado.'
                        ];
                    }
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'ID do usuário não fornecido.'
                    ];
                }
                break;
            
            default:
                # code...
                break;
        }
        echo json_encode($response);
        exit;
    }
    
    if (!$data) {
        echo json_encode([
            'success' => false,
            'message' => 'Dados inválidos.'
        ]);
        exit;
    }
    
    $result = update_user_profile($username, $data);

    if ($result) {
        $updated_profile = get_user_profile($data['name']);

        $_SESSION['user']['username'] = $data['name'];
        echo json_encode([
            'success' => true,
            'message' => 'Perfil atualizado com sucesso.',
            'profile' => $updated_profile
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao atualizar o perfil.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método de requisição não permitido.'
    ]);
}
?>
