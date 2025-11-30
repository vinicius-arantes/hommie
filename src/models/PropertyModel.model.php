<?php
include_once __DIR__ . '/../database/Transaction.class.php';

// Função para buscar todos os imóveis
function get_all_properties($wheres = "", $inners = "") {
    include_once __DIR__ . '/UserModel.model.php';
    include_once __DIR__ . '/HistoricModel.model.php';

    $users_arr = load_users();

    Transaction::open();
    
    $property_details = get_properties_details();

    if(empty($property_details)) return [];

    $property_reviews = get_properties_reviews();

    $property_requests = get_properties_requests();

    $property_historic = get_historic('property');

    Transaction::open();

    $current_user = $users_arr[$_SESSION['user']['name']];

    // Consulta para buscar todos os imóveis com o filtro
    handle_filters($wheres, $inners);

    $search_all_props = 
    "SELECT 
        property.id,
        property.title,
        property.location,
        property.price,
        property.type,
        property.description,
        property.nearby,
        property.image,
        property.rating,
        users.name AS owner,
        CASE WHEN fav_props.id IS NOT NULL THEN 1 ELSE 0 END AS is_favorite
    FROM property
    LEFT JOIN users
        ON users.id = property.host_id
    LEFT JOIN users_favorite_properties AS fav_props
        ON fav_props.property_id = property.id
        AND fav_props.user_id = {$current_user['id']}
    {$inners}
    WHERE 1=1
        {$wheres}";

    $property_search = Connection::search($search_all_props);

    if($property_search["error"]) return [];

    $properties_return = [];

    foreach ($property_search["msg"] as $index_search => $property_info) {
        $property_info->host = $property_info->owner != "" ? $users_arr[$property_info->owner] : [];
        $property_info->details = $property_details[$property_info->id];
        $property_info->reviews = isset($property_reviews[$property_info->id]) ? $property_reviews[$property_info->id] : [];
        $property_info->requests = isset($property_requests[$property_info->id]) ? $property_requests[$property_info->id] : [];
        $property_info->historic = isset($property_historic[$property_info->id]) ? $property_historic[$property_info->id] : [];
        $properties_return[$property_info->id] = (array) $property_info;
    }

    Transaction::close();

    return $properties_return;
}

function handle_filters(&$wheres, &$inners) {
    if(isset($_POST['type_select']) && !empty($_POST['type_select'])) {
        $type = $_POST['type_select'];
        $wheres .= "\n AND property.type = '{$type}' ";
    }
    if(isset($_POST['value_min']) && !empty($_POST['value_min'])) {
        $value_min = floatval(str_replace(['R$', ','], ['', '.'], $_POST['value_min']));
        // $wheres .= "\n AND REPLACE(REPLACE(property.price, 'R$ ', ''), '.', '')::FLOAT >= {$value_min} ";
        $wheres .= "\n AND CAST(REPLACE(REPLACE(REPLACE(property.price, 'R$', ''), '.', ''), ',', '.') AS DECIMAL(10, 2)) >= {$value_min}";
    }
    if(isset($_POST['value_max']) && !empty($_POST['value_max'])) {
        $value_max = floatval(str_replace(['R$', ','], ['', '.'], $_POST['value_max']));
        // $wheres .= "\n AND REPLACE(REPLACE(property.price, 'R$ ', ''), '.', '')::FLOAT <= {$value_max} ";
        $wheres .= "\n AND CAST(REPLACE(REPLACE(REPLACE(property.price, 'R$', ''), '.', ''), ',', '.') AS DECIMAL(10, 2)) <= {$value_max}";
    }
    if(isset($_POST['location']) && !empty($_POST['location'])) {
        $location = $_POST['location'];
        $wheres .= "\n AND property.location ILIKE '%{$location}%' ";
    }
    if(isset($_POST['parking']) && !empty($_POST['parking'])) {
        $parking = $_POST['parking'];
        $inners .= "\n INNER JOIN property_details AS pd_parking
                     ON pd_parking.property_id = property.id
                     AND pd_parking.detail_name = 'vagas'
                     AND pd_parking.detail_value >= {$parking}";
    }
    if(isset($_POST['rooms']) && !empty($_POST['rooms'])) {
        $rooms = $_POST['rooms'];
        $inners .= "\n INNER JOIN property_details AS pd_rooms
                     ON pd_rooms.property_id = property.id
                     AND pd_rooms.detail_name = 'quartos'
                     AND pd_rooms.detail_value >= {$rooms}";
    }
}

// Função para buscar um imóvel pelo ID
function get_property_by_id($id) {
    $where_id = "AND property.id = {$id}";
    $property = get_all_properties($where_id);
    return reset($property);
}

// Função para buscar imóveis de um usuário específico
function get_properties_by_owner($owner) {
    $properties_data = get_all_properties();
    $owner_properties = [];
    foreach ($properties_data as $property) {
        if (isset($property['owner']) && $property['owner'] === $owner) {
            $owner_properties[] = $property;
        }
    }
    return $owner_properties;
}

