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
        if (Schema::hasTable('vehicle_companies')) {
            Schema::table('vehicle_companies', function (Blueprint $table) {
                if (!Schema::hasColumn('vehicle_companies', 'code')) {
                    // Add code to vehicle_companies table
                    $table->string('code')->nullable();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('vehicle_companies')) {
            Schema::table('vehicle_companies', function (Blueprint $table) {
                if (Schema::hasColumn('vehicle_companies', 'code')) {
                    // Remove code from vehicle_companies table
                    $table->dropColumn('code');
                }
            });
        }
    }
};
