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
        Schema::create('annex26s', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contractor_company_id')->constrained('contractor_companies'); // Contratista
            $table->foreignId('contractor_company_type_id')->constrained('contractor_company_types'); // Tipo de contratista
            $table->foreignId('uea_id')->constrained('ueas'); // UEA
            $table->foreignId('user_id')->constrained('users'); // Usuario que subió el archivo
            $table->text('file'); // Archivo
            $table->integer('year'); // Año
            $table->integer('month'); // Mes
            $table->integer('empl')->nullable();
            $table->integer('obr')->nullable();
            $table->integer('day1')->nullable();
            $table->integer('day2')->nullable();
            $table->integer('day3')->nullable();
            $table->integer('day4')->nullable();
            $table->integer('day5')->nullable();
            $table->integer('day6')->nullable();
            $table->integer('day7')->nullable();
            $table->integer('day8')->nullable();
            $table->integer('day9')->nullable();
            $table->integer('day10')->nullable();
            $table->integer('day11')->nullable();
            $table->integer('day12')->nullable();
            $table->integer('day13')->nullable();
            $table->integer('day14')->nullable();
            $table->integer('day15')->nullable();
            $table->integer('day16')->nullable();
            $table->integer('day17')->nullable();
            $table->integer('day18')->nullable();
            $table->integer('day19')->nullable();
            $table->integer('day20')->nullable();
            $table->integer('day21')->nullable();
            $table->integer('day22')->nullable();
            $table->boolean('is_old')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('annex26s');
    }
};
