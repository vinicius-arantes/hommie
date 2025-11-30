<?php
include_once __DIR__ . '/../database/Transaction.class.php';

function get_historic($historic_type, $user_id = null){

    Transaction::open();

    $staus_labels = [
        0 => 'Pendente',
        1 => 'Aprovado',
        2 => 'Rejeitado'
    ];

    $sql_search_prop_historic = "";
    switch ($historic_type) {
        case 'user':
            $sql_search_prop_historic = "SELECT 
                pr.id,
                pr.property_id,
                property.title AS building,
                pr.user_id,
                pr.status,
                pr.request_type,
                pr.created_at
            FROM property_requests AS pr
            LEFT JOIN users 
                ON users.id = pr.user_id
            LEFT JOIN property 
                ON property.id = pr.property_id
            WHERE pr.user_id = {$user_id}";
        break;
        case 'property':
            $sql_search_prop_historic = 
            "SELECT 
                pr.id,
                pr.property_id,
                pr.user_id,
                users.name AS author,
                pr.status,
                pr.request_type,
                pr.created_at
            FROM property_requests AS pr
            LEFT JOIN users
            ON pr.user_id = users.id
            ";
        break;
        default:
            return [];
    }

    $search_prop_historic = Connection::search($sql_search_prop_historic);

    if($search_prop_historic["error"]) return [];

    $prop_historic_arr = [];
    foreach ($search_prop_historic["msg"] as $key => $value) {
        $date_happened = date("d/m/Y H:i:s", strtotime($value->created_at . "-3 hours"));
        $value->text = "{$value->request_type} - Status: {$staus_labels[$value->status]} ({$date_happened})";
        switch ($historic_type) {
            case 'user':
                $prop_historic_arr[] = $value;
                break;
            case 'property':
                $prop_historic_arr[$value->property_id][] = $value;
                break;
            default:
                break;
        }
    }

    Transaction::close();
    
    return $prop_historic_arr;
}