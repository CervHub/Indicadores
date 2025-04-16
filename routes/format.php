<?php

use App\Http\Controllers\Vehicle\VehicleController;
use App\Http\Controllers\Format\FormatController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::prefix('vehicle')->group(function () {
        Route::get('/', [VehicleController::class, 'index'])->name('vehicle.index');
        Route::post('/', [VehicleController::class, 'store'])->name('vehicle.store');
        Route::get('/{vehicle}', [VehicleController::class, 'show'])->name('vehicle.show');
        Route::put('/{vehicle}', [VehicleController::class, 'update'])->name('vehicle.update');
        Route::delete('/{vehicle}', [VehicleController::class, 'delete'])->name('vehicle.destroy');
    });
});

Route::middleware('auth')->group(function () {
    Route::prefix('format')->group(function () {
        Route::get('/', [FormatController::class, 'index'])->name('format.index');

        // Routes for acts, conditions, incidents, and inspections
        Route::get('/acts', [FormatController::class, 'acts'])->name('format.acts');
        Route::get('/conditions', [FormatController::class, 'conditions'])->name('format.conditions');
        Route::get('/incidents', [FormatController::class, 'incidents'])->name('format.incidents');
        Route::get('/inspection', [FormatController::class, 'inspection'])->name('format.inspection');

        // Routes for vehicle inspections
        Route::get('/daily-vehicle-inspection', [FormatController::class, 'dailyVehicleInspection'])->name('format.dailyVehicleInspection');
        Route::get('/quarterly-vehicle-inspection', [FormatController::class, 'quarterlyVehicleInspection'])->name('format.quarterlyVehicleInspection');
        Route::get('/semiannual-vehicle-inspection', [FormatController::class, 'semiannualVehicleInspection'])->name('format.semiannualVehicleInspection');
        Route::get('/annual-vehicle-shutdown-inspection', [FormatController::class, 'annualVehicleShutdownInspection'])->name('format.annualVehicleShutdownInspection');

        // Store route for all types
        Route::post('/store', [FormatController::class, 'store'])->name('format.store');
    });
});
