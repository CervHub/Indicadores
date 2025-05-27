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
        if (!Schema::hasColumn('companies', 'contractor_company_type_id')) {
            Schema::table('companies', function (Blueprint $table) {
                $table->foreignId('contractor_company_type_id')->nullable()->constrained('contractor_company_types')->after('ruc_number'); // Tipo de cliente
            });
        }
        if (!Schema::hasColumn('companies', 'situation')) {
            Schema::table('companies', function (Blueprint $table) {
                $table->string('situation')->nullable()->after('contractor_company_type_id'); // Situación
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('situation');
            $table->dropForeign(['contractor_company_type_id']);
            $table->dropColumn('contractor_company_type_id');
        });
    }
};
