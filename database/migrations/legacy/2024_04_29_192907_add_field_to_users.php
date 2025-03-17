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
        Schema::table('users', function (Blueprint $table) {
            $table->json('permisos')->nullable()->after('estado');
            $table->unsignedBigInteger('system_role_id')->nullable()->after('permisos');

            $table->foreign('system_role_id') // Cambia 'role_id' a 'system_role_id'
                ->references('id')
                ->on('system_roles')
                ->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['system_role_id']); // Cambia 'role_id' a 'system_role_id'
            $table->dropColumn('system_role_id'); // Cambia 'role_id' a 'system_role_id'
            $table->dropColumn('permisos');
        });
    }
};
