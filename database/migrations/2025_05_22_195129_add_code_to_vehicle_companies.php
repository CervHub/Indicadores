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
        Schema::table('vehicle_companies', function (Blueprint $table) {
            // Add code to vehicle_companies table
            $table->string('code')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_companies', function (Blueprint $table) {
            // Remove code from vehicle_companies table
            $table->dropColumn('code');
        });
    }
};
