<?php

use App\Http\Controllers\Indicators\ContractorController;
use Illuminate\Support\Facades\Route;

// Exportar detalle de empresa específica - solo requiere autenticación
Route::middleware(['auth'])->group(function () {
    Route::get('contractor/export/{id}', [ContractorController::class, 'exportDetail'])->name('contractor.export.detail');
});

Route::middleware(['auth', 'role.permission'])->group(function () {

    // Redirigir 'contractor' a 'contractor'
    Route::redirect('contractor', 'contractor');

    // Visualizar las contratistas
    Route::get('contractor', [ContractorController::class, 'index'])->name('contractor.index');
    // Exportar contratistas
    Route::get('contractor/export', [ContractorController::class, 'export'])->name('contractor.export');
    // Agregar una contratista
    Route::post('contractor', [ContractorController::class, 'store'])->name('contractor.store');
    // Visualizar una contratista
    Route::get('contractor/{id}', [ContractorController::class, 'show'])->name('contractor.show');
    // Actualizar una contratista
    Route::patch('contractor/{id}', [ContractorController::class, 'update'])->name('contractor.update');
    // Eliminar una contratista
    Route::delete('contractor/{id}', [ContractorController::class, 'destroy'])->name('contractor.destroy');
});
