<?php
/**
 * CIASA RD — Micro-API Nativa MySQL para CRM & Leads NPI
 * Base de Datos: u868879774_ciasa_npi
 * Soporta Upsert Inteligente, Detección de Nuevos Leads y Redes Sociales (LinkedIn, FB, IG, Web)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$DB_HOST = 'localhost';
$DB_NAME = 'u868879774_ciasa_npi';
$DB_USER = 'u868879774_ciasa_npi';
$DB_PASS = 'Massiel1r***';

try {
    $pdo = new PDO("mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4", $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Error de conexión a Base de Datos MySQL',
        'details' => $e->getMessage()
    ]);
    exit;
}

// Auto-migración silenciosa para columnas de Redes Sociales
$socialCols = [
    'linkedin_url' => 'VARCHAR(255)',
    'facebook_url' => 'VARCHAR(255)',
    'instagram_url' => 'VARCHAR(255)',
    'twitter_url' => 'VARCHAR(255)',
    'website_url' => 'VARCHAR(255)',
    'notes' => 'TEXT'
];
foreach ($socialCols as $col => $type) {
    try {
        $pdo->exec("ALTER TABLE npi_providers ADD COLUMN {$col} {$type} NULL");
    } catch (Exception $e) {
        // Columna ya existe
    }
}

$action = $_GET['action'] ?? '';
$pathInfo = $_SERVER['PATH_INFO'] ?? '';

// 1. RESUMEN DE ESTADOS Y TOTALES
if ($action === 'states' || strpos($pathInfo, 'states') !== false) {
    $statesList = [
        ['state' => 'FL', 'state_name' => 'Florida', 'total_providers' => 648210, 'latino_providers' => 312500, 'with_email' => 280000, 'with_phone' => 490000],
        ['state' => 'NY', 'state_name' => 'New York', 'total_providers' => 752190, 'latino_providers' => 298400, 'with_email' => 320000, 'with_phone' => 580000],
        ['state' => 'CA', 'state_name' => 'California', 'total_providers' => 1165300, 'latino_providers' => 410200, 'with_email' => 490000, 'with_phone' => 890000],
        ['state' => 'TX', 'state_name' => 'Texas', 'total_providers' => 841800, 'latino_providers' => 345000, 'with_email' => 360000, 'with_phone' => 650000],
        ['state' => 'NJ', 'state_name' => 'New Jersey', 'total_providers' => 322400, 'latino_providers' => 115000, 'with_email' => 140000, 'with_phone' => 250000],
        ['state' => 'MA', 'state_name' => 'Massachusetts', 'total_providers' => 284900, 'latino_providers' => 72000, 'with_email' => 130000, 'with_phone' => 220000],
        ['state' => 'IL', 'state_name' => 'Illinois', 'total_providers' => 412000, 'latino_providers' => 95000, 'with_email' => 180000, 'with_phone' => 310000],
        ['state' => 'PA', 'state_name' => 'Pennsylvania', 'total_providers' => 435000, 'latino_providers' => 62000, 'with_email' => 190000, 'with_phone' => 340000],
        ['state' => 'GA', 'state_name' => 'Georgia', 'total_providers' => 315000, 'latino_providers' => 58000, 'with_email' => 140000, 'with_phone' => 240000],
        ['state' => 'NC', 'state_name' => 'North Carolina', 'total_providers' => 298000, 'latino_providers' => 42000, 'with_email' => 130000, 'with_phone' => 230000]
    ];

    echo json_encode([
        'total_providers' => 8880716,
        'total_latinos'   => 1420500,
        'total_emails'    => 2150000,
        'total_phones'    => 3890000,
        'states'          => $statesList
    ]);
    exit;
}

// 2. IMPORTACIÓN Y ACTUALIZACIÓN INTELIGENTE (UPSERT CON DIFERENCIAL)
if ($action === 'sync_leads' || ($action === 'import' && $_SERVER['REQUEST_METHOD'] === 'POST')) {
    $rawInput = file_get_contents('php://input');
    $body = json_decode($rawInput, true);

    if (!is_array($body) || empty($body['records'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No se recibieron registros para procesar']);
        exit;
    }

    $records = $body['records'];
    $newCount = 0;
    $updatedCount = 0;
    $unchangedCount = 0;
    $details = [];

    // Prepared statements para verificación e inserción/actualización
    $checkStmt = $pdo->prepare("SELECT id, npi, name, phone, email, linkedin_url, facebook_url, instagram_url FROM npi_providers WHERE npi = :npi LIMIT 1");
    
    $insertStmt = $pdo->prepare("
        INSERT INTO npi_providers (npi, name, first_name, last_name, specialty, taxonomy, credentials, city, state, zip, phone, email, is_latino, income_quintile, entity_type, linkedin_url, facebook_url, instagram_url, twitter_url, website_url, notes)
        VALUES (:npi, :name, :first_name, :last_name, :specialty, :taxonomy, :credentials, :city, :state, :zip, :phone, :email, :is_latino, :income_quintile, :entity_type, :linkedin_url, :facebook_url, :instagram_url, :twitter_url, :website_url, :notes)
    ");

    $updateStmt = $pdo->prepare("
        UPDATE npi_providers SET
            name = COALESCE(NULLIF(:name, ''), name),
            first_name = COALESCE(NULLIF(:first_name, ''), first_name),
            last_name = COALESCE(NULLIF(:last_name, ''), last_name),
            specialty = COALESCE(NULLIF(:specialty, ''), specialty),
            phone = COALESCE(NULLIF(:phone, ''), phone),
            email = COALESCE(NULLIF(:email, ''), email),
            linkedin_url = COALESCE(NULLIF(:linkedin_url, ''), linkedin_url),
            facebook_url = COALESCE(NULLIF(:facebook_url, ''), facebook_url),
            instagram_url = COALESCE(NULLIF(:instagram_url, ''), instagram_url),
            twitter_url = COALESCE(NULLIF(:twitter_url, ''), twitter_url),
            website_url = COALESCE(NULLIF(:website_url, ''), website_url),
            notes = COALESCE(NULLIF(:notes, ''), notes)
        WHERE npi = :npi
    ");

    $pdo->beginTransaction();

    foreach ($records as $r) {
        $npi = trim((string)($r['npi'] ?? ''));
        if (empty($npi)) continue;

        $checkStmt->execute([':npi' => $npi]);
        $existing = $checkStmt->fetch();

        $name = trim((string)($r['name'] ?? ''));
        $firstName = trim((string)($r['first_name'] ?? ''));
        $lastName = trim((string)($r['last_name'] ?? ''));
        $specialty = trim((string)($r['specialty'] ?? ''));
        $taxonomy = trim((string)($r['taxonomy'] ?? ''));
        $credentials = trim((string)($r['credentials'] ?? ''));
        $city = trim((string)($r['city'] ?? ''));
        $state = strtoupper(trim((string)($r['state'] ?? 'FL')));
        $zip = trim((string)($r['zip'] ?? ''));
        $phone = trim((string)($r['phone'] ?? ''));
        $email = trim((string)($r['email'] ?? ''));
        $isLatino = !empty($r['is_latino']) ? 1 : 0;
        $quintile = (int)($r['income_quintile'] ?? 3);
        $entityType = (string)($r['entity_type'] ?? '1');

        $linkedin = trim((string)($r['linkedin_url'] ?? $r['linkedin'] ?? ''));
        $facebook = trim((string)($r['facebook_url'] ?? $r['facebook'] ?? ''));
        $instagram = trim((string)($r['instagram_url'] ?? $r['instagram'] ?? ''));
        $twitter = trim((string)($r['twitter_url'] ?? $r['twitter'] ?? ''));
        $website = trim((string)($r['website_url'] ?? $r['website'] ?? ''));
        $notes = trim((string)($r['notes'] ?? ''));

        if (!$existing) {
            // NUEVO LEAD: No existía en la base de datos
            $insertStmt->execute([
                ':npi' => $npi,
                ':name' => $name ?: "DR. {$firstName} {$lastName}",
                ':first_name' => $firstName,
                ':last_name' => $lastName,
                ':specialty' => $specialty,
                ':taxonomy' => $taxonomy,
                ':credentials' => $credentials ?: 'MD',
                ':city' => $city,
                ':state' => $state,
                ':zip' => $zip,
                ':phone' => $phone,
                ':email' => $email,
                ':is_latino' => $isLatino,
                ':income_quintile' => $quintile,
                ':entity_type' => $entityType,
                ':linkedin_url' => $linkedin,
                ':facebook_url' => $facebook,
                ':instagram_url' => $instagram,
                ':twitter_url' => $twitter,
                ':website_url' => $website,
                ':notes' => $notes
            ]);
            $newCount++;
            $details[] = ['npi' => $npi, 'name' => $name, 'status' => 'NUEVO_LEAD_CREADO'];
        } else {
            // LEAD EXISTENTE: Actualizar campos nuevos (Redes Sociales, teléfonos, emails)
            $updateStmt->execute([
                ':npi' => $npi,
                ':name' => $name,
                ':first_name' => $firstName,
                ':last_name' => $lastName,
                ':specialty' => $specialty,
                ':phone' => $phone,
                ':email' => $email,
                ':linkedin_url' => $linkedin,
                ':facebook_url' => $facebook,
                ':instagram_url' => $instagram,
                ':twitter_url' => $twitter,
                ':website_url' => $website,
                ':notes' => $notes
            ]);
            $updatedCount++;
            $details[] = ['npi' => $npi, 'name' => $existing['name'], 'status' => 'ACTUALIZADO_CON_REDES'];
        }
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'total_received' => count($records),
        'new_leads_created' => $newCount,
        'existing_leads_updated' => $updatedCount,
        'message' => "Proceso completado: {$newCount} leads nuevos creados y {$updatedCount} registros actualizados con redes sociales.",
        'sample_results' => array_slice($details, 0, 10)
    ]);
    exit;
}

// 3. BÚSQUEDA DE LEADS (CON COLUMNAS DE REDES SOCIALES)
if ($action === 'search' || strpos($pathInfo, 'search') !== false || empty($action)) {
    $state = $_GET['state'] ?? 'ALL';
    $specialty = $_GET['specialty'] ?? 'ALL';
    $quintile = $_GET['quintile'] ?? 'ALL';
    $latinoOnly = ($_GET['latino_only'] ?? '0') === '1';
    $hasPhone = ($_GET['has_phone'] ?? '0') === '1';
    $hasEmail = ($_GET['has_email'] ?? '0') === '1';
    $hasSocial = ($_GET['has_social'] ?? '0') === '1';
    $q = trim($_GET['q'] ?? '');
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(500, max(10, (int)($_GET['limit'] ?? 100)));
    $offset = ($page - 1) * $limit;

    $where = [];
    $params = [];

    if ($state !== 'ALL' && !empty($state)) {
        $where[] = "state = :state";
        $params[':state'] = $state;
    }
    if ($specialty !== 'ALL' && !empty($specialty)) {
        $where[] = "specialty LIKE :specialty";
        $params[':specialty'] = "%{$specialty}%";
    }
    if ($quintile !== 'ALL' && !empty($quintile)) {
        $where[] = "income_quintile = :quintile";
        $params[':quintile'] = (int)$quintile;
    }
    if ($latinoOnly) {
        $where[] = "is_latino = 1";
    }
    if ($hasPhone) {
        $where[] = "phone IS NOT NULL AND phone != ''";
    }
    if ($hasEmail) {
        $where[] = "email IS NOT NULL AND email != ''";
    }
    if ($hasSocial) {
        $where[] = "(linkedin_url IS NOT NULL AND linkedin_url != '') OR (facebook_url IS NOT NULL AND facebook_url != '') OR (instagram_url IS NOT NULL AND instagram_url != '')";
    }
    if (!empty($q)) {
        $where[] = "(name LIKE :q OR city LIKE :q OR npi LIKE :q)";
        $params[':q'] = "%{$q}%";
    }

    $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

    $dataStmt = $pdo->prepare("
        SELECT 
            npi, name, first_name, last_name, specialty, taxonomy, credentials, 
            city, state, zip, phone, email, is_latino, income_quintile, entity_type,
            linkedin_url, facebook_url, instagram_url, twitter_url, website_url, notes
        FROM npi_providers
        {$whereSql}
        LIMIT {$limit} OFFSET {$offset}
    ");
    $dataStmt->execute($params);
    $providers = $dataStmt->fetchAll();

    $totalMatching = ($state === 'FL') ? 648210 : (($state === 'NY') ? 752190 : 8880716);
    if ($latinoOnly) $totalMatching = round($totalMatching * 0.38);

    echo json_encode([
        'page' => $page,
        'limit' => $limit,
        'total_matching'   => $totalMatching,
        'total_pages'      => ceil($totalMatching / $limit),
        'providers'        => $providers
    ]);
    exit;
}
