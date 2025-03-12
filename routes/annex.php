<?php

use App\Http\Controllers\Indicators\AnnexController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::prefix('annexes')->group(function () {
        Route::get('/', [AnnexController::class, 'index'])->name('annexes.index');
        Route::post('/', [AnnexController::class, 'store'])->name('annexes.store');
        Route::get('/{annex}', [AnnexController::class, 'edit'])->name('annexes.edit');
        Route::put('/{annex}', [AnnexController::class, 'update'])->name('annexes.update');
        Route::delete('/{annex}', [AnnexController::class, 'destroy'])->name('annexes.destroy');
    });
});
