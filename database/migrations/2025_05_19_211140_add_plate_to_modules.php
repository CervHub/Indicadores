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
        if (!Schema::hasColumn('modules', 'vehicle_plate') && !Schema::hasColumn('modules', 'vehicle_status')) {
            Schema::table('modules', function (Blueprint $table) {
                // Campos para la inspección vehicular
                $table->string('vehicle_plate')->nullable()->after('id'); // Placa vehicular
                $table->string('vehicle_status')->nullable()->after('plate'); // Estado de vehículo
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropColumn('vehicle_status');
            $table->dropColumn('vehicle_plate');
        });
    }
};
