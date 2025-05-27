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
        if (!Schema::hasTable('minem_template1s')) {
            Schema::create('minem_template1s', function (Blueprint $table) {
                $table->id();
                $table->foreignId('file_status_id')->constrained('file_statuses'); // Archivo
                $table->integer('year'); // Año
                $table->integer('month'); // Mes
                $table->string('concession_code')->nullable(); // Código de concesión
                $table->string('concession_name')->nullable(); // Nombre de concesión
                $table->integer('local_male_workers')->nullable(); // Trabajadores locales hombres obreros
                $table->integer('regional_male_workers')->nullable(); // Trabajadores regionales hombres obreros
                $table->integer('national_male_workers')->nullable(); // Trabajadores nacionales hombres obreros
                $table->integer('foreign_male_workers')->nullable(); // Trabajadores extranjeros hombres obreros
                $table->integer('local_female_workers')->nullable(); // Trabajadoras locales mujeres obreros
                $table->integer('regional_female_workers')->nullable(); // Trabajadoras regionales mujeres obreros
                $table->integer('national_female_workers')->nullable(); // Trabajadoras nacionales mujeres obreros
                $table->integer('foreign_female_workers')->nullable(); // Trabajadoras extranjeras mujeres obreros

                $table->integer('local_male_employees')->nullable(); // Trabajadores locales hombres empleados
                $table->integer('regional_male_employees')->nullable(); // Trabajadores regionales hombres empleados
                $table->integer('national_male_employees')->nullable(); // Trabajadores nacionales hombres empleados
                $table->integer('foreign_male_employees')->nullable(); // Trabajadores extranjeros hombres empleados
                $table->integer('local_female_employees')->nullable(); // Trabajadoras locales mujeres empleados
                $table->integer('regional_female_employees')->nullable(); // Trabajadoras regionales mujeres empleados
                $table->integer('national_female_employees')->nullable(); // Trabajadoras nacionales mujeres empleados
                $table->integer('foreign_female_employees')->nullable(); // Trabajadoras extranjeras mujeres empleados

                $table->decimal('total_employees')->nullable(); // Employees
                $table->decimal('total_hours_employees')->nullable(); // Hours worked
                $table->string('mining_activities')->nullable(); // Mining activities

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
        Schema::dropIfExists('minem_template1s');
    }
};
