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
        Schema::table('modules', function (Blueprint $table) {
            // Agrega las columnas relacionadas con la eliminación
            $table->string('delete_reason')->nullable();

            // Agrega las columnas relacionadas con la reasignación
            $table->unsignedBigInteger('reassigned_user_id')->nullable(); // Relaciona con la tabla users
            $table->foreign('reassigned_user_id')->nullable()->references('id')->on('users')->onDelete('set null'); // Clave foránea
            $table->string('reassignment_reason')->nullable();

            // Agrega la columna entity_id
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->foreign('entity_id')->references('id')->on('entities')->onDelete('no action');

            // Agrega la columna de fecha de cierre del reporte
            $table->timestamp('report_closed_at')->nullable();

            // Agrega la columna deleted_at para soft deletes
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            // Elimina la columna de fecha de cierre del reporte
            $table->dropColumn('report_closed_at');

            // Elimina las columnas relacionadas con la reasignación
            $table->dropForeign(['reassigned_user_id']); // Elimina la clave foránea
            $table->dropColumn('reassigned_user_id');
            $table->dropColumn('reassignment_reason');

            // Elimina la columna entity_id
            $table->dropForeign(['entity_id']);
            $table->dropColumn('entity_id');

            // Elimina las columnas relacionadas con la eliminación
            $table->dropColumn('delete_reason');

            // Elimina la columna deleted_at para soft deletes
            $table->dropSoftDeletes();
        });
    }
};
