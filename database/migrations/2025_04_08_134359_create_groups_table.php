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
        if (!Schema::hasTable('groups')) {
            Schema::create('groups', function (Blueprint $table) {
                $table->id();
                $table->string('name')->nullable(); // Nombre del grupo
                $table->foreignId('category_id')->constrained('categories')->onDelete('no action'); // Relación con la tabla categories
                $table->timestamps();
                $table->softDeletes(); // Campo para eliminar lógicamente el grupo
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};
