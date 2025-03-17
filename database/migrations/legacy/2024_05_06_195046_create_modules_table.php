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

        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->timestamp('fecha_reporte')->nullable();
            $table->integer('order')->nullable();
            $table->timestamp('fecha_evento')->nullable();
            $table->text('descripcion')->nullable();
            $table->text('correctiva')->nullable();
            $table->string('gravedad')->nullable();
            $table->string('probabilidad')->nullable();
            $table->string('exposicion')->nullable();
            $table->text('otros')->nullable();
            $table->string('mapa_cordenadas')->nullable();
            $table->longText('firma')->nullable();
            $table->string('estado')->nullable();
            $table->json('levels')->nullable();
            $table->string('comentario')->nullable();
            $table->foreignId('category_company_id')->nullable()->constrained('category_companies'); // Referencia a la tabla de causas
            $table->json('images')->nullable(); // Campo para almacenar las imágenes
            $table->string('tipo_reporte')->nullable(); // Agregar campo para tipo de reporte
            $table->json('reporte_usuarios_ids')->nullable(); // Campo para ids de usuarios a los que se enviará el reporte
            $table->foreignId('user_id')->constrained('users'); // Referencia a la tabla de usuarios
            $table->foreignId('company_id')->constrained('companies'); // Referencia a la tabla de empresas
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
