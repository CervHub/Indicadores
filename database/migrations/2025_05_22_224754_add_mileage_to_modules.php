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
        if (Schema::hasTable('modules')) {
            Schema::table('modules', function (Blueprint $table) {
                if (!Schema::hasColumn('modules', 'mileage')) {
                    $table->string('mileage')->nullable()->after('status');
                }
                if (!Schema::hasColumn('modules', 'area')) {
                    $table->string('area')->nullable()->after('mileage');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('modules')) {
            Schema::table('modules', function (Blueprint $table) {
                if (Schema::hasColumn('modules', 'mileage')) {
                    $table->dropColumn('mileage');
                }
                if (Schema::hasColumn('modules', 'area')) {
                    $table->dropColumn('area');
                }
                // ...
            });
        }
    }
};
