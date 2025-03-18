<?php

use App\Http\Controllers\Indicators\ConsolidatedController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    // Rutas para Consolidated
    Route::get('consolidated', [ConsolidatedController::class, 'index'])->name('consolidated.index');
    Route::post('consolidated', [ConsolidatedController::class, 'store'])->name('consolidated.store');
    Route::get('consolidated/{id}', [ConsolidatedController::class, 'show'])->name('consolidated.show');
    Route::patch('consolidated/{id}', [ConsolidatedController::class, 'update'])->name('consolidated.update');
    Route::delete('consolidated/{id}', [ConsolidatedController::class, 'destroy'])->name('consolidated.destroy');
    Route::get('consolidated/download/{id}', [ConsolidatedController::class, 'download'])->name('consolidated.download'); // Nueva ruta para descargar el archivo
    Route::patch('consolidated/close/{id}', [ConsolidatedController::class, 'close'])->name('consolidated.close'); // Nueva ruta para cerrar el consolidado
    Route::patch('consolidated/open/{id}', [ConsolidatedController::class, 'open'])->name('consolidated.open'); // Nueva ruta para abrir el consolidado
});
