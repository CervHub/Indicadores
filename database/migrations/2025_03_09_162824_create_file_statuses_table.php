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
        Schema::create('file_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contractor_company_id')->constrained('companies'); // Contratista
            $table->foreignId('contractor_company_type_id')->constrained('contractor_company_types'); // Tipo de contratista
            $table->foreignId('uea_id')->constrained('ueas'); // UEA
            $table->foreignId('user_id')->constrained('users'); // Usuario que subió el archivo
            $table->integer('year'); // Año
            $table->integer('month'); // Mes
            $table->text('file'); // Archivo
            $table->boolean('annex24')->nullable(); // Anexo 24
            $table->boolean('annex25')->nullable(); // Anexo 25
            $table->boolean('annex26')->nullable(); // Anexo 26
            $table->boolean('annex27')->nullable(); // Anexo 27
            $table->boolean('annex28')->nullable(); // Anexo 28
            $table->boolean('annex30')->nullable(); // Anexo 30
            $table->boolean('minem_template_1')->nullable(); // Plantilla MINEM 1
            $table->boolean('minem_template_2')->nullable(); // Plantilla MINEM 2
            $table->boolean('is_old')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_statuses');
    }
};
