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
            $table->foreignId('file_status_id')->constrained('file_statuses'); // Archivo
            $table->integer('year'); // Año
            $table->integer('month'); // Mes
            $table->string('situation')->nullable(); // Situacion
            $table->integer('employees')->nullable(); // Empleados
            $table->integer('workers')->nullable(); // Obreros
            $table->integer('incidents')->nullable(); // Incidentes
            $table->integer('dangerous_incidents')->nullable(); // Incidentes peligrosos
            $table->integer('minor_accidents')->nullable(); // Accidentes leves
            $table->integer('disability')->nullable(); // Incapacidad
            $table->integer('mortality')->nullable(); // Mortalidad
            $table->decimal('lost_days', 8, 2)->nullable(); // Días perdidos
            $table->decimal('man_hours_worked', 8, 2)->nullable(); // Horas hombre trabajadas
            $table->decimal('frequency_index', 8, 2)->nullable(); // Índice de frecuencia
            $table->decimal('severity_index', 8, 2)->nullable(); // Índice de severidad
            $table->decimal('accident_rate', 8, 2)->nullable(); // Índice de accidentalidad
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