// Função para adicionar um novo imóvel
function add_property($property_data) {
    
    include_once __DIR__ . '/UserModel.model.php';

    $user = find_user($property_data['owner']);

    Transaction::open();
    
    // Cria o novo imóvel com valores padrão
    $new_property = [
        'title' => "'{$property_data['title']}'" ?? "'Novo Imóvel'",
        'location' => "'{$property_data['location']}'" ?? '',
        'price' => "'{$property_data['price']}'" ?? "'R$ 0,00'",
        'type' => "'{$property_data['type']}'" ?? "'Aluguel'",
        "host_id" => $user['id'], 
        'description' => "'{$property_data['description']}'" ?? '',
        'nearby' => "'{$property_data['nearby']}'" ?? '',
        'image' => "'img/property-placeholder.png'",
        'rating' => 0,
    ];

    $insert_prop = Connection::insert_data('property', $new_property);

    $details = [
        [
            "property_id" => $insert_prop['id'],
            "detail_name" => "'vagas'",
            "detail_value" => intval($property_data['vagas'] ?? 0)
        ],
        [
            "property_id" => $insert_prop['id'],
            "detail_name" => "'quartos'",
            "detail_value" => intval($property_data['quartos'] ?? 0)
        ],
        [
            "property_id" => $insert_prop['id'],
            "detail_name" => "'banheiros'",
            "detail_value" => intval($property_data['banheiros'] ?? 0)
        ],
        [
            "property_id" => $insert_prop['id'],
            "detail_name" => "'area'",
            "detail_value" => intval($property_data['area'] ?? 0)
        ],
        [
            "property_id" => $insert_prop['id'],
            "detail_name" => "'pet'",
            "detail_value" => !empty($property_data['pet']) ? 1 : 0
        ],
        [
            "property_id" => $insert_prop['id'],
            "detail_name" => "'elevador'",
            "detail_value" => !empty($property_data['elevador']) ? 1 : 0
        ],
        [
            "property_id" => $insert_prop['id'],
            "detail_name" => "'portaria'",
            "detail_value" => !empty($property_data['portaria']) ? 1 : 0
        ],
    ];

    $insert_details = Connection::insert_data_multi('property_details', $details);

    Transaction::close();
    
    return $new_property;
}

function edit_property($property_data) {
    
    include_once __DIR__ . '/UserModel.model.php';

    $user = find_user($property_data['owner']);

    Transaction::open();

    // Prepara os dados para edição do imóvel
    $property_data_edit = [
        'id' => $property_data['id'],
        'title' => "'{$property_data['title']}'",
        'location' => "'{$property_data['location']}'",
        'price' => "'{$property_data['price']}'",
        'type' => "'{$property_data['type']}'",
        "host_id" => $user['id'], 
        'description' => "'{$property_data['description']}'",
        'nearby' => "'{$property_data['nearby']}'" ?? "''",
    ];

    $edit_prop = Connection::edit_data('property', $property_data_edit);

    $deletion_details_sql = "DELETE FROM property_details WHERE property_id = {$property_data['id']}";
    Connection::execute($deletion_details_sql);

    $details = [
        [
            "property_id" => $property_data['id'],
            "detail_name" => "'vagas'",
            "detail_value" => intval($property_data['vagas'] ?? 0)
        ],
        [
            "property_id" => $property_data['id'],
            "detail_name" => "'quartos'",
            "detail_value" => intval($property_data['quartos'] ?? 0)
        ],
        [
            "property_id" => $property_data['id'],
            "detail_name" => "'banheiros'",
            "detail_value" => intval($property_data['banheiros'] ?? 0)
        ],
        [
            "property_id" => $property_data['id'],
            "detail_name" => "'area'",
            "detail_value" => intval($property_data['area'] ?? 0)
        ],
        [
            "property_id" => $property_data['id'],
            "detail_name" => "'pet'",
            "detail_value" => !empty($property_data['pet']) ? 1 : 0
        ],
        [
            "property_id" => $property_data['id'],
            "detail_name" => "'elevador'",
            "detail_value" => !empty($property_data['elevador']) ? 1 : 0
        ],
        [
            "property_id" => $property_data['id'],
            "detail_name" => "'portaria'",
            "detail_value" => !empty($property_data['portaria']) ? 1 : 0
        ],
    ];

    $insert_details = Connection::insert_data_multi('property_details', $details);

    Transaction::close();
    
    return $edit_prop;
}

function delete_property($property_data) {

    $property_id = $property_data['id'];
    Transaction::open();

    $deletion_details_sql = "DELETE FROM property_details WHERE property_id = {$property_id}";
    Connection::execute($deletion_details_sql);

    $deletion_property_sql = "DELETE FROM property WHERE id = {$property_id}";
    $delete_property = Connection::execute($deletion_property_sql);

    Transaction::close();

    return $delete_property;
}

