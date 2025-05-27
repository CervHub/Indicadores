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
        if (Schema::hasTable('companies') && !Schema::hasColumn('companies', 'code')) {
            Schema::table('companies', function (Blueprint $table) {
                $table->string('code', 255)->nullable()->after('id');
            });
        }

        // Asignar códigos únicos a las compañías existentes
        if (Schema::hasTable('companies') && Schema::hasColumn('companies', 'code')) {
            $companies = \DB::table('companies')->get();
            $usedCodes = [];

            foreach ($companies as $index => $company) {
                // Obtener nombre limpio en mayúsculas, solo letras (sin números ni espacios)
                $nombre = strtoupper(preg_replace('/[^A-Z]/', '', $company->nombre ?? $company->name ?? ''));
                $nombreParts = preg_split('/\s+/', trim($nombre));
                if (count($nombreParts) === 1) {
                    // Si solo tiene un nombre, usa los primeros 4 letras
                    $nameCode = substr($nombreParts[0], 0, 4);
                } else {
                    // Si tiene más de un nombre, usa la primera letra de los primeros 3 nombres
                    $nameCode = '';
                    foreach (array_slice($nombreParts, 0, 3) as $part) {
                        $nameCode .= substr($part, 0, 1);
                    }
                    $nameCode = strtoupper($nameCode);
                }
                $code = $nameCode;

                // Asegurar unicidad
                $originalCode = $code;
                $suffix = 1;
                while (in_array($code, $usedCodes)) {
                    $code = $originalCode . $suffix;
                    $suffix++;
                }
                $usedCodes[] = $code;

                \DB::table('companies')->where('id', $company->id)->update(['code' => $code]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('companies') && Schema::hasColumn('companies', 'code')) {
            Schema::table('companies', function (Blueprint $table) {
                $table->dropColumn('code');
            });
        }
    }
};
