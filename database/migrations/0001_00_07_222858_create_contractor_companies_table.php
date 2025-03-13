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
        Schema::create('contractor_companies', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Obligatorio
            $table->string('business_name')->nullable(); // Opcional
            $table->string('email')->nullable(); // Opcional
            $table->string('phone_number')->nullable(); // Opcional
            $table->string('address')->nullable(); // Opcional
            $table->string('city')->nullable(); // Opcional
            $table->string('country')->nullable(); // Opcional
            $table->string('ruc_number')->unique(); // Obligatorio
            $table->foreignId('contractor_company_type_id')->constrained('contractor_company_types'); // Tipo de cliente
            $table->string('situation')->nullable(); // Situación
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contractor_companies');
    }
};
