<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WebController;
use App\Http\Controllers\Api\Web\VehicleController;
use App\Http\Controllers\Api\Web\ReportController;

/*
|--------------------------------------------------------------------------
| Rutas de la API - Versión 2 (web/v1)
|--------------------------------------------------------------------------
| Este archivo define las rutas para la versión 2 de la API con el prefijo
| 'web/v1'. Estas rutas manejan operaciones como guardar reportes, buscar
| usuarios, buscar vehículos y obtener la versión del aplicativo.
|--------------------------------------------------------------------------
*/

Route::prefix('web/v1')->group(function () {
    // Guardar un nuevo reporte
    Route::post('/save-report', [ReportController::class, 'saveReport'])
        ->name('web.v1.saveReport');
    // Descripción: Guarda un nuevo reporte en el sistema.

    // Buscar vehículos
    Route::get('/search-vehicles', [VehicleController::class, 'getVehicles'])
        ->name('web.v1.searchVehicles');
    // Descripción: Busca y recupera una lista de vehículos.

    Route::get('/search-vehicles/inspection', [VehicleController::class, 'getVehiclesInspection'])
        ->name('web.v1.searchVehiclesForInspection');

    // Obtener la versión del aplicativo
    Route::get('/version', [WebController::class, 'getVersion'])
        ->name('web.v1.getVersion');
    // Descripción: Recupera la versión actual del aplicativo.

});
