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
        if (!Schema::hasTable('vehicle_companies')) {
            Schema::create('vehicle_companies', function (Blueprint $table) {
                $table->id();
                $table->foreignId('vehicle_id')->constrained('vehicles')->onDelete('no action'); // Relación con la tabla vehicles
                $table->foreignId('company_id')->constrained('companies')->onDelete('no action'); // Relación con la tabla companies
                $table->boolean('is_linked')->default(true); // Estado de vinculación (true = vinculado, false = desvinculado)
                $table->foreignId('linked_by')->nullable()->constrained('users')->onDelete('no action'); // Relación con la tabla users
                $table->foreignId('unlinked_by')->nullable()->constrained('users')->onDelete('no action'); // Relación con la tabla users
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_companies');
    }
};
