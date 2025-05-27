<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('detail_users')) {
            Schema::create('detail_users', function (Blueprint $table) {
                $table->id();
                $table->timestamps();
                $table->foreignId('user_id')->references('id')->on('users');
                $table->string('licencia')->nullable();
                $table->string('numero_licencia')->nullable();
                $table->string('categoria_conducir')->nullable();
                $table->string('numero_colegiatura')->nullable();
                $table->string('estado_colegiatura')->nullable();
                $table->string('correo_empresa')->nullable();
                $table->string('correo_personal')->nullable();
                $table->string('numero_fijo')->nullable();
                $table->string('numero_celular')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_users');
    }
};
