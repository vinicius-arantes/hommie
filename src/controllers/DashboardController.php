<?php
// Inicia a sessão
session_start();

// Inclui o arquivo de simulação de dados de imóveis
require_once __DIR__ . '/../models/PropertyModel.model.php';

// Define o cabeçalho da resposta como JSON
header('Content-Type: application/json');

// Verifica se o usuário está logado
if (!isset($_SESSION['user'])) {
    // Se não estiver logado, retorna um erro ou redireciona
    echo json_encode([
        'success' => false,
        'message' => 'Acesso negado. Por favor, faça login.'
    ]);
    exit;
}

// Verifica o método da requisição
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if(isset($_GET["action"])){
        switch ($_GET["action"]) {
            case 'favorite_properties':
                $properties = get_all_favorite_properties($_SESSION['user']);
                break;
            default:
                $properties = get_all_properties();
                break;
        }
    } else {
        $properties = get_all_properties();
    }


    // Retorna os dados dos imóveis
    echo json_encode([
        'success' => true,
        'properties' => $properties,
        'user' => $_SESSION['user']
    ]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $json_data = file_get_contents('php://input');

    $_POST = json_decode($json_data, true);

    switch ($_GET["action"]) {
        case 'list':
            $properties = get_all_properties();
            break;
        case 'favorite_properties':
            $properties = get_all_favorite_properties($_SESSION['user']);
            break;
        default:
            $properties = get_all_properties();
            break;
    }

    // Retorna os dados dos imóveis
    echo json_encode([
        'success' => true,
        'properties' => $properties,
        'user' => $_SESSION['user']
    ]);

} else {
    // Método não permitido
    echo json_encode([
        'success' => false,
        'message' => 'Método de requisição não permitido.'
    ]);
}
?>
