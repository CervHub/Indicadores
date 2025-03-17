<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Contrata\ContrataController;
use App\Http\Controllers\Contrata\PersonalController;
use App\Http\Controllers\Contrata\ReportabilityController;
use App\Http\Controllers\Contrata\SecurityController;

Route::get('/contrata', [ContrataController::class, 'index'])->name('contrata.dashboard');
Route::get('/contrata/personal', [PersonalController::class, 'index'])->name('contrata.personal');
Route::post('/contrata/personal/store', [PersonalController::class, 'store'])->name('contrata.personal.store');
Route::put('/contrata/personal/{personal}', [PersonalController::class, 'update'])->name('contrata.personal.update');
Route::delete('/contrata/personal/{personal}', [PersonalController::class, 'destroy'])->name('contrata.personal.destroy');

// /reprotabilidad
Route::get('contrata/analysis/category', [ContrataController::class, 'category'])->name('contrata.analysis.category');
Route::get('contrata/analysis/category/{category_name}', [ContrataController::class, 'categoryDetail'])->name('contrata.analysis.category.detail');
Route::get('contrata/analysis/year', [ContrataController::class, 'categoryYear'])->name('contrata.analysis.category.year');

//Analiticas Inspecciones
Route::get('contrata/analysis/inspeccion', [ContrataController::class, 'inspeccion'])->name('contrata.analysis.inspeccion');
Route::get('contrata/analysis/inspeccion/detalle', [ContrataController::class, 'inspeccionDetail'])->name('contrata.analysis.inspeccion.detail');
Route::get('contrata/analysis/inspeccion/year', [ContrataController::class, 'inspeccionYear'])->name('contrata.analysis.inspeccion.year');

// Visualizacion de reportes
//Reportabilidad
Route::get('contrata/reportability', [ReportabilityController::class, 'index'])->name('contrata.reportability');
Route::get('contrata/reportability/detalle/{reportability_id}', [ReportabilityController::class, 'detalle'])->name('contrata.reportability.detalle');


// Excel Masivo
Route::get('contrata/excel/formatodownload', [ReportabilityController::class, 'formatoDownload'])->name('contrata.excel.formatodownload');
Route::post('contrata/excel/formatoupload', [ReportabilityController::class, 'formatoUpload'])->name('contrata.excel.formatoupload');

// Habilitar ingenieros de seguridad
Route::get('contrata/security-engineer', [SecurityController::class, 'index'])->name('security-engineer');
Route::post('contrata/security-engineer/store', [SecurityController::class, 'store'])->name('security-engineer.store');
Route::delete('contrata/security-engineer/{dni}', [SecurityController::class, 'destroy'])->name('security-engineer.destroy');
