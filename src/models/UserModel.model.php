<?php
include_once __DIR__ . '/../database/Transaction.class.php';

// Função para carregar usuários
function load_users($wheres = '', $inners = '') {
    $arr_users = [];

    Transaction::open();

    $search_users = Connection::search(
        "SELECT 
            id
            ,name
            ,username
            ,password
            ,city
            ,profession
            ,interests
            ,bio
            ,0 AS reviews_count
            ,(
                SELECT COUNT(id) AS listings
                FROM property
                WHERE property.host_id = users.id 
                GROUP BY property.host_id
            ) AS listings_count
            ,COALESCE(host_rating, 0) AS host_rating
            ,created_at 
        FROM users
        {$inners}
        WHERE 1=1
            {$wheres}"
    );

    if(!$search_users["error"]){
        foreach ($search_users["msg"] as $user_info) {
            $arr_users[$user_info->name] = (array) $user_info;
        }
    }

    Transaction::close();
    
    return $arr_users;
}

// Função para salvar usuários
function save_users($user) {
    Transaction::open();

    $insert_user = Connection::insert_data("users", $user);

    Transaction::close();
}

function edit_user($edit_info) {
    Transaction::open();

    $insert_user = Connection::edit_data("users", $edit_info);

    Transaction::close();
}

// Função para adicionar um novo usuário
function add_user($username, $password, $name) {
    $users = load_users();
    if (isset($users[$username])) {
        return false; // Usuário já existe
    }

    // Em um projeto real, use password_hash()
    $user_to_add = [
        'password' => "'$password'",
        'name' => "'$name'",
        'username' => "'$username'"
    ];

    save_users($user_to_add);
    return true;
}

// Função para atualizar o perfil do usuário
function update_user_profile($username, $profile_data) {
    $users = load_users();
    if (!isset($users[$username])) {
        return false; // Usuário não existe
    }

    // Atualiza apenas os campos de perfil (não a senha)
    $edit_info['id'] = $users[$username]['id'];
    if (!empty($profile_data['name'])) {
        $edit_info['name'] = "'{$profile_data['name']}'";
    }
    if (!empty($profile_data['city'])) {
        $edit_info['city'] = "'{$profile_data['city']}'";
    }
    if (!empty($profile_data['profession'])) {
        $edit_info['profession'] = "'{$profile_data['profession']}'";
    }
    if (!empty($profile_data['interests'])) {
        $edit_info['interests'] = "'{$profile_data['interests']}'";
    }
    if (!empty($profile_data['bio'])) {
        $edit_info['bio'] = "'{$profile_data['bio']}'";
    }

    edit_user($edit_info);
    return true;
}

// Função para obter o perfil completo do usuário
function get_user_profile($username) {
    include_once __DIR__ . '/HistoricModel.model.php';
    $user = find_user($username);

    if (!$user) {
        return null;
    }

    // Retorna o perfil sem a senha
    return [
        'username' => $username,
        'name' => $user['name'] ?? '',
        'city' => $user['city'] ?? '',
        'profession' => $user['profession'] ?? '',
        'interests' => $user['interests'] ?? '',
        'bio' => $user['bio'] ?? '',
        'historic' => get_historic('user', $user['id'])
    ];
}

// Função para buscar um usuário (usada no LoginController)
function find_user($username) {
    $users = load_users();
    return $users[$username] ?? null;
}

?>
