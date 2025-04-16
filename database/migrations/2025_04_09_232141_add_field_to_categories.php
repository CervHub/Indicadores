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
        Schema::table('categories', function (Blueprint $table) {
            $table->boolean('is_categorized')->default(false)->nullable(); // Campo opcional, por defecto false
            $table->boolean('is_risk')->default(false)->nullable(); // Campo opcional, por defecto false
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('is_categorized'); // Elimina el campo is_categorized
            $table->dropColumn('is_risk'); // Elimina el campo is_risk
        });
    }
};
