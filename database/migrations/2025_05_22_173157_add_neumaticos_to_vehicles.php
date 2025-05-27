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
        if (!Schema::hasColumn('vehicles', 'tire_count') && !Schema::hasColumn('vehicles', 'spare_tire_count')) {
            Schema::table('vehicles', function (Blueprint $table) {
                // Add number of tires
                $table->string('tire_count')->nullable();
                // Add number of spare tires
                $table->integer('spare_tire_count')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn('tire_count');
            $table->dropColumn('spare_tire_count');
        });
    }
};
