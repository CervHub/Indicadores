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
        Schema::create('category_companies', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('category_id');
            $table->timestamps();

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('no action');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_companies');
    }
};
