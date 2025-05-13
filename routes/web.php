<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Company\ReportabilityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FinishController;
use App\Http\Controllers\Contrata\RoleController;

Route::get('/', function () {
    return redirect()->route('login');
    // return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard/{type}', [DashboardController::class, 'type'])->name('dashboard.type');
    Route::post('finish/{id}', [FinishController::class, 'store'])->name('finish.store');
});

Route::get('view/reportability/download/{reportability_id}', [ReportabilityController::class, 'download'])->name('company.reportability.download');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/contractor.php';
require __DIR__ . '/annex.php';
require __DIR__ . '/consolidated.php';
require __DIR__ . '/company.php';

// Modulo para la gestion de vehiculos
require __DIR__ . '/format.php';

//Legacy
require __DIR__ . '/legacy/user.php';
require __DIR__ . '/legacy/admin.php';
Route::middleware(['auth', 'verified'])->group(function () {
    require __DIR__ . '/legacy/contrata.php';
    require __DIR__ . '/legacy/admin.php';
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('contrata/roles', [RoleController::class, 'index'])->name('contrata.roles.index');
    Route::post('contrata/roles/store', [RoleController::class, 'store'])->name('contrata.roles.store');
    Route::put('contrata/roles/update/{id}', [RoleController::class, 'update'])->name('contrata.roles.update');
    Route::delete('contrata/roles/destroy/{id}', [RoleController::class, 'destroy'])->name('contrata.roles.destroy');
});
