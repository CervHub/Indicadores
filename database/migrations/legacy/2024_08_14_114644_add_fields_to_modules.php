<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->foreignId('company_report_id')->nullable()->constrained('companies')->onDelete('set null');
        });

        // Update existing records
        DB::table('modules')->update([
            'company_report_id' => DB::raw('company_id')
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropForeign(['company_report_id']);
            $table->dropColumn('company_report_id');
        });
    }
};
