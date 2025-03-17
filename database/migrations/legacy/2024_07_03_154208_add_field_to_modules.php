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
        Schema::table('modules', function (Blueprint $table) {
            $table->json('send_email')->nullable()->after('tipo_inspeccion');
        });

        // Establecer el valor predeterminado para los registros existentes
        DB::table('modules')->update([
            'send_email' => json_encode([
                ["email" => "moises.salazar@cerv.com.pe", "nombre" => "Moises Alberto", "apellidos" => "Salazar Machaca"],
                ["email" => "elfer.arenas@cerv.com.pe", "nombre" => "Elfer", "apellidos" => "Arenas"],
                ["email" => "jninajac@southerperu.com.pe", "nombre" => "Jesus", "apellidos" => "Ninaja"],
                ["email" => "eee@ooo", "nombre" => "Jason", "apellidos" => "Espinoza"]
            ])
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropColumn('send_email');
        });
    }
};
