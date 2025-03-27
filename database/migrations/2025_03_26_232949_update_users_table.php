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
        Schema::table('users', function (Blueprint $table) {
            // Permitir que la columna 'email' sea NULL
            $table->string('email')->nullable()->change();

            // Eliminar el índice único de la columna 'email'
            $table->dropUnique(['email']);

            // Agregar el índice único a la columna 'doi'
            $table->unique('doi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Revertir la columna 'email' para que no permita NULL
            $table->string('email')->nullable(false)->change();

            // Eliminar el índice único de la columna 'doi'
            $table->dropUnique(['doi']);

            // Restaurar el índice único en la columna 'email'
            // $table->unique('email');
        });
    }
};
