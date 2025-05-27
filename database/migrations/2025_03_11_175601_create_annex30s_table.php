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
        if (!Schema::hasTable('annex30s')) {
            Schema::create('annex30s', function (Blueprint $table) {
                $table->id();
                $table->foreignId('file_status_id')->constrained('file_statuses'); // Archivo
                $table->integer('year'); // Año
                $table->integer('month'); // Mes
                $table->string('accident_type')->nullable(); // Tipo de accidente
                $table->string('injury_nature')->nullable(); // Naturaleza de la lesión
                $table->string('age')->nullable(); // Edad
                $table->string('marital_status')->nullable(); // Estado civil
                $table->string('education_level')->nullable(); // Grado de instrucción
                $table->string('years_experience')->nullable(); // Años de experiencia
                $table->string('time')->nullable(); // Hora
                $table->string('day')->nullable(); // Día
                $table->string('month_name')->nullable(); // Mes
                $table->string('partial_temporary')->nullable(); // Parcial temporal
                $table->string('permanent_temporary')->nullable(); // Permanente temporal
                $table->string('partial_permanent')->nullable(); // Permanente parcial
                $table->string('total_permanent')->nullable(); // Permanente total
                $table->string('disability')->nullable(); // Incapacidad
                $table->string('occupation')->nullable(); // Ocupación
                $table->decimal('remuneration', 8, 2)->nullable(); // Remuneración
                $table->timestamps(); // Tiempos de creación y actualización
                $table->softDeletes(); // Borrado suave
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('annex30s');
    }
};
