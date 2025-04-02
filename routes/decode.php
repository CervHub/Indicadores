<?php

use App\Http\Controllers\Indicators\DecodeExcelController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {

    // Redirigir 'decode' a 'decode'
    Route::redirect('decode', 'decode');

    // Visualizar los decodificadores
    Route::get('decode', [DecodeExcelController::class, 'index'])->name('decode.index');
    // Agregar un decodificador
    Route::post('decode', [DecodeExcelController::class, 'store'])->name('decode.store');
});
