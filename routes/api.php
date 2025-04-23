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

Route::get('/connection', function () {
    return response()->json(['status' => true, 'message' => 'Conexión exitosa'], 200);
});

Route::post('/authenticate', [UtilityController::class, 'authenticate']);

require __DIR__.'/apimobile.php';
require __DIR__.'/apiweb.php';
