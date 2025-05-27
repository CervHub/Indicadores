<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Permitir que la columna 'email' sea NULL
            if (Schema::hasColumn('users', 'email')) {
                $table->string('email')->nullable()->change();
            }

            // Verificar y eliminar el índice único de la columna 'email' si existe (SQL Server)
            $emailIndex = DB::select("SELECT name FROM sys.indexes WHERE object_id = OBJECT_ID('users') AND name = 'users_email_unique'");
            if (count($emailIndex) > 0) {
                $table->dropUnique('users_email_unique');
            }

            // Verificar y agregar el índice único a la columna 'doi' si no existe (SQL Server)
            $doiIndex = DB::select("SELECT name FROM sys.indexes WHERE object_id = OBJECT_ID('users') AND name = 'users_doi_unique'");
            if (count($doiIndex) === 0) {
                $table->unique('doi');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Revertir la columna 'email' para que no permita NULL
            if (Schema::hasColumn('users', 'email')) {
                $table->string('email')->nullable(false)->change();
            }

            // Verificar y eliminar el índice único de la columna 'doi' si existe (SQL Server)
            $doiIndex = DB::select("SELECT name FROM sys.indexes WHERE object_id = OBJECT_ID('users') AND name = 'users_doi_unique'");
            if (count($doiIndex) > 0) {
                $table->dropUnique('users_doi_unique');
            }

            // Restaurar el índice único en la columna 'email' si no existe (SQL Server)
            $emailIndex = DB::select("SELECT name FROM sys.indexes WHERE object_id = OBJECT_ID('users') AND name = 'users_email_unique'");
            if (count($emailIndex) === 0) {
                $table->unique('email');
            }
        });
    }
};
