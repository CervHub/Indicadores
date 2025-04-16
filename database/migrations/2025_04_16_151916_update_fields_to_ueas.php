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
        // Actualizar los registros específicos
        DB::table('ueas')->where('name', 'SPCC - CONCENTRADORA TOQUEPALA')->update(['code' => 'SPCCT']);
        DB::table('ueas')->where('name', 'SPCC - ACUMULACION TOQUEPALA 1')->update(['code' => 'SPCAT']);
        DB::table('ueas')->where('name', 'SPCC - PLANTA LIXIVIAXION SX/EW TOQUEPALA')->update(['code' => 'SPCLX']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir los cambios realizados en la función up
        DB::table('ueas')->where('name', 'SPCC - CONCENTRADORA TOQUEPALA')->update(['code' => null]);
        DB::table('ueas')->where('name', 'SPCC - ACUMULACION TOQUEPALA 1')->update(['code' => null]);
        DB::table('ueas')->where('name', 'SPCC - PLANTA LIXIVIAXION SX/EW TOQUEPALA')->update(['code' => null]);
    }
};
