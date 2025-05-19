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
// Rutas para el administrador principal
Route::get('/dashboard/admin', [CompanyController::class, 'index'])->name('admin.dashboard');

// Rutas para la gestion de empresas o management
Route::get('admin/management', [ManagementController::class, 'index'])->name('admin.management');

//Crear niveles
Route::post('admin/management/level/store', [LevelController::class, 'store'])->name('admin.management.level.store');

//Rutas para configurar la empresa
Route::get('admin/settings', [SettingController::class, 'index'])->name('admin.settings');
Route::post('admin/settings/store', [SettingController::class, 'store'])->name('admin.settings.store');
Route::put('admin/settings/{setting}', [SettingController::class, 'update'])->name('admin.settings.update');

// Rutas para crear entidades en niveles
Route::get('admin/management/entity/{order?}/{parent_id}', [EntityController::class, 'index'])->name('admin.management.entity');
Route::post('admin/management/entity/store/{order}/{parent_id}', [EntityController::class, 'store'])->name('admin.management.entity.store');

//Rutas para los roles del sistema o SystemRole
Route::get('admin/system-role', [SystemRoleController::class, 'index'])->name('admin.system-role');
Route::post('admin/system-role/store', [SystemRoleController::class, 'store'])->name('admin.system-role.store');

//Rutas para el usuario
Route::get('admin/user', [UserController::class, 'index'])->name('admin.user');
Route::post('admin/user/store', [UserController::class, 'store'])->name('admin.user.store');
Route::delete('admin/user/{user}', [UserController::class, 'destroy'])->name('admin.user.destroy');

// Rutas para el ingeniero de seguridad
Route::get('admin/security-engineer', [UserController::class, 'indexsecurity'])->name('admin.security-engineer');

//Rutas para categorias
Route::get('admin/category', [CategoryController::class, 'index'])->name('admin.category');
Route::post('admin/category/store', [CategoryController::class, 'store'])->name('admin.category.store');
Route::delete('admin/category/{category}', [CategoryController::class, 'destroy'])->name('admin.category.destroy');

//Rutas para categories admin
Route::post('admin/category/admin/{category_id}', [CategoryController::class, 'storeCompany'])->name('admin.category.admin.store');
Route::put('admin/category/admin/{category_id}', [CategoryController::class, 'updateCompany'])->name('admin.category.admin.update');
//Rutas para group
Route::post('group/store/{category_id}', [CategoryController::class, 'groupStore'])->name('group.store');

//Reportabilidad
Route::get('admin/reportability', [ReportabilityController::class, 'index'])->name('admin.reportability');
Route::get('admin/reportability/detalle/{reportability_id}', [ReportabilityController::class, 'detalle'])->name('admin.reportability.detalle');
Route::get('reportability/download/{start_date}/{end_date}', [ReportabilityController::class, 'downloadRange'])->name('reportability.download');


//Analiticas
Route::get('admin/analysis', [AnalysisController::class, 'index'])->name('admin.analysis');
//Analitica Toquepala
Route::get('admin/analysis/category', [AnalysisController::class, 'category'])->name('admin.analysis.category');
Route::get('admin/analysis/category/{category_name}', [AnalysisController::class, 'categoryDetail'])->name('admin.analysis.category.detail');
Route::get('admin/analysis/year', [AnalysisController::class, 'categoryYear'])->name('admin.analysis.category.year');


//Descargar reportes en un rango de fechas
Route::get('reportability/download/{start_date}/{end_date}', [ReportabilityController::class, 'downloadRange'])->name('reportability.download');
