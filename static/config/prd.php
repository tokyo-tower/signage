<?php
$config = [
    'API_STATUS_ENDPOINT' => $_SERVER['API_STATUS_ENDPOINT'],
    'API_TIMEOUT' => $_SERVER['API_TIMEOUT']
];

header('content-type: application/json; charset=utf-8');
echo json_encode($config);
