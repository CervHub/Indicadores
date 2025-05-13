<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateRoleCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lista de roles con sus respectivos códigos
        $rolesWithCodes = [
            'Super Admin' => 'SA',
            'Regular User' => 'RU',
            'Company Admin' => 'CA',
            'Sub Comité de Contratistas' => 'SCC',
            'Almacenes' => 'ALM',
            'Proyectos de Inversión' => 'PI',
            'Contratos de Obras' => 'CO',
            'Contratos y Servicios' => 'CS',
            'Ingeniero de Seguridad' => 'IS',
        ];

        // Iterar sobre los roles y verificar si existen
        foreach ($rolesWithCodes as $roleName => $code) {
            $roleExists = DB::table('roles')->where('nombre', $roleName)->exists();

            if ($roleExists) {
                // Si el rol existe, actualizar el código
                DB::table('roles')
                    ->where('nombre', $roleName)
                    ->update(['code' => $code]);
            }
        }
    }
}
