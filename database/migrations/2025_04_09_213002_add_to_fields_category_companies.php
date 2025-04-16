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
            $table->foreignId('group_id')->nullable()->constrained('groups')->onDelete('no action'); // Relación con la tabla groups
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('category_companies', function (Blueprint $table) {
            $table->dropForeign(['group_id']); // Elimina la relación con la tabla groups
            $table->dropColumn('group_id'); // Elimina el campo group_id
        });
    }
};
