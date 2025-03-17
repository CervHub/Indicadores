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
        Schema::table('companies', function (Blueprint $table) {
            $table->foreignId('contractor_company_type_id')->nullable()->constrained('contractor_company_types')->after('ruc_number'); // Tipo de cliente
            $table->string('situation')->nullable()->after('contractor_company_type_id'); // Situación
        });
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
