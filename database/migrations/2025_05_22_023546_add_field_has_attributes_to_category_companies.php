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
        if (!Schema::hasColumn('category_companies', 'has_attributes') && !Schema::hasColumn('category_companies', 'attribute_type')) {
            Schema::table('category_companies', function (Blueprint $table) {
                $table->boolean('has_attributes')->default(false);
                $table->string('attribute_type')->nullable(); // e.g. 'text', 'integer', 'date', 'checkbox'
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('category_companies', function (Blueprint $table) {
            $table->dropColumn('has_attributes');
            $table->dropColumn('attribute_type');
        });
    }
};
