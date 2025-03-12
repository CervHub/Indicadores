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
        Schema::create('minem_template2s', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contractor_company_id')->constrained('contractor_companies'); // ID de la empresa contratista
            $table->foreignId('contractor_company_type_id')->constrained('contractor_company_types'); // Tipo de contratista
            $table->foreignId('uea_id')->constrained('ueas'); // ID de la UEA
            $table->foreignId('user_id')->constrained('users'); // ID del usuario que subió el archivo
            $table->text('file'); // Archivo
            $table->integer('year'); // Año
            $table->integer('month'); // Mes
            $table->string('concession_code')->nullable(); // Código de concesión
            $table->string('concession_name')->nullable(); // Nombre de concesión
            $table->integer('male_managers')->nullable(); // Gerentes hombres
            $table->integer('male_administrative')->nullable(); // Administrativos hombres
            $table->integer('male_plant_staff')->nullable(); // Personal de planta hombres
            $table->integer('male_general_operations')->nullable(); // Operaciones generales hombres
            $table->integer('female_managers')->nullable(); // Gerentes mujeres
            $table->integer('female_administrative')->nullable(); // Administrativos mujeres
            $table->integer('female_plant_staff')->nullable(); // Personal de planta mujeres
            $table->integer('female_general_operations')->nullable(); // Operaciones generales mujeres
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
        Schema::dropIfExists('minem_template2s');
    }
};
