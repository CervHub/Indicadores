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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('code')->nullable(); // Código único del vehículo
            $table->string('license_plate')->nullable(); // Placa del vehículo
            $table->string('brand')->nullable(); // Marca del vehículo
            $table->string('model')->nullable(); // Modelo del vehículo
            $table->string('color')->nullable(); // Color del vehículo
            $table->integer('year')->nullable(); // Año de fabricación
            $table->string('engine_number')->nullable(); // Número de motor
            $table->string('chassis_number')->nullable(); // Número de chasis
            $table->string('type')->nullable(); // Tipo de vehículo (e.g., sedán, SUV)
            $table->string('fuel_type')->nullable(); // Tipo de combustible (e.g., gasolina, diésel)
            $table->integer('seating_capacity')->nullable(); // Capacidad de asientos
            $table->integer('mileage')->nullable(); // Kilometraje del vehículo
            $table->boolean('is_active')->default('1'); // Estado activo/inactivo del vehículo
            $table->date('insurance_expiry_date')->nullable(); // Fecha de vencimiento del seguro
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
