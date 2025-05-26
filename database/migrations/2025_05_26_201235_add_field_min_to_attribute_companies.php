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
        Schema::table('category_attributes', function (Blueprint $table) {
            // Add the fields min_value and unit
            $table->string('min_value')->nullable();
            $table->string('unit')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('category_attributes', function (Blueprint $table) {
            // Drop the fields min_value and unit
            $table->dropColumn(['min_value', 'unit']);
        });
    }
};
