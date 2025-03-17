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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies');
            $table->integer('num_niveles');
            $table->string('nombre')->nullable();
            $table->text('descripcion')->nullable();
            $table->boolean('estado')->default(true);
            $table->string('logo')->nullable();
            $table->string('mini_logo')->nullable();
            $table->string('color_primario')->nullable();
            $table->string('color_secundario')->nullable();
            $table->string('font')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
