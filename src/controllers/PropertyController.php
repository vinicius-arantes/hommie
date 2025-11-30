<?php
// Inicia a sessão
session_start();

// Inclui o arquivo de simulação de dados de imóveis
require_once __DIR__ . '/../models/PropertyModel.model.php';

// Define o cabeçalho da resposta como JSON
header('Content-Type: application/json');

// Verifica se o usuário está logado (opcional, mas boa prática)
if (!isset($_SESSION['user'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Acesso negado. Por favor, faça login.'
    ]);
    exit;
}

// Prepara a resposta padrão
$response = [
    'success' => false,
    'message' => 'Requisição inválida.'
];

$method = $_SERVER['REQUEST_METHOD'];
$username = $_SESSION['user']['username'] ?? $_SESSION['user'];

if ($method === 'GET') {
    // Se um ID foi fornecido, retorna um imóvel específico
    if (isset($_GET['id'])) {
        $property_id = (int)$_GET['id'];
        $property = get_property_by_id($property_id);
        
        if ($property) {
            $response['success'] = true;
            $response['property'] = $property;
            $response['message'] = "Imóvel encontrado!";
        } else {
            $response['message'] = 'Imóvel não encontrado.';
        }
    } else if (isset($_GET['username'])) {
        $owner_username = $_GET['username'];
        $properties = get_properties_by_owner($owner_username);
        
        if ($properties) {
            $response['success'] = true;
            $response['properties'] = $properties;
            $response['message'] = "Imóveis do usuário encontrados!";
        } else {
            $response['message'] = 'Nenhum imóvel encontrado para este usuário.';
        }
    } else {
        // Caso contrário, retorna os imóveis do usuário
        $properties = get_properties_by_owner($username);
        $response['success'] = true;
        $response['properties'] = $properties;
    }
} elseif ($method === 'POST') {
    // Cria um novo imóvel
    $data = json_decode(file_get_contents('php://input'), true);

    if(isset($_GET["is_favorite"])){ 
        // Favorita um imóvel
        if($_GET["is_favorite"] == 'true'){
            $favorited_property = favorite_property($data, $_SESSION['user']);
        } else if ($_GET["is_favorite"] == 'false'){
            $favorited_property = unfavorite_property($data, $_SESSION['user']);
        }
        
        if ($favorited_property) {
            $response['success'] = true;
            $response['message'] = 'Imóvel favoritado com sucesso.';
            $response['property'] = $favorited_property;
        } else {
            $response['message'] = 'Erro ao favoritar o imóvel.';
        }
    } elseif (isset($_GET['action'])) {

        switch ($_GET['action']) {
            case 'create_request':
                // Cria uma solicitação de imóvel
                $property_request = create_property_request($data, $_SESSION['user']);
                
                if (!$property_request["error"]) {
                    $response['success'] = true;
                    $response['message'] = 'Solicitação criada com sucesso.';
                    $response['property_request'] = $property_request;
                } else {
                    $response['message'] = $property_request["msg"];
                }
                break;
            case 'edit_property':

                $data['owner'] = $username;
                // Edita um imóvel existente
                $edited_property = edit_property($data);

                if (!$edited_property["error"]) {
                    $response['success'] = true;
                    $response['message'] = 'Imóvel editado com sucesso.';
                    $response['property'] = $edited_property;
                } else {
                    $response['message'] = 'Erro ao editar o imóvel.';
                }
                break;
            case 'delete_property':
                // Deleta um imóvel existente
                $deleted_property = delete_property($data);
                if (!$deleted_property["error"]) {
                    $response['success'] = true;
                    $response['message'] = 'Imóvel excluído com sucesso.';
                    $response['property'] = $deleted_property;
                } else {
                    $response['message'] = 'Erro ao excluir o imóvel.';
                }
                break;
            case 'approve_request':
                // Aprova uma solicitação de imóvel
                $data['status'] = 1; // Define o status como aprovado
                $approved_request = update_property_request_status($data);
                
                if (!$approved_request["error"]) {
                    $response['success'] = true;
                    $response['message'] = 'Solicitação aprovada com sucesso.';
                    $response['property_request'] = $approved_request;
                } else {
                    $response['message'] = 'Erro ao aprovar a solicitação.';
                }
                break;
            case 'reject_request':
                // Rejeita uma solicitação de imóvel
                $data['status'] = 2; // Define o status como rejeitado
                $rejected_request = update_property_request_status($data);
                
                if (!$rejected_request["error"]) {
                    $response['success'] = true;
                    $response['message'] = 'Solicitação rejeitada com sucesso.';
                    $response['property_request'] = $rejected_request;
                } else {
                    $response['message'] = 'Erro ao rejeitar a solicitação.';
                }
                break;
            default:
                $response['message'] = 'Ação inválida.';
                break;
        }
    } else {        
        if (!$data) {
            $response['message'] = 'Dados inválidos.';
        } else {
            // Adiciona o proprietário aos dados
            $data['owner'] = $username;
            
            // Adiciona o novo imóvel
            $new_property = add_property($data);
            
            if ($new_property) {
                $response['success'] = true;
                $response['message'] = 'Imóvel criado com sucesso.';
                $response['property'] = $new_property;
            } else {
                $response['message'] = 'Erro ao criar o imóvel.';
            }
        }
    }
}

// Retorna a resposta em formato JSON
echo json_encode($response);
?>
