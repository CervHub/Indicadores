<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\User\ReportabilityController;


Route::get('/dashboard/user', [UserController::class, 'index'])->name('user.dashboard');

// Visualizacion de reportes
//Reportabilidad
Route::get('user/reportability', [ReportabilityController::class, 'index'])->name('user.reportability');
Route::get('user/reportability/detalle/{reportability_id}', [ReportabilityController::class, 'detalle'])->name('user.reportability.detalle');


// /reprotabilidad
Route::get('user/analysis/category', [UserController::class, 'category'])->name('user.analysis.category');
Route::get('user/analysis/category/{category_name}', [UserController::class, 'categoryDetail'])->name('user.analysis.category.detail');
Route::get('user/analysis/year', [UserController::class, 'categoryYear'])->name('user.analysis.category.year');

//Analiticas Inspecciones
Route::get('user/analysis/inspeccion', [UserController::class, 'inspeccion'])->name('user.analysis.inspeccion');
Route::get('user/analysis/inspeccion/detalle', [UserController::class, 'inspeccionDetail'])->name('user.analysis.inspeccion.detail');
Route::get('user/analysis/inspeccion/year', [UserController::class, 'inspeccionYear'])->name('user.analysis.inspeccion.year');
