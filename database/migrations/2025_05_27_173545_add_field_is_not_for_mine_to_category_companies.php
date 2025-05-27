<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Agrega el campo 'is_not_for_mine' a la tabla 'category_companies'.
     */
    public function up(): void
    {
        Schema::table('category_companies', function (Blueprint $table) {
            $table->boolean('is_not_for_mine')->nullable()->default(false);
        });
    }

    /**
     * Elimina el campo 'is_not_for_mine' de la tabla 'category_companies'.
     */
    public function down(): void
    {
        Schema::table('category_companies', function (Blueprint $table) {
            $table->dropColumn('is_not_for_mine');
        });
    }
};