function get_properties_details(){
    
    $sql_search_props_details = 
    "SELECT
        property_id,
        detail_name,
        detail_value
    FROM property_details
    ";

    $search_props_details = Connection::search($sql_search_props_details);

    $props_details_arr = [];
    
    if($search_props_details["error"]) return [];

    foreach ($search_props_details["msg"] as $key => $value) {
        $props_details_arr[$value->property_id][$value->detail_name] = $value->detail_value;
    }

    return $props_details_arr;
}

function get_properties_reviews(){
    
    $sql_search_props_reviews = 
    "SELECT
        pr.id,
        pr.property_id,
        pr.author_id,
        pr.text,
        pr.rating,
        users.name AS author
    FROM property_reviews AS pr
    LEFT JOIN users
    ON pr.author_id = users.id
    ";

    $search_props_reviews = Connection::search($sql_search_props_reviews);

    if($search_props_reviews["error"]) return [];

    $props_reviews_arr = [];
    foreach ($search_props_reviews["msg"] as $key => $value) {
        $props_reviews_arr[$value->property_id][] = $value;
    }

    return $props_reviews_arr;
}

function favorite_property($data, $user){
    include_once __DIR__ . '/UserModel.model.php';

    $user_info = find_user($user['name']);

    Transaction::open();

    $update_favorite = [
        "property_id" => $data['id'],
        "user_id" => $user_info['id']
    ];

    $update = Connection::insert_data("users_favorite_properties", $update_favorite);

    Transaction::close();

    return $update;
}
function unfavorite_property($data, $user){
    include_once __DIR__ . '/UserModel.model.php';

    $user_info = find_user($user['name']);

    Transaction::open();

    $sql_delete_favorite = "DELETE FROM users_favorite_properties WHERE property_id = {$data['id']} AND user_id = {$user_info['id']}";

    $delete = Connection::execute($sql_delete_favorite);

    Transaction::close();

    return $delete;
}

function get_all_favorite_properties($user){
    include_once __DIR__ . '/UserModel.model.php';

    $user_info = find_user($user['name']);

    $inner_favorites = "INNER JOIN users_favorite_properties AS user_fav_props
                        ON user_fav_props.user_id = {$user_info['id']}
                        AND user_fav_props.property_id = property.id";

    $return_props_fav = get_all_properties(null, $inner_favorites);

    return $return_props_fav;
}

function create_property_request($data, $user){
    include_once __DIR__ . '/UserModel.model.php';

    $user_info = find_user($user['name']);

    Transaction::open();

    $sql_search_existing_request = 
    "SELECT
        id
    FROM property_requests
    WHERE property_id = {$data['property_id']}
    AND user_id = {$user_info['id']}
    AND status = 0";

    $existing_request = Connection::search($sql_search_existing_request);

    if(!$existing_request["error"] && count($existing_request["msg"]) > 0){
        Transaction::close();
        return [
            "error" => true,
            "msg" => "Você já possui uma solicitação para este imóvel."
        ];
    }

    $sql_search_last_request = 
    "SELECT
        id, request_type
    FROM property_requests
    WHERE property_id = {$data['property_id']} AND status = 1
    ORDER BY id DESC
    LIMIT 1";

    $last_request = Connection::search($sql_search_last_request);

    if(!$last_request["error"] && count($last_request["msg"]) > 0){
        $last_request_info = $last_request["msg"][0];
        if($last_request_info->request_type != "Fim de Vínculo"){
            Transaction::close();
            return [
                "error" => true,
                "msg" => "Esse imóvel já possui uma solicitação aprovada que não é do tipo 'Fim de Vínculo'. Por favor, aguarde ou escolha outro imóvel."
            ];
        }
    }

    $new_request = [
        "property_id" => $data['property_id'],
        "user_id" => $user_info['id'],
        "status" => 0,
        "request_type" => "'{$data['request_type']}'"
    ];

    $insert_request = Connection::insert_data("property_requests", $new_request);

    Transaction::close();

    return $insert_request;
}

function get_properties_requests(){

    $staus_labels = [
        0 => 'Pendente',
        1 => 'Aprovado',
        2 => 'Rejeitado'
    ];
    
    $sql_search_props_requests = 
    "SELECT
        pr.id,
        pr.property_id,
        pr.user_id,
        pr.status,
        pr.request_type,
        users.name AS requester
    FROM property_requests AS pr
    LEFT JOIN users
    ON pr.user_id = users.id
    ";

    $search_props_requests = Connection::search($sql_search_props_requests);

    if($search_props_requests["error"]) return [];

    $props_requests_arr = [];
    foreach ($search_props_requests["msg"] as $key => $value) {
        $value->status_label = $staus_labels[$value->status];
        $props_requests_arr[$value->property_id][] = $value;
    }

    return $props_requests_arr;
}

function update_property_request_status($data){

    Transaction::open();

    $update_request = [
        "id" => $data['id'],
        "status" => $data['status']
    ];

    $update = Connection::edit_data("property_requests", $update_request);

    Transaction::close();

    return $update;
}