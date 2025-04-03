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
        Schema::create('setting_globals', function (Blueprint $table) {
            $table->id();
            $table->string('web_version')->nullable(); // Versión de la web
            $table->string('mobile_version')->nullable(); // Versión de la app móvil
            $table->string('logo')->nullable(); // URL o ruta del logo principal
            $table->string('mini_logo')->nullable(); // URL o ruta del logo mini
            $table->text('general_notes')->nullable(); // Notas o consideraciones generales
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setting_globals');
    }
};
