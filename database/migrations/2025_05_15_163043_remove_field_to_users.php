<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop foreign key constraints if they exist (SQL Server safe)
        DB::statement("IF OBJECT_ID('FK_users_entity_id', 'F') IS NOT NULL ALTER TABLE users DROP CONSTRAINT FK_users_entity_id");
        DB::statement("IF OBJECT_ID('FK_users_system_role_id', 'F') IS NOT NULL ALTER TABLE users DROP CONSTRAINT FK_users_system_role_id");
        // For Laravel default constraint names
        DB::statement("IF OBJECT_ID('users_entity_id_foreign', 'F') IS NOT NULL ALTER TABLE users DROP CONSTRAINT users_entity_id_foreign");
        DB::statement("IF OBJECT_ID('users_system_role_id_foreign', 'F') IS NOT NULL ALTER TABLE users DROP CONSTRAINT users_system_role_id_foreign");

        Schema::table('users', function (Blueprint $table) {
            // Drop columns
            $table->dropColumn([
                'entity_id',
                'permisos',
                'system_role_id',
                'contrata',
                'text_password',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->text('permisos')->nullable();
            $table->unsignedBigInteger('system_role_id')->nullable();
            $table->string('contrata')->nullable();
            $table->string('text_password')->nullable();
        });
    }
};
