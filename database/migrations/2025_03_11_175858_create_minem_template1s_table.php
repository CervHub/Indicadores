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
        Schema::create('minem_template1s', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contractor_company_id')->constrained('contractor_companies'); // ID de la empresa contratista
            $table->foreignId('contractor_company_type_id')->constrained('contractor_company_types'); // Tipo de contratista
            $table->foreignId('uea_id')->constrained('ueas'); // ID de la UEA
            $table->foreignId('user_id')->constrained('users'); // ID del usuario que subió el archivo
            $table->text('file'); // Archivo
            $table->integer('year'); // Año
            $table->integer('month'); // Mes
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
        Schema::dropIfExists('minem_template1s');
    }
};
