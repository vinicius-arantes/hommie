<?php
// Inicia a sessão
session_start();

// Inclui os arquivos necessários
require_once __DIR__ . '/../models/ChatModel.model.php';

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

// Prepara a resposta padrão
$response = [
    'success' => false,
    'message' => 'Requisição inválida.'
];

if ($method === 'GET') {
    // Verifica se um chat_id foi fornecido
    if (isset($_GET['chat_id'])) {
        // Retorna um chat específico
        $chat_id = (int)$_GET['chat_id'];
        $chat = get_chat_by_id($chat_id);

        if ($chat) {
            $response['success'] = true;
            $response['chat'] = $chat;
        } else {
            $response['message'] = 'Chat não encontrado.';
        }
    } elseif (isset($_GET['host'])) {
        // Busca ou cria um chat com um host específico
        $host_username = $_GET['host'];
        $property_id = isset($_GET['property_id']) ? (int)$_GET['property_id'] : null;
        
        $chat = get_or_create_chat($username, $host_username, $property_id);
        
        if ($chat) {
            $response['success'] = true;
            $response['chat'] = $chat;
        } else {
            $response['message'] = 'Erro ao buscar ou criar o chat.';
        }
    } else {
        // Retorna todos os chats do usuário
        $chats = get_user_chats($username);

        $response['success'] = true;
        $response['chats'] = $chats;
        $response['message'] = 'Chats carregados com sucesso.';
    }
} elseif ($method === 'POST') {
    // Adiciona uma mensagem a um chat
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['chat_id']) || !isset($data['message'])) {
        $response['message'] = 'Dados inválidos.';
    } else {
        $chat_id = (int)$data['chat_id'];
        $message_text = $data['message'];
        
        // Verifica se o chat pertence ao usuário
        $chat = get_chat_by_id($chat_id);
        if (!$chat) {
            $response['message'] = 'Chat não encontrado ou acesso negado.';
        } else {
            $new_message = add_message_to_chat($chat_id, $username, $message_text);
            
            if ($new_message) {
                $response['success'] = true;
                $response['message'] = 'Mensagem enviada com sucesso.';
                $response['new_message'] = $new_message;
            } else {
                $response['message'] = 'Erro ao enviar a mensagem.';
            }
        }
    }
}

// Retorna a resposta em formato JSON
echo json_encode($response);
?>
