<?php
include_once __DIR__ . '/../database/Transaction.class.php';

// Função para carregar todos os chats
function get_all_chats($wheres = "", $inners = "") {
    include_once __DIR__ . '/UserModel.model.php';

    $user_session = find_user($_SESSION['user']['name']);

    Transaction::open();

    $sql_search_messages = "SELECT
        CASE WHEN users.id = {$user_session['id']} THEN 'user' ELSE 'host' END AS sender,
        chat_messages.text,
        chat_messages.chat_id,
        chat_messages.created_at AS timestamp
        FROM chat_messages
        INNER JOIN chat
            ON chat.id = chat_messages.chat_id
        INNER JOIN users
            ON users.id = chat_messages.user_id
        ORDER BY chat_messages.created_at ASC";

    $messages_search = Connection::search($sql_search_messages);

    $all_messages = [];
    if(!$messages_search["error"]){
        foreach ($messages_search["msg"] as $message_info) {
            $chat_id = $message_info->chat_id;
            $all_messages[$chat_id][] = (array) $message_info;
        }
    }

    $sql_search_chats = "SELECT
        chat.id,
        send_user.name AS user,
        host_user.name AS host,
        CASE WHEN send_user.name = '{$user_session['name']}' THEN host_user.name ELSE send_user.name END AS host_name,
        chat.property_id,
        property.title AS property_title,
        last_msgs.last_message,
        last_msgs.last_message_time
    FROM chat
    INNER JOIN property 
        ON property.id = chat.property_id
    INNER JOIN users AS host_user
        ON host_user.id = property.host_id
    INNER JOIN users AS send_user
        ON send_user.id = chat.user_id
    LEFT JOIN LATERAL (
        SELECT 
            chat_messages.text AS last_message,
            chat_messages.created_at AS last_message_time
        FROM chat_messages
        WHERE chat_messages.chat_id = chat.id
        ORDER BY chat_messages.created_at DESC
        LIMIT 1
    ) AS last_msgs ON TRUE
    {$inners}
    WHERE 1=1
        {$wheres}";

    $chat_search = Connection::search($sql_search_chats);

    // echo '<pre>';
    // print_r($chat_search);
    // die($sql_search_chats);

    if(!$chat_search["error"]){
        $chats_return = [];

        foreach ($chat_search["msg"] as $index_search => $chat_info) {
            $chats_return[$chat_info->id] = (array) $chat_info;
            $chats_return[$chat_info->id]['messages'] = $all_messages[$chat_info->id] ?? [];
        }

        return $chats_return;
    }

    Transaction::close();

    return [];
}

// Função para buscar chats de um usuário
function get_user_chats($username) {
    $where_user = "AND (send_user.name = '{$username}' OR host_user.name = '{$username}')";
    $user_chats = get_all_chats($where_user);

    return $user_chats;
}

// Função para buscar um chat específico
function get_chat_by_id($chat_id) {
    $where_id = "AND chat.id = {$chat_id}";
    $chat = get_all_chats($where_id);

    if (!empty($chat)) {
        return reset($chat);
    }
    
    return null;
}

// Função para buscar ou criar um chat entre usuário e host
function get_or_create_chat($username, $host_username, $property_id) {
    $where_chat = "AND (send_user.name = '{$username}' OR host_user.name = '{$host_username}') AND property.id = {$property_id}";
    $chat = get_all_chats($where_chat);

    if (!empty($chat)) {
        return reset($chat);
    }

    include_once __DIR__ . '/UserModel.model.php';
    include_once __DIR__ . '/PropertyModel.model.php';

    $user_sender = find_user($username);
    
    Transaction::open();

    $new_chat = [
        'user_id' => $user_sender['id'],
        'property_id' => $property_id
    ];

    $insert_chat = Connection::insert_data("chat", $new_chat);

    Transaction::close();
    
    return get_chat_by_id($insert_chat['id']);
}

// Função para adicionar uma mensagem a um chat
function add_message_to_chat($chat_id, $sender, $message_text) {
    include_once __DIR__ . '/UserModel.model.php';

    $user = find_user($sender);

    Transaction::open();

    if ($user) {
        $new_message = [
            'chat_id' => $chat_id,
            'user_id' => $user['id'],
            'text' => "'$message_text'"
        ];

        $insert_message = Connection::insert_data("chat_messages", $new_message);

        Transaction::close();
        
        $new_message['timestamp'] = date('Y-m-d H:i:s');

        return $new_message;
    }
    
    return null;
}
?>
