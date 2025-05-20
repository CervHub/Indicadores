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
        Schema::create('uea_companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('uea_id')->references('id')->on('ueas');
            $table->foreignId('company_id')->references('id')->on('companies');
            $table->foreignId('activity_id')->references('id')->on('contractor_company_types');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uea_companies');
    }
};
