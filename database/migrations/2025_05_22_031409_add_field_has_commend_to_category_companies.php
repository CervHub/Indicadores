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
        Schema::table('category_companies', function (Blueprint $table) {
            $table->string('instruction')->nullable();
            $table->string('document_url')->nullable();
            $table->string('document_name')->nullable();
            $table->boolean('is_for_mine')->default(false); // Nuevo campo para mina
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('category_companies', function (Blueprint $table) {
            $table->dropColumn(['instruction', 'document_url', 'document_name', 'is_for_mine']);
        });
    }
};
