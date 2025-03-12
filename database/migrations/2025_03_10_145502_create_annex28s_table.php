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
        Schema::create('annex28s', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contractor_company_id')->constrained('contractor_companies'); // Contratista
            $table->foreignId('contractor_company_type_id')->constrained('contractor_company_types'); // Tipo de contratista
            $table->foreignId('uea_id')->constrained('ueas'); // UEA
            $table->foreignId('user_id')->constrained('users'); // Usuario que subió el archivo
            $table->text('file'); // Archivo
            $table->integer('year'); // Año
            $table->integer('month'); // Mes
            $table->integer('employees')->nullable(); // Empleados
            $table->integer('workers')->nullable(); // Obreros
            $table->integer('incidents')->nullable(); // Incidentes
            $table->integer('dangerous_incidents')->nullable(); // Incidentes peligrosos
            $table->integer('minor_accidents')->nullable(); // Accidentes leves
            $table->integer('disability')->nullable(); // Incapacidad
            $table->integer('mortality')->nullable(); // Mortalidad
            $table->integer('lost_days')->nullable(); // Días perdidos
            $table->integer('man_hours_worked')->nullable(); // Horas hombre trabajadas
            $table->integer('frequency_index')->nullable(); // Índice de frecuencia
            $table->integer('severity_index')->nullable(); // Índice de severidad
            $table->integer('accident_rate')->nullable(); // Índice de accidentalidad
            $table->boolean('is_old')->default(false); // Es antiguo
            $table->timestamps(); // Tiempos de creación y actualización
            $table->softDeletes(); // Borrado suave
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('annex28s');
    }
};
