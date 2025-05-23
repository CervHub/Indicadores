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
        // Solo agrega columnas si la tabla ya existe
        if (Schema::hasTable('logs')) {
            Schema::table('logs', function (Blueprint $table) {
                if (!Schema::hasColumn('logs', 'action')) $table->string('action')->nullable();
                if (!Schema::hasColumn('logs', 'model')) $table->string('model')->nullable();
                if (!Schema::hasColumn('logs', 'model_name')) $table->string('model_name')->nullable();
                if (!Schema::hasColumn('logs', 'user_id')) $table->unsignedBigInteger('user_id')->nullable();
                if (!Schema::hasColumn('logs', 'ip_address')) $table->string('ip_address', 45)->nullable();
                if (!Schema::hasColumn('logs', 'user_agent')) $table->text('user_agent')->nullable();
                if (!Schema::hasColumn('logs', 'status')) $table->string('status')->nullable();
                if (!Schema::hasColumn('logs', 'error_message')) $table->text('error_message')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('logs')) {
            Schema::table('logs', function (Blueprint $table) {
                if (Schema::hasColumn('logs', 'action')) $table->dropColumn('action');
                if (Schema::hasColumn('logs', 'model')) $table->dropColumn('model');
                if (Schema::hasColumn('logs', 'model_name')) $table->dropColumn('model_name');
                if (Schema::hasColumn('logs', 'user_id')) $table->dropColumn('user_id');
                if (Schema::hasColumn('logs', 'ip_address')) $table->dropColumn('ip_address');
                if (Schema::hasColumn('logs', 'user_agent')) $table->dropColumn('user_agent');
                if (Schema::hasColumn('logs', 'status')) $table->dropColumn('status');
                if (Schema::hasColumn('logs', 'error_message')) $table->dropColumn('error_message');
            });
        }
    }
};
