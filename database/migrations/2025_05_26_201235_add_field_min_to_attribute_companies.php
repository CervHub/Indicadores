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
        if (Schema::hasTable('category_attributes')) {
            Schema::table('category_attributes', function (Blueprint $table) {
                if (!Schema::hasColumn('category_attributes', 'min_value')) {
                    $table->string('min_value')->nullable();
                }
                if (!Schema::hasColumn('category_attributes', 'unit')) {
                    $table->string('unit')->nullable();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('category_attributes')) {
            Schema::table('category_attributes', function (Blueprint $table) {
                if (Schema::hasColumn('category_attributes', 'min_value')) {
                    $table->dropColumn('min_value');
                }
                if (Schema::hasColumn('category_attributes', 'unit')) {
                    $table->dropColumn('unit');
                }
            });
        }
    }
};
