<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UtilityController;
use App\Http\Controllers\Api\EntityUserController;
use App\Http\Controllers\Api\UserContrller;

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
//get user with role engineer security
Route::get('/{company_id}/engineer-security', [UserContrller::class, 'getUserCompanyIngSecurity'])->name('company.users.engineer-security');

Route::get('/year/metrics/{company_id}', [UtilityController::class, 'yearMetrics'])->name('year.metrics');
Route::get('/year/metrics/inspeccion/{company_id}', [UtilityController::class, 'yearMetricsInspeccion'])->name('year.metrics.inspeccion');
Route::post('/year/metrics/inspeccion/detalle/{type}', [UtilityController::class, 'yearMetricsInspeccionDetalle'])->name('year.metrics.inspeccion.detalle');

Route::get('user/{dni}', [UtilityController::class, 'getUser'])->name('user.show');

Route::get('companies', [UtilityController::class, 'getCompanies'])->name('contratas');

Route::get('report/{report_id}', [UtilityController::class, 'getReportJson']);

Route::post('reports/metrics/{type}', [UtilityController::class, 'getReportsMetrics'])->name('getReportsMetrics');

Route::get('/current-version', [UtilityController::class, 'getCurrentVersion']);

Route::get('/current-version-web', [UtilityController::class, 'getCurrentVersionWeb'])->name('current-version-web');
