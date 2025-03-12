<?php

use App\Http\Controllers\Indicators\ContractorController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {

    // Redirigir 'contractor' a 'contractor'
    Route::redirect('contractor', 'contractor');

    // Visualizar las contratistas
    Route::get('contractor', [ContractorController::class, 'index'])->name('contractor.index');
    // Agregar una contratista
    Route::post('contractor', [ContractorController::class, 'store'])->name('contractor.store');
    // Visualizar una contratista
    Route::get('contractor/{id}', [ContractorController::class, 'show'])->name('contractor.show');
    // Actualizar una contratista
    Route::patch('contractor/{id}', [ContractorController::class, 'update'])->name('contractor.update');
    // Eliminar una contratista
    Route::delete('contractor/{id}', [ContractorController::class, 'destroy'])->name('contractor.destroy');
});
