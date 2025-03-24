<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Company\CompanyController;
use App\Http\Controllers\Company\ManagementController;
use App\Http\Controllers\Company\SettingController;
use App\Http\Controllers\Company\LevelController;
use App\Http\Controllers\Company\EntityController;
use App\Http\Controllers\Company\SystemRoleController;
use App\Http\Controllers\Company\UserController;
use App\Http\Controllers\Company\CategoryController;
use App\Http\Controllers\Company\ReportabilityController;
use App\Http\Controllers\Company\AnalysisController;
use App\Http\Controllers\Company\ContrataController;

// Rutas para el administrador principal
Route::get('/dashboard/company', [CompanyController::class, 'index'])->name('company.dashboard');

// Rutas para la gestion de empresas o management
Route::get('admin/management', [ManagementController::class, 'index'])->name('company.management');

//Crear niveles
Route::post('admin/management/level/store', [LevelController::class, 'store'])->name('company.management.level.store');

//Rutas para configurar la empresa
Route::get('admin/settings', [SettingController::class, 'index'])->name('company.settings');
Route::post('admin/settings/store', [SettingController::class, 'store'])->name('company.settings.store');
Route::put('admin/settings/{setting}', [SettingController::class, 'update'])->name('company.settings.update');

// Rutas para crear entidades en niveles
Route::get('admin/management/entity/{order?}/{parent_id}', [EntityController::class, 'index'])->name('company.management.entity');
Route::post('admin/management/entity/store/{order}/{parent_id}', [EntityController::class, 'store'])->name('company.management.entity.store');

//Rutas para los roles del sistema o SystemRole
Route::get('admin/system-role', [SystemRoleController::class, 'index'])->name('company.system-role');
Route::post('admin/system-role/store', [SystemRoleController::class, 'store'])->name('company.system-role.store');

//Rutas para el usuario
Route::get('admin/user', [UserController::class, 'index'])->name('company.user');
Route::post('admin/user/store', [UserController::class, 'store'])->name('company.user.store');
Route::put('admin/user/{user}', [UserController::class, 'update'])->name('company.user.update');
Route::delete('admin/user/{user}', [UserController::class, 'destroy'])->name('company.user.destroy');

// Rutas para el ingeniero de seguridad
Route::get('admin/security-engineer', [UserController::class, 'indexsecurity'])->name('company.security-engineer');

//Rutas para categorias
Route::get('admin/category', [CategoryController::class, 'index'])->name('company.category');
Route::post('admin/category/store', [CategoryController::class, 'store'])->name('company.category.store');
Route::delete('admin/category/{category}', [CategoryController::class, 'destroy'])->name('company.category.destroy');

//Rutas para categories company
Route::post('admin/category/admin/{category_id}', [CategoryController::class, 'storeCompany'])->name('company.category.company.store');


//Reportabilidad
Route::get('admin/reportability', [ReportabilityController::class, 'index'])->name('company.reportability');
Route::get('admin2/reportability/detalle/{reportability_id}', [ReportabilityController::class, 'detalle'])->name('company.reportability.detalle');


//Analiticas
Route::get('admin/analysis', [AnalysisController::class, 'index'])->name('company.analysis');
//Analitica Toquepala
Route::get('admin/analysis/category', [AnalysisController::class, 'category'])->name('company.analysis.category');
Route::get('admin/analysis/category/{category_name}', [AnalysisController::class, 'categoryDetail'])->name('company.analysis.category.detail');
Route::get('/admin/analysis/year', [AnalysisController::class, 'categoryYear'])->name('company.analysis.category.year');

//Analiticas Inspecciones
Route::get('admin/analysis/inspeccion', [AnalysisController::class, 'inspeccion'])->name('company.analysis.inspeccion');
Route::get('admin/analysis/inspeccion/detalle', [AnalysisController::class, 'inspeccionDetail'])->name('company.analysis.inspeccion.detail');
Route::get('admin/analysis/inspeccion/year', [AnalysisController::class, 'inspeccionYear'])->name('company.analysis.inspeccion.year');

// Crear contratistas`
Route::post('contractor/store', [ContrataController::class, 'store'])->name('admin.contractor.store');
Route::put('contractor/{contrata}', [ContrataController::class, 'update'])->name('admin.contractor.update');
Route::post('contractor/{contrata}', [ContrataController::class, 'delete'])->name('admin.contractor.destroy');
Route::post('contractor/activate/{contrata}', [ContrataController::class, 'activate'])->name('admin.contractor.activate');
Route::post('contractor/show/password/{contrata}', [ContrataController::class, 'showPassword'])->name('admin.contractor.show.password');
Route::post('contractor/reset/{contrata}', [ContrataController::class, 'resetPassword'])->name('admin.contractor.reset.password');
