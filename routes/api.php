<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UtilityController;
use App\Http\Controllers\Api\EntityUserController;
use App\Http\Controllers\Api\UserContrller;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


/**
 * GET /connection
 *
 * Esta ruta verifica la conexión a la API.
 *
 * @return \Illuminate\Http\JsonResponse Una respuesta JSON que contiene un estado y un mensaje.
 * El estado será `true` si la conexión es exitosa, y el mensaje será 'Conexión exitosa'.
 */
Route::get('/connection', function () {
    return response()->json(['status' => true, 'message' => 'Conexión exitosa'], 200);
});

/**
 * @api {post} /authenticate Autenticar un usuario
 * @apiName AuthenticateUser
 * @apiGroup User
 *
 * @apiParam {String} doi Documento de identidad del Usuario.
 * @apiParam {String} password Contraseña del Usuario.
 *
 * @apiSuccess {String} success Mensaje de éxito.
 * @apiSuccess {Object} user Datos del usuario autenticado.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Conexión exitosa",
 *       "user": {
 *          "id": 1,
 *          "doi": "12345678",
 *          "name": "John Doe",
 *          ...
 *       }
 *     }
 *
 * @apiError {String} error Mensaje de error.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Las credenciales proporcionadas son incorrectas."
 *     }
 */
Route::post('/authenticate', [UtilityController::class, 'authenticate']);


Route::get('/entities/{entity_id}/users', [EntityUserController::class, 'users'])->name('entity.users');
Route::post('/entities/users/store', [EntityUserController::class, 'store'])->name('entity.users.store');

Route::get('/entities/{company_id}', [UtilityController::class, 'entities'])->name('entities');

//Ruta para categorias
Route::get('/categories/{company_id}/{name}', [UtilityController::class, 'categories'])->name('categories');

//Ruta para saber quien es el jefe de una entidad
Route::get('/entities/{entity_id}/boss', [EntityUserController::class, 'boss'])->name('entity.boss');

// Ingreso de reportes
Route::post('/report/store/{company_id}', [UtilityController::class, 'storeReport'])->name('report.store');


//Ruta para obtener mis reportes
Route::post('/reports', [UtilityController::class, 'reports'])->name('reports');
Route::get('/myreports', [UtilityController::class, 'myReports'])->name('my-reports');

//Enviar correo prueba
Route::get('/sendmail', [UtilityController::class, 'sendMail'])->name('sendmail');

Route::get('/show/credentials', [UtilityController::class, 'showCredentials'])->name('show.credentials');

//get user for company
Route::get('/{company_id}/users', [UserContrller::class, 'getUserCompany'])->name('company.users');

Route::get('/current-version', function () {
    return response()->json([
        'success' => true,
        'version' => '2.2.1'
    ], 200);
});

Route::get('/current-version-web', function () {
    return response()->json([
        'success' => true,
        'version' => '2.2.1'
    ], 200);
})->name('current-version-web');

Route::get('/year/metrics/{company_id}', [UtilityController::class, 'yearMetrics'])->name('year.metrics');
Route::get('/year/metrics/inspeccion/{company_id}', [UtilityController::class, 'yearMetricsInspeccion'])->name('year.metrics.inspeccion');
Route::post('/year/metrics/inspeccion/detalle/{type}', [UtilityController::class, 'yearMetricsInspeccionDetalle'])->name('year.metrics.inspeccion.detalle');

Route::get('user/{dni}', [UtilityController::class, 'getUser'])->name('user.show');

Route::get('companies', [UtilityController::class, 'getCompanies'])->name('contratas');

Route::get('report/{report_id}', [UtilityController::class, 'getReportJson']);

Route::post('reports/metrics/{type}', [UtilityController::class, 'getReportsMetrics'])->name('getReportsMetrics');
