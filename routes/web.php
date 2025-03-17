<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/contractor.php';
require __DIR__.'/annex.php';
require __DIR__.'/consolidated.php';

//Legacy
require __DIR__.'/legacy/user.php';
require __DIR__.'/legacy/contrata.php';
require __DIR__.'/legacy/company.php';
require __DIR__.'/legacy/admin.php';
